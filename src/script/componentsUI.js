const taskLists = document.querySelector('#todo-list');
const modal = document.querySelector('.modal')
const btnConfirm = document.querySelector('#confirm-btn')
const btnCancel = document.querySelector('#cancel-btn')
const btnClose = document.querySelector('.close')

const errorMessage = document.getElementById("error-message");
const errorMessageText = document.getElementById("error-message-text");

const actionDelete = {
    '.delete-task': taskDeleter,
    '.text': showPopover
};

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

    function confirmDelete(e) {

        function removeTask(e) {
            e.target.parentElement.remove();
            return setItemsLocalStorage();
        };

        removeTask(e);
        modal.style.display = 'none'
    }

    const cancelDelete = () => {
        modal.style.display = 'none'
    }

    openModal(e)

};


function showErrorMessage(message) {
    errorMessageText.textContent = message;
    errorMessage.style.visibility = "visible";
}

function hideErrorMessage() {
    errorMessage.style.visibility = "hidden";
}


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

            removeVisibleToDOM(item)
            return 
        }

        item.classList.remove('show')
        removeVisibleToDOM(item)
        return
    }

    const removeVisibleToDOM = (item) => {
        if(item.classList.contains('show')) {
            setTimeout(() => {
                item.classList.remove('show')
            }, 4000)

            return
        }
    }

    selectItems()
}


taskLists.addEventListener("click", (e) => {
    Object.entries(actionDelete).forEach(([selector, action]) => {
        if (e.target.matches(selector)) {
            action(e);
        };
    });
});

taskLists.addEventListener("mousedown", (e) => {
    if (e.shiftKey && e.button === 0) {
        e.target.parentElement.remove();
        return setItemsLocalStorage();
    }
});