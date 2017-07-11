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
        }
      );
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
