import { StorageInstance } from '../Storage';

import type { ExercisePack } from "../service/exercises/Defaults";
import "../styles/RetrieveProgression.css";

export type ProgressionProps = {
  storage: StorageInstance
  exercises: Array<ExercisePack>
}


/**
 * Retrieves the progression from local storage
 * This is being used to track
 * what has been completed and what hasn't been
 */
export function RetrieveProgression(props: ProgressionProps) {

  const storage = props.storage;

  /**
   * Simulates the click event and allows the user
   * to 
   */
  const downloadClickEvent = (_: any) => {
    const progressKeys = props.exercises.map((pe) => {
      const exercises: Array<string> = [];
      pe.tasks.forEach(te => exercises.push(te.name))
      return exercises;
    }).reduce((pa, ca) => pa.concat(ca));
    
    const record = storage.makeProgressionRecord(progressKeys)

    const serializedProgression = JSON.stringify(record);

    const blob = new Blob([serializedProgression],
      { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const virtualAnchor = document.createElement("a");

    const filename = `progression-${record.timestamp}.json`;
    
    virtualAnchor.href=url;
    virtualAnchor.download = filename;
    virtualAnchor.click();
    
  }

  return (<>
    <div className={"retrieveProgression"}
      onClick={downloadClickEvent}>
      📈
    </div>
  </>)
}
