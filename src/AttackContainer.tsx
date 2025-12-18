import { SQLTask } from "./Task"
import { KeyPrefixes, type StorageInstance } from "./Storage";
import { RetrieveProgression } from './progression/Retrieve';
import { type ReactElement } from "preact/compat";
import type { ExercisePack } from "./service/exercises/Defaults";
import { useEffect, useRef, useState } from "preact/hooks"
import './styles/AttackContainer.css';

/**
 * SetData callback, used to update and trigger
 * the container refresh
 */
export type SetDataCallback = (data: SqlAttackContainerData) => void;

/**
 * Progression tuple, references the array
 * of exercises
 */
export type ProgressionTuple = {
  exerciseNo: number,
  completed: boolean,
}

/**
 * Progression array
 */
export type SqlExerciseProgression = {
  exericses: Array<ProgressionTuple>
}

/**
 * Container properties
 * It will accept the set of exercises
 */
export type SqlAttackContainerProps = {
  exercises: Array<ExercisePack>
  storage: StorageInstance
}

/**
 * Container data that will
 * hold the current exercises and progression
 */
export type SqlAttackContainerData = {
  exercises: Array<ExercisePack>
  progress: SqlExerciseProgression
  selected: number
  selectedPack: number
  currentPack: number
}

/**
 * If a task is not selected, it will
 * show that it is not selected otherwise it will have
 * a task presentable
 */
export type SqlTaskContainerProps = {
  parentData: SqlAttackContainerData
  setData: SetDataCallback
  selected: number
  selectedPack: number
  storage: StorageInstance
}


/**
 * On the lefthand side, a selector will be
 * present to allow for the user to select the task
 * they want
 */
export type SqlTaskSelectorProps = {
  parentData: SqlAttackContainerData
  setData: SetDataCallback
  storage: StorageInstance
  visible: boolean
  setVisible: (s: boolean) => void;
}

/**
 * Selector Column where the user can select the exercise
 * they want to work on
 */
export function SqlTaskSelectorColumn(props: SqlTaskSelectorProps) {

  const setData = props.setData;
  const data = props.parentData;
  const selectedPack = data.selectedPack;
  const selected = data.selected;
  const currentPack = data.currentPack;
  const storage = props.storage;
  const visibleState = props.visible;
  const setVisible = props.setVisible;
  
  const isVisible = visibleState ?  'visible' : 'hidden';

  useEffect(() => {
    const handleRes = () => {
      const docWidth = (document.getRootNode() as any)
        .body.clientWidth;
      if(docWidth > 700) {
        setVisible(true);
      }
    };

    window.addEventListener('resize', handleRes);
    
  });

  const progressKeys = props.parentData.exercises.map((pe) => {
    const exercises: Array<string> = [];
    pe.tasks.forEach(te => exercises.push(te.name))
    return exercises;
  }).reduce((pa, ca) => pa.concat(ca));

  const [progMap, progArray] = storage.progression(progressKeys);
  
  const buttonSelect = (n: number, p: number) => {
    const newState = {...data};
    newState.selected = n;
    newState.selectedPack = p;
    newState.currentPack = p;
    setData(newState);    
  };

  const selectPack = (n: number) => {
    const newState = {...data};
    newState.selectedPack = n;
    setData(newState);    
  };

  const packItems = props.parentData
    .exercises.map((e, i: number) => {
    let navItems: Array<ReactElement> = [];

    if(selectedPack === i) {
      navItems = 
      e.tasks.map((e, idx: number) => {

        //TODO: Replace e.name with e.key
        const progKey = KeyPrefixes.FormatForProgress(e.name);
        const progIndex = progMap.get(progKey);
        const progObj = progIndex !== undefined && progIndex >= 0 ? progArray[progIndex] : { completed: false };

        const selectedItemStyle = progObj.completed ? 'taskSelectNavItemCompleted' :
          (selected !== undefined
          && selected === idx
          && selectedPack === currentPack) ? "taskSelectNavItemSoftChosen" :
          "taskSelectNavItemSoft";
        return (<>
          <li key={`navitem_extra_${idx}`} onClick={() => buttonSelect(idx, i)}
          className={`${selectedItemStyle}`}>
            {e.name}
          </li>
          </>)
      });
    }
    
    const selectedPackStyle = (selectedPack !== undefined
      && selectedPack === i) ? "taskSelectNavItemChosen" : "taskSelectNavItem";
    
    return (<>
      <li key={`navitem_${i}`} onClick={() => selectPack(i)}
      className={`${selectedPackStyle}`}>
          ⛁ : {e.topic}
      </li>
      {navItems}
      </>);
  });
  
  
  return (<nav className="taskSelectNav" style={{visibility: isVisible }}>
      <div className="taskListTitle">Exercises</div>
      <ul className="taskSelectNavList">
        {packItems}
      </ul>
    </nav>) 
}

export type SqlAttackTopBarProps = {
  storage: StorageInstance,
  exercises: Array<ExercisePack>
  columnToggleState: boolean
  columnToggleFn: (b: boolean) => void;
}

/**
 * TaskContainer, used to be within the view
 * while the user is browsing the exercises they want to work on.
 */
export function SqlTaskContainer(props: SqlTaskContainerProps) {

  const selected = props.selected;
  const selectedPack = props.selectedPack;
  const exercises = props.parentData.exercises;
  const storage = props.storage;

  return ((selected >= 0 && selected < exercises[selectedPack]
      .tasks.length) ?
    <SQLTask pkg={exercises[selectedPack].tasks[selected]}
      storage={storage} /> :
    <div className="sqltaskContainer_NotSelected">
      <span className="sql_notselected">Please Select An Exercise</span>
    </div>);
}

export function SqlAttackTopBar(props: SqlAttackTopBarProps) {

  const storage = props.storage;
  const exercises = props.exercises;
  const visibleState = props.columnToggleState;
  const barRef: any = useRef(null);
  const visibleFn = props.columnToggleFn;
  

  const exercisesVisible = () => {
    console.log(barRef.current.offsetWidth);
    visibleFn(!visibleState);
  }

  return (
    <div className={"sqlattackTopBar"} ref={barRef}>
      <div className={"taskNavButton"} onClick={exercisesVisible}>☰</div>
      <span>SqlAttack</span>
      <RetrieveProgression storage={storage} exercises={exercises} />
    </div>
  )
}

/**
 * SqlAttackContainer
 * It will hold all components and be a representation of our single page
 * application
 */
export function SqlAttackContainer(props: SqlAttackContainerProps) {

  const storage = props.storage;
  const [data, setData] = useState({
    exercises: props.exercises,
    progress: { exericses: [] },
    selected: -1,
    selectedPack: -1,
    currentPack: -1,

  } as SqlAttackContainerData);

  const [columnState, setColumnState] = useState(false)

  return (<>
    <div className="sqlattackStack">
      <SqlAttackTopBar storage={storage} exercises={data.exercises}
        columnToggleState={columnState} columnToggleFn={(d: boolean) => { setColumnState(d) }} />
      <div className="sqlattackContainer">

        <SqlTaskSelectorColumn parentData={data} storage={storage}
          setData={(input: SqlAttackContainerData) => setData(input)} visible={columnState}
          setVisible={setColumnState}/>

        <SqlTaskContainer parentData={data}
          setData={(input: SqlAttackContainerData) => setData(input)}
          selected={data.selected} selectedPack={data.selectedPack}
          storage={storage}
        />
      </div>
    </div>
  </>)
}
