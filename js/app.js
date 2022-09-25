import {todos} from "./arrayMethods.js"
import renderElement from "./renderElement.js" 
let dropArea = document.querySelectorAll(".dropArea")

const buttonContent = 
    {
        notStarted:"Not Started",
        inProgress:"In progress",
        completed:"Completed"
    }
function isFieldEmpty(field){
    let pattern = /^\s*$/
    return  field.match(pattern)
}
function disableAction(element){
    document.querySelectorAll(element).forEach(e=>{
        e.classList.add("disabled")
    })
}
function enableAction(){
    document.querySelectorAll(".disabled").forEach(e=>{
        e.classList.remove("disabled")
    })
}
function updateButtonMoveTo(button, from){
    button.setAttribute("data-button", from)
    button.innerHTML = "<i class='fa fa-arrow-right'></i>" + buttonContent[from]
}
function addNew(textArea){

    let value = textArea.value
    if(isFieldEmpty(value)) return
    let todo = {
        id:Date.now().toString(),
        status:textArea.parentElement.parentElement.parentElement.dataset.area,
        content:value
    }
    todos.addNew(todo)
    renderElement({...todo})
    textArea.value = ""
}

function removeCard(e){
    e.target.parentElement.parentElement.parentElement.parentElement.remove()
    todos.remove(e.target.parentElement.parentElement.parentElement.parentElement.id)
}

let element, editCardLabel, newCardLabel, textarea, content;
function editCard(e){
    element = e.target.parentElement.parentElement.parentElement.parentElement

    editCardLabel = element.parentElement.querySelector(".editCardLabel")
    newCardLabel = element.parentElement.querySelector(".newCardLabel")

    newCardLabel.classList.add("cardLabel--invisible")
    editCardLabel.classList.remove("cardLabel--invisible")

    
    textarea = editCardLabel.querySelector("textarea")
    content = element.querySelector("div span")

    textarea.value = content.textContent
    textarea.focus()
    textarea.onkeydown = evt =>{
        if(evt.key === "Enter"){
            if(!isFieldEmpty(textarea.value)){
                content.textContent = textarea.value
                todos.updateContent(element.id, content.textContent)

            }
            textarea.value = ""
            editCardLabel.classList.add("cardLabel--invisible")
            newCardLabel.classList.remove("cardLabel--invisible")
        }
    }
    textarea.addEventListener("focusout",()=>{
        if(!isFieldEmpty(textarea.value)){
            content.textContent = textarea.value
            todos.updateContent(element.id, content.textContent)

        }
        textarea.value = ""
        editCardLabel.classList.add("cardLabel--invisible")
        newCardLabel.classList.remove("cardLabel--invisible")
    })
    

}

function moveCard(e){

    let element = e.target.parentElement.parentElement.parentElement.parentElement
    let from = element.parentElement.dataset.area
    
    todos.updateStatus(e.target.dataset.button, element.id)
    todos.updatePosition(element.id, "")

    let dropArea = document.querySelector(`ul[data-area="${e.target.dataset.button}"]`)
    dropArea.insertBefore(element, dropArea.lastElementChild)

    updateButtonMoveTo(e.target, from)
    
}
function check(){
    document.querySelector(".deleteChecked").disabled = !document.querySelector("main [type='checkbox']:checked") || !document.querySelector(".checkbox--mode")
}
const cardActions = {
    removeCard:(e)=>removeCard(e),
    editCard:(e)=>editCard(e),
    moveCard:(e)=>moveCard(e),
    check:(e)=>check()
}

document.querySelectorAll(".newCardLabel > textarea").forEach(textArea=>{
    textArea.onkeydown = evt =>{
        if(evt.key === "Enter"){
            evt.preventDefault()
            addNew(textArea)
        }
    }
    textArea.onfocus = inp =>{
        textArea.classList.add("activedTextarea")}

    textArea.addEventListener("focusout", (evt)=>{
        addNew(textArea)
        textArea.classList.remove("activedTextarea")

    })

})

document.onclick = e =>{
    let actived = document.querySelector(".dotsOpened")
    actived?.classList.remove("dotsOpened")   
    
    if(e.target !== actived && e.target.classList.contains("dots")){
        e.target.classList.add("dotsOpened")
    }
}

function dragStart(evt){
    document.querySelector(".dotsOpened")?.classList.remove("dotsOpened")    
    evt.dataTransfer.setData("text", evt.target.id)
    evt.dataTransfer.setData("from", evt.target.parentElement.dataset.area)
    
    disableAction("label")
    disableAction(".element div")

    setTimeout(() => {
        evt.target.classList.add("invisible")
    }, 0);
}

function dragDrop(evt, area){
    let data = evt.dataTransfer.getData("text")
    let from = evt.dataTransfer.getData("from")

    area.insertBefore(document.getElementById(data), evt.target)

    let buttonChange = document.getElementById(data).querySelector(`[data-button="${area.dataset.area}"]`)

    if(buttonChange){
        todos.updateStatus(area.dataset.area, data)
        updateButtonMoveTo(buttonChange, from)

    }
    evt.target.querySelector("span").remove()
    todos.updatePosition(data, evt.target.id)
}

function dragEnd(evt){
    setTimeout(() => {
        evt.target.classList.remove("invisible")
    }, 0);
    enableAction()
}

function dragEnter(evt){
    let span = document.createElement("span")
    span.classList.add("shadow")
    evt.target.insertAdjacentElement("afterBegin", span)
}

dropArea.forEach(area=>{
    
    area.onclick = e =>{
        
        if(e.target.dataset.action in cardActions){
            cardActions[e.target.dataset.action](e)
        }
    }
    area.ondragstart = e => dragStart(e)

    area.ondrop = e => dragDrop(e, area)

    area.ondragend = e => dragEnd(e)

    area.ondragover = e => e.preventDefault()
    
    area.ondragleave = e => e.target.querySelector("span").remove()

    area.ondragenter = e => dragEnter(e)

})

todos.todoList.forEach(element=>{
    renderElement({...element})
})


