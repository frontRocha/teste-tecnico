const modal = document.querySelector('.modal')
const btnConfirm = document.querySelector('#confirm-btn')
const btnCancel = document.querySelector('#cancel-btn')
const btnClose = document.querySelector('.close')
const shiftObs = document.querySelector('.obs')
const btnDelete = document.querySelector('.delete-task')
const toast = document.querySelector(".toast")
const progress = document.querySelector(".progress")

const actionDelete = {
    '.delete-task': taskDeleter,
    '.text': showPopover
};

const removeParentElement = (e) => {
    e.target.parentElement.remove();
}

const addClassListOnToast = () => {
    toast.classList.add("active");
}

const removeClassListOnToast = () => {
    toast.classList.remove("active");
}

const addClassListOnProgress = () => {
    progress.classList.add("active");
}

const removeClassListOnProgress = () => {
    progress.classList.remove("active");
}

function taskDeleter(e) {

    const openModal = () => {
        showModal()

        btnConfirm.addEventListener('click', () => {
            confirmDelete(e)
        })

        btnCancel.addEventListener('click', () => {
            hideModal()
        })

        btnClose.addEventListener('click', () => {
            hideModal()
        })
    }

    function confirmDelete() {
        hideTaskList()
        showLoaderList()
        removeTask();
        hideModal()
    }

    function removeTask() {
        removeParentElement(e)

        showTaskList()
        hideLoaderList()

        return setItemsLocalStorage();
    };

    const hideModal = () => {
        modal.style.display = 'none'
    }

    const showModal = () => {
        modal.style.display = 'block'
    }

    openModal()
};

function showErrorMessage(message) {
    addClassListOnToast()
    addClassListOnProgress()

    alertMessage.innerHTML = message

    timer1 = setTimeout(() => {
        removeClassListOnToast()
    }, 5000);

    timer2 = setTimeout(() => {
        removeClassListOnProgress()
    }, 5300);
}

function showPopover(e) {
    const item = e.target.parentElement.querySelector('.date')
    const allItems = document.querySelectorAll('.date')

    allItems.forEach(element => {
        if (element === item) {
            element.classList.toggle('show')
            return
        }

        if (element.classList.contains('show')) {
            element.classList.remove('show')
        }
    })
}

closeIcon.addEventListener("click", () => {
    removeClassListOnToast()

    setTimeout(() => {
        removeClassListOnProgress()
    }, 300);

    clearTimeout(timer1);
    clearTimeout(timer2);
});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    shiftObs.style.display = 'none'
} else {
    shiftObs.style.display = 'block'
}

taskList.addEventListener("click", (e) => {
    Object.entries(actionDelete).forEach(([selector, action]) => {
        if (e.target.matches(selector)) {
            action(e);
        };
    });
});

taskList.addEventListener("mousedown", (e) => {
    if (e.shiftKey && e.button === 0 && e.target.classList.contains('delete-task')) {
        hideTaskList()
        showLoaderList()

        removeParentElement(e)

        showTaskList()
        hideLoaderList()

        return setItemsLocalStorage();
    }
});
