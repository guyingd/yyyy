import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const PRODUCTS_KEY = 'products';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const products = await kv.get(PRODUCTS_KEY) || [];
        return res.json(products);

      case 'POST':
        const currentProducts = await kv.get<any[]>(PRODUCTS_KEY) || [];
        const maxId = Math.max(...currentProducts.map(p => p.id), 0);
        const newProduct = { ...req.body, id: maxId + 1 };
        await kv.set(PRODUCTS_KEY, [...currentProducts, newProduct]);
        return res.json(newProduct);

      case 'PUT':
        const { id } = req.query;
        const existingProducts = await kv.get<any[]>(PRODUCTS_KEY) || [];
        const updatedProducts = existingProducts.map(p => 
          p.id === Number(id) ? { ...req.body, id: Number(id) } : p
        );
        await kv.set(PRODUCTS_KEY, updatedProducts);
        return res.json(req.body);

      case 'DELETE':
        const deleteId = req.query.id;
        const productsToUpdate = await kv.get<any[]>(PRODUCTS_KEY) || [];
        const filteredProducts = productsToUpdate.filter(p => p.id !== Number(deleteId));
        await kv.set(PRODUCTS_KEY, filteredProducts);
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