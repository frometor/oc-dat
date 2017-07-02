import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-incident-type',
  templateUrl: './incident-type.component.html',
  styleUrls: ['./incident-type.component.css']
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
