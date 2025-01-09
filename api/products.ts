import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const { rows } = await sql`SELECT * FROM products`;
        return res.json(rows);

      case 'POST':
        const { name, price, category, description } = req.body;
        const result = await sql`
          INSERT INTO products (name, price, category, description)
          VALUES (${name}, ${price}, ${category}, ${description || null})
          RETURNING *
        `;
        return res.json(result.rows[0]);

      case 'PUT':
        const updateId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
        if (!updateId) {
          return res.status(400).json({ error: '缺少 ID 参数' });
        }
        const updateResult = await sql`
          UPDATE products
          SET name = ${req.body.name},
              price = ${req.body.price},
              category = ${req.body.category},
              description = ${req.body.description || null}
          WHERE id = ${updateId}
          RETURNING *
        `;
        return res.json(updateResult.rows[0]);

      case 'DELETE':
        const deleteId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
        if (!deleteId) {
          return res.status(400).json({ error: '缺少 ID 参数' });
        }
        await sql`DELETE FROM products WHERE id = ${deleteId}`;
        return res.json({ message: '删除成功' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '服务器错误' });
  }
} 