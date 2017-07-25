import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {IncidentsService} from "../../../services/incidents.service";
import * as _ from "lodash";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnInit {

  allIncidents: any;
  incidentValues: any;

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    this.incidentService.incidents$.subscribe(
      incidents => {
        this.allIncidents = incidents.hits;
        this.fillColums(incidents);
      }
    );
  }

  view: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Type of Incident';
  showYAxisLabel = true;
  yAxisLabel = 'Amount';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  onSelect(event) {
    console.log(event);
  }

  private fillColums(incidents: any) {
    this.incidentValues = this.lodashMapKeys(incidents.aggregations.types_of_incidents.number_of_incident.buckets);
    console.log("this.incidentValues", this.incidentValues);
     this.cd.markForCheck(); // marks path
  }

  //changes the elasticsearch key names to names that the component understands
  private lodashMapKeys(buckets: Array<any>) {
    let returnValue;
    let keyMap = {
      doc_count: 'value',
      key: 'name'
    };

    returnValue = buckets.map(function (obj) {
      return _.mapKeys(obj, function (value, key) {
        return keyMap[key];
      });
    });
    return returnValue;
  }
}
