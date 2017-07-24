import {Component, Input} from '@angular/core';
import {IncidentsService} from "../../services/incidents.service";

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css']
})
export class InputsComponent {

  typeofIncidents;
  resultIncidents: any[] = [];

  constructor(private incidentService: IncidentsService) {
  }

  searchIncidents(searchData: Object) {
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
    }
  }

  resetSearch() {
    this.incidentService.resetSearch()
      .subscribe(
        (data) => {
        }
      )
  }

  parentFunction(event) {
  //  console.log("event", event);
    this.typeofIncidents = event;
  }
}
