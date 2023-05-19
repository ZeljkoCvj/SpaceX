import { DialogBodyComponent } from './../dialog-body/dialog-body.component';
import { Flight } from './../../http_service/model';
import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../http_service/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-launches',
  templateUrl: './list-launches.component.html',
  styleUrls: ['./list-launches.component.scss'],
})
export class ListLaunchesComponent implements OnInit {
  inputValue = '';
  items: Flight[] = [];
  filterItems: Flight[] = [];
  page = 1;
  loading = false;
  pageSize = 20;
  currentPageIndex = 0;
  constructor(private httpService: HttpService, private matDialog: MatDialog) {}

  openDialog(item: Flight) {
    this.matDialog.open(DialogBodyComponent, {
      width: '80rem',
      height: '40rem',
      data: { item },
    });
  }
  validateInput(inputValue: string): boolean {
    const regex = /^[a-zA-Z0-9\s]+$/;
    return regex.test(inputValue);
  }

  validate() {
    return {
      'is-invalid': !this.validateInput(this.inputValue),
      'is-valid': this.validateInput(this.inputValue),
    };
  }

  searchFlight() {
    let inputSearch = this.inputValue.toLowerCase().trim().split(' ').join('');
    if (!inputSearch) {
      this.filterItems = this.items;
    } else {
      this.filterItems = this.items.filter((launch) => {
        return launch.mission_name
          .toLocaleLowerCase()
          .trim()
          .split(' ')
          .join('')
          .includes(inputSearch);
      });
    }
    if (inputSearch && this.filterItems) {
      this.filterItems.map((item: Flight) => {
        return item;
      });
    }
  }
  onWindowScroll(): void {
    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight && !this.loading) {
      this.loading = true;
      this.currentPageIndex++;
      this.httpService
        .getData(this.currentPageIndex, this.pageSize)
        .subscribe((data) => {
          this.items.push(...data);
          this.searchFlight();
          this.loading = false;
        });
    }
  }
  ngOnInit(): void {
    this.httpService
      .getData(this.currentPageIndex, this.pageSize)
      .subscribe((data) => {
        this.items = data;
        this.searchFlight();
      });

    window.addEventListener('scroll', this.onWindowScroll.bind(this), true);
  }
}
