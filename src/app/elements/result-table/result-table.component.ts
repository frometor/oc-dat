import {Component, OnInit} from '@angular/core';
import {incidents} from "../data/incident";
import Promise = promise.Promise;
import {HttpModule} from '@angular/http';
import {Observable, Observer} from "rxjs";
import {Response} from '@angular/http';
import {promise} from "selenium-webdriver";
import {IncidentsService, EMPTY_INCIDENT} from "../../services/incidents.service";

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css'],
  providers: [IncidentsService]
})
export class ResultTableComponent implements OnInit {

  allIncidents: any[] = [];
  allIncidents$: Observable<any>;
  rows: any[] = [];
  selected: any[] = [];
  columns: any[] = [
    {prop: 'state'},
    {name: 'Types'},
    {name: 'Gender'}
  ];

  //declared private so that it is available elsewhere in the application
  //COnstructor only used for dependency injection
  constructor(private incidentsService: IncidentsService) {
    // Object.assign(this, {incidents});

    /*this.fetch((data) => {
     this.rows = data;
     });*/
  }

  private loadIncidents() {
    // this.incidentService.getAllIncidents().subscribe(data => (console.log("HELLO")));

  }

  ngOnInit() {

   // this.allIncidents$ = this.incidentsService.incidents$.map(data => data !== EMPTY_INCIDENT);
   this.incidentsService.getAllIncidents().subscribe(data => {
      this.allIncidents = data;
      this.fillColums(this.allIncidents);
      console.log("SERVICE: ", this.allIncidents)
    });

    console.log("SERVICE: ", this.allIncidents);
  }

  private fillColums(mAllIncidents:any) {
    console.log("resultsTable", mAllIncidents);
    for (let incidentRow of mAllIncidents.incidents) {
      console.log(incidentRow);
      this.rows.push({
        state: incidentRow.state,
        types: incidentRow.types
      });
    }
  }


  /*
   fetch(cb) {
   const req = new XMLHttpRequest();
   req.open('GET', `assets/data/company.json`);

   req.onload = () => {
   cb(JSON.parse(req.response));
   };

   req.send();
   }*/

  onSelect(event) {
    console.log('Event: select', event, this.selected);
  }

  onActivate(event) {
    console.log('Event: activate', event);
  }

}
