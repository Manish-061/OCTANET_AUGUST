document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <input type="text" class="edit-input" style="display: none;">
                <div class="task-actions">
                    <button class="complete-btn">${task.completed ? 'Not Completed' : 'Complete'}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="save-btn" style="display: none;">Save</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            const taskText = li.querySelector('.task-text');
            const editInput = li.querySelector('.edit-input');
            const editBtn = li.querySelector('.edit-btn');
            const saveBtn = li.querySelector('.save-btn');

            li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(index, taskText));
            editBtn.addEventListener('click', () => startEditing(taskText, editInput, editBtn, saveBtn));
            saveBtn.addEventListener('click', () => saveEdit(index, editInput, taskText, editBtn, saveBtn));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(index));

            taskList.appendChild(li);
        });
    }

    function addTask(text) {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
    }

    function toggleComplete(index, taskText) {
        tasks[index].completed = !tasks[index].completed;
        taskText.classList.toggle('completed');
        saveTasks();
        renderTasks();
    }

    function startEditing(taskText, editInput, editBtn, saveBtn) {
        taskText.style.display = 'none';
        editInput.style.display = 'inline-block';
        editInput.value = taskText.textContent;
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        editInput.focus();
    }

    function saveEdit(index, editInput, taskText, editBtn, saveBtn) {
        const newText = editInput.value.trim();
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            taskText.textContent = newText;
        }
        taskText.style.display = 'inline-block';
        editInput.style.display = 'none';
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            addTask(text);
            taskInput.value = '';
        }
    });

    renderTasks();
});