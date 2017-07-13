import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
//import {single, multi} from '../../data/result-data';
import {IncidentsService} from "../../../services/incidents.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class LineChartComponent implements OnInit {

  message: any;
  subscription: Subscription;
  multi: any = [];


  single: any[];
  view: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // line, area
  autoScale = true;

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
    // Object.assign(this, {single, multi});
  }

  ngOnInit(): void {
    this.subscription = this.incidentService.getMessageFromTable2LineChart().subscribe(message => {
      this.multi = [{
        "name": "Reports",
        "series": []
      }];
      this.message = message;
      /*console.log("Line Chart: GET MESSAGE", this.message);
      for (let i = 0; i < this.message._source.reports.length; i++) {*/
      /*  console.log("Reports: ", this.message._source.reports[i]);
        let theData = new Date(this.message._source.reports[i].src.created);
        this.multi[0].series.push({
          "name": theData,
          "value":1000
        })*/
    /*  }
      //._source.reports["0"].src.created
      this.cd.markForCheck(); // marks path
      console.log("multi", this.multi);
      */
    });
  }

  /*
   [
   {
   "name": "Germany",
   "series": [
   {
   "name": "2010",
   "value": 7300000
   },
   {
   "name": "2011",
   "value": 8940000
   }
   ]
   },

   {
   "name": "USA",
   "series": [
   {
   "name": "2010",
   "value": 7870000
   },
   {
   "name": "2011",
   "value": 8270000
   }
   ]
   },

   {
   "name": "France",
   "series": [
   {
   "name": "2010",
   "value": 5000002
   },
   {
   "name": "2011",
   "value": 5800000
   }
   ]
   }
   ];
   * */


  onSelect(event) {
    console.log(event);


  }

}
