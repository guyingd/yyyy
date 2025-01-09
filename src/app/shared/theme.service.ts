import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private isDarkMode = new BehaviorSubject<boolean>(false);
    isDarkMode$ = this.isDarkMode.asObservable();

    toggleTheme() {
        this.isDarkMode.next(!this.isDarkMode.value);
        document.body.classList.toggle('dark-mode');
    }
} 