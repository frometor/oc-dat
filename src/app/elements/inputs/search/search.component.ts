import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  inputValue;
  public options: Select2Options;
  data;

  constructor() {
  }

  ngOnInit() {

    this.options = {
      multiple: true,
      theme: 'classic',
      closeOnSelect: false
    }

  }

  onKeyUp() {
    this.data.push({id:"sth",text:"sth"});

    console.log("Changed", this.data);

  }

  onInputSelect() {
    console.log(this.inputValue);

  }

}
