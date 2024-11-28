const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
let currentPage = 1;
const itemsPerPage = 6;
let todos = [];
let filteredTodos = [];

const catalog = document.querySelector('.catalog');
const filterInput = document.getElementById('filter');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const pageNum = document.getElementById('page-num');

const fetchData = async () => {
    const response = await fetch(apiUrl);
    todos = await response.json();
    filteredTodos = todos; // Initially, no filter
    renderCatalog();
};

const renderCatalog = () => {
    catalog.innerHTML = '';  // Очищаем каталог, чтобы перерисовать карточки
    const startIndex = (currentPage - 1) * itemsPerPage;  // Индекс первого элемента на текущей странице
    const endIndex = startIndex + itemsPerPage;  // Индекс последнего элемента на текущей странице
    const pageTodos = filteredTodos.slice(startIndex, endIndex);  // Отбираем нужные элементы для текущей страницы

    pageTodos.forEach(todo => {  // Для каждой задачи создаем карточку
        const card = document.createElement('div');
        card.classList.add('card');  // Добавляем класс card

        const title = document.createElement('h3');
        title.textContent = todo.title;  // Устанавливаем заголовок карточки

        const button = document.createElement('button');
        button.textContent = 'View Details';  // Кнопка для открытия модалки
        button.onclick = () => openModal(todo);  // При клике открываем модалку с информацией о задаче

        card.appendChild(title);  // Добавляем заголовок в карточку
        card.appendChild(button);  // Добавляем кнопку в карточку
        catalog.appendChild(card);  // Добавляем карточку в контейнер
    });

    pageNum.textContent = `Page ${currentPage}`;  // Отображаем номер текущей страницы
    prevButton.disabled = currentPage === 1;  // Отключаем кнопку "Предыдущая" на первой странице
    nextButton.disabled = currentPage * itemsPerPage >= filteredTodos.length;  // Отключаем кнопку "Следующая", если достигнут конец списка
};


const openModal = (todo) => {
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    modalTitle.textContent = todo.title;  // Заголовок модалки
    modalDescription.textContent = todo.completed ? 'Completed' : 'Pending';  // Статус задачи (завершена или нет)

    modal.style.display = 'flex';  // Показываем модалку, изменяя её стиль
};

const closeModalHandler = () => {
    modal.style.display = 'none';
};
const filterTodos = () => {
    const searchText = filterInput.value.toLowerCase();  // Получаем текст из поля фильтра
    filteredTodos = todos.filter(todo => todo.title.toLowerCase().includes(searchText));  // Фильтруем задачи по названию
    currentPage = 1;  // Сбрасываем страницу на первую при изменении фильтра
    renderCatalog();  // Перерисовываем каталог
};
const changePage = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage * itemsPerPage < filteredTodos.length) {
        currentPage++;
    }
    renderCatalog();
};

filterInput.addEventListener('input', filterTodos);
closeModal.addEventListener('click', closeModalHandler);
prevButton.addEventListener('click', () => changePage('prev'));
nextButton.addEventListener('click', () => changePage('next'));

fetchData();
