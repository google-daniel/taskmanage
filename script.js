const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTask');

let tasks = JSON.parse(localStorage.getItem('tasks')); // ローカルストレージからの読み込みは維持
if (tasks && tasks.length > 0 && typeof tasks[0] === 'string') {
    tasks = tasks.map(task => ({ text: task, completed: false }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
} else {
    tasks = tasks || [];
}
renderTasks();

function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        saveTasks(); // ローカルストレージにも保存
        renderTasks();
        newTaskInput.value = "";
    }
}

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.classList.toggle('completed', task.completed);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.onclick = () => deleteTask(index);
        li.appendChild(deleteButton);

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? "未完了にする" : "完了にする";
        completeButton.onclick = () => toggleComplete(index);
        li.appendChild(completeButton);

        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks(); // ローカルストレージにも保存
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(); // ローカルストレージにも保存
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function downloadTasks() {
    const jsonString = JSON.stringify(tasks);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';
    link.click();
    URL.revokeObjectURL(url);
}

function uploadTasks(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            tasks = JSON.parse(e.target.result);
            saveTasks();//アップロード後もローカルストレージに保存
            renderTasks();
        } catch (error) {
            alert('無効なJSONファイルです。');
        }
    };
    reader.readAsText(file);
}