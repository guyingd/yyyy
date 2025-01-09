import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class ProductSearchComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.search.emit(this.searchTerm);
  }
} 