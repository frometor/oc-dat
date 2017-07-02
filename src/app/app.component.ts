import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Data Analysis Tool';
  startDate;
  endDate;

  constructor() {
   // this.startDate = new Date('03/12/2017');
  }
}

