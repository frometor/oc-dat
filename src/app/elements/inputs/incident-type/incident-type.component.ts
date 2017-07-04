import {Component, OnInit} from '@angular/core';
import {incidents} from '../../data/incident';

@Component({
  selector: 'app-incident-type',
  templateUrl: './incident-type.component.html',
  styleUrls: ['./incident-type.component.css'],
})
export class IncidentTypeComponent implements OnInit {

  uniqueTypeOfIncidents: any[] = [];

  constructor() {
    Object.assign(this, {incidents});
  }

  ngOnInit(): void {

    //filters the types of incident to be unique
    for (let typeOfIncident of incidents) {
      for (let singleTypesOfIncident of typeOfIncident.types) {
        // console.log(singleTypesOfIncident.type);
        if (this.uniqueTypeOfIncidents.includes(singleTypesOfIncident.type.toLowerCase())) {

          //its already in uniqueTypeOfIncidents array
        } else {
          this.uniqueTypeOfIncidents.push(singleTypesOfIncident.type.toLowerCase());
        }
      }
    }
  }

  //public items: Array<string> = ['Theft', 'Other'];
  public items: Array<string> = this.uniqueTypeOfIncidents;

  private value: any = ['Theft'];

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
    console.log(value);
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }
}
/*import {Component, OnInit} from '@angular/core';

 @Component({
 selector: 'app-incident-type',
 templateUrl: './incident-type.component.html',
 styleUrls: ['./incident-type.component.css'],

 })
 export class IncidentTypeComponent implements OnInit {

 model = {
 all: true,
 theft: false,
 riot: false,
 fire: false
 };

 constructor() {
 }

 ngOnInit() {
 }

 onInputSelect($value) {
 console.log($value);
 if($value=="all"&&(this.model==={all: true,theft: true,riot: true,fire: true})){
 console.log("4");
 this.model={
 all: true,
 theft: false,
 riot: false,
 fire: false
 }
 }
 if (((this.model.theft == false) && (this.model.riot == false) && (this.model.fire == false))) {
 console.log("1");
 // this.model.all = true;
 } else {
 console.log("2");
 this.model.all = false;
 }
 if ($value==="all" &&((this.model.all == false) )) {
 console.log("3");
 this.model={
 all: true,
 theft: false,
 riot: false,
 fire: false
 }
 }

 }


 }
 */
