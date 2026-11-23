
const API = "/books";

function showMessage(message, error = false) {
  const element = document.getElementById("message");
  element.textContent = message;
  element.style.color = error ? "red" : "green";
}

function getInput() {
  return {
    id: Number(document.getElementById("id").value),
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    price: Number(document.getElementById("price").value)
  };
}

function validDetails(book) {
  return Number.isInteger(book.id) && book.id > 0 &&
    book.title !== "" && book.author !== "" &&
    document.getElementById("price").value !== "" &&
    Number.isFinite(book.price) && book.price >= 0;
}

function getId() {
  const value = document.getElementById("id").value;
  const id = Number(value);

  if (!value || !Number.isInteger(id) || id <= 0) {
    throw new Error("Enter a valid Book ID");
  }

  return id;
}

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function displayBooks(books) {
  const table = document.getElementById("bookList");
  table.innerHTML = "";

  books.forEach(book => {
    const row = document.createElement("tr");

    [book.id, book.title, book.author, book.price].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    table.appendChild(row);
  });
}

// View all books
async function getBooks() {
  try {
    const books = await request(API);
    displayBooks(books);
    showMessage("Books loaded successfully");
  } catch (error) {
    showMessage(error.message, true);
  }
}

// Add book
async function addBook() {
  try {
    const book = getInput();

    if (!validDetails(book)) {
      throw new Error("Enter all valid book details");
    }

    const result = await request(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });

    showMessage(result.message);
    await refreshBooks();
  } catch (error) {
    showMessage(error.message, true);
  }
}

// Update book
async function updateBook() {
  try {
    const book = getInput();

    if (!validDetails(book)) {
      throw new Error("Enter all valid book details");
    }

    const result = await request(`${API}/${book.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });

    showMessage(result.message);
    await refreshBooks();
  } catch (error) {
    showMessage(error.message, true);
  }
}

// Delete book
async function deleteBook() {
  try {
    const id = getId();

    const result = await request(`${API}/${id}`, {
      method: "DELETE"
    });

    showMessage(result.message);
    await refreshBooks();
  } catch (error) {
    showMessage(error.message, true);
  }
}

// Search book by ID
async function searchBook() {
  try {
    const id = getId();
    const book = await request(`${API}/${id}`);

    displayBooks([book]);
    showMessage("Book found successfully");
  } catch (error) {
    displayBooks([]);
    showMessage(error.message, true);
  }
}

// Refresh table without changing success message
async function refreshBooks() {
  try {
    const books = await request(API);
    displayBooks(books);
  } catch (error) {
    showMessage(error.message, true);
  }
}

// Display books when page loads
getBooks();
