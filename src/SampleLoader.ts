
import { SqliteProxy } from "./SQLiteProxy";

import type { SampleDatabase } from './samples/SampleDatabase';

/**
 * SampleLoader that will load a SampleDatabase
 *   
 */
export class SampleLoader {

  proxy: SqliteProxy;

  /**
   * Constructs the database using the proxy
   */
  constructor(proxy: SqliteProxy) {
    this.proxy = proxy;
  }

  /**
   * Loads a sample database
   */
  load(database: SampleDatabase) {

    const requirements = database.requirements();

    const tasks = [database.getSchema()];
    if(requirements.data) {
      tasks.push(database.getInsertData());
    }
  }
  
}
