const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


const productsFilePath = 'products.json';

function readProducts() {
  try {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}


function writeProducts(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}


let products = readProducts();


app.use(express.json());


app.get('/products', (req, res) => {
  res.json(products);
});


app.post('/products', (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});


app.patch('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;

  const productIndex = products.findIndex(product => product.id === productId);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    writeProducts(products);
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});


app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  products = products.filter(product => product.id !== productId);
  writeProducts(products);
  res.json({ message: 'Producto eliminado' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});