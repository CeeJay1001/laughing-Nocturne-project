const books = [
    { id: "alchemist", title: "The Last Alchemist", author: "Celeste A. Jones", genre: "Genre coming soon", cardSynopsis: "A forbidden manuscript hidden for centuries.", synopsis: "Full synopsis coming soon.", image: "images/last-alchemist.png.png", featured: true, staff: true, newArrival: false },
    { id: "ivy", title: "Whispers Beneath the Ivy", author: "Celeste A. Jones", genre: "Genre coming soon", cardSynopsis: "Secrets buried within the walls of an ancient university.", synopsis: "Full synopsis coming soon.", image: "images/whispers-beneath-the-ivy.png.png", featured: true, staff: false, newArrival: true },
    { id: "raven", title: "The Raven's Testament", author: "Celeste A. Jones", genre: "Genre coming soon", cardSynopsis: "Unsettling writings left behind by a vanished scholar.", synopsis: "Full synopsis coming soon.", image: "images/ravens-testament.png.png", featured: true, staff: true, newArrival: true },
    { id: "blackwood", title: "Letters from Blackwood Hall", author: "Celeste A. Jones", genre: "Genre coming soon", cardSynopsis: "Forgotten correspondence uncovering a family mystery.", synopsis: "Full synopsis coming soon.", image: null, featured: false, staff: true, newArrival: false },
    { id: "clockmaker", title: "The Clockmaker's Secret", author: "Celeste A. Jones", genre: "Genre coming soon", cardSynopsis: "An apprentice discovers a device capable of altering fate.", synopsis: "Full synopsis coming soon.", image: null, featured: false, staff: false, newArrival: true },
    { id: "ghost", title: "Anatomy of a Ghost", author: "Celeste A. Jones", genre: "Genre coming soon", cardSynopsis: "A young researcher investigates supernatural occurrences.", synopsis: "Full synopsis coming soon.", image: null, featured: false, staff: false, newArrival: true }
];

const borrowedStorageKey = "nocturne-borrowed-books";
const savedBorrowedBooks = JSON.parse(localStorage.getItem(borrowedStorageKey) || "[]");
const borrowedBooks = new Set(savedBorrowedBooks);
const counter = document.getElementById("borrow-count");
const modal = document.getElementById("book-modal");
const modalContent = document.getElementById("modal-content");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");

function bookCard(book) {
    const borrowed = borrowedBooks.has(book.id);
    const cover = book.image
        ? `<img src="${book.image}" alt="${book.title} cover">`
        : `<div class="cover-placeholder" role="img" aria-label="Cover for ${book.title} coming soon"><span>Cover<br>in progress</span></div>`;
    return `<article class="book-card" data-book-id="${book.id}">
        ${cover}
        <h3>${book.title}</h3>
        <p class="book-meta">${book.author} · ${book.genre}</p>
        <p>${book.cardSynopsis}</p>
        <button class="borrow-button ${borrowed ? "borrowed" : ""}" type="button" data-borrow-id="${book.id}">${borrowed ? "Borrowed ✓" : "Borrow"}</button>
    </article>`;
}

function renderBooks(targetId, collection) {
    document.getElementById(targetId).innerHTML = collection.map(bookCard).join("");
}

function renderAll() {
    renderBooks("featured-books", books.filter(book => book.featured));
    renderBooks("staff-books", books.filter(book => book.staff));
    renderBooks("new-books", books.filter(book => book.newArrival));
    renderSearchResults();
    counter.textContent = `${borrowedBooks.size} ${borrowedBooks.size === 1 ? "book" : "books"} borrowed`;
}

function renderSearchResults() {
    const query = searchInput.value.trim().toLowerCase();
    const genre = genreFilter.value;
    const matches = books.filter(book => {
        const searchable = `${book.title} ${book.author} ${book.genre} ${book.synopsis}`.toLowerCase();
        return searchable.includes(query) && (genre === "all" || book.genre === genre);
    });
    document.getElementById("search-results").innerHTML = matches.map(bookCard).join("");
    document.getElementById("empty-state").hidden = matches.length > 0;
}

function openBook(book) {
    const cover = book.image
        ? `<img src="${book.image}" alt="${book.title} cover">`
        : `<div class="cover-placeholder modal-cover" role="img" aria-label="Cover for ${book.title} coming soon"><span>Cover<br>in progress</span></div>`;
    modalContent.innerHTML = `${cover}
        <div><p class="eyebrow">Book details</p><h2 id="modal-title">${book.title}</h2>
        <p class="detail-label">Author</p><p>${book.author}</p>
        <p class="detail-label">Genre</p><p>${book.genre}</p>
        <p class="detail-label">Synopsis</p><p>${book.synopsis}</p>
        <button class="borrow-button ${borrowedBooks.has(book.id) ? "borrowed" : ""}" type="button" data-borrow-id="${book.id}" ${borrowedBooks.has(book.id) ? "disabled" : ""}>${borrowedBooks.has(book.id) ? "Borrowed ✓" : "Borrow"}</button></div>`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
}

books.forEach(book => {
    const option = document.createElement("option");
    option.value = book.genre;
    option.textContent = book.genre;
    genreFilter.appendChild(option);
});

document.addEventListener("click", event => {
    const borrowButton = event.target.closest("[data-borrow-id]");
    if (borrowButton) {
        const bookId = borrowButton.dataset.borrowId;
        if (borrowedBooks.has(bookId)) borrowedBooks.delete(bookId);
        else borrowedBooks.add(bookId);
        localStorage.setItem(borrowedStorageKey, JSON.stringify([...borrowedBooks]));
        renderAll();
        if (!modal.hidden) openBook(books.find(book => book.id === bookId));
        return;
    }
    const card = event.target.closest(".book-card");
    if (card && !event.target.closest("button")) openBook(books.find(book => book.id === card.dataset.bookId));
    if (event.target === modal || event.target.closest(".modal-close")) closeModal();
});

searchInput.addEventListener("input", renderSearchResults);
genreFilter.addEventListener("change", renderSearchResults);
document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) closeModal(); });
renderAll();