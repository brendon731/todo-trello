import {addNewCard, removeCard, editCard, moveCard} from "./actionsFunctions.js"
import {check} from "./checkboxButtons.js"


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


const cardActions = {
    removeCard:(e)=>removeCard(e),
    editCard:(e)=>editCard(e),
    moveCard:(e)=>moveCard(e.target.dataset.id, e.target.dataset.belongsto, e.target.dataset.button),
    check:(e)=>check()
}

document.querySelectorAll(".newCardLabel > textarea").forEach(textArea=>{
    
    textArea.onkeydown = evt =>{
        if(evt.key === "Enter"){
            evt.preventDefault()
            textArea.blur()
            textArea.focus()
               
        }
    }
    textArea.onfocus = () =>{textArea.classList.add("activedTextarea")}
        
    textArea.addEventListener("focusout", (evt)=>{
        addNewCard(textArea)
        textArea.value = ""
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
    if(document.querySelector(".checkbox--mode")) return false
            
    document.querySelector(".dotsOpened")?.classList.remove("dotsOpened")    
    evt.dataTransfer.setData("text", evt.target.id)
    evt.dataTransfer.setData("comingFrom", evt.target.dataset.status)
    
    disableAction(".dropArea > li >*")
    
    setTimeout(() => {
        evt.target.classList.add("invisible")
    }, 0);
}

function dragDrop(evt, area){
    let data = evt.dataTransfer.getData("text")
    let status = evt.dataTransfer.getData("comingFrom")

    evt.target.querySelector("span").remove()
    moveCard(data, status, area.dataset.area, evt.target.id)
    enableAction()

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


document.querySelectorAll(".dropArea").forEach(area=>{
    
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



