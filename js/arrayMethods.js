function setLocalStorage(todos){
    localStorage.setItem("todos", JSON.stringify(todos))
}
function getLocalStorage(){
    return localStorage.getItem("todos")
}
export const todos = {

 todoList:JSON.parse(getLocalStorage()) || [],

    addNew(todo){
        this.todoList.push(todo)
        setLocalStorage(this.todoList)
    },
    remove(id){
        this.todoList = this.todoList.filter(element=>element.id !== id)
        setLocalStorage(this.todoList)
    },
    updateContent(id, content){
        this.todoList = this.todoList.map(e=>e.id === id?{...e, content:content}:e)
        setLocalStorage(this.todoList)
    },
    updatePosition(targetID, toStatus, toID){

        if(!this.todoList.length) return 
        let targetPosition = this.todoList.findIndex(e=>e.id === targetID)
        let targetTodo = this.todoList.splice(targetPosition, 1)
        targetTodo = {...targetTodo[0], status:toStatus}

        let newPosition = this.todoList.findIndex(e=>e.id === toID)
        if(newPosition === -1){
            this.todoList.push(targetTodo)
        }else{
            this.todoList.splice(newPosition, 0, targetTodo)
        }
        setLocalStorage(this.todoList)
    
    }
}
