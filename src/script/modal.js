const taskListModal = document.querySelector('#todo-list');
const modal = document.querySelector('.modal')
const btnConfirm = document.querySelector('#confirm-btn')
const btnCancel = document.querySelector('#cancel-btn')
const btnClose = document.querySelector('.close')

const actionDelete = {
    '.delete-task': taskDeleter,
};

function taskDeleter(e) {

    function openModal() {   
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
    
    function cancelDelete() {
        modal.style.display = 'none'
    }

    openModal(e)
    
};

taskListModal.addEventListener("click", (e) => {
    Object.entries(actionDelete).forEach(([selector, action]) => {
        if (e.target.matches(selector)) {
            action(e);
        };
    });
});
