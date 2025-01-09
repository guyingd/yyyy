import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true
})
export class AboutComponent {
  author = {
    name: '袁子兵',
    email: '2739218253@qq.com',
    github: 'https://github.com/yourusername'
  };
} 