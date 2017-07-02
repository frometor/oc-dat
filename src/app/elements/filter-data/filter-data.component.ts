import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-filter-data',
  templateUrl: './filter-data.component.html',
  styleUrls: ['./filter-data.component.css']
})
export class FilterDataComponent implements OnInit {

  private chartData: Array<any>;

  constructor() {
  }

  ngOnInit() {
    // give everything a chance to get loaded before starting the animation to reduce choppiness
    setTimeout(() => {
      this.generateData();

      // change the data periodically
      setInterval(() => this.generateData(), 3000);
    }, 1000);
  }

  generateData() {

    this.chartData = [];
    this.chartData.push(
      [`january`,30],
      [`february`,20],
      [`march`,57],
      [`april`,37],
      [`may`,20],
      [`june`,98],
      [`july`,76],
      [`august`,23],
      [`september`,84],
      [`october`,20],
      [`november`,64],
      [`december`,13],
    );

    /*this.chartData = [
     {'theft':30},
     {'riot':20},
     {'fire':25},
     ];*/
    /*
    this.chartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([
        `Index ${i}`,
        Math.floor(Math.random() * 100)
      ]);
    }*/
  }

}
