import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { ProductFilterComponent } from '../product-filter/product-filter.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, ProductSearchComponent, ProductFilterComponent]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
      this.categories = Array.from(new Set(data.map(product => product.category)));
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  private applyFilters() {
    let result = this.products;
    if (this.searchQuery) {
      result = this.productService.searchProducts(this.searchQuery, result);
    }
    if (this.selectedCategory) {
      result = this.productService.filterByCategory(this.selectedCategory, result);
    }
    this.filteredProducts = result;
  }
} 