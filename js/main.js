const books = []
const RENDER_EVENT = 'render-books'
const SAVED_EVENT = 'saved-books'
const STORAGE_KEY = 'bookshelf-apps'

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
        for (const book of data) {
            books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const addBook = () => {
    const title = document.getElementById('inputBookTitle');
    const author = document.getElementById('inputBookAuthor');
    const year = document.getElementById('inputBookYear');
    const isComplete = document.getElementById('inputBookIsComplete');

    const bookObject = {
        id: +new Date(),
        title: title.value,
        author: author.value,
        year: parseInt(year.value),
        isComplete: isComplete.checked
    };

    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const makeNewBook = (book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const titleElement = document.createElement("h2");
    titleElement.innerText = book.title;

    const authorElement = document.createElement("p");
    authorElement.innerText = `Penulis: ${book.author}`;

    const yearElement = document.createElement("p");
    yearElement.innerText = `Tahun: ${book.year}`;

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(yearElement);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const actionButton = document.createElement("button");
    actionButton.id = book.id;
    actionButton.innerText = book.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca";
    actionButton.classList.add("green");
    actionButton.addEventListener("click", () => {
        if (book.isComplete) {
            markAsIncomplete(book.id)
        } else {
            markAsComplete(book.id)
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.id = book.id;
    deleteButton.innerText = "Hapus buku";
    deleteButton.classList.add("red");
    deleteButton.addEventListener("click", () => {
        removeBook(book.id)
    });

    const editButton = document.createElement("button");
    editButton.id = book.id;
    editButton.innerText = "Edit buku";
    editButton.classList.add("blue");
    editButton.addEventListener("click", () => {
        editBook(book.id);
    });

    actionContainer.appendChild(actionButton);
    actionContainer.appendChild(deleteButton);
    actionContainer.appendChild(editButton);
    bookItem.appendChild(actionContainer);

    return bookItem;
}

const findBook = (bookId) => {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

const findBookIndex = (bookId) => {
    let foundIndex = -1;

    books.forEach((book, index) => {
        if (book.id === bookId) {
            foundIndex = index;
        }
    });

    return foundIndex;
}

const markAsComplete = (bookId) => {
   const bookTarget = findBook(bookId);

   if (bookTarget == null) return;

   bookTarget.isComplete = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

const markAsIncomplete = (bookId) => {
   const bookTarget = findBook(bookId);

   if (bookTarget == null) return;

   bookTarget.isComplete = false;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

const removeBook = (bookId) => {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1 || !books[bookTarget]) return;

    books.splice(bookTarget, 1);
    alert(`buku dengan id ${bookId} telah dihapus`);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const editBook = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    const editedTitle = prompt("Edit judul buku", bookTarget.title);
    const editedAuthor = prompt("Edit penulis buku", bookTarget.author);
    const editedYear = prompt("Edit tahun buku", bookTarget.year);

    if (editedTitle && editedAuthor && editedYear) {
        bookTarget.title = editedTitle;
        bookTarget.author = editedAuthor;
        bookTarget.year = editedYear;

        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

const searchBook = () => {
    const search = document.getElementById('searchBookTitle');
    const query = search.value.toLowerCase();

    if (query) {
        const filteredBook = books.filter(book => book.title.toLowerCase().includes(query));
        displayBooks(filteredBook);
    } else {
        displayBooks(books);
    }
    
}

const displayBooks = (books) => {
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    incompleteBookshelf.innerHTML = "";
    const completeBookshelf = document.getElementById("completeBookshelfList");
    completeBookshelf.innerHTML = "";

    for (const book of books) {
        const bookElement = makeNewBook(book);
        if (book.isComplete) {
            completeBookshelf.append(bookElement);
        } else {
            incompleteBookshelf.append(bookElement);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('inputBook');
    const submitSearch = document.getElementById('searchBook');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
    })
    submitSearch.addEventListener('submit', (event) => {
        event.preventDefault();
        searchBook();
    })
    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

document.addEventListener(SAVED_EVENT, () => {
    console.log('data berhasil disimpan');
})

document.addEventListener(RENDER_EVENT, () => {
    displayBooks(books);
})
