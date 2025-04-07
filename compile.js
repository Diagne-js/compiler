import { compileScript } from './complScript/index.js'
import { compileTemplate } from './complTemplate/index.js';

export const compile = (target) => {
  const start = target.indexOf("export default") + 15
  const main = target.slice(start, target.indexOf("</template>") + 11) + "}"
  /* vNames = reactives variables Names */
  let { script, vNames } = compileScript(
    main.slice(
      main.indexOf("=> {") + 4,
      main.indexOf("return <template>")
    ).trim())
  
  let template = main.slice(main.indexOf("return <template>") + 17, main.indexOf("</template>")).trim();
  /* We change the script because it must update the DOM */
  [template, script] = compileTemplate(template, script, vNames)
  script = script.trim()
  script = script.split('  ').join(' ')
  script = script.split('\n\n')
  .join('\n')
  document.querySelector('.un').innerText = `
      <body>
        ${template}
        <script>
           ${script}
        </script>
      </body>
    `
  document.querySelector('#app').innerHTML = `${template}\n`
  let scriptTag = document.createElement('script')
  scriptTag.text = script
  document.body.append(scriptTag)
}

compile(`
  export default () => {
    let todos = newReactive([]);
    let newTodo = newReactive('')
    let isWritting = newDerived(() => newTodo.trim() != '')
    console.log(isWritting)
    let isDark = true

    const addTodo = (newTodo) => {
       set todos = prev => {
         prev.push({
            title: newTodo,
            completed: false,
            id: Date.now()
         })
        return prev
      }
      set newTodo = 'g'
    }
    
    const remove = (todo, i) => {
      set todos = todos.filter(t => t.id != todo.id)
    }

  return <template>
   <main style="background: {isDark ? 'black' : 'white'};height:100vh">
    <div style="width:100%; padding:6px 0; border-bottom:1px gray solid;">
      <div style='width:60px;height:30px;border:solid 1px; border-radius:30px; position:relative;padding:2px'
      onclick={(e) => set isDark = !isDark}>
         <button style="width:30px; height:30px; border-radius:50%; box-shadow:1px 1px 1px;border:1px solid;position:absolute;transition:0.4s;left:{isDark ? '50%' : '3%'}"
         onclick={(e) => {
           e.stopPropagation()
           set isDark = !isDark
         }}
         ></button>
      </div>
    </div>
    <h1 style='padding:40px 0; text-align:center'>My Todo List App</h1>
    <div style='display:flex; justify-content:center;gap:5px'>
    <input type="text" d-model={newTodo} 
    style='width:200px;padding:5px;border-radius:6px;border:solid 2px rgb(180,180,190);'/>
    <button 
    onclick={() => addTodo(newTodo)}
    style='width:50px;background:lightgray;'
    disabled='{!isWritting}'
    >add</button><br>
    </div>
    <p d-if={!isWritting}>Add a new todo !</p>
    {newTodo}
    <ul>
      <li d-for={todo in todos, todo.id}>
        { todo.title} {todo.completed}
        <button
        onclick={() => set todos[i].completed = !todos[i].completed}
        >👌</button>
         <button onclick={() => remove(todo,i)}>
            remove
         </button>
      </li>
    </ul>
    </main>
  </template>
}
`)
