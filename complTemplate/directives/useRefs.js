import { newId } from '../../../utils/index.js'

export const useRefs = (template, script, vNames) => {
  const regex = /d-ref\s*=\s*\{[^}]*\}/
  const refs = template.match(regex)
  
  if(refs == null) return [template, script]
  for (let ref of refs ) {
    const v = ref.slice(ref.indexOf('{')+1, -1).trim()
    if(!script.includes(`ref_is_${v}`)) console.error(v+ ' is not defined as a ref')
     const id = newId()
    script = script.replace(`ref_is_${v}`, `$select("[ref = '${id}']")`)
    template = template.replace(ref, `ref='${id}'`)
  }
  return [template,  script]
}
