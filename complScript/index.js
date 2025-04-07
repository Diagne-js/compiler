import { getVariablesNames } from './getVariablesNames.js'
import {addSetters} from './addSetters.js';
import {addRunTimeMethods} from './addRunTimeMethods.js';

export const compileScript = (script) => {
  let vNames = {};
  [vNames, script] = getVariablesNames(script)
  
  script = addSetters(script, vNames)
  script = addRunTimeMethods(script)
  return {script,  vNames}
}
