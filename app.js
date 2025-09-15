const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Servir HTML y JS

// API para guardar productos
app.post("/api/productos", (req, res) => {
  const { nombre } = req.body;
  console.log("Producto recibido:", nombre);
  // Aquí iría la lógica para guardarlo en SQLite
  res.json({ mensaje: "Producto guardado con éxito" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
