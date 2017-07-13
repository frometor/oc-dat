import {
  Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input,
  ChangeDetectorRef
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

//communication between map and table
  message: any;
  subscription: Subscription;


  rows: any[] = [];
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
      console.log("RESULT TABLE: GET MESSAGE", this.message);

    });

    this.incidentService.incidents$.subscribe(
      incidents => {
        this.allIncidents = incidents;
        this.fillColums(incidents);
        //this.cd.markForCheck(); // marks path
        //console.log("result table subscribed");
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
    this.rows = [];
    let incidentTypes;
    this.allIncidents = mAllIncidents;
    // console.log("FILLCOLUMNS: mAllIncidents", mAllIncidents);
    //console.log("FILLCOLUMNS: this.allIncidents", this.allIncidents);
    for (let incidentRow of this.allIncidents.hits.hits) {


      incidentTypes = _.map(incidentRow._source.types, 'type').join(', ');
      this.rows.push({
        "state": incidentRow._source.state,
        "types": incidentTypes,
        "id": incidentRow._source.id
      })
    }
    /*
     this.rows.push({state: "sth"});*/

    /* let typesOfIncidentString;
     for (let incidentRow of mAllIncidents.hits.hits) {
     let typesOfIncidentString = '';
     for (let typesOfIncident of incidentRow._source.types) {
     console.log(typesOfIncident.type);
     typesOfIncidentString += " " + typesOfIncident.type;
     }
     this.rows.push({
     state: incidentRow._source.state,
     types: typesOfIncidentString
     });
     console.log("PUSHED");
     }*/

    //  this.change.emit();

    this.cd.markForCheck(); // marks path

  }

  onSelect(event) {
    //console.log('Event: select', event, this.selected);
    this.incidentService.sendMessageFromTable2Map(event);
    console.log("RESULT TABLE: SEND MESSAGE", event);
    console.log("RESULT TABLE: this.allIncidents[i]", this.allIncidents);

    for (let i = 0; i < this.allIncidents.hits.hits.length; i++) {
      if (event.selected[0].id == this.allIncidents.hits.hits[i]._id) {
        this.incidentService.sendMessageFromTable2lineChart(this.allIncidents.hits.hits[i])
          .subscribe(  (data) => {

            console.log("FOUND!");
          });

      }
    }
    /* console.log("RESULT TABLE this.allIncidents):", this.allIncidents);
     console.log("$: ", this.allIncidents$)*/
  }


  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  onActivate(event) {
    //  console.log('Event: activate', event);
  }

  getRowHeight(row) {
    if (!row) return 50;
    if (row.height === undefined) return 50;
    return row.height;
  }

}
