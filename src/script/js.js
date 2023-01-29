const addTaskBtn = document.querySelector('#add-task');
const taskTitleInput = document.querySelector('#task-input');
const taskList = document.querySelector('#todo-list');
const subTaskList = document.querySelector('.child-list');

const validations = {
    checkEmpty: (title) => {
        if (!title) {
            throw new Error('Digite algo no campo!')
        }
    },
    checkMinLength: (title) => {
        if (title.length < 4) {
            throw new Error('Digite algo válido')
        }
    }
}

const taskActions = {
    '.add-child': CreateSubTask,
    '.confirm-name-btn': SubTasks,
    'input[type="checkbox"]': CheckBox,
    '.delete-task': TaskDeleter,
    '.dropdown-btn': dropdown
}

const subTaskConfigs = {
    input: {
        type: 'text',
        placeholder: 'Adicione o conteúdo',
        class: 'task-name-input'
    },
    button: {
        text: 'Adicionar',
        class: 'confirm-name-btn'
    },
    imgDelete: {
        src: '/src/assets/trash.png',
        class: 'delete-task'
    },
    childList: {
        class: 'child-list'
    }
}

const subTaskElements = {
    dropdownBtn: {
        type: 'img',
        src: '/src/assets/dropdown.png',
        class: 'dropdown-btn'
    },
    checkbox: {
        type: 'checkbox'
    },
    taskDate: {
        title: '',
        class: 'date',
    },
    taskName: {
        type: 'text',
        text: '',
    },
    addChildBtn: {
        type: 'img',
        src: '/src/assets/add.png',
        class: 'add-child'
    },
    deleteTaskBtn: {
        type: 'img',
        src: '/src/assets/trash.png',
        class: 'delete-task'
    },
    childList: {
        class: 'child-list'
    }
}

//Elementos Pais
function Task() {

    function addTitleTask() {
        const taskText = taskTitleInput.value;

        validateAndAddTask(taskText)
        taskTitleInput.value = ''
    }

    async function validateAndAddTask(title) {
        const resultValidate = await validateTaskTitle(title)

        if (!resultValidate) {
            const translateTitle = titleize(title)
            createElements(translateTitle)
        }
    }

    async function createElements(title) {
        const childTask = document.createElement('li');
        childTask.classList.add('child-item');

        addTaskToDOM(childTask, title)

        return setItemsLocalStorage()
    }

    function addTaskToDOM(childTask, title) {
        const date = getDate();

        childTask.appendChild(createElement('img', subTaskElements.dropdownBtn));
        childTask.appendChild(createElement('input', subTaskElements.checkbox));
        childTask.appendChild(createElement('span', subTaskElements.taskName, title));
        childTask.appendChild(createElement('img', subTaskElements.addChildBtn));
        childTask.appendChild(createElement('img', subTaskElements.deleteTaskBtn));
        childTask.appendChild(createElement('span', subTaskElements.taskDate, date));
        childTask.appendChild(createElement('ul', subTaskElements.childList));

        return taskList.appendChild(childTask);
    }

    addTitleTask()
}


//Elementos filhos
function SubTasks(e) {

    function addTitleTask(e) {
        const parentTask = e.target.parentElement;
        const taskNameInput = parentTask.querySelector('.task-name-input');

        const taskName = taskNameInput.value;

        validateSubTaskTitle(taskName, parentTask)
    }

    async function validateSubTaskTitle(title, parentTask) {
        const resultValidate = await validateTaskTitle(title)

        if (!resultValidate) {
            const translateTitle = titleize(title)
            createElements(parentTask, translateTitle)
        }
    }

    async function createElements(parentTask, title) {
        const childList = parentTask.querySelector('.child-list');
        const childTask = document.createElement('li');
        childTask.classList.add('child-item');

        addTaskToDOM(childTask, childList, title)

        return setItemsLocalStorage()
    }

    function addTaskToDOM(childTask, childList, title) {
        const date = getDate()

        childTask.appendChild(createElement('img', subTaskElements.dropdownBtn));
        childTask.appendChild(createElement('input', subTaskElements.checkbox));
        childTask.appendChild(createElement('span', subTaskElements.taskName, title));
        childTask.appendChild(createElement('img', subTaskElements.addChildBtn));
        childTask.appendChild(createElement('img', subTaskElements.deleteTaskBtn));
        childTask.appendChild(createElement('span', subTaskElements.taskDate, date))
        childTask.appendChild(createElement('ul', subTaskElements.childList));

        return childList.appendChild(childTask)
    }

    addTitleTask(e)
}


//Adiciona ao DOM, elementos para confirmações de valores
function CreateSubTask(e) {

    function createSubTask(e) {
        const parentTask = e.target.parentElement;

        createElements(parentTask);
    }

    function createElements(parentTask) {
        const childList = parentTask.querySelector('.child-list');
        const childTask = document.createElement('li');
        childTask.classList.add('child-item');

        addTaskToDOM(childTask, childList)

        return
    }

    function addTaskToDOM(childTask, childList) {
        childTask.appendChild(createElement('input', subTaskConfigs.input));
        childTask.appendChild(createElement('button', subTaskConfigs.button));
        childTask.appendChild(createElement('img', subTaskConfigs.imgDelete));
        childTask.appendChild(createElement('ul', subTaskConfigs.childList));

        return childList.appendChild(childTask);
    }

    createSubTask(e)
}


//Validações, configurações de criações e persistencia de dados
function createElement(type, config, title) {
    const element = document.createElement(type);
    if (config.class) element.classList.add(config.class);
    if (config.src) element.src = config.src;
    if (config.text) element.textContent = config.text;
    if (title) element.textContent = title;
    if (config.onClick) element.onclick = config.onClick;
    if (config.type) element.type = config.type;
    if (config.placeholder) element.placeholder = config.placeholder;

    return element;
}

const getDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function titleize(text) {
    let wordsArray = text.toLowerCase().split(" ");

    let words = wordsArray.map((word) => {
        if (word.length === 1) {
            return word.toUpperCase() + ".";
        }
        if (word.length === 2) {
            return word;
        }
            
        return word[0].toUpperCase() + word.slice(1);
    });

    return words.join(" ");
}

const validateTaskTitle = (title) => {
    try {
        runValidations(title)
    } catch (err) {
        return err
    }
}

const runValidations = (title) => {
    Object.keys(validations).forEach((key) => {
        validations[key](title);
    });
}

const setItemsLocalStorage = () => localStorage.setItem('@tasklist:todo-list', JSON.stringify(taskList.innerHTML));


//Funcionalidades complementares
function dropdown(e) {
    const childList = e.target.parentElement.querySelector('.child-list');
    childList.classList.toggle('show-children');

    const children = childList.querySelectorAll('li');
    for (let i = 0; i < children.length; i++) {
        children[i].classList.toggle('show-children');
    }

    const dropdown = e.target.parentElement.querySelector('.dropdown-btn');
    dropdown.classList.toggle('show-children');
}

function CheckBox(e) {
    const currentCheckbox = e.target;
    const currentTask = currentCheckbox.closest("li");
    const isChecked = currentCheckbox.checked;

    const childCheckboxes = currentTask.querySelectorAll("li input[type='checkbox']");
    childCheckboxes.forEach(checkbox => checkbox.checked = isChecked);

    const parentTask = currentTask.parentElement.closest("li");
    if (parentTask) {
        const parentCheckbox = parentTask.querySelector("input[type='checkbox']");
        const childTasks = parentTask.querySelectorAll("li");

        let allChecked = true;
        let someChecked = false;

        for (const childTask of childTasks) {
            const childCheckbox = childTask.querySelector("input[type='checkbox']");
            if (childCheckbox.checked) {
                someChecked = true;
            } else {
                allChecked = false;
            }
        }
        
        if (allChecked) {
            parentCheckbox.indeterminate = false;
            parentCheckbox.checked = isChecked;
        } 
        else if (someChecked) {
            parentCheckbox.indeterminate = true;
            parentCheckbox.checked = false;
        } 
        else {
            parentCheckbox.indeterminate = false;
            parentCheckbox.checked = false;
        }
    }
}

function TaskDeleter(e) {
    function removeTask(e) {
        e.target.parentElement.remove();
        return setItemsLocalStorage()
    }

    removeTask(e)
}


const getItemsLocalStorage = () => taskList.innerHTML = JSON.parse(localStorage.getItem('@tasklist:todo-list'));

if (localStorage.getItem("@tasklist:todo-list")) {
    getItemsLocalStorage()
}


addTaskBtn.addEventListener("click", () => {
    Task()
});

taskList.addEventListener("click", (e) => {
    Object.entries(taskActions).forEach(([selector, action]) => {
        if (e.target.matches(selector)) {
            action(e);
        }
    });
});