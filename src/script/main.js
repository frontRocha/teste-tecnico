const addTaskBtn = document.querySelector('#add-task');
const taskList = document.querySelector('#todo-list');

const imgDelete = './assets/trash.ico'
const imgDropdownButton = './assets/dropdown.ico'
const imgAdd = './assets/add.ico'


//Objetos de funções, validações e atributos de elementos
const validations = {
    checkEmpty: (title) => {
        if (!title) throw new Error('Digite algo no campo!')
    },
    checkMinLength: (title) => {
        if (title.length < 4) throw new Error('Digite algo válido');
    }
};

const taskActions = {
    '.add-child': createSubTask,
    '.confirm-name-btn': subTasks,
    'input[type="checkbox"]': checkBox,
    '.dropdown-btn': dropdown
};

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
        src: imgDelete,
        class: 'delete-task'
    },
    childList: {
        class: 'child-list'
    }
};

const subTaskElements = {
    dropdownBtn: {
        type: 'img',
        src: imgDropdownButton,
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
        class: 'text'
    },
    addChildBtn: {
        type: 'img',
        src: imgAdd,
        class: 'add-child',
    },
    deleteTaskBtn: {
        type: 'img',
        src: imgDelete,
        class: 'delete-task'
    },
    childList: {
        class: 'child-list'
    },
};


//Elementos Pais
function task() {

    function addTitleTask() {
        const taskText = document.querySelector('#task-input').value;

        validateAndAddTask(taskText)
        document.querySelector('#task-input').value = ''
    };

    async function validateAndAddTask(title) {
        const resultValidate = await validateTaskTitle(title);

        if (!resultValidate) {
            const translateTitle = titleize(title);
            createElements(translateTitle);
        };
    };

    function createElements(title) {
        const childTask = document.createElement('li');
        childTask.classList.add('child-item');

        addTaskToDOM(childTask, title);

        return setItemsLocalStorage();
    };

    function addTaskToDOM(childTask, title) {
        const date = getDate();
        const dateFormat = `Adicionado em: ${date}`

        childTask.appendChild(createElement('img', subTaskElements.dropdownBtn));
        childTask.appendChild(createElement('input', subTaskElements.checkbox));
        childTask.appendChild(createElement('span', subTaskElements.taskName, title));
        childTask.appendChild(createElement('img', subTaskElements.addChildBtn));
        childTask.appendChild(createElement('img', subTaskElements.deleteTaskBtn));
        childTask.appendChild(createElement('span', subTaskElements.taskDate, dateFormat));
        childTask.appendChild(createElement('ul', subTaskElements.childList));

        return taskList.appendChild(childTask);
    };

    addTitleTask();
};


//Variavel global de referência aos elementos que serão substituidos
let referenceChild;

//Elementos filhos
function subTasks(e) {

    function addTitleTask(e) {
        const parentTask = e.target.parentElement;

        const taskName = parentTask.querySelector('.task-name-input').value;

        validateSubTaskTitle(taskName, parentTask);
    };

    async function validateSubTaskTitle(title, parentTask) {
        const resultValidate = await validateTaskTitle(title);

        if (!resultValidate) {
            removeElementsToConfirm(parentTask);

            const translateTitle = titleize(title);
            createElements(translateTitle);
        };
    };

    function removeElementsToConfirm(parentTask) {
        parentTask.querySelector('.task-name-input').remove();
        parentTask.querySelector('.confirm-name-btn').remove();
        parentTask.querySelector('.delete-task').remove();

        return;
    };

    function createElements(title) {
        addTaskToDOM(title);

        return setItemsLocalStorage();
    };

    function addTaskToDOM(title) {
        const date = getDate();
        const dateFormat = `Adicionado em: ${date}`

        referenceChild.appendChild(createElement('img', subTaskElements.dropdownBtn));
        referenceChild.appendChild(createElement('input', subTaskElements.checkbox));
        referenceChild.appendChild(createElement('span', subTaskElements.taskName, title));
        referenceChild.appendChild(createElement('img', subTaskElements.addChildBtn));
        referenceChild.appendChild(createElement('img', subTaskElements.deleteTaskBtn));
        referenceChild.appendChild(createElement('span', subTaskElements.taskDate, dateFormat))
        referenceChild.appendChild(createElement('ul', subTaskElements.childList));

        return referenceChild = null;
    };

    addTitleTask(e);
};


//Adiciona ao DOM, elementos para confirmações de valores
function createSubTask(e) {

    function referenceTask(e) {
        const parentTask = e.target.parentElement;

        createElements(parentTask);
    };

    function createElements(parentTask) {
        const checkForButton = document.querySelectorAll('.confirm-name-btn')

        if(checkForButton.length) {
            return
        }

        const childList = parentTask.querySelector('.child-list');
        const childTask = document.createElement('li');
        childTask.classList.add('child-item');

        addTaskToDOM(childTask, childList);

        return referenceChild = childTask;
    };

    function addTaskToDOM(childTask, childList) {
        childTask.appendChild(createElement('input', subTaskConfigs.input));
        childTask.appendChild(createElement('button', subTaskConfigs.button));
        childTask.appendChild(createElement('img', subTaskConfigs.imgDelete));

        return childList.appendChild(childTask);
    };

    referenceTask(e);
};

//
function dropdown(e) {
    const childList = e.target.parentElement.querySelector('.child-list');
    childList.classList.toggle('show-children');

    const children = childList.querySelectorAll('li');

    for (let i = 0; i < children.length; i++) {
        children[i].classList.toggle('show-children');
    };

    const dropdown = e.target.parentElement.querySelector('.dropdown-btn');
    dropdown.classList.toggle('show-children');
};

function checkBox(e) {

    function checkBoxReference(e) {
        const currentCheckbox = e.target;
        const currentTask = currentCheckbox.closest("li");
        const isChecked = currentCheckbox.checked;

        checkChildCheckboxes(currentTask, isChecked);
        updateParentCheckbox(currentTask, isChecked);
    };

    function checkChildCheckboxes(task, checked) {
        const childCheckboxes = task.querySelectorAll("li input[type='checkbox']");
        childCheckboxes.forEach(checkbox => checkbox.checked = checked);
    };

    function updateParentCheckbox(task, checked) {
        const parentTask = task.parentElement.closest("li");

        if (parentTask) {
            const parentCheckbox = parentTask.querySelector("input[type='checkbox']");
            const childTasks = parentTask.querySelectorAll("li");
            let allChecked = false;
            let someChecked = false;

            for (const childTask of childTasks) {
                const childCheckbox = childTask.querySelector("input[type='checkbox']");
                if (childCheckbox.checked) {
                    someChecked = true;
                }

                allChecked = false;
            };


            updateParentCheckboxIfs(allChecked, someChecked, checked, parentCheckbox);
        };
    };

    const updateParentCheckboxIfs = (allChecked, someChecked, checked, parentCheckbox) => {
        if (allChecked) {
            parentCheckbox.indeterminate = false;
            parentCheckbox.checked = checked;
        };

        if (someChecked) {
            parentCheckbox.indeterminate = true;
            parentCheckbox.checked = false;
        };

        if (!allChecked && !someChecked) {
            parentCheckbox.indeterminate = false;
            parentCheckbox.checked = false;
        };
    };

    checkBoxReference(e);
}


//Realização de validações, configurações de criações e inserção de dados no localStorage
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
};

const getDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

function titleize(text) {
    let wordsArray = text.toLowerCase().split(" ");

    let words = wordsArray.map((word) => {
        if (word.length === 1) {
            return word.toUpperCase() + ".";
        };

        if (word.length === 2) {
            ; return word;
        }

        return word[0].toUpperCase() + word.slice(1);
    });

    return words.join(" ");
};

const validateTaskTitle = (title) => {
    try {
        runValidations(title);
    } catch (err) {
        showErrorMessage(err);
        setTimeout(hideErrorMessage, 2000);
        return err
    };
};

const runValidations = (title) => {
    Object.keys(validations).forEach((key) => {
        validations[key](title);
    });
};

const setItemsLocalStorage = () => localStorage.setItem('@tasklist:todo-list', JSON.stringify(taskList.innerHTML));


//Dados a serem recuperados do localStorage e enseridos ao DOM
const getItemsLocalStorage = () => taskList.innerHTML = JSON.parse(localStorage.getItem('@tasklist:todo-list'));

if (localStorage.getItem("@tasklist:todo-list")) {
    getItemsLocalStorage();
};

addTaskBtn.addEventListener("click", () => {
    task();
});

taskList.addEventListener("click", (e) => {
    Object.entries(taskActions).forEach(([selector, action]) => {
        if (e.target.matches(selector)) {
            action(e);
        };
    });
});

document.addEventListener("keydown", (e) => {
    if(e.key === 'Enter' && document.querySelector('#task-input').value.length) {
        task();
        return
    }
});

taskList.addEventListener("keydown", (e) => {
    if(e.key === 'Enter' && e.target.parentElement.querySelector('.task-name-input').value.length) {
        subTasks(e);
        return
    }
});