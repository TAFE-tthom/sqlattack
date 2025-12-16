import {
  FirstEntryEvaluationTest,
  OrderedEntriesEvaluationTest, 
  TableConstructionEvaluation,
  InsertIntoFormat}
  from './Utility';

import {
    EvaluationTest,
  ResultRow,
  TaskSetupTuple
} from '../../../TaskAggregate'

const EvalInitState = function(
  tests: Array<EvaluationTest>) {

  const stateData = {
    test: '',
    oper: (() => { }) as any,
    rows: [] as Array<ResultRow>,
    extra: [] as Array<any>
  };

  function expectedData(rows: Array<ResultRow>) {
    stateData.rows = rows;
    tests.push(stateData);
    return {
      next: () => EvalInitState(tests),
      done: () => tests
    };
  }
  function extrafn(entry: any) {
    stateData.extra.push(entry);
    return {
      extra: extrafn,
      expectedData
    }
  }

  

  function insertStatement(table: string, columns: Array<string>) {
    const values: Array<Array<any>> = [];
    const entry = InsertIntoFormat(table, columns, values);

    function addValues(data: Array<any>) {
      values.push(data);
      return {
        addValues,
        insertStatement,
        expectedData
      }
    }
    
    stateData.extra.push(entry);
    return {
      addValues,
      expectedData
    }
  }

  const initData = {
    test: (name: string) => {
      stateData.test = name;

      return {
        firstEntryOnly: () => {
          stateData.oper
            = FirstEntryEvaluationTest;
          return {
            extra: extrafn,
            expectedData
          }
        },
        orderedEntries: () => {
          stateData.oper
            = OrderedEntriesEvaluationTest;

          return {
            extra: extrafn,
            expectedData
          }
        },
        constructionEval: () => {
          stateData.oper
            = TableConstructionEvaluation;
          return {
            extra: extrafn,
            insertStatement,
            expectedData
          }
        }
      }
    },
  }
  return initData;
}

const EvalTaskInitState = function(
  task: any) {

  const stateData = {
    test: '',
    oper: (() => { }) as any,
    rows: [] as Array<ResultRow>,
    extra: [] as Array<any>
  };

  function expectedData(rows: Array<ResultRow>) {
    stateData.rows = rows;
    task.evaluation.evaldata.push(stateData);
    return {
      next: () => EvalTaskInitState(task),
      done: () => task
    };
  }

  function extrafn(entry: any) {
    stateData.extra.push(entry);
    
    return {
      extra: extrafn,
      expectedData
    }
  }

  function selectStatement(query: string) {

    const metaentry = {
      query,
      kind: 'SELECT'
    };

    stateData.extra.push(metaentry);

    return {
      
      expectedData
    }
  }

  function insertStatement(table: string, columns: Array<string>) {
    const metaentry = {
      table, columns, values: [] as Array<Array<any>>,
      kind: 'INSERT'
    };
    
    stateData.extra.push(metaentry);

    function addValues(data: Array<any>) {
      metaentry.values.push(data);

      return {
        addValues,
        insertStatement,
        selectStatement
      }
    }
    
    return {
      addValues,
    }
  }

  const initData = {
    test: (name: string) => {
      stateData.test = name;

      return {
        firstEntryOnly: () => {
          stateData.oper
            = FirstEntryEvaluationTest;
          return {
            expectedData
          }
        },
        orderedEntries: () => {
          stateData.oper
            = OrderedEntriesEvaluationTest;

          return {
            expectedData
          }
        },
        constructionEval: () => {
          stateData.oper
            = TableConstructionEvaluation;
          return {
            extra: extrafn,
            insertStatement,
            selectStatement,
            expectedData
          }
        }
      }
    },
  }
  return initData;
}
/**
 * Public function to construct Evaluation Tests
 */
export function EvalTests() {
  const tests: Array<any> = [];
  return EvalInitState(tests);
}


const SetupFnInit = function(task: any) {

  const setupState = {
    add: function(setup: TaskSetupTuple) {
      task.setup.push(setup);
      return setupState;
    },
    skip: function() {
      return {
        evaluation: function(kind: string) {
          task.evalkind = kind;
          return EvalTaskInitState(task)
        }
      }
    }
  }
  return setupState;
}

const NewTaskInit = function(task: any) {

  return {
    name: function(name: string) {
      task.name = name;
      return {
        key: function(_key: string) {
          return {
            scaffold: function(scaffold: string) {
              task.scaffold = scaffold;
              return {
                question: function(md: string) {
                  task.questionMd = md;
                  return {
                    database: function(db: string) {
                      task.database = db;
                      task.setup = [];
                      return {
                        setup: function() {
                          return SetupFnInit(task);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

/**
 * NewTask and you have to update this so it ensures
 * that the task is typed correctly
 * TODO: Fix it with typing
 */
export function NewTask() {
  const task = {
    name: '',
    key: '',
    scaffold: '',
    questionMd: '',
    database: '',
    setup: [],
    evaluation: {
      evalkind: [],
      evaldata: [],
    }
  }
  return NewTaskInit(task);
}
