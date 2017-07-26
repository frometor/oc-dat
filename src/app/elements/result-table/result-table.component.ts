import {
  Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input,
  ChangeDetectorRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import {Observable, Observer, Subscription} from "rxjs";
import * as _ from "lodash";
import {IncidentsService} from "../../services/incidents.service";

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ResultTableComponent implements OnInit {

  @Input() incidents$: Observable<any>;
  @ViewChild('myTable') table: any;
//communication between map and table
  message: any;
  subscription: Subscription;
  subscriptionMonthly: Subscription;

  showChart: any = false;

  rows;
  expanded: any = {};
  timeout: any;
  allIncidents: any;
  allIncidents$: Observable<any>;
  selected: any[] = [];


  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
    // this.subscription = this.incidentService.getMessageFromTable2Map().subscribe(message => { this.message = message; console.log("message",message)});
    this.singleSelectCheck = this.singleSelectCheck.bind(this);
  }

  ngOnInit() {

    // subscribe to home component messages
    this.subscription = this.incidentService.getMessageFromMap2Table().subscribe(message => {
      this.message = message;

      //console.log("RESULT TABLE: GET MESSAGE", this.message);

    });

    this.incidentService.incidents$.subscribe(
      incidents => {
        // EMPTY_SEARCH has a "reset" value
        if (incidents.hasOwnProperty("reset")) {
          this.showChart = false;
        } else {
          this.showChart = true;
        }
        this.allIncidents = incidents;
        this.fillColums(incidents, [{"name": "all"}]);
        //this.cd.markForCheck(); // marks path
      }
    );

    this.subscriptionMonthly = this.incidentService.getMessageFromFilter2Table().subscribe(messageMonth => {
      console.log("messageMonth", messageMonth);
      if (messageMonth[1].name == "day") {
        //console.log("SHOW daily", messageMonth);
        let messageM = _.cloneDeep(messageMonth);
        this.fillColums(this.allIncidents, messageM);
      } else if (messageMonth[1].name == "month") {
        // console.log("SHOW monthly", messageMonth);
        let messageM = _.cloneDeep(messageMonth);
        this.fillColums(this.allIncidents, messageM);
      } else {
        //  console.log("SHOW EVERYTHING", messageMonth);
        let messageM = _.cloneDeep(messageMonth);
        this.fillColums(this.allIncidents, messageM);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  private fillColums(mAllIncidents: any, filterObject) {
    // console.log("fillColums", filterObject);
    let incidentTypes;
    let rowReports;
    let rowAlerts;
    let filteredValue;
    this.allIncidents = mAllIncidents;
    this.rows = [];

    for (let incidentRow of this.allIncidents.hits.hits) {

      if (filterObject[0].name == "all") {
        //   console.log("NAME == ALL");
        rowReports = [];
        rowAlerts = [];

        incidentTypes = _.map(incidentRow._source.types, 'type').join(', ');

        //REPORTS
        for (let i = 0; i < incidentRow._source.reports.length; i++) {
          //if ((incidentRow._source.reports[i].src.description != null) && (incidentRow._source.reports[i].src.description != "")) {
          if ((incidentRow._source.reports[i].src.description != null)) {
            if (incidentRow._source.reports[i].src.description == "") {
              rowReports.push({"report": "no description"});
            } else {
              rowReports.push({"report": incidentRow._source.reports[i].src.description});
            }
          }
        }

        //ALERTS
        for (let i = 0; i < incidentRow._source.alerts.length; i++) {
          if ((incidentRow._source.alerts[i] != null) && (incidentRow._source.reports[i] != "")) {
            rowAlerts.push({"alert": "Event Type: " + incidentRow._source.alerts[i].event_type + " | Note: " + incidentRow._source.alerts[i].note});
          }
        }

        let incidentDate = new Date(incidentRow._source.reports[0].src.created * 1000);
        //  let incidentDataString = incidentDate.getDate() + "." + (incidentDate.getMonth() + 1) + "." + incidentDate.getFullYear();
        console.log("incidentRow", incidentRow);

        this.rows.push({
          "state": incidentRow._source.state,
          "types": incidentTypes,
          "date": incidentDate,
          "id": incidentRow._source.id,
          "reports": rowReports,
          "alerts": rowAlerts,
          "numberOfReports": rowReports.length,
          "numberOfAlerts": rowAlerts.length,
          "theft": incidentRow._source.theft,
          "score": incidentRow._score
        });

        // console.log("REPORTS", this.rows);

      } else if (filterObject[1].name == "day") {
        //console.log("filterObject", filterObject);

        switch (filterObject[0].name) {
          case "Sunday":
            filteredValue = 0;
            break;
          case "Monday":
            filteredValue = 1;
            break;
          case "Tuesday":
            filteredValue = 2;
            break;
          case "Wednesday":
            filteredValue = 3;
            break;
          case "Thursday":
            filteredValue = 4;
            break;
          case "Friday":
            filteredValue = 5;
            break;
          case "Saturday":
            filteredValue = 6;
            break;
          default:
        }
        let incidentDateFilter = new Date(incidentRow._source.reports[0].src.created * 1000).getDay();
        if (incidentDateFilter == filteredValue) {
          // console.log("YEAH", incidentDateFilter);
          rowReports = [];
          rowAlerts = [];

          incidentTypes = _.map(incidentRow._source.types, 'type').join(', ');

          //REPORTS
          for (let i = 0; i < incidentRow._source.reports.length; i++) {
            //if ((incidentRow._source.reports[i].src.description != null) && (incidentRow._source.reports[i].src.description != "")) {
            if ((incidentRow._source.reports[i].src.description != null)) {
              if (incidentRow._source.reports[i].src.description == "") {
                rowReports.push({"report": "no description"});
              } else {
                rowReports.push({"report": incidentRow._source.reports[i].src.description});
              }
            }
          }

          //ALERTS
          for (let i = 0; i < incidentRow._source.alerts.length; i++) {
            if ((incidentRow._source.alerts[i] != null) && (incidentRow._source.reports[i] != "")) {
              rowAlerts.push({"alert": "Event Type: " + incidentRow._source.alerts[i].event_type + " | Note: " + incidentRow._source.alerts[i].note});
            }
          }

          let incidentDate = new Date(incidentRow._source.reports[0].src.created * 1000);
          //  let incidentDataString = incidentDate.getDate() + "." + (incidentDate.getMonth() + 1) + "." + incidentDate.getFullYear();
          console.log("incidentRow", incidentRow);
          this.rows.push({
            "state": incidentRow._source.state,
            "types": incidentTypes,
            "date": incidentDate,
            "id": incidentRow._source.id,
            "reports": rowReports,
            "alerts": rowAlerts,
            "numberOfReports": rowReports.length,
            "numberOfAlerts": rowAlerts.length,
            "theft": incidentRow._source.theft,
            "score": incidentRow._score
          });

        }

      } else if (filterObject[1].name == "month") {

        //console.log("filterObject", filterObject);

        switch (filterObject[0].name) {
          case "January":
            filteredValue = 0;
            break;
          case "February":
            filteredValue = 1;
            break;
          case "March":
            filteredValue = 2;
            break;
          case "April":
            filteredValue = 3;
            break;
          case "May":
            filteredValue = 4;
            break;
          case "June":
            filteredValue = 5;
            break;
          case "July":
            filteredValue = 6;
            break;
          case "August":
            filteredValue = 7;
            break;
          case "September":
            filteredValue = 8;
            break;
          case "October":
            filteredValue = 9;
            break;
          case "November":
            filteredValue = 10;
            break;
          case "December":
            filteredValue = 11;
            break;
          default:
        }
        let incidentDateFilter = new Date(incidentRow._source.reports[0].src.created * 1000).getMonth();
        if (incidentDateFilter == filteredValue) {
          // console.log("YEAH", incidentDateFilter);
          rowReports = [];
          rowAlerts = [];

          incidentTypes = _.map(incidentRow._source.types, 'type').join(', ');

          //REPORTS
          for (let i = 0; i < incidentRow._source.reports.length; i++) {
            //if ((incidentRow._source.reports[i].src.description != null) && (incidentRow._source.reports[i].src.description != "")) {
            if ((incidentRow._source.reports[i].src.description != null)) {
              if (incidentRow._source.reports[i].src.description == "") {
                rowReports.push({"report": "no description"});
              } else {
                rowReports.push({"report": incidentRow._source.reports[i].src.description});
              }
            }
          }

          //ALERTS
          for (let i = 0; i < incidentRow._source.alerts.length; i++) {
            if ((incidentRow._source.alerts[i] != null) && (incidentRow._source.reports[i] != "")) {
              rowAlerts.push({"alert": "Event Type: " + incidentRow._source.alerts[i].event_type + " | Note: " + incidentRow._source.alerts[i].note});
            }
          }

          let incidentDate = new Date(incidentRow._source.reports[0].src.created * 1000);
          //  let incidentDataString = incidentDate.getDate() + "." + (incidentDate.getMonth() + 1) + "." + incidentDate.getFullYear();
          console.log("incidentRow", incidentRow);

          this.rows.push({
            "state": incidentRow._source.state,
            "types": incidentTypes,
            "date": incidentDate,
            "id": incidentRow._source.id,
            "reports": rowReports,
            "alerts": rowAlerts,
            "numberOfReports": rowReports.length,
            "numberOfAlerts": rowAlerts.length,
            "theft": incidentRow._source.theft,
            "score": incidentRow._score
          });

        }

      }

    }

    this.cd.markForCheck(); // marks path

  }

  onSelect(event) {

    console.log('Event: select', event, this.selected);
    this.incidentService.sendMessageFromTable2Map(event);
    if ((event.selected.length != 0) && (event.selected != 0)) {
      for (let i = 0; i < this.allIncidents.hits.hits.length; i++) {
        if (event.selected[0].id == this.allIncidents.hits.hits[i]._id) {
          this.incidentService.getMessageFromTable2lineChart(this.allIncidents.hits.hits[i]).subscribe(
            data => {
              this.incidentService.sendMessageFromTable2lineChart(data);
            });
        }
      }
    } else {
      //todo: reset elements
    }

  }

  singleSelectCheck(row: any) {
    console.log("ROW", row);
    return this.selected.indexOf(row) === -1;
  }

  onActivate(event) {
    console.log('Event: activate', event);
  }

  showReports(id) {
    console.log("ID:", id);
    this.incidentService.sendMessagefromTable2Map4Reports(id);
  }

  showAlerts(id) {
    console.log("ID:", id);
    this.incidentService.sendMessagefromTable2Map4Alerts(id);
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
//      console.log('paged!', event);
    }, 100);
  }

  toggleShowtable() {
    this.showChart = !this.showChart;
  }

  toggleExpandRow(row) {
    //  console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  getSelectedIx() {
    // selected: any[] = [];
    return this.selected[0]['$$index'];
  }

  onDetailToggle(event) {
    //  console.log('Detail Toggled', event);
  }

  getRowClass(row) {
    console.log("getRowClass", row);
    // return { 'important-row': "background-color",};
  }

  selectARow() {
    this.selected = [{"$$index": 0}];
    //this.onSelect({"$$index": 0});
    this.onPage([{"$$index": 0}]);
    this.onActivate([{"$$index": 0}]);
    this.singleSelectCheck([{"$$index": 0}]);
    // return this.selected.indexOf(row) === -1;
    // this.singleSelectCheck({"$$index": 0});
    this.cd.markForCheck(); // marks path
    // this.table.refresh();
    console.log("selectARow");
  }

}
