import { createClient } from '@vercel/postgres';

export default async function handler(req, res) {
  const client = createClient();
  await client.connect();

  try {
    switch (req.method) {
      case 'GET':
        const { rows } = await client.query('SELECT * FROM products');
        res.json(rows);
        break;

      case 'POST':
        const { name, price, category } = req.body;
        const result = await client.query(
          'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *',
          [name, price, category]
        );
        res.json(result.rows[0]);
        break;

      case 'PUT':
        const { id } = req.query;
        const updateResult = await client.query(
          'UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *',
          [req.body.name, req.body.price, req.body.category, id]
        );
        res.json(updateResult.rows[0]);
        break;

      case 'DELETE':
        const deleteId = req.query.id;
        await client.query('DELETE FROM products WHERE id = $1', [deleteId]);
        res.json({ message: '删除成功' });
        break;

      default:
        res.status(405).json({ error: '不支持的方法' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '服务器错误' });
  } finally {
    await client.end();
  }
} 