import {Component, Input} from '@angular/core';
import {IncidentsService} from "../../services/incidents.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css']
})
export class InputsComponent {

  typeofIncidents;
  resultIncidents: any[] = [];
  inputValues: Object = {};
  allIncidents$: Observable<any>;


  constructor(private incidentService: IncidentsService) {
  }

  searchIncidents(searchData: Object) {
    //console.log("this.typeofIncidents: ", this.typeofIncidents);
    this.incidentService.getIncidents({"typesOfIncident": this.typeofIncidents})
      .subscribe(
        (data) => {
          this.resultIncidents = data;
          this.printEachIncident(this.resultIncidents);
        }
      );
  }

  private printEachIncident(resultIncidents: any) {
    for (let i = 0; i < resultIncidents.hits.hits.length; i++) {
     // console.log(resultIncidents.hits.hits[i]._source.theft)
    }
  }

  resetSearch() {
    this.incidentService.resetSearch()
      .subscribe(
        (data) => {
          //console.log("Resetted")
        }
      )
  }

  parentFunction(event) {
    console.log("event", event);
    this.typeofIncidents = event;
  }
}
