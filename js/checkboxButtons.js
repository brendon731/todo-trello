let deleteChecked = document.querySelector(".deleteChecked")
import {todos} from "./arrayMethods.js"

document.querySelectorAll(".checkAll").forEach(checkall=>{
    checkall.onclick = e=>{
        document.querySelectorAll(`[data-area="${checkall.dataset.input}"] input[type="checkbox"]`)
        .forEach(input=>{
            input.checked = e.target.checked
        })
        deleteChecked.disabled = !document.querySelector("main [type='checkbox']:checked")
        
    }
})

deleteChecked.onclick = button =>{
    document.querySelectorAll(`ul [type="checkbox"]:checked`).forEach(e=>{
        e.parentElement.parentElement.parentElement.remove()
        todos.remove(e.parentElement.parentElement.parentElement.id)
    })
    document.querySelectorAll(".checkAll").forEach(checkall=>{
        checkall.checked = false
    })
    button.target.disabled = true
}

document.querySelector("#enableCheckbox input").onclick = checkall =>{
    deleteChecked.disabled = true
    document.querySelectorAll(`.container`).forEach(e=>{
        e.classList.toggle("checkbox--mode")
        e.querySelectorAll("[type='checkbox']").forEach(checkbox=>{
            checkbox.checked = false
        })
    })
}