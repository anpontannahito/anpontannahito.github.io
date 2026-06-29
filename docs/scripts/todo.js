(() => {
    let todoList = null;
    let todoInput = null;

    function initTodo() {
        todoList = document.getElementById("todo-list");
        todoInput = document.getElementById("todo-input");
    }

    function ensureTodoReady() {
        if (!todoList || !todoInput) initTodo();
        return Boolean(todoList && todoInput);
    }

    function createTodoItem(text) {
        const li = document.createElement("li");
        li.textContent = text;
        li.classList.add("list-item");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "削除";
        deleteBtn.onclick = () => { deltodo(li); };
        deleteBtn.classList.add("todo_delete_button");

        li.appendChild(deleteBtn);
        return li;
    }

    function addTodo() {
        if (!ensureTodoReady()) return;

        const todoText = todoInput.value.trim();
        if (todoText === "") return;

        const li = createTodoItem(todoText);
        todoList.appendChild(li);
        todoInput.value = "";
    }

    function deltodo(item) {
        if (todoList && item.parentElement === todoList) {
            todoList.removeChild(item);
        }
    }

    window.initTodo = initTodo;
    window.createTodoItem = createTodoItem;
    window.addTodo = addTodo;
    window.deltodo = deltodo;
})();