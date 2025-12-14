
/**
 * Organisation for the data
 *
 * - Submissions - This is held
 * - Tasks       - Holds the data to show if the task has been completed or not
 *
 * Submissions are prefixed as `submission-${}`
 * Tasks are prefixed as `progress-${}`
 *
 */

/**
 * KeyPrefixes,
 * Used to provide a prefix to assist with formatting
 * when saved and also helper functions
 */
export const KeyPrefixes = {
  Submission: 'submission-',
  Progress: 'progress-',
  FormatForSubmission: (key: string) => `${KeyPrefixes.Submission}${key}`,
  FormatForProgress: (key: string) => `${KeyPrefixes.Progress}${key}`,
}

/**
 * Submission Object
 * used to get the currently written code
 */
export type SubmissionObject = {
  code: string
}

/**
 * Gets the progress object
 * Atomised to a specific object changing
 */
export type ProgressObject = {
  completed: boolean
}

/**
 * StorageInstace interface
 * Acts as a general interface for saving data in both local and remote
 */
export interface StorageInstance {

  saveSubmission(key: string, subobj: SubmissionObject): void

  saveProgress(key: string, prgobj: ProgressObject): void

  getSubmission(key: string): SubmissionObject | null;

  getProgress(key: string): ProgressObject | null;

  progression(keys: Array<string>): [Map<string, number>, Array<ProgressObject>]
}

/**
 * StorageInstance
 *
 * An instance will be constructed and allow
 * saved worked to be retrieved for a particular task
 *
 * However, this is for a local device and is not for networked
 * persistance.
 */
export class LocalStorageInstance implements StorageInstance {

  static #instance: StorageInstance | null = null;

  static getInstance(): StorageInstance {
    if(this.#instance == null) {
      this.#instance = new LocalStorageInstance();
    }
    return this.#instance;
  }

  saveSubmission(key: string, obj: SubmissionObject) {
    const skey = KeyPrefixes.FormatForSubmission(key);
    const sobj = JSON.stringify(obj);
    localStorage.setItem(skey, sobj);
    
  }

  getSubmission(key: string) {
    const skey = KeyPrefixes.FormatForSubmission(key);
    const obj = localStorage.getItem(skey);
    if(obj) {
      return JSON.parse(obj);
    }
    return null;
  }

  saveProgress(key: string, data: ProgressObject) {
    const skey = KeyPrefixes.FormatForProgress(key);
    const sobj = JSON.stringify(data);
    localStorage.setItem(skey, sobj);
  }


  getProgress(key: string): ProgressObject | null {
    
    const skey = KeyPrefixes.FormatForProgress(key);
    const obj = localStorage.getItem(skey);
    if(obj) {
      return JSON.parse(obj);
    }
    return null;
  }

  progression(keys: Array<string>) {
    const pmap: Map<string, number> = new Map();
    const pobjs: Array<ProgressObject> = [];

    for(const k of keys) {
      const pkey = KeyPrefixes.FormatForProgress(k);
      const pobj = this.getProgress(k);
      if(pobj) {
        pmap.set(pkey, pobjs.length);
        pobjs.push(pobj);
      } else {
        pmap.set(pkey, pobjs.length);
        pobjs.push({ completed: false })
      }
    }    
    return [pmap, pobjs] as [Map<string, number>, Array<ProgressObject>];
  }
}
