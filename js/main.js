'use strict';

// Находим элементы страницы

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

// Достаём данные из localStorage
if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();


// Добавление задачи
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу выполненной
tasksList.addEventListener('click', doneTask);

// Функции
function addTask(e) {

    // Отмена стандартного поведения браузера
    e.preventDefault();

    // Достаём текст задачи
    const taskText = taskInput.value;

    // Создаём объект, описание задачи
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    // Добавляем задачу в массив
    tasks.push(newTask);

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();
    
    // Рендерим задачу на странице
    renderTask(newTask);

    // Очищаем поле вводы и возвращаем фокус на него
    // e.target.reset();
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();

}

function deleteTask(e) {

    // Проверка клика НЕ по элементу (return останавливает дальнейшее выполнение кода)
    if(e.target.dataset.action !== 'delete') return;

    // Проверка клика по элементу (Свойство pointer-vents=none для img в CSS для клика по родителю)
    const parentNode = e.target.closest('.list-group-item');
    parentNode.remove();

    // Определяем ID задачи
    const id = Number(parentNode.id);

    // Удаляем задачу через фильтрацию массива
    tasks = tasks.filter((task) => task.id !== id);

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    checkEmptyList();


 }

function doneTask(e) {
    
    // Проверка клика НЕ по элементу (return останавливает дальнейшее выполнение кода)
    if(e.target.dataset.action !== 'done') return;

    // Проверка клика по элементу (Свойство pointer-vents=none для img в CSS для клика по родителю)
  
    const parentNode = e.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    // tasks.forEach((task) => {
    //     if (task.id === id) {
    //         parentNode.querySelector('.task-title').classList.toggle('task-title--done');
    //     }
    // })

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
    
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                    <div class="empty-list__title">Список дел пуст</div>
                                </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListElement);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }

    
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // Формируем CSS класс для выполненных задач
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Формируем разметку для новой задачи
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`
    
    tasksList.insertAdjacentHTML("beforeend", taskHTML);
}