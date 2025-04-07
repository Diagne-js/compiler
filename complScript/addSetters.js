import {getContent} from '../../../utils/index.js'

export const addSetters = (script, vNames) => {
  let updates = script.match(/set\s+([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)\s*=\s*(.+)/g)
  
  if (!updates) {
    return script
  }
  
  updates.forEach((update, i) => {
    const name = update.slice(update.indexOf(' '), update.indexOf('=')).trim()
    
    let input = update.slice(update.indexOf(' ')).trim()
    const value = input.slice(input.indexOf('=')+1).trim()
    
    const useCallback = value.startsWith('prev')
    
    if (useCallback) {
      let content = getContent(script, '{', '}', script.indexOf(update))
      content = value.slice(0,value.indexOf('{')) + content
      
      input = input.slice(0, input.indexOf('=')+1) + content
      update = update.slice(0, update.indexOf('prev')) + content
    }
    else if (value.startsWith('(')) {
        let content = getContent(script, '(', ')', script.indexOf(update))
        input = (input.slice(0, input.indexOf('=')+1) + content).trim()
        update = update.slice(0, update.indexOf('(')) + content
    }
    if(input.endsWith(';')) input = input.slice(0,-1).trim()
    script = script.replace(update, 
    `${useCallback ? `const oldVal = structuredClone(${name})\nconst setter = ${input.slice(input.indexOf('prev'))}\n` : ''}
    update(() => ${!useCallback ? input : `${name} = setter(${name})`},${useCallback ? 'oldVal' : name}, '${name}')
    `)
  })
  return script
}
