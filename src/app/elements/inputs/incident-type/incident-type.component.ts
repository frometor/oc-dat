import {
  Component, OnInit, Output, EventEmitter, OnChanges, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {incidents} from '../../data/incident';
import {IncidentsService} from "../../../services/incidents.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-incident-type',
  templateUrl: './incident-type.component.html',
  styleUrls: ['./incident-type.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class IncidentTypeComponent implements OnInit {

  message: any;
  subscription: Subscription;

  uniqueTypeOfIncidents: any[] = [];
  postData: any = {
    "size": 0,
    "aggs": {
      "types_of_incidents": {
        "nested": {
          "path": "types"
        },
        "aggs": {
          "number_of_incident": {
            "terms": {
              "field": "types.type.keyword",
              "size": 30
            }
          }
        }
      }
    }
  };

  @Output()
  typeOfIncidentChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
    //Object.assign(this, {incidents});
  }

  ngOnInit(): void {
    //this.incidentService.onInitGetTypesOfIncident(this.postData);

    // subscribe to home component messages
    this.subscription = this.incidentService.onInitGetTypesOfIncident(this.postData).subscribe(message => {
      this.message = message;
      console.log("RESULT TABLE: GET MESSAGE", this.message);
      this.fillSelectTypes(this.message);
    });
  }

  private fillSelectTypes(message: any) {
    //TODO: GET TYPES FROM ELASTICSEARCH
    //filters the types of incident to be unique
    for (let typeOfIncident of message.aggregations.types_of_incidents.number_of_incident.buckets) {
      console.log("TYPE:", typeOfIncident);

      if (this.uniqueTypeOfIncidents.includes(typeOfIncident.key.toLowerCase())) {
        //if (this.uniqueTypeOfIncidents.includes(singleTypesOfIncident.type)) {

        //its already in uniqueTypeOfIncidents array
      } else {
        this.uniqueTypeOfIncidents.push(typeOfIncident.key.toLowerCase());
        // this.uniqueTypeOfIncidents.push(singleTypesOfIncident.type);
      }
    }
    console.log("############", this.uniqueTypeOfIncidents);
    this.items = this.uniqueTypeOfIncidents;
    this.cd.markForCheck(); // marks path
  }

  //public items: Array<string> = ['Theft', 'Other'];
  public items: Array<string>;
  //public items: Array<string> = this.uniqueTypeOfIncidents;

  private value: any = [];
  //private value: any = ['Theft'];

  public selected(value: any) {
    console.log('Selected value is: ', value);
    //this.eventInChild.emit(value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
    console.log("refreshValue: ", value);
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
