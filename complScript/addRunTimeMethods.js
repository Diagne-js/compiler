import {update, effect, $useReactiveHtml} from '../../reactivity/index.js'
import {escapeHtml} from '../../../utils/index.js'

export const addRunTimeMethods = (script) => {
  script = 'const effects = [];\n' + script
  script = script.replaceAll('newEffect(', 'effect(').trim()
  script = `\n
   const $mapNodes = (selector, callback) => document.querySelectorAll(selector).forEach(callback) \n
   const $selectAll = (s) => [...document.querySelectorAll(s)]\n
   const $select = (s) => document.querySelector(s)\n
     ${script} 
     
     ${update} 
     
     ${effect}
     
     const $escapeHtml = ${escapeHtml}
     
     const $useReactiveHtml = ${$useReactiveHtml}
  
     function block(cb) {
       cb()
     }
  `
  return script
}
