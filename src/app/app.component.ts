import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    //console.log(window.outerHeight);
  }
  title = 'Data Analysis Tool';
  startDate;
  endDate;
  showInput: boolean = true;


  constructor() {
   // this.startDate = new Date('03/12/2017');
  }

  toggleShowInput() {
    this.showInput = !this.showInput;
  }
}

