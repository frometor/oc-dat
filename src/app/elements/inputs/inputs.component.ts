import {Component,} from '@angular/core';
import {IncidentsService} from "../../services/incidents.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css']
})
export class InputsComponent {

  resultIncidents: any[] = [];
  inputValues: Object = {};
  allIncidents$: Observable<any>;


  constructor(private incidentService: IncidentsService) {
  }

  searchIncidents(searchData: Object) {

    // this.allIncidents$ = this.incidentService.incidents$;

    this.incidentService.getIncidents()
      .subscribe(
        (data) => {
          this.resultIncidents = data;
          // console.log("changed!: ",this.resultIncidents)
        }
      );

    //console.log("inputs component clicked");
    /*
     this.incidentsService.getSearchIncidents(this.inputValues).subscribe(data => {
     this.resultIncidents = data;
     },
     console.error);
     */
    /*this.incidentsService.getAllIncidents().subscribe(data => {
     this.resultIncidents = data;
     console.log("Result: ", this.resultIncidents)

     });*/
  }

  resetSearch() {
    this.incidentService.resetSearch()
      .subscribe(
        (data) => {
          console.log("Resetted")
        }
      )
  }
}
