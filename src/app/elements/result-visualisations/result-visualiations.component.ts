import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {IncidentsService} from "../../services/incidents.service";

@Component({
  selector: 'app-result-visualiations',
  templateUrl: './result-visualiations.component.html',
  styleUrls: ['./result-visualiations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ResultVisualiationsComponent implements OnInit {

  showChart: any = false;

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {

  }


  ngOnInit(): void {
    this.incidentService.incidents$.subscribe(
      incidents => {
        // EMPTY_SEARCH has a "reset" value
        if (incidents.hasOwnProperty("reset")) {
          console.log("1", this.showChart);
          this.showChart = false;
          this.cd.markForCheck(); // marks path

        } else {
          console.log("2", this.showChart);
          this.showChart = true;
          this.cd.markForCheck(); // marks path

        }
        // this.allIncidents = incidents;
        // this.fillColums(incidents,{"name":"all"});
        //this.cd.markForCheck(); // marks path
      }
    );
  }

  toggleshowChart() {
    console.log("CLICKED", this.showChart);
    this.showChart = !this.showChart;
    this.cd.markForCheck(); // marks path

  }

}
