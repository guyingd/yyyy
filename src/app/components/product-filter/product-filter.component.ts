import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductFilterComponent {
  @Input() categories: string[] = [];
  @Output() categoryChange = new EventEmitter<string>();
  selectedCategory: string = '';

  onCategorySelect(category: string) {
    this.selectedCategory = category === this.selectedCategory ? '' : category;
    this.categoryChange.emit(this.selectedCategory);
  }
} 