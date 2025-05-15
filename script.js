const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    return currentFilter === 'completed' ? task.completed : !task.completed;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    
    const span = document.createElement('span');
    span.textContent = task.title;

    const del = document.createElement('button');
    del.innerHTML = '🗑️';
    del.className = 'delete';
    del.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);

    taskList.appendChild(li);
  });
}

function addTask(title) {
  const task = {
    id: Date.now(),
    title,
    completed: false
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task => 
    task.id === id ? {...task, completed: !task.completed} : task
  );
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (title) {
    addTask(title);
    taskInput.value = '';
  }
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Initial render
renderTasks();
