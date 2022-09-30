
const statusTodo = ["notStarted", "inProgress", "completed"]
import {todos} from "./arrayMethods.js"
const buttonContent = 
    {
        notStarted:"Not Started",
        inProgress:"In progress",
        completed:"Completed"
    }
function createElement({id, content, status}){
    let newLi = document.createElement("li")
    newLi.setAttribute("id", id)
    newLi.setAttribute("data-status", status)
    newLi.setAttribute("draggable", true)
    newLi.classList.add("element")

    let moveOptions = statusTodo
    .filter(e=>e !== status)
    .map(e=>`
    <li class="miniMenu__item moveCard" data-button="${e}" data-action="moveCard" data-id="${id}" data-belongsTo="${status}">
        <i class="fa fa-arrow-right"></i>
        ${buttonContent[e]}
    </li>`
    )
     
    newLi.innerHTML = `
    <div>
    <i class="dots"></i>

        <label class="checkbox element__label">
        <input type='checkbox' data-action="check" data-id="${id}" data-status="${status}"/>
            <span class="elementContent">${content}</span>
            <ul class="miniMenu">
                <li class="miniMenu__item editCard" data-action="editCard" data-belongsTo="${status}" data-id="${id}"><i class="fa fa-edit"></i>Editar</li>
                <li class="miniMenu__item removeCard" data-action="removeCard" data-id="${id}" data-belongsTo="${status}"><i class="fa fa-trash"></i>Excluir</li>
                ${moveOptions.join("")}
            </ul>
        </label>

        </div>
            `
    return newLi
}
export default function render(){
    let container, createNewTodoLabel

    Object.keys(todos.todoList).forEach(key=>{
        container = document.querySelector(`[data-area="${key}"]`)
        
        //getting the last element (textarea) before cleaning de ul
        createNewTodoLabel = container.lastElementChild

        //cleaning the ul
        container.innerHTML = ""

        //adding todos
        todos.todoList[key].forEach(element=>{

            container.appendChild(createElement(element))
        })
        //adding the last element again
        container.appendChild(createNewTodoLabel)


    })

}