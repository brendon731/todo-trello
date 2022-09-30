
const statusTodo = ["notStarted", "inProgress", "completed"]
const buttonContent = 
    {
        notStarted:"Not Started",
        inProgress:"In progress",
        completed:"Completed"
    }
function createHtmlElement({id, content, status}){
    let newLi = document.createElement("li")
    newLi.setAttribute("id", id)
    newLi.setAttribute("draggable", true)
    newLi.classList.add("element")

    let moveOptions = statusTodo
    .filter(e=>e !== status)
    .map(e=>`
    <li class="miniMenu__item moveCard" data-button="${e}" data-action="moveCard" data-id="${id}">
        <i class="fa fa-arrow-right"></i>
        ${buttonContent[e]}
    </li>`
    )
     
    newLi.innerHTML = `
    <div>
    <i class="dots"></i>

        <label class="checkbox element__label">
        <input type='checkbox' data-action="check" data-id="${id}"/>
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
export default function init({id, status, content}){
    let element = createHtmlElement({id, status,content})
    document.querySelector(`[data-area="${status}"]`).insertBefore(element, document.querySelector(`[data-area="${status}"] .inputCardArea`))
}