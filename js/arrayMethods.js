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

    updateStatus(to, id){
        this.todoList = this.todoList.map(e=>e.id === id?{...e, status:to}:e)
        setLocalStorage(this.todoList)
    },
    updateContent(id, content){
        this.todoList = this.todoList.map(e=>e.id === id?{...e, content:content}:e)
        setLocalStorage(this.todoList)
    },
    updatePosition(target, to){

        if(!this.todoList.length) return 
        let targetPosition = this.todoList.findIndex(e=>e.id === target)
        let targetTodo = this.todoList.splice(targetPosition, 1)
        let newPosition = this.todoList.findIndex(e=>e.id === to)

        if(newPosition !== -1){
            this.todoList.splice(newPosition, 0, ...targetTodo)
        }else{
            this.todoList.push(...targetTodo)
        }
        setLocalStorage(this.todoList)
    
    }
}
