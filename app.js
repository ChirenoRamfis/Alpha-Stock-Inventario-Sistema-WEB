let db;
const form = document.getElementById("form-producto");
const lista = document.getElementById("lista-productos");

// Abrir o crear la base de datos
const request = indexedDB.open("InventarioDB", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const store = db.createObjectStore("productos", { keyPath: "id", autoIncrement: true });
  store.createIndex("nombre", "nombre", { unique: false });
  store.createIndex("cantidad", "cantidad", { unique: false });
};

request.onsuccess = (event) => {
  db = event.target.result;
  renderProductos();
};

request.onerror = (event) => {
  console.error("Error al abrir la base de datos:", event.target.errorCode);
};

// Agregar producto
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);

  const tx = db.transaction("productos", "readwrite");
  const store = tx.objectStore("productos");
  store.add({ nombre, cantidad });

  tx.oncomplete = () => {
    renderProductos();
    form.reset();
  };
});

// Renderizar productos
function renderProductos() {
  lista.innerHTML = "";
  const tx = db.transaction("productos", "readonly");
  const store = tx.objectStore("productos");
  store.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const li = document.createElement("li");
      li.textContent = `${cursor.value.nombre} - Stock: ${cursor.value.cantidad}`;
      li.innerHTML += ` <button onclick="eliminar(${cursor.value.id})">❌</button>`;
      lista.appendChild(li);
      cursor.continue();
    }
  };
}

// Eliminar producto
function eliminar(id) {
  const tx = db.transaction("productos", "readwrite");
  const store = tx.objectStore("productos");
  store.delete(id);

  tx.oncomplete = () => renderProductos();
}

// Registrar service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
