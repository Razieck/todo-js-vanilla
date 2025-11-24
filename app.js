// Estado de la app
const state = {
    tasks: loadTasks()
  };
  
  // Elementos del DOM
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const stats = document.getElementById('stats');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const clearAllBtn = document.getElementById('clear-all');
  
  // Inicializar
  render();
  updateStats();
  
  // Eventos
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTask(text);
    input.value = '';
    input.focus();
  });
  
  clearCompletedBtn.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => !t.completed);
    saveTasks(state.tasks);
    render();
    updateStats();
  });
  
  clearAllBtn.addEventListener('click', () => {
    if (!confirm('¿Eliminar todas las tareas?')) return;
    state.tasks = [];
    saveTasks(state.tasks);
    render();
    updateStats();
  });
  
  // Funciones principales
  function addTask(text) {
    const task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now()
    };
    state.tasks.push(task);
    saveTasks(state.tasks);
    render();
    updateStats();
  }
  
  function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks(state.tasks);
    render();
    updateStats();
  }
  
  function deleteTask(index) {
    state.tasks.splice(index, 1);
    persist();
    render();
    updateStats();
  }
  
  // Renderizado
  function render() {
    list.innerHTML = '';
    const fragment = document.createDocumentFragment();
    state.tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `item ${task.completed ? 'completed' : ''}`;
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTask(task.id));
  
      const text = document.createElement('span');
      text.className = 'text';
      text.textContent = task.text;
  
      const actions = document.createElement('div');
      actions.className = 'actions';
  
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove';
      removeBtn.textContent = 'Eliminar';
      removeBtn.addEventListener('click', () => deleteTask(index));
  
      actions.appendChild(removeBtn);
  
      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(actions);
  
      fragment.appendChild(li);
    });
    list.appendChild(fragment);
  }
  
  function updateStats() {
    const total = state.tasks.length;
    const done = state.tasks.filter(t => t.completed).length;
    stats.textContent = `Total: ${total} | Completadas: ${done} | Pendientes: ${total - done}`;
  }
  
  // Persistencia en LocalStorage
  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function loadTasks() {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  }