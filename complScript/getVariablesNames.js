import { getContent } from '../../utils/index.js'

export const getVariablesNames = (script) => {
  let variables = script.match(/(const|let)\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+)/g)
  const vNames = []
  
  if (variables == null) return [
    [], script
  ]
  
  for (let decl of variables) {
    decl = decl.trim()
    let content = getContent(script, '(', ')', script.indexOf(decl))
    
    const name = decl.slice(decl.indexOf(" "), decl.indexOf("=")).trim()
    
    vNames.push(name)
    
    let value = decl.slice(
      decl.indexOf('=') + 1,
      decl.endsWith(';') ? -1 : decl.length
    ).trim()
    
    if (value.startsWith('newReactive')) {
      decl = decl.slice(0, decl.indexOf("newReactive")) + 'newReactive' + content
      const outputDecl = decl.slice(0, decl.indexOf('=') + 1) + content.slice(1, -1)
      script = script.replace(decl, outputDecl)
    } else if (value.startsWith('newDerived')) {
      decl = decl.slice(0, decl.indexOf("newDerived")) + 'newDerived' + content
      content = content.slice(1, -1)
      const dependences = [...vNames.filter(n => content.includes(n))]
      const outputDecl = decl.slice(0, decl.indexOf('=') + 1) + ' ' + content
      let output = `
        ${outputDecl} \n
        ${name} = ${name}()
      `.trim()
      
      script = script.replace(decl, output)
      script = script + `\n
        effect(() => {
           const old = ${name};
           ${outputDecl.slice(outputDecl.indexOf(' '))}\n
           update(() => ${name} = ${name}(),old,'${name}')
        }, ${JSON.stringify(dependences)})
        `
    } else if (value.startsWith("newRef")) {
      script = script.replace(decl, decl.slice(0,decl.indexOf('=')+1)+'ref_is_'+name)
    }
  }
  return [vNames, script]
}
