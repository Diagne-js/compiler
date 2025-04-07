import { newId } from '../../../utils/index.js'

export const useModels = (template, script, vNames) => {
  const regex = /d-model\s*=\s*\{[^}]*\}/
  const models = template.match(regex)
  if (models == null) return [template, script]
  
  for (let model of models) {
    const bindTo = model.slice(model.indexOf('{') + 1, -1).trim()
    if (!vNames.find(v => v.startsWith(bindTo))) console.error(bindTo + " is not defined")
    const id = newId()
    const tracker = `d-mod='${id}'`
    template = template.replace(model, tracker)
    script = script + `\n
    block(() => {
     let t = $select("[${tracker}]")
     const handler = e => update(() => ${bindTo} = e.target.value, ${bindTo}, "${bindTo}")
     t.addEventListener('input', handler)
     t.removeAttribute('d-mod')
     t.value = ${bindTo}
    effect(() => {
      if(!t) return 
      t.removeEventListener('input', handler)
      t.value = ${bindTo}
      t.addEventListener('input', handler)
    }, ["${bindTo}"], false, '${id}')
    })
    `
  }
  return [template, script]
}
