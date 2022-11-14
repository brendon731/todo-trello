import {todos} from "./arrayMethods.js"

function isFieldEmpty(field){
    let pattern = /^\s*$/
    return  field.match(pattern)
}

export function addNewCard(textArea){

    let value = textArea.value
    if(isFieldEmpty(value)) return

    let todo = {
        id:Date.now().toString(),
        status:textArea.dataset.status,
        content:value
    }
    todos.addNew(todo)
    
}
export function removeCard(e){
    todos.remove(e.target.dataset.id, e.target.dataset.belongsto)
    
}

let id, belongsTo, editCardLabel, newCardLabel, textarea;
export function editCard(e){
    id = e.target.dataset.id
    belongsTo = e.target.dataset.belongsto


    newCardLabel = document.querySelector(`[data-area="${belongsTo}"] .newCardLabel`)
    editCardLabel = document.querySelector(`[data-area="${belongsTo}"] .editCardLabel`)

    newCardLabel.classList.add("cardLabel--invisible")
    editCardLabel.classList.remove("cardLabel--invisible")

    textarea = editCardLabel.querySelector(`textarea`)
    textarea.value = todos.todoList[belongsTo].filter(e=>e.id === id).map(e=>e.content)
    textarea.focus()

    textarea.onkeydown = evt =>{
        if(evt.key === "Enter"){
            evt.preventDefault()
            textarea.blur()
        }
    }
    textarea.addEventListener("focusout",()=>{
        if(!isFieldEmpty(textarea.value)){
            todos.updateContent(id, belongsTo,textarea.value)

        }
        textarea.value = ""
        editCardLabel.classList.add("cardLabel--invisible")
        newCardLabel.classList.remove("cardLabel--invisible")
        
    })

}
export function moveCard(targetID, status, toStatus, toID=""){
    todos.updatePosition(targetID, status, toStatus, toID)
    
}
