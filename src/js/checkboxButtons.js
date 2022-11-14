let deleteChecked = document.querySelector(".deleteChecked")
import {todos} from "./arrayMethods.js"

export function check(){
    document.querySelector(".deleteChecked").disabled = !document.querySelector("main [type='checkbox']:checked") || !document.querySelector(".checkbox--mode")
}

document.querySelectorAll(".checkAll").forEach(checkall=>{
    checkall.onclick = e=>{
        document.querySelectorAll(`[data-area="${checkall.dataset.input}"] input[type="checkbox"]`)
        .forEach(input=>{
            input.checked = e.target.checked
        })
        deleteChecked.disabled = !e.target.checked

    }
})

deleteChecked.onclick = button =>{
    document.querySelectorAll(`ul [type="checkbox"]:checked`).forEach(e=>{todos.remove(e.dataset.id, e.dataset.status)})
}
document.querySelector("#enableCheckbox input").onclick = checkall =>{
    deleteChecked.disabled = true
    document.querySelectorAll(`.container`).forEach(e=>{
        e.classList.toggle("checkbox--mode")
        
        e.querySelectorAll("[type='checkbox']:checked").forEach(checkbox=>{
            checkbox.checked = false
        })
    })
}