import {
  Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input,
  ChangeDetectorRef, ViewChild
} from '@angular/core';
import {Observable, Observer, Subscription} from "rxjs";
import * as _ from "lodash";
import {IncidentsService} from "../../services/incidents.service";

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ResultTableComponent implements OnInit {

  @Input() incidents$: Observable<any>;
  @ViewChild('myTable') table: any;
//communication between map and table
  message: any;
  subscription: Subscription;

  rows;
  expanded: any = {};
  timeout: any;
  allIncidents: any;
  allIncidents$: Observable<any>;
  selected: any[] = [];
  columns: any[] = [
    {prop: 'state'},
    {prop: 'types'},
    {prop: 'id'}
  ];

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
    //  this.singleSelectCheck = this.singleSelectCheck.bind(this);
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
        this.allIncidents = incidents;
        this.fillColums(incidents);
        //this.cd.markForCheck(); // marks path
      }
    );
    /*
     //this.allIncidents$ = this.incidentService.incidents$.map(data => this.allIncidents = data);
     this.allIncidents$ = this.incidentService.incidents$.map(data => {
     this.fillColums(data);
     this.rows = data
     });*/
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  private fillColums(mAllIncidents: any) {

    let incidentTypes;
    let incidentReports;
    let rowReports;
    let rowAlerts;

    this.allIncidents = mAllIncidents;
    this.rows = [];

    for (let incidentRow of this.allIncidents.hits.hits) {

      rowReports = [];
      rowAlerts = [];

      incidentTypes = _.map(incidentRow._source.types, 'type').join(', ');

      //REPORTS
      for (let i = 0; i < incidentRow._source.reports.length; i++) {
        if ((incidentRow._source.reports[i].src.description != null)&&(incidentRow._source.reports[i].src.description !="")) {
          rowReports.push({"report": incidentRow._source.reports[i].src.description});
        }
      }

      //ALERTS
      for (let i = 0; i < incidentRow._source.alerts.length; i++) {
        if ((incidentRow._source.alerts[i] != null)&&(incidentRow._source.reports[i]!="")) {
          rowAlerts.push({"alert": "Event Type: "+incidentRow._source.alerts[i].event_type+"| Note: "+incidentRow._source.alerts[i].note});
        }
      }


      let incidentDate = new Date(incidentRow._source.reports[0].src.created)
    //  let incidentDataString = incidentDate.getDate() + "." + (incidentDate.getMonth() + 1) + "." + incidentDate.getFullYear();

      this.rows.push({
        "state": incidentRow._source.state,
        "types": incidentTypes,
        "date": incidentDate,
        "id": incidentRow._source.id,
        "reports": rowReports,
        "alerts": rowAlerts,
        "numberOfReports": rowReports.length,
        "numberOfAlerts": rowAlerts.length,
        "theft":incidentRow._source.theft
      });

     // console.log("REPORTS", this.rows);

    }

    this.cd.markForCheck(); // marks path

  }

  onSelect(event) {
    //console.log('Event: select', event, this.selected);
    this.incidentService.sendMessageFromTable2Map(event);
   // console.log("RESULT TABLE: SEND MESSAGE", event);
 //   console.log("RESULT TABLE: this.allIncidents[i]", this.allIncidents);
    if ((event.selected.length != 0) && (event.selected != 0)) {
      for (let i = 0; i < this.allIncidents.hits.hits.length; i++) {
        if (event.selected[0].id == this.allIncidents.hits.hits[i]._id) {
          this.incidentService.sendMessageFromTable2lineChart(this.allIncidents.hits.hits[i])
            .subscribe((data) => {

         //     console.log("FOUND!");
            });

        }
      }
    } else {
      //todo: reset elements
    }

  }

  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  onActivate(event) {
    //  console.log('Event: activate', event);
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
//      console.log('paged!', event);
    }, 100);
  }

  toggleExpandRow(row) {
  //  console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
  //  console.log('Detail Toggled', event);
  }


}
