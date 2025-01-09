import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Observable, map } from 'rxjs';

interface SortConfig {
  key: keyof Product;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminComponent implements OnInit {
  password: string = '';
  editingProduct: Product | null = null;
  newProduct: Product = this.getEmptyProduct();
  showAddForm = false;
  searchTerm: string = '';
  selectedProducts: Set<number> = new Set();
  sortConfig: SortConfig = { key: 'id', direction: 'asc' };

  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.products$ = this.productService.getProducts().pipe(
      map(products => this.sortProducts(this.filterProducts(products)))
    );
  }

  isAuthenticated$!: Observable<boolean>;
  products$!: Observable<Product[]>;

  // 搜索功能
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.refreshProducts();
  }

  private filterProducts(products: Product[]): Product[] {
    if (!this.searchTerm) return products;
    const term = this.searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.id.toString().includes(term)
    );
  }

  // 排序功能
  sortBy(key: keyof Product) {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig = { key, direction: 'asc' };
    }
    this.refreshProducts();
  }

  private sortProducts(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
      const aValue = a[this.sortConfig.key];
      const bValue = b[this.sortConfig.key];
      const direction = this.sortConfig.direction === 'asc' ? 1 : -1;

      // 处理 undefined 或 null 值
      if (aValue === undefined || aValue === null) return direction;
      if (bValue === undefined || bValue === null) return -direction;

      // 根据类型进行比较
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }

      // 如果类型不匹配或其他情况，保持原有顺序
      return 0;
    });
  }

  // 批量操作功能
  toggleSelectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.productService.getProducts().subscribe(products => {
      if (checkbox.checked) {
        products.forEach(p => this.selectedProducts.add(p.id));
      } else {
        this.selectedProducts.clear();
      }
    });
  }

  toggleSelect(id: number) {
    if (this.selectedProducts.has(id)) {
      this.selectedProducts.delete(id);
    } else {
      this.selectedProducts.add(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedProducts.has(id);
  }

  deleteSelected() {
    if (this.selectedProducts.size === 0) {
      alert('请先选择要删除的商品');
      return;
    }
    if (confirm(`确定要删除选中的 ${this.selectedProducts.size} 个商品吗？此操作不可恢复。`)) {
      this.selectedProducts.forEach(id => {
        this.productService.deleteProduct(id);
      });
      this.selectedProducts.clear();
    }
  }

  // 刷新商品列表
  private refreshProducts() {
    this.productService.getProducts().subscribe(products => {
      const filteredProducts = this.filterProducts(products);
      const sortedProducts = this.sortProducts(filteredProducts);
      this.products$ = new Observable(subscriber => {
        subscriber.next(sortedProducts);
        subscriber.complete();
      });
    });
  }

  login() {
    if (!this.authService.login(this.password)) {
      alert('密码错误');
    }
    this.password = '';
  }

  logout() {
    if (confirm('确定要退出登录吗？')) {
      this.authService.logout();
    }
  }

  startEdit(product: Product) {
    this.editingProduct = { ...product };
  }

  saveEdit() {
    if (this.editingProduct) {
      if (this.validateProduct(this.editingProduct)) {
        this.productService.updateProduct(this.editingProduct);
        this.editingProduct = null;
      }
    }
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  addProduct() {
    if (this.validateProduct(this.newProduct)) {
      this.productService.addProduct(this.newProduct);
      this.newProduct = this.getEmptyProduct();
      this.showAddForm = false;
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newProduct = this.getEmptyProduct();
  }

  confirmDelete(id: number) {
    if (confirm('确定要删除这个商品吗？此操作不可恢复。')) {
      this.productService.deleteProduct(id);
    }
  }

  private validateProduct(product: Product): boolean {
    if (!product.name.trim()) {
      alert('商品名称不能为空');
      return false;
    }
    if (product.price <= 0) {
      alert('商品价格必须大于0');
      return false;
    }
    if (!product.category.trim()) {
      alert('商品分类不能为空');
      return false;
    }
    return true;
  }

  private getEmptyProduct(): Product {
    return {
      id: 0,
      name: '',
      price: 0,
      category: ''
    };
  }
} 