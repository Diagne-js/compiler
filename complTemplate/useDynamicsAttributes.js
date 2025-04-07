import {toTemplateLiteral, newId} from '../../utils/index.js'

export const useDynamicsAttributes = (template, script, vNames) => {
  const regex = /\b([\w-]+)\s*=\s*(['"])(.*?)\2/g;
  let attributes = template.match(regex)
  if (attributes) {
    for (let attr of attributes) {
      const name = attr.slice(0,attr.indexOf('=')).trim()
      let value = attr.slice(attr.indexOf('=')+1).trim().slice(1,-1)
      if (value.includes('{') && value.includes('}')) {
        const id = newId()
        let tracker = `d-${name}-id='${id}'`
        template = template.replace(attr, tracker)
        const dependences = vNames.filter(v => value.includes(v))
        
        script = script + `\n
        block(() => {
         const t = $select("[${tracker}]")
         t.removeAttribute("d-${name}-id")
         effect(() => {
          if(!t) return
          ${name == 'disabled' ? 
         `t.disabled = ${toTemplateLiteral(value).trim()} == 'true'`:
          `t.setAttribute('${name}', ${toTemplateLiteral(value)})`
              }
            }, ${JSON.stringify(dependences)})
          })
        `
      }
    }
  }
  return [template, script]
}
