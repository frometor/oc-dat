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

  bounds;

  message: any;
  subscription: Subscription;
  messageReports: any;
  subscriptionReports: Subscription;
  subscriptionMonthly: Subscription;

  communicationTableMap: any;
  //markerGroup
  markerLayer;
  markerLayerGroup;
  singleMarkerLayerGroup;
  reportsMarkerLayerGroup;
  alertsPolygonLayerGroup;
  polygonLayerGroup;
  filteredValue: any;
  filteredIncidents: any[] = [];
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
    center: L.latLng([50.83, 4.33]),
    zoomControl:false
  };

  zoomOptions = {position: 'bottomright'};

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

  ngOnInit() {
  }

  onMapReady(map: L.Map) {

    let self = this;
    map.on("click", function (event) {
      console.log("self.markerLayerGroup: ", self.markerLayerGroup);
      if (self.reportsMarkerLayerGroup != null) {
        map.removeLayer(self.reportsMarkerLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }
      if (self.singleMarkerLayerGroup != null) {
        map.removeLayer(self.singleMarkerLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }
      if (self.alertsPolygonLayerGroup != null) {
        map.removeLayer(self.alertsPolygonLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }
      if (self.markerLayerGroup._mapToAdd == null) {
        self.drawMarker(self.incidents, map);
      }
    });

    this.incidentService.incidents$.subscribe(
      data => {
        // EMPTY_SEARCH has a "reset" value
        if (data.hasOwnProperty("reset")) {
          //  this.height = 900;
          map.invalidateSize();
          this.cd.markForCheck(); // forces redraw

        } else {
          //this.height = 1000;
          map.invalidateSize();
          // this.cd.markForCheck(); // forces redraw
        }
        if (this.reportsMarkerLayerGroup != null) {
          map.removeLayer(this.reportsMarkerLayerGroup);
          this.cd.markForCheck(); // forces redraw
        }
        if (this.singleMarkerLayerGroup != null) {
          map.removeLayer(this.singleMarkerLayerGroup);
          // this.cd.markForCheck(); // forces redraw
        }
        if (this.alertsPolygonLayerGroup != null) {
          map.removeLayer(this.alertsPolygonLayerGroup);
          //   this.cd.markForCheck(); // forces redraw
        }
        // console.log("data:", data);
        if (this.markerLayerGroup != null) {
          map.removeLayer(this.markerLayerGroup);
          //map.removeLayer(this.markerClusterGroup);
          this.cd.markForCheck(); // forces redraw
        }
        if (this.polygonLayerGroup != null) {
          map.removeLayer(this.polygonLayerGroup);
          //this.cd.markForCheck(); // forces redraw
        }
        this.cd.markForCheck(); // forces redraw
        this.incidents = data.hits.hits;
        this.drawMarker(this.incidents, map);
        //this.cd.markForCheck(); // marks path
        let self = this;

        //marker on click handler that shows reports
        /*     this.markerLayerGroup.on("click", function (event) {

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
         // swappedPolyCoords = self.swapPolyCoords(self.incidents[i]._source.alerts[k].geometry.coordinates);
         console.log("self.incidents[i]._source.alerts[k].geometry.coordinates", self.incidents[i]._source.alerts[k].geometry.coordinates);
         // for (let m = 0; m < self.incidents[i]._source.alerts[k].geometry.coordinates.length; m++) {
         //    swappedPolyCoords.push([self.incidents[i]._source.alerts[k].geometry.coordinates[h][1], self.incidents[i]._source.alerts[k].geometry.coordinates[h][0]]);
         // }

         //alertsPolygonMarker.push(L.polygon([self.incidents[i]._source.alerts[k].geometry.coordinates]).bindPopup("alert: " + alertText))
         //  alertsPolygonMarker.push(L.polygon(swappedPolyCoords).bindPopup("alert: " + alertText))
         }

         console.log("FOUND ALERTS!", self.incidents[i]._source.alerts[k]);

         //  reportText = self.incidents[i]._source.reports[j].src.description;
         // reportsPointsMarker.push(L.marker([self.incidents[i]._source.reports[j].src.location.coordinates[1], self.incidents[i]._source.reports[j].src.location.coordinates[0]], {
         // icon: self.customIcon2,
         //   }).bindPopup("Report: " + reportText));
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
         */
        //Polygon
        this.polygonLayerGroup.on("click", function (event) {
          console.log("CLICKED POLYGON")
        })
      }
    );

    this.subscription = this.incidentService.getMessageFromTable2Map().subscribe(message => {
      this.message = message;
      if (this.message.selected.length > 0) {
        // own scope >> eachlayer
        this.markerLayerGroup.eachLayer(function (layer) {
          if (layer.options.title == self.message.selected[0].id) {
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

      //deletes all marker to only show the marker for the incident, alerts and reports
      if (this.markerLayerGroup != null) {
        map.removeLayer(this.markerLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }

      let reportsPointsMarker: any[] = [];
      let reportText: String = "";

      this.messageReports = message;
      for (let i = 0; i < this.incidents.length; i++) {
        if (this.incidents[i]._id == message) {
          let singlePointsMarker: any[] = [];
          console.log("FOUND!", this.incidents[i]._source.reports);

          let thelatlong = {
            lat: this.incidents[i]._source.location.coordinates[1],
            lng: this.incidents[i]._source.location.coordinates[0]
          };

          this.typesArray = [];
          for (let x = 0; x < this.incidents[i]._source.types.length; x++) {
            this.typesArray.push(this.incidents[i]._source.types[x].type);
          }
          singlePointsMarker.push(L.marker(thelatlong, {
            icon: this.customIcon,
            title: this.incidents[i]._source.id
          }).on('click',
            (data) => {
              // console.log("I have a click.")
            }).bindPopup("Lat:" + this.incidents[i]._source.location.coordinates[1] + " | Lng: " + this.incidents[i]._source.location.coordinates[0] + "<br>Types:" + this.typesArray));

          this.singleMarkerLayerGroup = L.featureGroup(singlePointsMarker).addTo(map);

          self.cd.markForCheck(); // forces redraw


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

    // Show Alerts on click from table button
    this.subscriptionReports = this.incidentService.getMessagefromTable2Map4Alerts().subscribe(message => {
      let swappedPolyCoords2 = [];

      if (this.alertsPolygonLayerGroup != null) {
        map.removeLayer(this.alertsPolygonLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }

      //deletes all marker to only show the marker for the incident, alerts and reports
      if (this.markerLayerGroup != null) {
        map.removeLayer(this.markerLayerGroup);
        self.cd.markForCheck(); // forces redraw
      }

      let alertsPolygonMarker: any[] = [];
      let alertText: String = "";

      this.messageReports = message;
      for (let i = 0; i < this.incidents.length; i++) {
        if (this.incidents[i]._id == message) {

          let singlePointsMarker: any[] = [];
          console.log("FOUND!", this.incidents[i]._source.reports);

          let thelatlong = {
            lat: this.incidents[i]._source.location.coordinates[1],
            lng: this.incidents[i]._source.location.coordinates[0]
          };
          this.typesArray = [];
          for (let x = 0; x < this.incidents[i]._source.types.length; x++) {
            this.typesArray.push(this.incidents[i]._source.types[x].type);
          }
          singlePointsMarker.push(L.marker(thelatlong, {
            icon: this.customIcon,
            title: this.incidents[i]._source.id
          }).on('click',
            (data) => {
              // console.log("I have a click.")
            }).bindPopup("Lat:" + this.incidents[i]._source.location.coordinates[1] + " | Lng: " + this.incidents[i]._source.location.coordinates[0] + "<br>Types:" + this.typesArray));

          this.singleMarkerLayerGroup = L.featureGroup(singlePointsMarker).addTo(map);

          self.cd.markForCheck(); // forces redraw

          console.log("FOUND!", this.incidents[i]._source.alerts);
          for (let j = 0; j < this.incidents[i]._source.alerts.length; j++) {
            console.log("FOUND!", this.incidents[i]._source.alerts[j]);
            let swappedPolyCoords2 = [];
            alertText = self.incidents[i]._source.alerts[j].event_type;
            for (let m = 0; m < self.incidents[i]._source.alerts[j].geometry.coordinates[0].length; m++) {
              console.log([self.incidents[i]._source.alerts[j].geometry.coordinates[0][m][1], self.incidents[i]._source.alerts[j].geometry.coordinates[0][m][0]]);

              swappedPolyCoords2.push([self.incidents[i]._source.alerts[j].geometry.coordinates[0][m][1], self.incidents[i]._source.alerts[j].geometry.coordinates[0][m][0]]);

            }
            alertsPolygonMarker.push(L.polygon(swappedPolyCoords2).bindPopup("alert: " + alertText));
          }
          /*
           var polygon = L.polygon([
           [50.83564690862127, 4.335785508155824],
           [50.83564690862127, 4.337180256843568],
           [50.83504724959291, 4.337180256843568],
           [50.83504724959291, 4.335785508155824],
           [50.83564690862127, 4.335785508155824]
           ]).addTo(map);
           */

        }
      }
      this.alertsPolygonLayerGroup = L.featureGroup(alertsPolygonMarker).on('click',
        (data) => {
          map.fitBounds(this.alertsPolygonLayerGroup.getBounds());
        }).addTo(map);
      map.fitBounds(this.alertsPolygonLayerGroup.getBounds());
    });

    this.subscriptionMonthly = this.incidentService.getMessageFromFilter2Map().subscribe(messageMonth => {
      let messageM = _.cloneDeep(messageMonth);

      if (messageM[1].name == "day") {

        this.filteredValue = -1;
        this.filteredIncidents = [];
        switch (messageM[0].name) {
          case "Sunday":
            this.filteredValue = 0;
            break;
          case "Monday":
            this.filteredValue = 1;
            break;
          case "Tuesday":
            this.filteredValue = 2;
            break;
          case "Wednesday":
            this.filteredValue = 3;
            break;
          case "Thursday":
            this.filteredValue = 4;
            break;
          case "Friday":
            this.filteredValue = 5;
            break;
          case "Saturday":
            this.filteredValue = 6;
            break;
          default:
        }
        for (let i = 0; i < this.incidents.length; i++) {
         if (new Date(this.incidents[i]._source.reports["0"].src.created * 1000).getDay() == this.filteredValue) {
            this.filteredIncidents.push(this.incidents[i]);
          }
        }
        this.drawMarker(this.filteredIncidents, map);

      } else if (messageM[1].name == "month") {
        this.filteredValue = -1;
        this.filteredIncidents = [];
        switch (messageM[0].name) {
          case "January":
            this.filteredValue = 0;
            break;
          case "February":
            this.filteredValue = 1;
            break;
          case "March":
            this.filteredValue = 2;
            break;
          case "April":
            this.filteredValue = 3;
            break;
          case "May":
            this.filteredValue = 4;
            break;
          case "June":
            this.filteredValue = 5;
            break;
          case "July":
            this.filteredValue = 6;
            break;
          case "August":
            this.filteredValue = 7;
            break;
          case "September":
            this.filteredValue = 8;
            break;
          case "October":
            this.filteredValue = 9;
            break;
          case "November":
            this.filteredValue = 10;
            break;
          case "December":
            this.filteredValue = 11;
            break;
          default:
        }

        for (let i = 0; i < this.incidents.length; i++) {
          if (new Date(this.incidents[i]._source.reports["0"].src.created * 1000).getMonth() == this.filteredValue) {
            this.filteredIncidents.push(this.incidents[i]);
          }
        }

        this.drawMarker(this.filteredIncidents, map);

      } else {
        console.log("ELSE");
        this.drawMarker(this.incidents, map);
      }
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

  private drawMarker(incidents: any, map: L.Map) {

    this.incidentPoints = [];
    this.incidentPolygons = [];

    if (this.reportsMarkerLayerGroup != null) {
      map.removeLayer(this.reportsMarkerLayerGroup);
      this.cd.markForCheck(); // forces redraw
    }
    if (this.singleMarkerLayerGroup != null) {
      map.removeLayer(this.singleMarkerLayerGroup);
       this.cd.markForCheck(); // forces redraw
    }
    if (this.alertsPolygonLayerGroup != null) {
      map.removeLayer(this.alertsPolygonLayerGroup);
      //   this.cd.markForCheck(); // forces redraw
    }
    // console.log("data:", data);
    if (this.markerLayerGroup != null) {
      map.removeLayer(this.markerLayerGroup);
      //map.removeLayer(this.markerClusterGroup);
      this.cd.markForCheck(); // forces redraw
    }
    if (this.polygonLayerGroup != null) {
      map.removeLayer(this.polygonLayerGroup);
      //this.cd.markForCheck(); // forces redraw
    }
    this.cd.markForCheck(); // forces redraw

    for (let incidentP of incidents) {
      //console.log("incidentP: ", incidentP);
      //filter out points
      if (!(incidentP._source.hasOwnProperty("location"))) {
        //console.log("theft")
      }
      else if (!(incidentP._source.hasOwnProperty("types"))) {
        // console.log("type is missing");
      }
      //checks whether the incidentP is a point or a polygon
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

  private drawMarkerWithFilter(incidents: any, map: L.Map, filterObject) {

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
      //checks whether the incidentP is a point or a polygon
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

  onResize(event) {
    console.log("RESIZE", event);
  }

}
