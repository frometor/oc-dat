import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InputsComponent } from './elements/inputs/inputs.component';
import { DatepickerComponent } from './elements/inputs/datepicker/datepicker.component';
import { NgDateRangePickerModule } from 'ng-daterangepicker';
import { Select2Module } from 'ng2-select2';
import { ResultTableComponent } from './elements/result-table/result-table.component';
import { SearchComponent } from './elements/inputs/search/search.component';
import { IncidentTypeComponent } from './elements/inputs/incident-type/incident-type.component';
import { FilterComponent } from './elements/filter/filter.component';
import { FilterDataComponent } from './elements/filter-data/filter-data.component';
import { ResultVisualiationsComponent } from './elements/result-visualiations/result-visualiations.component';
import { D3Service } from 'd3-ng2-service';
import {NgxChartsModule} from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    InputsComponent,
    DatepickerComponent,
    ResultTableComponent,
    SearchComponent,
    IncidentTypeComponent,
    FilterComponent,
    FilterDataComponent,
    ResultVisualiationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LeafletModule,
    BrowserAnimationsModule,
    NgDateRangePickerModule,
    Select2Module,
    NgxChartsModule
  ],
  providers: [D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
