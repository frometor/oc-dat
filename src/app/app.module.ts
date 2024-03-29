import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/angular2-leaflet-markercluster';
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
import { ResultVisualiationsComponent } from './elements/result-visualisations/result-visualiations.component';
import { D3Service } from 'd3-ng2-service';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LineChartComponent } from './elements/result-visualisations/line-chart/line-chart.component';
import { BarChartComponent } from './elements/result-visualisations/bar-chart/bar-chart.component';
import { PieChartComponent } from './elements/result-visualisations/pie-chart/pie-chart.component';
import { MonthlyFilterComponent } from './elements/monthly-filter/monthly-filter.component';
import {SelectModule} from 'ng2-select';
import {IncidentsService} from './services/incidents.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import {OverlayModule} from "@swimlane/ngx-ui";
//import {DatePickerModule} from "angular-io-datepicker";
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MyDateRangePickerModule } from 'mydaterangepicker';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    InputsComponent,
    DatepickerComponent,
    ResultTableComponent,
    SearchComponent,
    IncidentTypeComponent,
    ResultVisualiationsComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    MonthlyFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgDateRangePickerModule,
    Select2Module,
    NgxChartsModule,
    NgxDatatableModule,
    SelectModule,
    OverlayModule,
    DatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    MyDateRangePickerModule
  ],
  providers: [D3Service,IncidentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
