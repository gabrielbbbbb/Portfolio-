
// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const dateDisplay = document.getElementById('date-display');

// Application State (Load from LocalStorage or default to empty array)
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Set up the current date display
const options = { weekday: 'long', month: 'short', day: 'numeric' };
dateDisplay.innerText = new Date().toLocaleDateString('en-US', options);

// Initialize App
function init() {
    renderTodos();
    setupEventListeners();
}

// Render todos to the DOM
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <div class="todo-item-content" onclick="toggleTodo(${index})">
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${escapeHTML(todo.text)}</span>
            </div>
            <button class="delete-btn" onclick="deleteTodo(event, ${index})">&times;</button>
        `;

        todoList.appendChild(li);
    });

    updateFooter();
    saveToLocalStorage();
}

// Event Listeners Setup
function setupEventListeners() {
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text !== '') {
            addTodo(text);
            todoInput.value = '';
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
}

// Core Functions
function addTodo(text) {
    todos.push({ text: text, completed: false });
    renderTodos();
}

window.toggleTodo = function(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

window.deleteTodo = function(event, index) {
    event.stopPropagation(); // Prevents the toggleTodo from firing
    todos.splice(index, 1);
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
}

function updateFooter() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    taskCount.innerText = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Helper to prevent basic XSS script injections
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Run the application
init();

