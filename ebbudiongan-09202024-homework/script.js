// Task states management using Proxy
const taskStates = {
    todo: [],
    inProgress: [],
    done: []
};

const taskProxy = new Proxy(taskStates, {
    set(target, key, newValue) {
        target[key] = newValue;
        renderTasks();
        return true;
    }
});


const taskInput = document.getElementById('new-task-input');
const addTaskButton = document.getElementById('add-task-btn');

// Add task event listener
addTaskButton.addEventListener('click', () => {
    const taskContent = taskInput.value.trim();
    if (taskContent) {
        taskProxy.todo = [...taskProxy.todo, taskContent];
        taskInput.value = ''; // Clear input field
    } else {
        alert("Please enter a task.");
    }
});

// Create a task element for the UI
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.draggable = true;
    taskElement.textContent = task;

     // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.addEventListener('click', () => {
        deleteTask(task);
    });

    taskElement.appendChild(deleteButton);

    // Drag event handlers
    taskElement.addEventListener('dragstart', () => {
        taskElement.classList.add('dragging');
    });

    taskElement.addEventListener('dragend', () => {
        taskElement.classList.remove('dragging');
    });

    return taskElement;
}

// Render tasks in the respective columns
function renderTasks() {
    ['todo', 'inProgress', 'done'].forEach(status => {
        const taskListElement = document.getElementById(`${status}-tasks`);
        taskListElement.innerHTML = ''; // Clear previous tasks
        taskProxy[status].forEach(task => {
            taskListElement.appendChild(createTaskElement(task));
        });
    });
}

function deleteTask(task) {
    for (const status in taskProxy) {
        if (taskProxy[status].includes(task)) {
            taskProxy[status] = taskProxy[status].filter(t => t !== task);
            break;
        }
    }
}

// Enable drag-and-drop functionality for columns
// document.querySelectorAll('.column').forEach(column => {
//     const taskListElement = column.querySelector('.task-list');

//     taskListElement.addEventListener('dragover', event => {
//         event.preventDefault(); // Allow dropping
//     });

//     taskListElement.addEventListener('drop', event => {
//         event.preventDefault();
//         const draggedTask = document.querySelector('.dragging');

//         if (draggedTask) {
//             const taskText = draggedTask.textContent;
//             const sourceColumnStatus = [...document.querySelectorAll('.column')]
//                 .find(col => col.contains(draggedTask)).getAttribute('data-status');
//             const targetColumnStatus = column.getAttribute('data-status');

//             if (sourceColumnStatus !== targetColumnStatus) {
//                 // Move task between columns
//                 taskProxy[sourceColumnStatus] = taskProxy[sourceColumnStatus].filter(task => task !== taskText);
//                 taskProxy[targetColumnStatus] = [...taskProxy[targetColumnStatus], taskText];
//             }
//         }
//     });
// });

document.querySelectorAll('.column').forEach(column => {
    const taskListElement = column.querySelector('.task-list');

    taskListElement.addEventListener('dragover', event => {
        event.preventDefault(); // Allow dropping
    });

    taskListElement.addEventListener('drop', event => {
        event.preventDefault();
        const draggedTask = document.querySelector('.dragging');

        if (draggedTask) {
            const taskText = draggedTask.textContent;
            const sourceColumnStatus = [...document.querySelectorAll('.column')]
                .find(col => col.contains(draggedTask)).getAttribute('data-status');
            const targetColumnStatus = column.getAttribute('data-status');

            if (sourceColumnStatus !== targetColumnStatus) {
                // Move task between columns
                taskProxy[sourceColumnStatus] = taskProxy[sourceColumnStatus].filter(task => task !== taskText);
                taskProxy[targetColumnStatus] = [...taskProxy[targetColumnStatus], taskText];
            }
        }
    });
});


// Initial rendering of tasks
renderTasks();
