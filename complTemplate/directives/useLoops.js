import { newId, toTemplateLiteral, getContent } from '../../../utils/index.js'
import { $events } from '../useEvents.js'

export const useLoops = (template, script, vNames) => {
  const regex = /d-for\s*=\s*\{[^}]*\}/
  const targets = template.match(regex)
  
  if (!targets) return [template, script]
  
  for (let target of targets) {
    let value = target.slice(target.indexOf('{') + 1, -1).trim()
    let [decl, keyName] = value.split(',').map(i => i.trim())
    let [itemName, iterable] = decl.split(' in ').map(s => s.trim())
    const id = newId()
    const sel = ` d-for-id='${id}' `
    let key = " key='${" + keyName + "}' "
    const dependences = [iterable]
    let start = null
    let y = template.indexOf(target)
    while (start == null) {
      if (template[y] == '<') {
        start = y
        break
      }
      y--
    }
    let tagName = template.slice(start + 1, template.indexOf(' ', start)).trim()
    let ref = `<span d-for-ref="${id}"></span>`
    let content = getContent(template, `<${tagName}`, `</${tagName}`, start) + `/${tagName}>`
    let input = content
    template = template.replace(input, ref)
    
    content = content.replace(target, sel)
    content = toTemplateLiteral(content)
    content = content.replace('>', `${key}>`).trim()
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    let el = doc.body.firstElementChild;
    let assignEvents = '';
    
    [el, ...el.querySelectorAll("*")].forEach(t => {
      if (t.hasAttribute('d-event')) {
        let id = t.getAttribute('d-event')
        let matched = $events.find(e => e.id == id)
        
        assignEvents = assignEvents + `\n 
       block(() => {
          $selectAll("[d-event='${id}']").forEach(el => {
          ${matched.assignment}
      })
})
        `
      } else {
        return
      }
    })
    
    script = script + `\n
    block(() => {
      let keys = [];
      let elements = "";
      const parser = new DOMParser()
      let ref = document.querySelector("[d-for-ref='${id}']")
      const assignEvents = (${itemName}, i) => {
      ${assignEvents}
    }
      for (var i = 0; i < ${iterable}.length; i++) {
      let ${itemName} = ${iterable}[i]
      keys.push(${keyName})
      let inner = ${content};
      const doc = parser.parseFromString(inner, 'text/html')
      const el = doc.body.firstChild 
      ref.insertAdjacentElement('beforebegin', el)
      assignEvents(${itemName}, i)
    }
    effect((old, newVal) => {
    let ref = document.querySelector("[d-for-ref='${id}']")
      if (old.length < newVal.length) {
       let newItem = newVal.filter(i => !old.find(${itemName} => ${keyName} == ${keyName.replace(itemName, 'i')}))[0]
       let newItemIndex = newVal.findIndex(i =>  ${keyName.replace(itemName, 'i')} == ${keyName.replace(itemName, 'newItem')})
       let i = newItemIndex 
       const ${itemName} = newItem
       let inner = ${content}
       
      const $parser = new DOMParser()
      const doc = $parser.parseFromString(inner, 'text/html')
      let el = doc.body.firstChild 
      if (newItemIndex == newVal.length - 1) {
        ref.insertAdjacentElement('beforebegin', el)
      }else {
        let hisRef = $selectAll("[${sel}]").filter(e => e.getAttribute('key') == newVal[newItemIndex+1]${keyName.replace(itemName,  '')})[0]
        hisRef.insertAdjacentElement('beforebegin', el)
      }
      assignEvents(${itemName}, i)
      }else {
        $mapNodes("[${sel}]", (el, i) => {
          const key = el.getAttribute('key')
          if (!newVal.find(${itemName} => ${keyName} == key)) {
            el.remove()
            keys = keys.filter(k => k != key)
          }
        })
      }
      
    }, ${JSON.stringify(dependences)}, false)
    })
    `
  }
  return [template, script]
}
