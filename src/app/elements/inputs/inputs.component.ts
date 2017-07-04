import {Component,} from '@angular/core';
import {IncidentsService} from "../../services/incidents.service";

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css']
})
export class InputsComponent {

  resultIncidents: any[] = [];
  inputValues:Object={}

  constructor(private incidentsService: IncidentsService) {
  }

  searchIncidents(searchData: Object) {

    this.incidentsService.getSearchIncidents(this.inputValues).subscribe(data => {
        this.resultIncidents = data;
      },
      console.error);

    /*this.incidentsService.getAllIncidents().subscribe(data => {
     this.resultIncidents = data;
     console.log("Result: ", this.resultIncidents)

     });*/
    console.log("clicked");
  }
}
