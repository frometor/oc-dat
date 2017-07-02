import { Component, OnInit } from '@angular/core';
import {months,single} from '../data/result-data';

@Component({
  selector: 'app-monthly-filter',
  templateUrl: './monthly-filter.component.html',
  styleUrls: ['./monthly-filter.component.css']
})
export class MonthlyFilterComponent implements OnInit {

  ngOnInit(): void {
  }

  months: any[];
  single: any[];

  view: any[];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Number of Incidents';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {
    Object.assign(this, {months})
  }

  onSelect(event) {
    console.log(event);
  }

}
