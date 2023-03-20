const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "Bookshelf_Apps";

function generateBookObject(id, title, author, publisher, isCompleted) {
  return {
    id,
    title,
    author,
    publisher,
    isCompleted,
  };
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generatedId() {
  return +new Date();
}

function makeBook(bookOject) {
  const { id, title, author, publisher, isCompleted } = bookOject;

  const textTitle = document.createElement("h3");
  textTitle.innerHTML = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerHTML = author;

  const textPublisher = document.createElement("p");
  textPublisher.innerHTML = publisher;

  const textContainer = document.createElement("div");
  textContainer.classList.add("container");
  textContainer.appendChild(textTitle, textAuthor, textPublisher);

  const container = document.createElement("div");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Belum Selesai Dibaca";
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoBookIsCompleted(id);
    });

    const removeButton = document.createElement("button");
    removeButton.innerText = "Hapus Buku";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", function () {
      removeBookIsCompleted(id);
    });
    container.append(undoButton, removeButton);
  } else {
    const completeButton = document.createElement("button");
    completeButton.innerText = "Selesai Dibaca";
    completeButton.classList.add("complete-button");
    completeButton.addEventListener("click", function () {
      addBookIsCompleted(id);
    });

    const removeButton = document.createElement("button");
    removeButton.innerText = "Hapus Buku";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", function () {
      removeBookIsCompleted(id);
    });
    container.append(completeButton, removeButton);
  }
  return container;
}

function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textPublisher = document.getElementById("inputBookYear").value;

  const generatedID = generatedId();
  const bookOject = generateBookObject(generatedID, textTitle, textAuthor, textPublisher, false);
  books.push(bookOject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookIsCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookIsCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookIsCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
  uncompletedBOOKList.innerHTML = "";
  const listCompleted = document.getElementById("completeBookshelfList");
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});

document.getElementById("searchBook").addEventListener("submit", function (event) {
  event.preventDefault();
  const searchBook = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookList = document.querySelectorAll(".item > .inner h2");

  for (const book of bookList) {
    if (searchBook !== book.innerText.toLowerCase()) {
      book.parentElement.style.display = "block";
    } else {
      book.parentElement.style.display = "none";
    }
  }
});
