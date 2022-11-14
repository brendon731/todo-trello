import render from "./renderElement.js" 


function setLocalStorage(todos){
    localStorage.setItem("todos", JSON.stringify(todos))
}
function getLocalStorage(){
    return localStorage.getItem("todos")
}
function arrayUpdated(array){
    setLocalStorage(array)
    render(array)

}
let initialValue = {
    notStarted:[],
    inProgress:[],
    completed:[]
}
export const todos = {

    todoList:JSON.parse(getLocalStorage()) || initialValue,

    addNew(todo){
        this.todoList[todo.status].push(todo)
        arrayUpdated(this.todoList)
    },
    remove(id, status){
        this.todoList[status] = this.todoList[status].filter(element=>element.id !== id)
        arrayUpdated(this.todoList)
    },
    updateContent(id, status, content){
        this.todoList[status] = this.todoList[status].map(e=>e.id === id?{...e, content:content}:e)
        arrayUpdated(this.todoList)
    },
    updatePosition(targetID, status, toStatus, toID){

        let targetPosition = this.todoList[status].findIndex(e=>e.id === targetID)

        let targetTodo = this.todoList[status].splice(targetPosition, 1)

        targetTodo = {...targetTodo[0], status:toStatus}

        let newPosition = this.todoList[toStatus].findIndex(e=>e.id === toID)
        if(newPosition === -1){
            this.todoList[toStatus].push(targetTodo)
        }else{
            this.todoList[toStatus].splice(newPosition, 0, targetTodo)
        }

        arrayUpdated(this.todoList)
    
    }
}
render(todos.todoList)

