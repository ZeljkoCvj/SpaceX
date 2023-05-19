import { Flight } from 'src/http_service/model';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SpaceX';
  isDarkThemeSelected = true;

  toggleTheme() {
    this.isDarkThemeSelected = !this.isDarkThemeSelected;
  }
}
