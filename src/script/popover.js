const taskListPopover = document.querySelector('#todo-list');


const popover = {
    '.text': showPopover,
}

function showPopover(e) {
    const item = e.target.parentElement.querySelector('.date')
    const allItems = document.querySelectorAll('.date')

    if (!item.classList.contains('show')) {
        allItems.forEach(element => {
            if (element.classList.contains('show')) {
                element.classList.remove('show')
            }
        })

        item.classList.add('show')

        return setItemsLocalStorage()
    }  

    item.classList.remove('show')
    
    setItemsLocalStorage()
}

taskListPopover.addEventListener("click", (e) => {
    Object.entries(popover).forEach(([selector, action]) => {
        if (e.target.matches(selector)) {
            action(e);
        };
    });
});