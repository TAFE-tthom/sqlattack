// @ts-ignore
import { sqlite3Worker1Promiser } from "@sqlite.org/sqlite-wasm"
// @ts-ignore
import sqlite from '@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.js'
import type { DatabaseProxy, ResultEntry, ResultRow, TaskEvaluationResult, TaskPackage, TaskSubmissionEvaluator } from './TaskAggregate';


export type CheckCallback = (outcome: TaskEvaluationResult) => void; 

/**
 * Stack callback that will take data from
 * the previous operation
 */
export type StackCallback = (data: any) => Promise<any>;

/**
 * Response upon a query
 */
export type ResponseCallback = (result: any) => any;

/**
 * Callback that is used in `use`
 */
export type MessageResultCallback = (data: any) => any;

/**
 * When a message is returned
 * The object is to be return but also
 * allow for chaining
 */
export class SqliteMessageResult {

  data: any;
  proxy: SqliteProxy;

  constructor(proxy: SqliteProxy, data: any) {
    this.data = data;
    this.proxy = proxy;
  }

  /**
   * Message wrapper for the proxy.message call
   */
  message(kind: string, data: any) {
    return this.proxy.message(kind, data);
  }

  /**
   * Applies an operation with the data returned
   */
  use(callback: MessageResultCallback) {
    const data = callback(this.data);
    return new SqliteMessageResult(this.proxy, data);
  }

  /**
   * Gets the proxy
   */
  getProxy() {
    return this.proxy;
  }
}

export type DatabaseKindFlag = "Scaffold" | "Submission" | "Sketch";

const DatabaseKindMap = {
  Scaffold: "Scaffold" as DatabaseKindFlag,
  Submission: "Submission" as DatabaseKindFlag,
  Sketch: "Sketch" as DatabaseKindFlag
}

/**
 * Symbolising the sqlite commands
 */
export const SqliteCommands = {
  ConfigGet: 'config-get',
  Exec: 'exec',
  Open: 'open',
}

/**
 * Entry data store
 */
export type DatabaseIDMapEntry = {
  dbId: string,
  dbName: string
}

/**
 * IDMap that will know what entry to use based
 * on the task at hand
 */
export type DatabaseIDMap = {
  scaffold: DatabaseIDMapEntry
  submission: DatabaseIDMapEntry
  sketch: DatabaseIDMapEntry
}

/**
 * SqliteProxy, used to construct
 * a database object representation
 */
export class SqliteProxy implements DatabaseProxy {

  databaseIdMap: DatabaseIDMap = {
      scaffold: { dbId: '0', dbName: '' },
      sketch: { dbId: '0', dbName: '' },
      submission: { dbId: '0', dbName: '' },
  };
  channel: any;
  dbname: string;
  package: TaskPackage;
  loading: boolean = false;
  ready: boolean = false;

  // Stack of operations that can run
  stack: Array<StackCallback> = [];

  
  /**
   * Constructor
   * Specifies the filename and dbname
   */
  constructor(dbname: string, channel: any, pkg: TaskPackage) {
    this.dbname = dbname;
    this.channel = channel;
    this.package = pkg;
    this.syncIdMap();
  }

  syncIdMap() {
    const {scaffold, submission, sketch } = this.variations();
    this.databaseIdMap = {
      scaffold: { dbId: '0', dbName: scaffold },
      sketch: { dbId: '0', dbName: sketch },
      submission: { dbId: '0', dbName: submission },
    }
  }

  /**
   * Sets the loading state
   */
  setLoading() {
    this.loading = true;
  }

  /**
   * Gets the state information if it is loading
   */
  isLoading() {
    return this.loading;
  }

  /**
   * Unsets the loading state
   */
  unsetLoading() {
    this.loading = false;
  }

  /**
   * Gets the channel to the sqlite worker
   */
  getChannel() {
    return this.channel;
  }

  /**
   * Updates the channel field
   */
  setChannel(channel: any) {
    this.channel = channel;
  }


  /**
   * Gets the ready state of the proxy
   */
  getReadyState() {
    return this.ready;
  }

  /**
   * Updates the package
   */
  setPackage(pkg: TaskPackage) {
    this.package = pkg;
  }
  
  /**
   * Sets the state to ready for the rpoxy
   */
  setReady() {
    this.loading = false;
    this.ready = true;
  }

  /**
   * Creates an empty proxy
   * that will not be usable and will likely throw
   * an exception
   */
  static Empty() {
    return new SqliteProxy('none', () => {}, {} as any);
  }

  static async Mutate(proxy: SqliteProxy, pkg: TaskPackage) {
    const promiser: any = await new Promise((resolve) => {
      const _promiser = sqlite3Worker1Promiser({
        onready: () => resolve(_promiser),
      });
    });

    proxy.setChannel(promiser);
    proxy.setPackage(pkg);
    proxy.dbname = pkg.database;

    proxy.setLoading();    
    await proxy.useExistingOrCreate();


    proxy.setReady();
    proxy.unsetLoading();
    
    return proxy;
  }

  /**
   * Constructs a new sqlite proxy
   * that will return a proxy object to interact with
   * database
   */
  static async Make(dbname: string, pkg: TaskPackage) {

    const promiser: any = await new Promise((resolve) => {
      const _promiser = sqlite3Worker1Promiser({
        onready: () => resolve(_promiser),
      });
    });


    const proxy = new SqliteProxy(dbname, promiser, pkg);
    proxy.setReady();

    await proxy.destroy();
    await proxy.open(DatabaseKindMap.Scaffold)
      .setup(DatabaseKindMap.Scaffold)
      .run();

    
    
    return proxy;
  }

  /**
   * Resets the database, requires deleting the current database
   */
  async reset() {
    await this.destroy();
    await this.open(DatabaseKindMap.Scaffold)
      .setup(DatabaseKindMap.Scaffold)
      .run();

    return this;
  }

  /**
   * Runs the stack of functions that have been
   * constructed
   */
  async run() {
    let data = {};
    while(this.stack.length > 0) {
      let oper = this.stack.shift();
      if(oper) {
        data = await oper(data);
      }
    }
    return this;
  }

  /**
   * message
   * Gets the data and returns a result object that allows
   * chaining
   */
  message(kind: string, data: any) {

    const channel = this.getChannel();
    this.stack.push(async () => {
      const resp = await channel(kind, data);
      const obj = new SqliteMessageResult(this, resp);
      return obj;
    });

    return this;
  }

  /**
   * Will use the same logic as `check` but will be
   * using the `_sketch` database
   */
  async sketch(userAnswer: string,
    evaluator: TaskSubmissionEvaluator): Promise<TaskEvaluationResult> {
    return this.queryEvalution(userAnswer, evaluator,
      this.getDatabaseSketchId());
  }

  /**
   * Moved logic to queryEvaluation, returns the required data
   */
  async check(userAnswer: string, evaluator: TaskSubmissionEvaluator)
    :Promise<TaskEvaluationResult> {
    return this.queryEvalution(userAnswer, evaluator, 
      this.getDatabaseSubmissionId())
  }

  /**
   * Handles a submission from the user
   * and checks it against expected results
   * NOTE: It resets the database
   */
  async queryEvalution(userAnswer: string,
    evaluator: TaskSubmissionEvaluator,
    dbId: string):
    Promise<TaskEvaluationResult> {

    const channel = this.getChannel();
    const returnedData: Array<ResultRow> = [];
    // Communicates to the database
    // and aggregates the results
    await channel(SqliteCommands.Exec, {
      dbId, sql: userAnswer,
      callback: (result: any) => {
        if(result.row) {
          const rowData: ResultRow = {row: []};
          for(let i = 0; i < result.row.length; i++) {
            const r = result.row[i];
            rowData.row.push(r);
          }
          returnedData.push(rowData);
        }
      }
    });

    const resultEntries: Array<ResultEntry> = [];
    const evalTests = evaluator.evaldata;

    // Evaluates against the set of tests
    for(const t of evalTests) {
      const evaloper = t.oper;
      const resultEntry = await evaloper(returnedData,
        t, this);
      resultEntries.push(resultEntry);
    }
    
    // Final results from the evaluation
    const evalResults: TaskEvaluationResult = {
      warnings: [], //WARN: Not used
      errors: [], //WARN: Not used
      results: resultEntries,
      resultData: returnedData,
      success: resultEntries
        .map(e => e.passed)
        .reduce((p, c) => p && c),
    };

    return evalResults;
  }

  /**
   * Query that will be executed on the newly created
   * database
   */
  query(statements: string, resCallback: ResponseCallback) {
    const ref = this;
    const channel = this.getChannel();

    // pushed an async call, NOTE: Sends it to submission
    this.stack.push(async () => {
      await channel(SqliteCommands.Exec, {
        dbId: ref.getDatabaseSubmissionId(),
        sql: statements, callback: (result: any) => {
          const data = resCallback(result);
          return data;
        }
      });
    });

    return this;
  }

  getDatabaseSubmissionId() {
    return this.databaseIdMap.submission.dbId;
  }


  getDatabaseSketchId() {
    
    return this.databaseIdMap.sketch.dbId;
  }

  getDatabaseScaffoldId() {
    
    return this.databaseIdMap.scaffold.dbId;
  }

  setDatabaseIdWithFlag(kind: DatabaseKindFlag, dbId: string) {
    if(kind === "Scaffold") {
      this.databaseIdMap.scaffold.dbId = dbId;
    } else if(kind === "Submission") {
      this.databaseIdMap.submission.dbId = dbId;
    } else {
      this.databaseIdMap.sketch.dbId = dbId;
    }
    
  }

  getDatabaseIdFromFlag(kind: DatabaseKindFlag) {
    if(kind === "Scaffold") {
      return this.getDatabaseScaffoldId();
    } else if(kind === "Submission") {
      return this.getDatabaseSubmissionId();
    } else {
      return this.getDatabaseSketchId();
    }
  }

  /**
   * Setups the database
   * Calls all the setup operations 
   */
  setup(kind: DatabaseKindFlag) {
    const setupTups = this.package.setup;
    const channel = this.getChannel();
    const ref = this;
    
    this.stack.push(async (_data: any) => {
      for(const prep of setupTups) {
        await channel(SqliteCommands.Exec, {
          dbId: ref.getDatabaseIdFromFlag(kind), sql: prep.operation });
      }
    });

    return this;
  }

  formattedName() {
    return `${this.dbname}.sqlite3`;
  }

  /**
   * Opens the database and constructs
   * the file using opfs - will need to check
   * if it is compatible
   */
  open(kind: DatabaseKindFlag) {
    const channel = this.getChannel();
    const ref = this;

    this.stack.push(async (_data: any) => {

      await channel(SqliteCommands.ConfigGet, {});
      const resp = await channel(SqliteCommands.Open, {
        filename: `file:${this.formattedName()}?vfs=opfs`
      });
      ref.setDatabaseIdWithFlag(kind, resp.dbId);

    });
    return this;
  }

  /**
   * Will get the variations of the database
   * that will be held
   */
  variations() {
    const dbname = this.dbname;
    const scaffold = `${dbname}.sqlite3`;
    const sketch = `${dbname}_sketch.sqlite3`;
    const submission = `${dbname}_submission.sqlite3`;

    return {scaffold, sketch, submission}
  }

  /**
   * Synchronises the databases between scaffold, submission and sketch
   */
  async syncDbs() {
    const {scaffold, sketch, submission} = this.variations();

    try {
      const root = await navigator.storage.getDirectory();
      const scafFile = await (await root.getFileHandle(scaffold))
        .getFile();

      if(await this.fileExist(sketch)) {
        await root.removeEntry(sketch);
      }
      const sketFile = await (await root.getFileHandle(sketch,
        { create: true}))
        .createWritable();
      if(await this.fileExist(submission)) {
        await root.removeEntry(submission);
      }
      const submFile = await (await root.getFileHandle(submission,
        {create: true}))
        .createWritable();

      await submFile.write(scafFile);
      await sketFile.write(scafFile);
      await submFile.close();
      await sketFile.close();
    } catch(error) {
      const err = error as any;
      console.error(err.name, err.message);
    }
    return this;
  }

  /**
   * Creates a database if it doesn't exist
   * Will use the 
   */
  async useExistingOrCreate() {
    
    const filename = `${this.formattedName()}`;
    const doesExist = await this.fileExist(filename);
    if(doesExist) {
    await this.open(DatabaseKindMap.Scaffold)
      .run();
      await this.syncDbs();
    } else {

      //Create an setup
      await this.open(DatabaseKindMap.Scaffold)
        .setup(DatabaseKindMap.Scaffold)
        .run();

      //Synchronise the databases
      await this.syncDbs();

      //Open sketch db
      await this.open(DatabaseKindMap.Sketch)
        .run();

      //Open submission db
      await this.open(DatabaseKindMap.Submission)
        .run();
    }
  }

  /**
   * Checks to see if a file exists
   */
  async fileExist(path: string) {
    let exists = false;
    const root = await navigator.storage.getDirectory();
    try {
      await root.getFileHandle(path);
      exists = true;
    } catch(error) {}

    return exists;
  }

  /**
   * Destroys the current database
   */
  async destroy() {
    const root = await navigator.storage.getDirectory();
    await root.removeEntry(this.formattedName());
  }
}
