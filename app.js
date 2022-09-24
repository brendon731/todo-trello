
// const li = document.querySelectorAll("li")

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
    console.log(id, status)
    let element = createHtmlElement({id, status,content})
    document.querySelector(`[data-area="${status}"]`).insertBefore(element, document.querySelector(`[data-area="${status}"] .inputNewCard`))

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
    let checkbox = document.querySelector(`.checkAll--label--enable`)?
    "<input type='checkbox' />":
    "<input type='checkbox' hidden/>"

    newLi.innerHTML = `
    <div>
    <i class="dots"></i>
        <label class="checkbox">
            ${checkbox}
            <span class="checkbox--hidden">${content}</span>
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

    editCardLabel = element.parentElement.querySelector(".editCardLabel")
    newCardLabel = element.parentElement.querySelector(".newCardLabel")

    newCardLabel.classList.add("cardLabel--invisible")
    editCardLabel.classList.add("cardLabel--visible")

    
    textarea = editCardLabel.querySelector("textarea")
    content = element.querySelector("div span")

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
function updateButton(button, from){
    button.setAttribute("data-button", from)
    button.innerHTML = "<i class='fa fa-arrow-right'></i>" + buttonContent[from]
}
function moveCard(e){

    let element = e.target.parentElement.parentElement.parentElement.parentElement
    let from = element.parentElement.dataset.area
    
    updateCardStatusOnArray(e.target.dataset.button, element.id)
    updateCardPositionOnArray(element.id, "")

    let dropArea = document.querySelector(`ul[data-area="${e.target.dataset.button}"]`)
    dropArea.insertBefore(element, dropArea.lastElementChild)

    updateButton(e.target, from)
    
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
    if(e.target.classList.contains("dots")){
        e.target.classList.toggle("dotsOpened")

    }
    
}
let deleteChecked = document.querySelector(".deleteChecked")

dropArea.forEach(area=>{
    
    area.onclick = e =>{
        
        if(e.target.dataset.action in buttonActions){
            buttonActions[e.target.dataset.action](e)
        }

        if(e.target.type === "checkbox" && !e.target.hidden){
            deleteChecked.disabled = !!!document.querySelector("main [type='checkbox']:checked")

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

            // buttonChange.setAttribute("data-button", from)
            // buttonChange.innerHTML = buttonContent[from]
            updateButton(buttonChange, from)

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
        span.classList.add("shadow")
        e.target.insertAdjacentElement("afterBegin", span)
    }

})

todos.forEach(element=>{
    init({...element})
})

document.querySelectorAll(".checkAll").forEach(checkall=>{
    checkall.onclick = e=>{
        
        document.querySelectorAll(`[data-area="${checkall.dataset.input}"] input[type="checkbox"]`)
        .forEach(input=>{
            input.checked = e.target.checked
        })
        deleteChecked.disabled = !!!document.querySelector("main [type='checkbox']:checked")
        
    }
})
deleteChecked.onclick = button =>{
    document.querySelectorAll(`ul [type="checkbox"]:checked`).forEach(e=>{
        e.parentElement.parentElement.parentElement.remove()
        removeCardFromArray(e.parentElement.parentElement.parentElement.id)
    })
    document.querySelectorAll(".checkAll").forEach(checkall=>{
        checkall.checked = false
    })
    button.target.disabled = true
}

document.querySelector("#enableCheckbox input").onclick = checkall =>{
    checkall.target.classList.toggle("enabled--all--checkbox")

    document.querySelectorAll(`.container [type="checkbox"]`).forEach(e=>{
        e.checked = false

        if(e.parentElement.classList.contains("checkAll--label")){
            e.parentElement.classList.toggle("checkAll--label--enable")
        }

        e.hidden = !checkall.target.checked


    })
}