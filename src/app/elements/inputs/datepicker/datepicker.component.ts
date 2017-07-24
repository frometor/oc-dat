import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
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
export class DatepickerComponent implements OnInit {

  private myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
    width: '100%'
  };
  private myForm: FormGroup;
  private model: string = null;   // not initial date range set

  private startDate: number;
  private endDate: number;

  ngOnInit(): void {

    this.myForm = this.formBuilder.group({
      // Empty string means no initial value. Can be also specific date range for example:
      // {beginDate: {year: 2018, month: 10, day: 9}, endDate: {year: 2018, month: 10, day: 19}}
      // which sets this date range to initial value. It is also possible to set initial
      // value using the selDateRange attribute.

      myDateRange: ['', Validators.required]
      // other controls are here...
    });

    this.incidentService.incidents$.subscribe(
      incidents => {
        // EMPTY_SEARCH has a "reset" value
        if (incidents.hasOwnProperty("reset")) {
          this.clearDateRange();
        }

      //  console.log("DATEPICKER COMPONENT", incidents)
      }
    );
  }

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef, private formBuilder: FormBuilder) {

  }

  setDateRange(): void {
    // Set date range (today) using the setValue function
    let date = new Date();
    this.myForm.setValue({
      myDateRange: {
        beginDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        },
        endDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  onSubmitNgModel(): void {
    console.log('Value: ', this.model);
  }

  onSubmitReactiveForms(): void {
    console.log('Value: ', this.myForm.controls['myDateRange'].value, ' - Valid: ', this.myForm.controls['myDateRange'].valid,
      ' - Dirty: ', this.myForm.controls['myDateRange'].dirty, ' - Touched: ', this.myForm.controls['myDateRange'].touched);
  }

  clearDateRange(): void {
    // Clear the date range using the setValue function
    this.myForm.setValue({myDateRange: ''});
    this.startDate = null;
    this.endDate = null;
    this.incidentService.sendMessageStartEndDate((this.startDate), (this.endDate));

    this.cd.markForCheck(); // forces redraw
  }

  // dateRangeChanged callback function called when the user apply the date range. This is
  // mandatory callback in this option. There are also optional inputFieldChanged and
  // calendarViewChanged callbacks.
  onDateRangeChanged(event: IMyDateRangeModel) {
    this.startDate = (event.beginEpoc);
    this.endDate = (event.endEpoc);

   // console.log("START", this.startDate);
    //console.log( "START",new Date(this.startDate));
   // console.log("END", this.endDate);
    // console.log("END",new Date(this.endDate));

    // event properties are: event.beginDate, event.endDate, event.formatted,
    // event.beginEpoc and event.endEpoc
    this.incidentService.sendMessageStartEndDate(this.startDate, this.endDate);
  }


}
