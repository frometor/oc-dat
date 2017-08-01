import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {months, single} from '../data/result-data';
import {IncidentsService} from "../../services/incidents.service";
import * as _ from "lodash";

@Component({
  selector: 'app-monthly-filter',
  templateUrl: './monthly-filter.component.html',
  styleUrls: ['./monthly-filter.component.css']
})
export class MonthlyFilterComponent implements OnInit {

  allIncidents: any;
  dateValues: any;
  showChart: any = false;
  toggleMonthDayBool = false;
  EMPTY_MONTH_VALUES: any[] = [
    {
      "name": "January",
      "value": 0
    },
    {
      "name": "February",
      "value": 0
    },
    {
      "name": "March",
      "value": 0
    },
    {
      "name": "April",
      "value": 0
    }, {
      "name": "May",
      "value": 0
    }, {
      "name": "June",
      "value": 0
    }, {
      "name": "July",
      "value": 0
    }, {
      "name": "August",
      "value": 0
    }, {
      "name": "September",
      "value": 0
    }, {
      "name": "October",
      "value": 0
    }, {
      "name": "November",
      "value": 0
    }, {
      "name": "December",
      "value": 0
    }
  ];
  EMPTY_DAY_VALUES: any[] = [
    {
      "name": "Sunday",
      "value": 0
    },
    {
      "name": "Monday",
      "value": 0
    },
    {
      "name": "Tuesday",
      "value": 0
    },
    {
      "name": "Wednesday",
      "value": 0
    }, {
      "name": "Thursday",
      "value": 0
    }, {
      "name": "Friday",
      "value": 0
    }, {
      "name": "Saturday",
      "value": 0
    }
  ];

  monthValues: any[] = this.EMPTY_MONTH_VALUES;
  dayValues: any[] = this.EMPTY_DAY_VALUES;

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    this.incidentService.incidents$.subscribe(
      incidents => {
        // EMPTY_SEARCH has a "reset" value
        if (incidents.hasOwnProperty("reset")) {
          this.showChart = false;
        } else {
          this.showChart = true;
        }
        console.log("MONTHLY FILTER: ", this.allIncidents);
        this.allIncidents = incidents;
        this.fillColumsMonth(this.allIncidents.hits.hits);
        this.fillColumsDaily(this.allIncidents.hits.hits);
        //  console.log("monthly filter subscribed");
      }
    );
  }
  
  mview: any[];
  // options
  mshowXAxis = true;
  mshowYAxis = true;
  mgradient = false;
  mshowLegend = false;
  mshowXAxisLabel = true;
  mxAxisLabel = 'Month';
  mshowYAxisLabel = true;
  myAxisLabel = 'Number of Incidents';

  mcolorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  dview: any[];
  // options
  dshowXAxis = true;
  dshowYAxis = true;
  dgradient = false;
  dshowLegend = false;
  dshowXAxisLabel = true;
  dxAxisLabel = 'Day';
  dshowYAxisLabel = true;
  dyAxisLabel = 'Number of Incidents';

  dcolorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  private fillColumsMonth(incidents: any) {

    // console.log("fillCOlumns Monthly filter", incidents);
    this.monthValues = _.cloneDeep(this.EMPTY_MONTH_VALUES);
    let incidentDate;
    for (let i = 0; i < incidents.length; i++) {

      //filters those incidents out that dont have a report OR have reports without created date
      //TODO: add those that dont have reports (like alerts!!)
      // console.log("incidents[i]:",incidents[i]);
      if (incidents[i]._source.reports[0] != null && incidents[i]._source.reports[0].src.created != null) {
        //console.log("Single incident", incidents[i]._source.reports[0]);
        //console.log("Single incident", incidents[i]._source.reports[0].src.created);
        incidentDate = new Date(incidents[i]._source.reports[0].src.created * 1000).getMonth();

        switch (incidentDate) {
          case 0:
            this.monthValues [0].value += 1;
            break;
          case 1:
            this.monthValues [1].value += 1;
            break;
          case 2:
            this.monthValues [2].value += 1;
            break;
          case 3:
            this.monthValues [3].value += 1;
            break;
          case 4:
            this.monthValues [4].value += 1;
            break;
          case 5:
            this.monthValues [5].value += 1;
            break;
          case 6:
            this.monthValues [6].value += 1;
            break;
          case 7:
            this.monthValues [7].value += 1;
            break;
          case 8:
            this.monthValues [8].value += 1;
            break;
          case 9:
            this.monthValues [9].value += 1;
            break;
          case 10:
            this.monthValues [10].value += 1;
            break;
          case 11:
            this.monthValues [11].value += 1;
            break;
        }

      } else if (incidents[i]._source["alerts"] != null && incidents[i]._source.alerts.length > 0) {
        console.log("one alert");
        //TODO: ALERT:where to get a date from???
      }
      //console.log("dateValues", this.dateValues);
      this.cd.markForCheck(); // forces redraw of component

    }
    // console.log("this.monthValues ",this.monthValues );
    this.cd.markForCheck(); // forces redraw of component
  }

  fillColumsDaily(incidents: any) {
    this.dayValues = _.cloneDeep(this.EMPTY_DAY_VALUES);
    let incidentDate;
    for (let i = 0; i < incidents.length; i++) {
      if (incidents[i]._source.reports[0] != null && incidents[i]._source.reports[0].src.created != null) {
              incidentDate = new Date(incidents[i]._source.reports[0].src.created * 1000).getDay();

        switch (incidentDate) {
          case 0:
            this.dayValues [0].value += 1;
            break;
          case 1:
            this.dayValues [1].value += 1;
            break;
          case 2:
            this.dayValues [2].value += 1;
            break;
          case 3:
            this.dayValues [3].value += 1;
            break;
          case 4:
            this.dayValues [4].value += 1;
            break;
          case 5:
            this.dayValues [5].value += 1;
            break;
        }

      } else if (incidents[i]._source["alerts"] != null && incidents[i]._source.alerts.length > 0) {
        console.log("one alert");
        //TODO: ALERT:where to get a date from???
      }
      //console.log("dateValues", this.dateValues);
      this.cd.markForCheck(); // forces redraw of component

    }
    // console.log("this.monthValues ",this.monthValues );
    this.cd.markForCheck(); // forces redraw of component

  }

  toggleMonthDay() {
    //console.log(this.toggleMonthDayBool);
    this.toggleMonthDayBool = !this.toggleMonthDayBool;
  }

  showAllIncidents() {
    this.incidentService.sendMessageFromFilter2Table([{"name": "all"}, {"name": "all"}]);
  }

  onSelectMonth(event) {
    console.log(event);
    this.incidentService.sendMessageFromFilter2Table([event, {"name": "month"}]);
    this.incidentService.sendMessageFromFilter2Map([event, {"name": "month"}]);
   /*this.mcolorScheme = {
      domain: ['#ffffff', '#A10A28', '#C7B42C', '#AAAAAA']
    };*/
  }

  onSelectDay(event) {
    console.log(event);
    this.incidentService.sendMessageFromFilter2Table([event, {"name": "day"}]);
    this.incidentService.sendMessageFromFilter2Map([event, {"name": "day"}]);
    /*this.dcolorScheme = {
      domain: ['#000000', '#A10A28', '#C7B42C', '#AAAAAA']
    };*/
  }

}
