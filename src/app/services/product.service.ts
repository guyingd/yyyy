import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly API_URL = '/api/products';
    private products = new BehaviorSubject<Product[]>([]);
    products$ = this.products.asObservable();

    constructor(private http: HttpClient) {
        this.loadProducts();
    }

    private loadProducts() {
        this.http.get<Product[]>(this.API_URL)
            .subscribe({
                next: (data) => this.products.next(data),
                error: (error) => {
                    console.error('加载商品失败:', error);
                    this.products.next([]);
                }
            });
    }

    getProducts(): Observable<Product[]> {
        return this.products$;
    }

    addProduct(product: Product) {
        this.http.post<Product>(this.API_URL, product)
            .subscribe({
                next: () => this.loadProducts(),
                error: (error) => console.error('添加商品失败:', error)
            });
    }

    updateProduct(product: Product) {
        this.http.put<Product>(`${this.API_URL}/${product.id}`, product)
            .subscribe({
                next: () => this.loadProducts(),
                error: (error) => console.error('更新商品失败:', error)
            });
    }

    deleteProduct(id: number) {
        this.http.delete(`${this.API_URL}/${id}`)
            .subscribe({
                next: () => this.loadProducts(),
                error: (error) => console.error('删除商品失败:', error)
            });
    }

    searchProducts(query: string, products: Product[]): Product[] {
        query = query.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
        );
    }

    filterByCategory(category: string, products: Product[]): Product[] {
        return category ? products.filter(product => 
            product.category === category
        ) : products;
    }
} 