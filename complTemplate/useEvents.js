import { newId, getContent } from '../../utils/index.js'
import { addSetters } from '../complScript/addSetters.js'

export const $events = []

export const useEvents = (template, script) => {
  let events = template.match(/on\w+\s*=\s*\{[^}]*\}/g)
  if (!events) return [template, script]
  
  for (let event of events) {
    let value = getContent(template, '{','}', template.indexOf(event))
    event = event.slice(0,event.indexOf('{'))+value
    let handler = value.slice(1,-1)
    const eventName = event.slice(2, event.indexOf('='))
    const id = newId()
    const tracker = ` d-event='${id}' `
    template = template.replace(event, tracker)
    handler = addSetters(handler)
    
    $events.push({
      assignment: `el.addEventListener("${eventName}", ${handler})`,
      id
    })
    
    script = script + `
        block(() => {
          $selectAll("[${tracker}]").forEach(el => {
            el.addEventListener("${eventName}", ${handler})
          })
        })
      `
    continue
  }
  return [template, script]
}
