import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3000/api/products';
    private products = new BehaviorSubject<Product[]>([]);
    products$ = this.products.asObservable();

    constructor(private http: HttpClient) {
        this.loadProducts();
    }

    private loadProducts() {
        this.http.get<Product[]>(this.apiUrl)
            .subscribe(data => this.products.next(data));
    }

    getProducts(): Observable<Product[]> {
        return this.products$;
    }

    addProduct(product: Product) {
        this.http.post<Product>(this.apiUrl, product)
            .pipe(
                tap(() => this.loadProducts())
            )
            .subscribe();
    }

    updateProduct(product: Product) {
        this.http.put<Product>(`${this.apiUrl}/${product.id}`, product)
            .pipe(
                tap(() => this.loadProducts())
            )
            .subscribe();
    }

    deleteProduct(id: number) {
        this.http.delete(`${this.apiUrl}/${id}`)
            .pipe(
                tap(() => this.loadProducts())
            )
            .subscribe();
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