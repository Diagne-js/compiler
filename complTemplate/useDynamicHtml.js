import { newId } from '../../utils/index.js'

export const useDynamicHtml = (template, script, vNames) => {
  let dynValues = template.match(/\{([^{}]*)\}/g)
  if(!dynValues) return [template, script]
  dynValues.forEach((d,i) => {
    const value = d.slice(1,-1).trim()
    const id = newId()
    const tracker = `<span d-text='${id}'>y</span>`
    template = template.replace(d, tracker)
    const dependences = vNames.filter(v => value.includes(v))
    script = script + `\n 
     $useReactiveHtml("[d-text = '${id}']",() => ${value},${JSON.stringify(dependences)})
    `
  })
  return [template, script]
}
