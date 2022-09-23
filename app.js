
const li = document.querySelectorAll("li")

let dropArea = document.querySelectorAll(".dropArea")


let todos = JSON.parse(localStorage.getItem("todos")) || []
    
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
function setLocalStorage(todos){
    localStorage.setItem("todos", JSON.stringify(todos))
}
function getLocalStorage(){
    localStorage.getItem("todos")
}


function init({id, status, content}){
    let element = createHtmlElement({id, status,content})
    document.querySelector(`[data-area="${status}"]`).insertBefore(element, document.querySelector(`[data-area="${status}"] .inputNewCard`))

}


function createHtmlElement({id, content, status}){
    let newLi = document.createElement("li")
    newLi.setAttribute("id", id)
    newLi.setAttribute("draggable", true)
    newLi.setAttribute("class", "element")

    let moveOptions = statusTodo
    .filter(e=>e !== status)
            
            .map(e=>`<li><button class="moveCard" data-button="${e}" data-action="moveCard"><i class="fa fa-arrow-right"></i>${buttonContent[e]}</button></li>`)
    
    newLi.innerHTML = `
        <div>${content}<i class="dots"></i>
            <ul class="miniMenu">
                <li><button class="editCard" data-action="editCard"><i class="fa fa-edit"></i>Editar</button></li>
                <li><button class="removeCard" data-action="removeCard"><i class="fa fa-trash"></i>Excluir</button></li>
                ${moveOptions.join("")}
            </ul>
        </div>
            `
    return newLi
}

function addNew(textArea){
    // if(textArea.querySelector(".addNewCard").classList.contains("hiddenButton")) return

    let value = textArea.value
    
    if(isFieldEmpty(value)) return

    let todo = {
        id:Date.now().toString(),
        status:textArea.parentElement.parentElement.parentElement.dataset.area,
        content:value
    }
    addCardToArray(todo)
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
function addCardToArray(todo){
    todos.push(todo)
    setLocalStorage(todos)
}

function removeCardFromArray(id){
    todos = todos.filter(element=>element.id !== id)
    setLocalStorage(todos)
}

function updateCardStatusOnArray(to, id){
    todos = todos.map(e=>e.id === id?{...e, status:to}:e)
    setLocalStorage(todos)
}
function updateCardContentOnArray(id, content){
    todos = todos.map(e=>e.id === id?{...e, content:content}:e)
    setLocalStorage(todos)
}

function removeCard(e){
    e.target.parentElement.parentElement.parentElement.parentElement.remove()
    removeCardFromArray(e.target.parentElement.parentElement.parentElement.parentElement.id)
}
function updateCardPositionOnArray(target, to){
    // console.log(target, to)

    if(!todos.length) return 
    let targetPosition = todos.findIndex(e=>e.id === target)
    let targetTodo = todos.splice(targetPosition, 1)
    let newPosition = todos.findIndex(e=>e.id === to)

    if(newPosition !== -1){
        todos.splice(newPosition, 0, ...targetTodo)
    }else{
        todos.push(...targetTodo)
    }
    setLocalStorage(todos)
 
}


function editCard(e){
    element = e.target.parentElement.parentElement.parentElement.parentElement
    // console.log(element, element.id)
    e.target.parentElement.parentElement.classList.remove("opened")

    editCardLabel = element.parentElement.querySelector(".editCardLabel")
    newCardLabel = element.parentElement.querySelector(".newCardLabel")

    newCardLabel.classList.add("cardLabel--invisible")
    editCardLabel.classList.add("cardLabel--visible")

    
    textarea = editCardLabel.querySelector("textarea")
    content = element.querySelector("div").firstChild

    textarea.value = content.textContent
    textarea.focus()
    textarea.onkeydown = evt =>{
        if(evt.key === "Enter"){
            if(!isFieldEmpty(textarea.value)){
                content.textContent = textarea.value
                updateCardContentOnArray(element.id, content.textContent)

            }
            textarea.value = ""
            editCardLabel.classList.remove("cardLabel--visible")
            newCardLabel.classList.remove("cardLabel--invisible")
        }
    }
    textarea.addEventListener("focusout",()=>{
        if(!isFieldEmpty(textarea.value)){
            content.textContent = textarea.value
            updateCardContentOnArray(element.id, content.textContent)

        }
        textarea.value = ""
        editCardLabel.classList.remove("cardLabel--visible")
        newCardLabel.classList.remove("cardLabel--invisible")
    })
    

}
function moveCard(e){
    console.log(e.target)
    let element = e.target.parentElement.parentElement.parentElement.parentElement
    let from = element.parentElement.dataset.area
    
    updateCardStatusOnArray(e.target.dataset.button, element.id)
    updateCardPositionOnArray(element.id, "")

    let dropArea = document.querySelector(`ul[data-area="${e.target.dataset.button}"]`)
    dropArea.insertBefore(element, dropArea.lastElementChild)

    e.target.setAttribute("data-button", from)
    e.target.lastChild = buttonContent[from]
    
}

const buttonActions = {
    removeCard:(e)=>removeCard(e),
    editCard:(e)=>editCard(e),
    moveCard:(e)=>moveCard(e)
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
    console.log(e.target)
    

        if(e.target.classList.contains("dots")){
            e.target.classList.add("dotsOpened")
        }
    7
}
dropArea.forEach(area=>{
    
    area.onclick = e =>{
        
        if(e.target.dataset.action in buttonActions){
            buttonActions[e.target.dataset.action](e)
        }
        
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
            updateCardStatusOnArray(area.dataset.area, data)

            buttonChange.setAttribute("data-button", from)
            buttonChange.innerHTML = buttonContent[from]
        }
        e.target.querySelector("span").remove()
        updateCardPositionOnArray(data, e.target.id)

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
        e.target.insertAdjacentElement("afterBegin", span)
    }

})

todos.forEach(element=>{
    init({...element})
})