const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const productsFile = path.join(__dirname, '../src/assets/products.json');

// 获取所有商品
app.get('/api/products', async (req, res) => {
  try {
    const data = await fs.readFile(productsFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 添加商品
app.post('/api/products', async (req, res) => {
  try {
    const data = await fs.readFile(productsFile, 'utf8');
    const products = JSON.parse(data);
    const newProduct = req.body;
    const maxId = Math.max(...products.map(p => p.id), 0);
    newProduct.id = maxId + 1;
    products.push(newProduct);
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: '添加商品失败' });
  }
});

// 更新商品
app.put('/api/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(productsFile, 'utf8');
    const products = JSON.parse(data);
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...updatedProduct, id };
      await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
      res.json(products[index]);
    } else {
      res.status(404).json({ error: '商品不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '更新商品失败' });
  }
});

// 删除商品
app.delete('/api/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(productsFile, 'utf8');
    const products = JSON.parse(data);
    const id = parseInt(req.params.id);
    const filteredProducts = products.filter(p => p.id !== id);
    if (filteredProducts.length < products.length) {
      await fs.writeFile(productsFile, JSON.stringify(filteredProducts, null, 2));
      res.json({ message: '删除成功' });
    } else {
      res.status(404).json({ error: '商品不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '删除商品失败' });
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 