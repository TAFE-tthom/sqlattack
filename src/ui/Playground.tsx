import { EditorZone } from './EditorZone';

import '../styles/SQLPlayground.css';
import { SqliteProxy } from '../sql/SQLiteProxy';

/**
 * Properties that are usable for
 * playing around with SQL and different databases
 * and options
 */
export type SQLPlaygroundProps = {
  proxy: SqliteProxy
  databaseRefs: Array<string>
  
}


/**
 * SQLPlayground
 * Used for just experimenting and 
 */
export const SQLPlayground = (props: SQLPlaygroundProps) => {

  return (
    <div className={'sqlplaygroundContainer'}>
    </div>
  )
}
