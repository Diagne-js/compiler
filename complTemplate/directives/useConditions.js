import {newId} from '../../../utils/index.js'

export const useConditions = (template, script, vNames) => {
  const regex = /d-if\s*=\s*\{[^}]*\}/
  const targets = template.match(regex)
  if(!targets) return [template, script]
  
  for (let target of targets) {
    const condition = target.slice(target.indexOf('{')+1, -1).trim()
    const id = newId()
    const d_if_id = ` d-if-id='${id}' `
    const dependences = vNames.filter(n => condition.includes(n))
    template = template.replace(target, d_if_id)
    
    script = script + `
     block(() => {
       const t = document.querySelector("[${d_if_id.trim()}]")
       let parent = t.parentElement
       let comment = document.createComment('condition')
       let lastCondition = null
      effect(() => {
        if (!parent) return
        const condition = ${condition}
        if (lastCondition === condition) return
        
        if (condition && parent.contains(comment)) {
            parent.replaceChild(t, comment)
        } else if (!condition && parent.contains(t)) {
            parent.replaceChild(comment, t)
        }
        lastCondition = condition 
      }, ${JSON.stringify(dependences)})
     })
    `
  }
  return [template, script]
}
