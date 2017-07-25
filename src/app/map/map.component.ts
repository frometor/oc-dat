import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
//import {incidents} from '../elements/data/incident';
import LatLngExpression = L.LatLngExpression;
import LatLngLiteral = L.LatLngLiteral;
import * as _ from "lodash";
import {IncidentsService} from "../services/incidents.service";
import map = L.map;
import {Subscription} from "rxjs";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {

  height: number = 400;
  bounds;

  message: any;
  subscription: Subscription;
  messageReports: any;
  subscriptionReports: Subscription;

  communicationTableMap: any;
  //markerGroup
  markerLayer;
  markerLayerGroup;
  reportsMarkerLayerGroup;
  alertsPolygonLayerGroup;
  polygonLayerGroup;
  clickedMarker: any;

  // Marker cluster stuff
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
  openStreetmap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'});

  LAYER_OCM = {
    id: 'opencyclemap',
    name: 'Open Cycle Map',
    enabled: true,
    layer: L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Open Cycle Map'
    })
  };

  LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Open Street Map',
    enabled: false,
    layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Open Street Map'
    })
  };

// Values to bind to Leaflet Directive
  layersControlOptions = {position: 'topright'};

  baseLayers = {
    'Open Street Map': this.LAYER_OSM.layer,
    'Open Cycle Map': this.LAYER_OCM.layer
  };
  mapOptions = {
    zoom: 10,
    center: L.latLng([50.83, 4.33])
  };

  customIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
  customIcon2 = L.icon({
    iconUrl: 'assets/marker-icon2.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  incidents: any[];
  incidentPoints: any[] = [];
  incidentPolygons: any[] = [];


  private typesArray: any[];

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
  }

  onMapReady(map: L.Map) {

    let self = this;
    map.on("click", function (event) {
      if (self.reportsMarkerLayerGroup != null) {

        map.removeLayer(self.reportsMarkerLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }
      if (self.alertsPolygonLayerGroup != null) {

        map.removeLayer(self.alertsPolygonLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }
    });

    this.incidentService.incidents$.subscribe(
      data => {
        // EMPTY_SEARCH has a "reset" value
        if (data.hasOwnProperty("reset")) {
          this.height = 700;
          map.invalidateSize();
          this.cd.markForCheck(); // forces redraw

        } else {
          this.height = 400;
          map.invalidateSize();
          this.cd.markForCheck(); // forces redraw
        }
        // console.log("data:", data);
        if (this.markerLayerGroup != null) {
          map.removeLayer(this.markerLayerGroup);
          //map.removeLayer(this.markerClusterGroup);
          this.cd.markForCheck(); // forces redraw
        }
        if (this.polygonLayerGroup != null) {
          map.removeLayer(this.polygonLayerGroup);
          this.cd.markForCheck(); // forces redraw
        }
        this.incidents = data.hits.hits;
        this.drawMarker(this.incidents, map);
        //this.cd.markForCheck(); // marks path
        let self = this;

        //marker on click handler that shows reports
        this.markerLayerGroup.on("click", function (event) {

          if (self.reportsMarkerLayerGroup != null) {
            map.removeLayer(self.reportsMarkerLayerGroup);
            self.cd.markForCheck(); // forces redraw
          }
          if (self.alertsPolygonLayerGroup != null) {
            map.removeLayer(self.alertsPolygonLayerGroup);
            self.cd.markForCheck(); // forces redraw
          }

          let reportText: String = "";
          let alertText: String = "";
          let swappedPolyCoords = [];
          let reportsPointsMarker: any[] = [];
          let alertsPolygonMarker: any[] = [];

          let clickedMarker = event.layer;
          //   console.log("Clicked", clickedMarker);

          map.setView(clickedMarker._latlng, map.getZoom(), true);

          //all incidents
          for (let i = 0; i < self.incidents.length; i++) {

            //the clicked incident
            if (self.incidents[i]._id == clickedMarker.options.title) {

              //add marker for the reports to the map
              for (let j = 0; j < self.incidents[i]._source.reports.length; j++) {
                reportText = self.incidents[i]._source.reports[j].src.description;
                reportsPointsMarker.push(L.marker([self.incidents[i]._source.reports[j].src.location.coordinates[1], self.incidents[i]._source.reports[j].src.location.coordinates[0]], {
                  icon: self.customIcon2,
                }).bindPopup("Report: " + reportText));
              }

              for (let k = 0; k < self.incidents[i]._source.alerts.length; k++) {
                for (let h = 0; h < self.incidents[i]._source.alerts[k].geometry.coordinates.length; h++) {
                  alertText = self.incidents[i]._source.alerts[k].event_type;
                  swappedPolyCoords = self.swapPolyCoords(self.incidents[i]._source.alerts[k].geometry.coordinates);
                  console.log("self.incidents[i]._source.alerts[k].geometry.coordinates", self.incidents[i]._source.alerts[k].geometry.coordinates);
                  //alertsPolygonMarker.push(L.polygon([self.incidents[i]._source.alerts[k].geometry.coordinates]).bindPopup("alert: " + alertText))
                  alertsPolygonMarker.push(L.polygon(swappedPolyCoords).bindPopup("alert: " + alertText))
                }
                /*  var polygon = L.polygon([
                 [51.509, -0.08],
                 [51.503, -0.06],
                 [51.51, -0.047]
                 ]).addTo(map);*/

                console.log("FOUND ALERTS!", self.incidents[i]._source.alerts[k]);

                /*  reportText = self.incidents[i]._source.reports[j].src.description;
                 reportsPointsMarker.push(L.marker([self.incidents[i]._source.reports[j].src.location.coordinates[1], self.incidents[i]._source.reports[j].src.location.coordinates[0]], {
                 icon: self.customIcon2,
                 }).bindPopup("Report: " + reportText));*/
              }


              self.reportsMarkerLayerGroup = L.featureGroup(reportsPointsMarker).on('click',
                (data) => {
                  map.fitBounds(self.reportsMarkerLayerGroup.getBounds());
                }).addTo(map);

              self.alertsPolygonLayerGroup = L.featureGroup(alertsPolygonMarker).on('click',
                (data) => {
                  map.fitBounds(self.alertsPolygonLayerGroup.getBounds());
                }).addTo(map);

            }
          }

          self.incidentService.sendMessageFromMap2Table(clickedMarker);
          self.cd.markForCheck(); // forces redraw
          map.invalidateSize();
        });

        //Polygon
        this.polygonLayerGroup.on("click", function (event) {
          console.log("CLICKED POLYGON")
        })
      }
    );

    this.subscription = this.incidentService.getMessageFromTable2Map().subscribe(message => {
      this.message = message;
      // console.log("MAP:Getmessage:", this.message);
      if (this.message.selected.length > 0) {
        // own scope >> eachlayer
        this.markerLayerGroup.eachLayer(function (layer) {
          if (layer.options.title == self.message.selected[0].id) {
            //   console.log(layer);
            layer.openPopup();
            map.setView(layer._latlng, map.getZoom(), true);
          }
        });
      } else {

      }
    });

    // Show Reports on click from table
    this.subscriptionReports = this.incidentService.getMessagefromTable2Map4Reports().subscribe(message => {

      if (this.reportsMarkerLayerGroup != null) {
        map.removeLayer(this.reportsMarkerLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }

      let reportsPointsMarker: any[] = [];
      let reportText: String = "";

      this.messageReports = message;
      for (let i = 0; i < this.incidents.length; i++) {
        if (this.incidents[i]._id == message) {
          console.log("FOUND!", this.incidents[i]._source.reports);
          for (let j = 0; j < this.incidents[i]._source.reports.length; j++) {
            console.log("FOUND!", this.incidents[i]._source.reports[j]);

            reportText = this.incidents[i]._source.reports[j].src.description;

            reportsPointsMarker.push(L.marker([this.incidents[i]._source.reports[j].src.location.coordinates[1], this.incidents[i]._source.reports[j].src.location.coordinates[0]], {
              icon: self.customIcon2,
            }).bindPopup("Report: " + reportText));
          }
        }
      }
      this.reportsMarkerLayerGroup = L.featureGroup(reportsPointsMarker).on('click',
        (data) => {
          map.fitBounds(this.reportsMarkerLayerGroup.getBounds());
        }).addTo(map);
      map.fitBounds(this.reportsMarkerLayerGroup.getBounds());
    });

    // Show Alerts on click from table
    this.subscriptionReports = this.incidentService.getMessagefromTable2Map4Alerts().subscribe(message => {
      let swappedPolyCoords2 = [];

      if (this.alertsPolygonLayerGroup != null) {
        map.removeLayer(this.alertsPolygonLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }

      let alertsPolygonMarker: any[] = [];
      let alertText: String = "";

      this.messageReports = message;
      for (let i = 0; i < this.incidents.length; i++) {
        if (this.incidents[i]._id == message) {
          console.log("FOUND!", this.incidents[i]._source.alerts);
          for (let j = 0; j < this.incidents[i]._source.alerts.length; j++) {
            console.log("FOUND!", this.incidents[i]._source.alerts[j]);

            alertText = self.incidents[i]._source.alerts[j].event_type;

            swappedPolyCoords2 = self.swapPolyCoords(self.incidents[i]._source.alerts[j].geometry.coordinates);
            alertsPolygonMarker.push(L.polygon(swappedPolyCoords2).bindPopup("alert: " + alertText));
          }
        }
      }
      this.alertsPolygonLayerGroup = L.featureGroup(alertsPolygonMarker).on('click',
        (data) => {
          map.fitBounds(this.alertsPolygonLayerGroup.getBounds());
        }).addTo(map);
      map.fitBounds(this.alertsPolygonLayerGroup.getBounds());
    });

  }

  private swapPolyCoords(coordinates) {
    console.log("coordinates");

    for (let m = 0; m < coordinates.length; m++) {
      console.log("m:", coordinates[m]);
      //points of polyline
      for (let k = 0; k < coordinates[m].length; k++) {
        console.log("m k:", coordinates[m][k]);
        let tmp = coordinates[m][k][0];
        coordinates[m][k][0] = coordinates[m][k][1];
        coordinates[m][k][1] = tmp;
      }

    }
    return coordinates;
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    // Do stuff with group
    // console.log("MARKERCLUSTER READY");
    //this.markerClusterGroup = group;
  }

  private swapLatLng(incidentPol: any) {
    for (let latLng of incidentPol.location.coordinates[0]) {
      let tmp = latLng[0];
      latLng[0] = latLng[1];
      latLng[1] = tmp;
    }
  }

  ngOnInit() {
    this.height = 400;

  }

  private drawMarker(incidents: any, map: L.Map) {

    this.incidentPoints = [];
    this.incidentPolygons = [];

    for (let incidentP of incidents) {
      //console.log("incidentP: ", incidentP);
      //filter out points
      if (!(incidentP._source.hasOwnProperty("location"))) {
        //console.log("theft")
      }
      else if (!(incidentP._source.hasOwnProperty("types"))) {
        // console.log("type is missing");
      }
      else if (incidentP._source.location.type == "Point" && incidentP._source.types[0] != null) {
        this.incidentPoints.push(incidentP._source);
      }
      else if (incidentP._source.location.type == "Polygon" && incidentP._source.types[0] != null) {
        this.incidentPolygons.push(incidentP._source);
      }
    }

    // var markers=L.markerClusterGroup();

    this.typesArray = [];
    let dataPointsPolygon: any[] = [];

    for (let incidentPol of this.incidentPolygons) {
      //console.log("incident polygons:",incidentPol.location.coordinates[0][0]);
      //swaps lat with lng because leaflet is other way round than normal
      this.swapLatLng(incidentPol);

      this.typesArray = [];
      for (let incidentType of incidentPol.types) {
        this.typesArray.push(incidentType.type);
      }
      ///  L.polygon(incidentPol.location.coordinates[0]).bindPopup("Types:" + this.typesArray).addTo(map);

      dataPointsPolygon.push(L.polygon(incidentPol.location.coordinates[0]).bindPopup("Types:" + this.typesArray));
    }
    let dataPointsMarker: any[] = [];

    for (let incident of this.incidentPoints) {

      this.typesArray = [];

      for (let incidentType of incident.types) {
        this.typesArray.push(incidentType.type);
      }

      let thelatlong = {lat: incident.location.coordinates[1], lng: incident.location.coordinates[0]};

      dataPointsMarker.push(L.marker(thelatlong, {
        icon: this.customIcon,
        title: incident.id
      }).on('click',
        (data) => {
          // console.log("I have a click.")
        }).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray));


      //this.markerClusterGroup.addLayer(L.marker(thelatlong, {icon: this.customIcon}).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray));
      /// L.marker(thelatlong, {icon: this.customIcon}).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray).addTo(map);
      //L.marker({"lat":incident.location.coordinates[1],"lng": incident.location.coordinates[0]}, {icon: this.customIcon}).bindPopup("Types:" +  this.typesArray).addTo(map)

      // }

    }
    //this.markerClusterGroup.addTo(map);
    this.markerLayerGroup = L.featureGroup(dataPointsMarker).addTo(map);
    this.polygonLayerGroup = L.featureGroup(dataPointsPolygon).addTo(map);

    // Polygons
    this.polygonLayerGroup.on("click", function (event) {
      let clickedMarker = event.layer;
      // console.log("Clicked", clickedMarker);
      map.setView(clickedMarker._latlngs[0][0], map.getZoom(), true);
    });

//    map.addLayer(new L.LayerGroup(dataPoints));
    //this.markerClusterData = dataPoints;
    this.cd.markForCheck(); // forces redraw
    map.invalidateSize();

  }


}
