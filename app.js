import {todos} from "./arrayMethods.js"
let dropArea = document.querySelectorAll(".dropArea")
    
const statusTodo = ["notStarted", "inProgress", "completed"]
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

function init({id, status, content}){
    let element = createHtmlElement({id, status,content})
    document.querySelector(`[data-area="${status}"]`).insertBefore(element, document.querySelector(`[data-area="${status}"] .inputCardArea`))

}

function createHtmlElement({id, content, status}){
    let newLi = document.createElement("li")
    newLi.setAttribute("id", id)
    newLi.setAttribute("draggable", true)
    newLi.classList.add("element")

    let moveOptions = statusTodo
    .filter(e=>e !== status)
    .map(e=>`
    <li class="miniMenu__item moveCard" data-button="${e}" data-action="moveCard">
        <i class="fa fa-arrow-right"></i>
        ${buttonContent[e]}
    </li>`
    )
    newLi.innerHTML = `
    <div>
    <i class="dots"></i>

        <label class="checkbox element__label">
        <input type='checkbox' data-action="check"/>
            <span>${content}</span>
            <ul class="miniMenu">
                <li class="miniMenu__item editCard" data-action="editCard"><i class="fa fa-edit"></i>Editar</li>
                <li class="miniMenu__item removeCard" data-action="removeCard"><i class="fa fa-trash"></i>Excluir</li>
                ${moveOptions.join("")}
            </ul>
        </label>

        </div>
            `
    return newLi
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
    init({...todo})
    textArea.value = ""
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
function updateButton(button, from){
    button.setAttribute("data-button", from)
    button.innerHTML = "<i class='fa fa-arrow-right'></i>" + buttonContent[from]
}
function moveCard(e){

    let element = e.target.parentElement.parentElement.parentElement.parentElement
    let from = element.parentElement.dataset.area
    
    todos.updateStatus(e.target.dataset.button, element.id)
    todos.updatePosition(element.id, "")

    let dropArea = document.querySelector(`ul[data-area="${e.target.dataset.button}"]`)
    dropArea.insertBefore(element, dropArea.lastElementChild)

    updateButton(e.target, from)
    
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
    document.querySelector(".dotsOpened")?.classList.remove("dotsOpened")    
    if(e.target.classList.contains("dots")){
        e.target.classList.toggle("dotsOpened")

    }
}

dropArea.forEach(area=>{
    
    area.onclick = e =>{
        
        if(e.target.dataset.action in cardActions){
            cardActions[e.target.dataset.action](e)
        }

        // if(e.target.type === "checkbox"){
        //     document.querySelector(".deleteChecked").disabled = !!!document.querySelector("main [type='checkbox']:checked") || !!!document.querySelector(".checkbox--mode")

        // }
        
    }
    area.ondragstart = e =>{
        e.dataTransfer.setData("text", e.target.id)
        e.dataTransfer.setData("from", e.target.parentElement.dataset.area)
        
        disableAction("label")
        disableAction(".element div")

        
        setTimeout(() => {
            e.target.classList.add("invisible")
        }, 0);

    }

    area.ondrop = e =>{

        let data = e.dataTransfer.getData("text")
        let from = e.dataTransfer.getData("from")

        area.insertBefore(document.getElementById(data), e.target)

        let buttonChange = document.getElementById(data).querySelector(`[data-button="${area.dataset.area}"]`)

        if(buttonChange){
            todos.updateStatus(area.dataset.area, data)

            // buttonChange.setAttribute("data-button", from)
            // buttonChange.innerHTML = buttonContent[from]
            updateButton(buttonChange, from)

        }
        e.target.querySelector("span").remove()
        todos.updatePosition(data, e.target.id)

    }

    area.ondragend = e =>{
        setTimeout(() => {
            e.target.classList.remove("invisible")
        }, 0);
        enableAction()
    }

    area.ondragover = e =>{e.preventDefault()}
    
    area.ondragleave = e =>{e.target.querySelector("span").remove()}

    area.ondragenter = e =>{
        let span = document.createElement("span")
        span.classList.add("shadow")
        e.target.insertAdjacentElement("afterBegin", span)
    }

})

todos.todoList.forEach(element=>{
    init({...element})
})


