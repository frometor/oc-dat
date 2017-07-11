import {Component, OnInit, Output, EventEmitter, OnChanges} from '@angular/core';
import {incidents} from '../../data/incident';

@Component({
  selector: 'app-incident-type',
  templateUrl: './incident-type.component.html',
  styleUrls: ['./incident-type.component.css'],
})
export class IncidentTypeComponent implements OnInit {

  uniqueTypeOfIncidents: any[] = [];

  @Output()
  typeOfIncidentChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    Object.assign(this, {incidents});
  }

  ngOnInit(): void {

    //filters the types of incident to be unique
    for (let typeOfIncident of incidents) {
      for (let singleTypesOfIncident of typeOfIncident.types) {
        // console.log(singleTypesOfIncident.type);
        //if (this.uniqueTypeOfIncidents.includes(singleTypesOfIncident.type.toLowerCase())) {
        if (this.uniqueTypeOfIncidents.includes(singleTypesOfIncident.type)) {

          //its already in uniqueTypeOfIncidents array
        } else {
        //  this.uniqueTypeOfIncidents.push(singleTypesOfIncident.type.toLowerCase());
          this.uniqueTypeOfIncidents.push(singleTypesOfIncident.type);
        }
      }
    }
  }

  //public items: Array<string> = ['Theft', 'Other'];
  public items: Array<string> = this.uniqueTypeOfIncidents;

  private value: any = ['Theft'];

  public selected(value: any) {
    console.log('Selected value is: ', value);
    //this.eventInChild.emit(value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
    console.log("refreshValue: ",value);
    this.typeOfIncidentChanged.emit(value);
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
