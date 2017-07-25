import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {IncidentsService} from "../../../services/incidents.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class LineChartComponent implements OnInit {

  buckets: any = [];
  incidentValues: any = [];

  view: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Number of Reports';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

   constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    this.incidentService.getMessageFromTable2lineChart2().subscribe(
      data => {
        // console.log("LINECHART", data);
        if (!data.hasOwnProperty("empty") && data != null) {
          // console.log("HEJA", data);
          this.fillColums(data);
        } else {
         // console.log("empty");
        }

      }
    )
  }

  onSelect(event) {
    console.log(event);
  }

  private fillColums(incidents: any) {
    this.buckets = [];
    //console.log("incidents: ", incidents.aggregations.incidents_per_month.incident_day.buckets);
    for (let i = 0; i < incidents.aggregations.incidents_per_month.incident_day.buckets.length; i++) {
      this.buckets.push({
        "name": new Date(incidents.aggregations.incidents_per_month.incident_day.buckets[i].key * 1000),
        "value": incidents.aggregations.incidents_per_month.incident_day.buckets[i].doc_count
      })
    }
  //  console.log("buckets", this.buckets);
    this.cd.markForCheck(); // marks path
  }
}
