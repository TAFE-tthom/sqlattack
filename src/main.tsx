import { render } from 'preact'
import { SqlAttackContainer } from './AttackContainer';
import { PackageServiceHandler } from './service/PackageService';

import './index.css'
import './app.css'
import '../node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-opfs-async-proxy.js';
import '../node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.js';

import '../node_modules/coi-serviceworker/coi-serviceworker.js';


import { LocalStorageInstance } from './Storage';

render(<SqlAttackContainer
  exercises={PackageServiceHandler.getPackages()}
  storage={LocalStorageInstance.getInstance()}
  />,
  document.getElementById('app')!)
