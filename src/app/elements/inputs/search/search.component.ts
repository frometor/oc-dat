import {Component, OnInit} from '@angular/core';
import {IncidentsService} from "../../../services/incidents.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  inputValue;
  public options: Select2Options;
  data;

  constructor(private incidentService: IncidentsService) {
  }

  ngOnInit() {

    this.options = {
      multiple: true,
      theme: 'classic',
      closeOnSelect: false
    };

    this.incidentService.incidents$.subscribe(
      incidents => {
        // EMPTY_SEARCH has a "reset" value
        if(incidents.hasOwnProperty("reset")){
          this.inputValue=null;
          this.incidentService.sendMessageInputSearch(this.inputValue);

        }
      //  console.log("SEARCH COMPONENT", incidents)
      }
    );

  }

  onKeyUp() {
    this.data.push({id: "sth", text: "sth"});

    //console.log("Changed", this.data);

  }

  onInputSelect() {
    console.log(this.inputValue);
    this.incidentService.sendMessageInputSearch(this.inputValue);
  }

}
