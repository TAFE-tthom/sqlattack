import type { ReactElement } from "preact/compat";
import { DatabaseIDMap } from "./SQLiteProxy";

/**
 * Database Proxy interface
 * used to provide a generate interface for
 * proxy objects
 */
export interface DatabaseProxy {

  check(userAnswer: string,
    evaluator: TaskSubmissionEvaluator): Promise<TaskEvaluationResult>;

  
  execute(statements: string,
    dbId: string):
    Promise<Array<ResultRow>>;


  query(statements: string): Promise<Array<ResultRow>>;


  getDatabaseIDMap(): DatabaseIDMap;
}

/**
 * Entry within the feedback to outline what
 *  was the outcome from the submission
 */
export type ResultEntry = {
  test: string
  actual: string
  expected: string
  passed: boolean
  diffData: Array<ReactElement>
}

/**
 * ResultRow, nothing fancy but helps with reading
 * the code rather than it being a direct array
 */
export type ResultRow = {
  row: Array<any>
}

/**
 * TaskEvaluationResult
 * Gets information on warnings, errors and results
 * Will outline if the evaluation is a success or not
 */
export type TaskEvaluationResult = {
  warnings: Array<string>
  errors: Array<string>
  results: Array<ResultEntry>
  resultData: Array<ResultRow>
  success: boolean
}


/**
 * TaskSubmission
 * A user submits that then gets grouped with
 * TaskOperation
 */
export type TaskSubmission = {
  query: string
}

/**
 * TaskOperation
 * Uses both the evaluation data and submission to
 * provides an evaluation result
 */
export type TaskOperation = (
  resultData: Array<ResultRow>,
  data: TaskSubmissionEvaluator) => TaskEvaluationResult;


export type ColumnNames = Array<string>

/**
 * EvaluationOperation, used to create individual tests
 * and the expected data from it
 */
export type EvaluationOperation = (
  columnNames: ColumnNames,
  resultData: Array<ResultRow>,
  testData: EvaluationTest,
  dbProxy: DatabaseProxy) => Promise<ResultEntry>



/**
 * EvaluationTest, given test name, test data and
 * an operation, it will check to see if passes
 * or not
 */
export type EvaluationTest = {
  test: string
  oper: EvaluationOperation
  rows: Array<ResultRow>
  columns: ColumnNames
  extra: Array<any>
}

/**
 * Allows for the submission to be evaluated against
 *   if testing select, it will check the query against expected
 *   if testing modification, it will run the query and check result
 *   if testing DDL, it will check to see if it works to specification
 */
export type TaskSubmissionEvaluator = {
  evalkind: string
  evaldata: Array<EvaluationTest>
}

/**
 * SetupTuple, to be ran at the beginning
 */
export type TaskSetupTuple = {
  command: string
  operation: string
  extra: Array<any>
}

/**
 * TaskPackage, requires
 *   questionMd - Used for displaying the question
 *   database   - Database name
 *   setup      - Used to setting up the conditions/environment
 *                   of the question
 *   evaluation - evaluator object
 */
export type TaskPackage = {
  name: string
  key: string
  scaffold: string
  questionMd: string
  database: string
  setup: Array<TaskSetupTuple>
  evaluation: TaskSubmissionEvaluator
}

/**
 * TaskSubmissionPackage
 * Will be updated but will be maintained
 * through different stages
 */
export type TaskSubmissionPackage = {
  package: TaskPackage
  submission: TaskSubmission
  results: TaskEvaluationResult
}
