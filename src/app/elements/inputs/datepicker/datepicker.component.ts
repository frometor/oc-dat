import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NgDateRangePickerOptions} from 'ng-daterangepicker';
import * as moment from 'moment';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import {IncidentsService} from "../../../services/incidents.service";


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DatepickerComponent {

  private myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };
  private myForm: FormGroup;
  private startDate: number;
  private endDate: number;


  constructor(private incidentService: IncidentsService) {

  }

  // dateRangeChanged callback function called when the user apply the date range. This is
  // mandatory callback in this option. There are also optional inputFieldChanged and
  // calendarViewChanged callbacks.
  onDateRangeChanged(event: IMyDateRangeModel) {
    this.startDate=((event.beginEpoc )*1000);
    this.endDate=((event.endEpoc )*1000);

    //console.log("beginDate",event.beginDate);
   // console.log(event.endDate);
   // console.log(event.formatted);
    console.log( "START",this.startDate);
    //console.log( "START",new Date(this.startDate));
    console.log("END",this.endDate);
   // console.log("END",new Date(this.endDate));

    // event properties are: event.beginDate, event.endDate, event.formatted,
    // event.beginEpoc and event.endEpoc
    this.incidentService.sendMessageStartEndDate( this.startDate,this.endDate);
  }


}
