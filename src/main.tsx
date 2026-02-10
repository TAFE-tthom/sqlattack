import { SqlAttackContainer } from './ui/AttackContainer';
import { PackageServiceHandler } from './service/PackageService';
import { LocalStorageInstance } from './service/Storage';

import { render } from 'preact'

import './index.css';
import './app.css';
import '../node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-opfs-async-proxy.js';
import '../node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.js';
import '../node_modules/coi-serviceworker/coi-serviceworker.js';



render(<SqlAttackContainer
  exercises={PackageServiceHandler.getPackages()}
  storage={LocalStorageInstance.getInstance()}
  />,
  document.getElementById('app')!)
