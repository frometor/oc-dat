import {
  Component, OnInit, Output, EventEmitter, OnChanges, ChangeDetectionStrategy,
  ChangeDetectorRef, ViewChild
} from '@angular/core';
import {IncidentsService} from "../../../services/incidents.service";
import {Subscription} from "rxjs";
import {SelectComponent} from "ng2-select";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-incident-type',
  templateUrl: './incident-type.component.html',
  styleUrls: ['./incident-type.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class IncidentTypeComponent implements OnInit {

  @ViewChild('select1') select1: SelectComponent;

  message: any;
  subscription: Subscription;

  public items: Array<string>;
  private value: any = [];

  private formGroup: FormGroup;

  uniqueTypeOfIncidents: any[] = [];
  postData: any = {
    "size": 100,
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
  }

  ngOnInit(): void {
    // subscribe to home component messages
    this.subscription = this.incidentService.onInitGetTypesOfIncident(this.postData).subscribe(message => {
      this.message = message;
      this.fillSelectTypes(this.message);
    });

    this.incidentService.incidents$.subscribe(
      incidents => {
        // EMPTY_SEARCH has a "reset" value
        if (incidents.hasOwnProperty("reset")) {
          this.clearTypesOfIncident();
        }

        console.log("DATEPICKER COMPONENT", incidents)
      }
    );
  }

  private fillSelectTypes(message: any) {

    //filters the types of incident to be unique
    for (let typeOfIncident of message.aggregations.types_of_incidents.number_of_incident.buckets) {
      //  console.log("TYPE:", typeOfIncident);

      if (this.uniqueTypeOfIncidents.includes(typeOfIncident.key.toLowerCase())) {
        //its already in uniqueTypeOfIncidents array

      } else {
        this.uniqueTypeOfIncidents.push(typeOfIncident.key.toLowerCase());
      }
    }
    this.items = this.uniqueTypeOfIncidents;
    this.cd.markForCheck(); // marks path
  }

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

  private clearTypesOfIncident() {
    // this.select1.remove( this.value);
    console.log("this.select1.selected",this.select1);

    this.select1.active=[];
    // this.items = null;
    this.cd.markForCheck(); // marks path
    this.typeOfIncidentChanged.emit(null);
  }
}
