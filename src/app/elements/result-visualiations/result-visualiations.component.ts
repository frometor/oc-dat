import {Component, OnInit} from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import {single} from '../data/result-data';
import {multi} from '../data/result-data';

@Component({
  selector: 'app-result-visualiations',
  templateUrl: './result-visualiations.component.html',
  styleUrls: ['./result-visualiations.component.css']
})
export class ResultVisualiationsComponent implements OnInit {
  ngOnInit(): void {
  }

  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Type of Incident';
  showYAxisLabel = true;
  yAxisLabel = 'Amount';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor() {
    Object.assign(this, {single})
  }

  onSelect(event) {
    console.log(event);
  }

}
