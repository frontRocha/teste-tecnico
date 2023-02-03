const modal = document.querySelector('.modal')
const btnConfirm = document.querySelector('#confirm-btn')
const btnCancel = document.querySelector('#cancel-btn')
const btnClose = document.querySelector('.close')
const shiftObs = document.querySelector('.obs')
const btnDelete = document.querySelector('.delete-task')

const errorMessage = document.getElementById("error-message");
const errorMessageText = document.getElementById("error-message-text");


//Objeto de funções
const actionDelete = {
    '.delete-task': taskDeleter,
    '.text': showPopover
};


//Função de exclusão através do modal
function taskDeleter(e) {

    const openModal = () => {
        modal.style.display = 'block'

        btnConfirm.addEventListener('click', () => {
            confirmDelete(e)
        })

        btnCancel.addEventListener('click', () => {
            cancelDelete()
        })

        btnClose.addEventListener('click', () => {
            modal.style.display = 'none'
        })
    }

    function confirmDelete() {
        taskList.style.display = 'none'
        loaderList.style.display = 'flex'

        function removeTask() {
            e.target.parentElement.remove();

            taskList.style.display = 'block'
            loaderList.style.display = 'none'

            return setItemsLocalStorage();
        };

        removeTask();
        modal.style.display = 'none'
    }

    const cancelDelete = () => {
        modal.style.display = 'none'
    }

    openModal()
};


//Notificação de erro ao titulo errado
function showErrorMessage(message) {
    errorMessageText.textContent = message;
    errorMessage.style.visibility = "visible";
}

function hideErrorMessage() {
    errorMessage.style.visibility = "hidden";
}


//Exibição de popover
function showPopover(e) {
    const selectItems = () => {
        const item = e.target.parentElement.querySelector('.date')
        const allItems = document.querySelectorAll('.date')
        verifyClassContainsItems(item, allItems)
    }

    const verifyClassContainsItems = (item, allItems) => {
        if (!item.classList.contains('show')) {
            allItems.forEach(element => {
                if (element.classList.contains('show')) {
                    element.classList.remove('show')
                }
            })

            item.classList.add('show')
            return
        }

        item.classList.remove('show')
        return
    }

    selectItems()
}


//Verificação para dispositivos móveis
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    shiftObs.style.display = 'none'
} else {
    shiftObs.style.display = 'block'
}


//Monitoramento de ações
taskList.addEventListener("click", (e) => {
    Object.entries(actionDelete).forEach(([selector, action]) => {
        if (e.target.matches(selector)) {
            action(e);
        };
    });
});


taskList.addEventListener("mousedown", (e) => {
    if (e.shiftKey && e.button === 0 && e.target.classList.contains('delete-task')) {
        taskList.style.display = 'none'
        loaderList.style.display = 'flex'

        e.target.parentElement.remove();

        taskList.style.display = 'block'
        loaderList.style.display = 'none'

        return setItemsLocalStorage();
    }
});
