const loaderList = document.querySelector('#loaderList')
const messageInital = document.querySelector('.messageInitial')
const addTaskBtn = document.querySelector('#add-task');
const taskList = document.querySelector('#todo-list');

const imgDelete = './assets/trash.ico'
const imgDropdownButton = './assets/dropdown.ico'
const imgAdd = './assets/add.ico'

const validations = {
    checkEmpty: (title) => {
        if (!title.trim()) throw new Error('Digite algo no campo!')
    },
    checkMinLength: (title) => {
        if (title.length < 4) throw new Error('Digite algo válido');
    },
    checkMaxLength: (title) => {
        if (title.length > 50) throw new Error('Limite de caracteres atingido');
    },
    checkForScripts: (title) => {
        const pattern = /^[a-zA-Z0-9\s]+$/;
        if (!pattern.test(title)) throw new Error('Entrada inválida');
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
        onClick: 'showPopover()'
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

const hideLoaderList = () => {
    loaderList.style.display = 'none'
}

const showTaskList = () => {
    taskList.style.display = 'block'
}

const hideTaskList = () => {
    taskList.style.display = 'none';
}

const showLoaderList = () => {
    loaderList.style.display = 'flex';
}

const hideMessageInitial = () => {
    messageInital.style.display = 'none'
}

const showMessageInitial = () => {
    messageInital.style.display = 'flex'
}

function task() {

    async function addTitleTask() {
        try {
            const taskText = getTaskInputValue();

            await validateTitleTask(taskText)

            const formatTitle = formatTitleize(taskText)

            addTaskOnDom(formatTitle)
            clearTaskInputValue()
        } catch (err) {
            return err
        }
    };

    const clearTaskInputValue = () => {
        document.querySelector('#task-input').value = ''
    }

    const getTaskInputValue = () => {
        return document.querySelector('#task-input').value;
    }

    const validateTitleTask = async (title) => {
        try {
            await validateTaskTitle(title);
        } catch (err) {
            throw err
        }
    };

    const formatTitleize = (title) => {
        try {
            const translateTitle = titleize(title);

            return translateTitle
        } catch (err) {
            throw err
        }
    }

    const createTaskElement = (title) => {
        createElements(title);
    }

    const setChildTaskClass = (childTask) => {
        childTask.classList.add('child-item');
    }

    function addTaskOnDom(title) {
        try {
            hideTaskList()
            showLoaderList()
            createTaskElement(title)
        } catch (err) {
            throw err
        }
    }

    function createElements(title) {
        try {
            const childTask = createChildTaskElement(title);

            setChildTaskClass(childTask);
            hideLoaderList()
            showTaskList()

            setItemsLocalStorage();
        } catch (err) {
            throw err
        }
    };

    function createChildTaskElement(title) {
        const childTask = document.createElement('li');

        addTaskToDOM(childTask, title);
        return childTask;
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
    };

    addTitleTask();
};

let referenceChild;

function subTasks(e) {

    function addTitleTask() {
        try {
            const parentTask = getParentTask();

            const taskText = getTaskInputValue();

            validateSubTaskTitle(taskText, parentTask);
        } catch (err) {
            return err
        }
    };

    const getTaskInputValue = () => {
        return document.querySelector('.task-name-input').value;
    }

    const getParentTask = () => {
        return e.target.parentElement
    }

    async function validateSubTaskTitle(title, parentTask) {
        try {
            const resultValidate = await validateTaskTitle(title);

            hideTaskList()
            showLoaderList()

            removeElementsToConfirm(parentTask);

            const translateTitle = titleize(title);
            createElements(translateTitle);
        } catch (err) {
            throw err
        }
    };

    function removeElementsToConfirm(parentTask) {
        Array.from(parentTask.querySelectorAll('.task-name-input, .confirm-name-btn, .delete-task')).forEach(element => element.remove());

        return;
    };

    function createElements(title) {
        addTaskToDOM(title);

        showTaskList()
        hideLoaderList()

        return setItemsLocalStorage();
    };

    function addTaskToDOM(title) {
        const date = getDate();

        referenceChild.appendChild(createElement('img', subTaskElements.dropdownBtn));
        referenceChild.appendChild(createElement('input', subTaskElements.checkbox));
        referenceChild.appendChild(createElement('span', subTaskElements.taskName, title));
        referenceChild.appendChild(createElement('img', subTaskElements.addChildBtn));
        referenceChild.appendChild(createElement('img', subTaskElements.deleteTaskBtn));
        referenceChild.appendChild(createElement('span', subTaskElements.taskDate, date));
        referenceChild.appendChild(createElement('ul', subTaskElements.childList));

        showLoaderList()
        return referenceChild = null;
    };

    addTitleTask();
};

function createSubTask(e) {

    function referenceTask() {
        const parentTask = getParentTask();

        createChildTaskElements(parentTask);
    };

    function checkForConfirmNameButton() {
        const confirmNameBtns = document.querySelectorAll('.confirm-name-btn');
        return confirmNameBtns.length > 0;
    }

    function createChildTaskElement(parentTask) {
        const childList = getChildList(parentTask);
        const childTask = getChildTask();
        childTask.classList.add('child-item');

        addTaskToDOM(childTask, childList);

        return referenceChild = childTask;
    }

    function createChildTaskElements(parentTask) {
        if (checkForConfirmNameButton()) {
            return;
        }

        dropdownOnCreate(e);

        return createChildTaskElement(parentTask);
    }

    function dropdownOnCreate() {
        const dropdownElement = getReferenceDropDown()

        if (dropdownElement.classList.contains('show-children')) {
            dropdown(e);
        };

        return;
    };

    function addTaskToDOM(childTask, childList) {
        childTask.appendChild(createElement('input', subTaskConfigs.input));
        childTask.appendChild(createElement('button', subTaskConfigs.button));
        childTask.appendChild(createElement('img', subTaskConfigs.imgDelete));

        return childList.appendChild(childTask);
    };

    const getParentTask = () => {
        return e.target.parentElement
    }

    const getChildList = (parentTask) => {
        return parentTask.querySelector('.child-list')
    }

    const getChildTask = () => {
        return document.createElement('li')
    }

    const getReferenceDropDown = () => {
        return e.target.parentElement.querySelector('.dropdown-btn');
    }

    referenceTask();
};

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

function updateChildCheckboxes(task, checked) {
    const childCheckboxes = task.querySelectorAll("li input[type='checkbox']");
    childCheckboxes.forEach(checkbox => checkbox.checked = checked);
}

function updateParentCheckbox(parentTask) {
    const parentCheckbox = parentTask.querySelector("input[type='checkbox']");
    const childTasks = parentTask.querySelectorAll("li");
    let allChecked = true;
    let someChecked = false;

    for (const childTask of childTasks) {
        const childCheckbox = childTask.querySelector("input[type='checkbox']");
        if (!childCheckbox.checked) {
            allChecked = false;
        } else {
            someChecked = true;
        }
    };

    updateParentCheckboxIfs(allChecked, someChecked, parentCheckbox);
}

function updateParentCheckboxIfs(allChecked, someChecked, parentCheckbox) {
    if (allChecked) {
        parentCheckbox.indeterminate = true;
        parentCheckbox.checked = false;
        return
    }

    if (someChecked) {
        parentCheckbox.indeterminate = true;
        parentCheckbox.checked = false;
        return
    }

    parentCheckbox.indeterminate = false;
    parentCheckbox.checked = false;
}

function checkBox(e) {
    const currentCheckbox = e.target;
    const currentTask = currentCheckbox.closest("li");
    const isChecked = currentCheckbox.checked;

    updateChildCheckboxes(currentTask, isChecked);

    let parentTask = currentTask.parentElement.closest("li");
    while (parentTask) {
        updateParentCheckbox(parentTask);
        parentTask = parentTask.parentElement.closest("li");
    }
}

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

    return `Adicionado em: ${day}/${month}/${year}`;
};

function titleize(text) {
    let wordsArray = text.trim().toLowerCase().split(" ");

    let words = wordsArray.map((word) => {
        if (word.length === 1) {
            return word.toUpperCase() + ".";
        };

        if (word.length === 2) {
            return word;
        };

        return word[0].toUpperCase() + word.slice(1);
    });

    return words.join(" ");
};

const validateTaskTitle = async (title) => {
    try {
        runValidations(title);
    } catch (err) {
        showErrorMessage(err.message);

        throw err
    };
};

const runValidations = (title) => {
    Object.keys(validations).forEach((key) => {
        validations[key](title);
    });
};

const setItemsLocalStorage = () => {
    removeShowClass()
    storeTodoListInLocalStorage()
    setMessageInitial()
}

const removeShowClass = () => {
    const initalizeElementPopover = taskList.querySelector('.show')
    if (initalizeElementPopover) {
        initalizeElementPopover.classList.remove('show')
    }
}

const storeTodoListInLocalStorage = () => {
    const todoList = taskList.innerHTML
    localStorage.setItem('@tasklist:todo-list', JSON.stringify(todoList))
}

const setMessageInitial = () => {

    if (taskList.hasChildNodes()) {
        hideMessageInitial()
        return
    }

    return showMessageInitial()
}

const getItemsLocalStorage = () => {
    taskList.innerHTML = JSON.parse(localStorage.getItem('@tasklist:todo-list'));
}

if (localStorage.getItem("@tasklist:todo-list")) {
    getItemsLocalStorage();
    setMessageInitial()
}

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
    if (e.key === 'Enter' && document.querySelector('#task-input').value.length) {
        task();
        return
    }
});

taskList.addEventListener("keydown", (e) => {
    if (e.key === 'Enter' && e.target.parentElement.querySelector('.task-name-input').value.length) {
        subTasks(e);
        return
    }
});