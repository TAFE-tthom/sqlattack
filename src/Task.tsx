import { useEffect, useState } from "preact/hooks"
import { SqliteProxy } from "./SQLiteProxy"
import type { TaskPackage } from "./TaskAggregate"
import { QuestionView } from "./Question"
import { EditorZone } from "./EditorZone"

import './styles/Task.css';
import type { StorageInstance } from "./Storage"

/**
 * Props, when selected the user should
 * be given the props
 */
export type SQLTaskProps = {
  pkg: TaskPackage
  storage: StorageInstance

}

/**
 * TaskData object is the coupling of the proxy and package
 */
export type SQLTaskDataObject = {
  proxy: SqliteProxy,
  pkg: TaskPackage
  
}

/**
 * Template 
 */
export class SQLTaskDataTemplate {

  static #instance: SQLTaskDataObject | null = null;

  /**
   * Default object for the state
   * Gets reinitialised when props are passed to it
   */
  static With(pkg: TaskPackage): SQLTaskDataObject {
    SQLTaskDataTemplate.#instance = {
      proxy: SqliteProxy.Empty(),
      pkg
    };
    return SQLTaskDataTemplate.#instance;
  }

  /**
   * Constructs the task data object
   * with the appropriate proxy and package
   * Will be used to refresh the task page
   */
  static async ConstructWith(data: SQLTaskDataObject) {
    const proxy = await SqliteProxy.Mutate(data.proxy, data.pkg);
    SQLTaskDataTemplate.#instance!.proxy = proxy;
    return SQLTaskDataTemplate.#instance;      
  }


  static GetExistingInstance(pkg: TaskPackage): SQLTaskDataObject {
    if(SQLTaskDataTemplate.#instance === null) {
      return SQLTaskDataTemplate.With(pkg);
    } else {
      //Also update the information with it
      return SQLTaskDataTemplate.#instance;
    }
  }
}

/**
 * SQLTask, holds the whole container outside of the task
 * selector for the task at hand.
 */
export function SQLTask(props: SQLTaskProps) {

  const pkg = props.pkg;
  const dbname = props.pkg.database;

  const [taskData, setTaskData] =
    useState(SQLTaskDataTemplate.GetExistingInstance(pkg));
  const question = pkg ? pkg.questionMd : 'Not Ready';
  const evaluator = pkg ? pkg.evaluation : ({} as any);
  const storage = props.storage;
  const proxy = taskData.proxy;


  useEffect(() => {
    
    const constructDb = async () => {
      // Triggers the switching
      const result = await SQLTaskDataTemplate
        .ConstructWith({ pkg, proxy });
      setTaskData({...result!});
      
    }

    if(dbname !== proxy.dbname) {
      constructDb();
    }
  }, [dbname]);

  return (<div className="sqltaskContainer">
    <div className={"notificationDbBusy"}
      style={{display: !proxy.getReadyState() ? "block" : "none"}}>
      Database is currently loading
    </div>
    <QuestionView question={question} />
    <EditorZone evaluator={evaluator} dbproxy={proxy} pkg={pkg} storage={storage}/>
  </div>)
}
