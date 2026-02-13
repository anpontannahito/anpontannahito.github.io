const todolist = document.getElementById("todo-list");
const todoInput = document.getElementById("todo-input");

function createTodoItem(text) {
    const li = document.createElement("li");
    li.textContent = text;
    li.classList.add("list-item");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.onclick = () => {deltodo(li);};
    deleteBtn.classList.add("todo_delete_button");
    li.appendChild(deleteBtn);
    return li;
}

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") return;
    const li = createTodoItem(todoText);
    todolist.appendChild(li);
    todoInput.value = "";
}

function deltodo(item) {
    todolist.removeChild(item);
}