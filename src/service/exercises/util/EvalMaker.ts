import {
  FirstEntryEvaluationTest,
  OrderedEntriesEvaluationTest }
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
    rows: [] as Array<ResultRow>
  };

  function expectedData(rows: Array<ResultRow>) {
    stateData.rows = rows;
    tests.push(stateData);
    return {
      next: () => EvalInitState(tests),
      done: () => tests
    };
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
    rows: [] as Array<ResultRow>
  };

  function expectedData(rows: Array<ResultRow>) {
    stateData.rows = rows;
    task.evaluation.evaldata.push(stateData);
    return {
      next: () => EvalTaskInitState(task),
      done: () => task
    };
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
