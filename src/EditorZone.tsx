
import { loadLanguage, langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror'; 
import { tokyoNight as THEME } from '@uiw/codemirror-themes-all';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { ResultEntry, TaskPackage, TaskSubmissionEvaluator } from './TaskAggregate';
import type { StorageInstance } from './Storage';
import './styles/EditorZone.css';
import type { SqliteProxy } from './SQLiteProxy';
import { ReactElement } from 'preact/compat';

/**
 * Feedback from evaluator
 */
export type ResultsFeedbackProps = {
  results: Array<ResultEntry>
  available: boolean
  error: boolean
  errorMessage: string
  queryOnly: boolean
  queryOutput: string
}

/**
 * Data related to the task itself
 */
export type EditorZoneProps = {
  // taskPackage: SQLTaskDataObject
  dbproxy: SqliteProxy
  pkg: TaskPackage
  evaluator: TaskSubmissionEvaluator
  storage: StorageInstance
}

/**
 * FeedbackProps
 * Will display each test case and different components
 * and views for the user
 */
export type FeedbackProps = {
  test: string
  passed: boolean
  diffString: Array<ReactElement>
  expected: string
  actual: string
}

/**
 * QueryOutputProps
 * used to just display the output from a query
 * of the database
 */
export type QueryOutputProps = {
  output: string
}

/**
 * QueryOutput component, that will be usable for users who
 * just want to get the output from the database.
 */
export function QueryOutput(props: QueryOutputProps) {

  const queryOutput = props.output;
  
  return (<>
    <div className={`queryYourOutput`}>
    Output
     </div>
    <pre className={'queryOutputSegment'}>
      {queryOutput}
    </pre>
  </>)
}

/**
 * Shows the feedback segment and if it needs 
 */
export function FeedbackSegment(props: FeedbackProps) {

  const [feedbackOn, setFeedbackOn] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(0);
  const name = props.test;
  const passText = props.passed ? '✓' : '✘';
  const style = props.passed ? "resultPass" : "resultFailed";

  const diffString = props.diffString;
  const actualString = props.actual;
  const expectedString = props.expected;
  
  const visibleState = feedbackOn ? "flex" : "none";

  const toggleExpandClick = () => {
    const toggle = !feedbackOn;
    setFeedbackOn(toggle);
  }

  const switchPanel = (e: any, idx: number) => {
    e.stopPropagation();
    setSelectedPanel(idx);
  }

  const feedbackOutput = selectedPanel === 0 ? actualString
    : selectedPanel === 1 ? expectedString
    : selectedPanel === 2 ? diffString : '';

  const usualDiff = selectedPanel !== 2 ?
    <pre className={"feedbackDiff"} style={{display: visibleState }}>
        {feedbackOutput}
    </pre> :
    <div className={"feedbackDiff"} style={{display: visibleState }}>
        {feedbackOutput}
    </div>
  return (
    <li className={`${style}`} onClick={toggleExpandClick}>
      <div className={"feedbackDiffTitle"} >
        {name} {passText}
      </div>
      <div className={"feedbackDiffBar"} style={{display: visibleState}}>
        <div className={`feedbackYourOutput ${selectedPanel === 0 ? "outputPanelSelected" : ""}`}
          onClick={(e) => switchPanel(e, 0)}>
        Your Output
         </div>
        <div className={`feedbackExpectedOutput ${selectedPanel === 1 ? "outputPanelSelected" : ""}`}
          onClick={(e) => switchPanel(e, 1)}>
        Expected
        </div>
        <div className={`feedbackDiffView ${selectedPanel === 2 ? "outputPanelSelected" : ""}`}
          onClick={(e) => switchPanel(e, 2)}>
        Diff
        </div>
      </div>
      {usualDiff}
    </li>
  )
}

/**
 * ResultsFeedback
 * Component is used to display the results
 * from the checker
 */
export function ResultsFeedback(props: ResultsFeedbackProps) {

  const isError = props.error;
  const isAvailable = props.available;
  const isQueryOnly = props.queryOnly;
  const errorMessage = props.errorMessage;
  const queryOutput = props.queryOutput;

  const results = props.results.map((e, _) => {
    const name = e.test;
    const diffStr = e.diffData;
    const actual = e.actual;
    const expected = e.expected;
    return <FeedbackSegment test={name} passed={e.passed} diffString={diffStr}
        actual={actual} expected={expected}/>
  });  

  return isError ?
    <div className="resultsError">
      {errorMessage}
    </div>
    : isQueryOnly ? (
      <div className="resultsQuery">
        <QueryOutput output={queryOutput} />
      </div>
    )
    : isAvailable ? (
      <div className="resultsFeedback">
        <span className={'resultTitle'}>💬 Feedback</span>
        <ul className="resultsList">
          {results}
        </ul>
      </div>) : (
      <div className="resultsUnavailable">
        <span className="resultUnavailableText">
          No Feedback Available
        </span>
      </div>
    )
}

/**
 * EditorZone, will be used for editing the answer
 * submitting it and 
 */
export function EditorZone(props: EditorZoneProps) {

  console.log(props);
  const dbproxy = props.dbproxy;
  const storage = props.storage;
  const taskkey = props.pkg.name;
  const pkg = props.pkg;
  const evaluator = props.evaluator;
  const editorRef = useRef(null);

  console.log(props);
  
  const [answer, setAnswer] = useState(pkg.scaffold);

  useEffect(() => {
    console.log("Updating")
    const previousSolution =
      storage.getSubmission(taskkey);

    if(previousSolution) {
      setAnswer(previousSolution.code);
      
    } else {
      setAnswer(pkg.scaffold);
    }
    
  }, [taskkey]);
  
  const [results, setResults] = useState({
    results: [] as Array<ResultEntry>,
    available: false,
    error: false,
    errorMessage: '',
    queryOnly: false,
    queryOutput: '',
  });

  const [shortcutState, setShortcutState] = useState({
    shift: false,
    enter: false,
    ctrl: false,
    queryDispatched: false,
    released: false
  })

  
  const onAnswerChange = useCallback((val: string,
      _viewUpdate: ViewUpdate) => {
    setAnswer(val);
    
  }, []);

  const submitAnswer = async (_e: any) => {

    //TODO: Need to separate the key to be extracted
    // from a separate field

    const proxy = dbproxy;
    let success = false;

    storage.saveSubmission(taskkey, { code: answer });

    try {
      // NOTE: This is where it is tested
      const userResults = await proxy
        .check(answer, evaluator);
        
      setResults({
        results: userResults.results,
        available: true,
        error: false,
        errorMessage: '',
        queryOnly: false,
        queryOutput: '',
      });
      success = userResults.success;

    } catch(error) {
      setResults({
        results: [],
        available: true,
        error: true,
        errorMessage: (error as any).result.message,
        queryOnly: false,
        queryOutput: '',
      })
    }
    storage.saveProgress(taskkey, { completed: success });
  };

  //
  // TODO: Enable selecting and running snippets
  // 
  // const getSlice = () => {
  //   const refObj = editorRef.current as any;
  //   const sliceDoc = refObj.state.sliceDoc;
  //   const from = refObj.state.selection.main.from;
  //   const to = refObj.state.selection.main.to;
  //   const data = sliceDoc(from, to);
  // 
  //   return data;
  // }
  // 

  const queryDatabase = async (_e: any) => {
    const proxy = dbproxy;
    try {
      const userResults = await proxy
        .sketch(answer, evaluator);
        
      setResults({
        results: userResults.results,
        available: true,
        error: false,
        errorMessage: '',
        queryOnly: true,
        queryOutput: userResults.results[0].actual,
      })
      console.log(userResults.resultData);
    } catch(error) {
      setResults({
        results: [],
        available: true,
        error: true,
        errorMessage: (error as any).result.message,
        queryOnly: false,
        queryOutput: '',
      })
    }
  }

  const onShortcutTriggerDown = (e: any) => {
    const newState = {...shortcutState};
    if(e.key === 'Control') {
      newState.ctrl = true;
    }
    if(e.key === 'Shift') {
      newState.shift = true;
    }
    if(e.key === 'Enter') {
      newState.enter = true;
    }
    if(newState.enter && newState.shift && newState.ctrl) {
      if(!newState.queryDispatched) {
        e.stopPropagation();
        newState.queryDispatched = true;
        queryDatabase({})
      }      
    }
    setShortcutState(newState);
  }
  
  const onShortcutTriggerUp = (e: any) => {
    const newState = {...shortcutState};
    if(e.key === 'Control') {
      newState.ctrl = false;
    }
    if(e.key === 'Shift') {
      newState.shift = false;
    }
    if(e.key === 'Enter') {
      newState.enter = false;
    }
    if(!newState.enter || !newState.shift || !newState.ctrl) {
      newState.queryDispatched = false;
    }
    setShortcutState(newState);
  }
    

  loadLanguage('sql');
  
  return (<div className="editorZone">
    <div className="attackEditor">
      <CodeMirror
          readOnly={!dbproxy.getReadyState()}
          ref={editorRef}
          onChange={onAnswerChange}
          style={{textAlign: 'left',
            color: 'black',
            flex: 1 }}
          theme={THEME}
          value={answer}
          extensions={[langs.sql()]}
          onKeyDown={onShortcutTriggerDown}
          onKeyUp={onShortcutTriggerUp}
        />
    </div>
    <div className="attackSubmission">
      <button className="attackSubmissionButton"
        onClick={submitAnswer}
        disabled={!dbproxy.getReadyState()}>Submit</button>
      <button className="attackSubmissionButton"
        onClick={queryDatabase}
        disabled={!dbproxy.getReadyState()}>Query</button>
    </div>
    <div className="attackResults">
      <ResultsFeedback
        results={results.results}
        error={results.error}
        errorMessage={results.errorMessage}
        available={results.available}
        queryOnly={results.queryOnly}
        queryOutput={results.queryOutput}
      />
    </div>
  </div>)
}
