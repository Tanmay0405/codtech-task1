// app.js
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('new-todo');
    const addTodoButton = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const themeToggleButton = document.getElementById('theme-toggle');

    // Load existing todos and theme from localStorage
    loadTodos();
    loadTheme();

    addTodoButton.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText) {
            addTodoItem(todoText);
            todoInput.value = '';
        }
    });

    todoList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const li = event.target.closest('li');
            if (event.target.classList.contains('delete')) {
                todoList.removeChild(li);
                saveTodos();
            } else if (event.target.classList.contains('edit')) {
                const newText = prompt('Edit your task:', li.querySelector('.todo-text').textContent);
                if (newText) {
                    li.querySelector('.todo-text').textContent = newText;
                    saveTodos();
                }
            } else if (event.target.classList.contains('toggle-complete')) {
                li.classList.toggle('completed');
                saveTodos();
            }
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterTodos(button.dataset.filter);
        });
    });

    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        saveTheme();
    });

    function addTodoItem(todoText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="todo-text">${todoText}</span>
            <div class="actions">
                <button class="toggle-complete">Complete</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>`;
        todoList.appendChild(li);
        saveTodos();
    }

    function saveTodos() {
        const todos = [];
        todoList.querySelectorAll('li').forEach(li => {
            todos.push({
                text: li.querySelector('.todo-text').textContent.trim(),
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <div class="actions">
                    <button class="toggle-complete">Complete</button>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>`;
            if (todo.completed) {
                li.classList.add('completed');
            }
            todoList.appendChild(li);
        });
    }

    function filterTodos(filter) {
        const items = todoList.querySelectorAll('li');
        items.forEach(item => {
            switch (filter) {
                case 'all':
                    item.style.display = 'flex';
                    break;
                case 'completed':
                    item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
                    break;
                case 'incomplete':
                    item.style.display = item.classList.contains('completed') ? 'none' : 'flex';
                    break;
            }
        });
    }

    function saveTheme() {
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    }

    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
});