import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
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


  message: any;
  subscription: Subscription;

  communicationTableMap: any;
  //markerGroup
  markerLayer;
  markerLayerGroup;
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

  incidents: any[];
  incidentPoints: any[] = [];
  incidentPolygons: any[] = [];


  private typesArray: any[];

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
    // Object.assign(this, {incidents});
  }

  onMapReady(map: L.Map) {

    let self = this;

    this.incidentService.incidents$.subscribe(
      data => {
        console.log("data:", data);
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

        //marker
        this.markerLayerGroup.on("click", function (event) {
          let clickedMarker = event.layer;
          console.log("Clicked", clickedMarker);
          map.setView(clickedMarker._latlng, map.getZoom());

          self.incidentService.sendMessage(clickedMarker);

          // this.cd.markForCheck(); // forces redraw
          //this.incidentService.sendCommunicateMapTable(clickedMarker);
        });
      }
    );

    this.subscription = this.incidentService.getMessage().subscribe(message => {
      this.message = message;
      console.log("message", this.message);
      if (this.message.hasOwnProperty("row")) {
        console.log("marker Clicked");


      }else{
        console.log("row Clicked");

        // own scope >> eachlayer
        this.markerLayerGroup.eachLayer(function (layer) {
          if (layer.options.title == self.message.selected[0].id) {
            console.log(layer);
            layer.openPopup();
            map.setView(layer._latlng, map.getZoom());
          }
        });
      }
    });


    /*  this.incidentService.mapTableCommunication$.subscribe(
     comunication => {
     console.log("comunication:", comunication);
     }
     );
     */

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

  /*  markerClusterReady(markerCluster: L.MarkerClusterGroup) {
   // Do stuff with group
   }*/

  ngOnInit() {
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
          console.log("I have a click.")
        }).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray));


      //this.markerClusterGroup.addLayer(L.marker(thelatlong, {icon: this.customIcon}).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray));
      /// L.marker(thelatlong, {icon: this.customIcon}).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray).addTo(map);
      //L.marker({"lat":incident.location.coordinates[1],"lng": incident.location.coordinates[0]}, {icon: this.customIcon}).bindPopup("Types:" +  this.typesArray).addTo(map)

      // }

    }
    //this.markerClusterGroup.addTo(map);
    this.markerLayerGroup = L.featureGroup(dataPointsMarker).addTo(map);
    this.polygonLayerGroup = L.featureGroup(dataPointsPolygon).addTo(map);

    //marker
    /* this.markerLayerGroup.on("click", function (event) {
     let clickedMarker = event.layer;
     console.log("Clicked", clickedMarker);
     map.setView(clickedMarker._latlng, map.getZoom());

     console.log("####################");

     this.incidentService.sendMessage("Message to you");

     this.cd.markForCheck(); // forces redraw
     //this.incidentService.sendCommunicateMapTable(clickedMarker);


     });*/

    // Polygons
    this.polygonLayerGroup.on("click", function (event) {
      let clickedMarker = event.layer;
      console.log("Clicked", clickedMarker);
      map.setView(clickedMarker._latlngs[0][0], map.getZoom());
      // this.incidentService.sendCommunicateMapTable(clickedMarker);
    });

//    map.addLayer(new L.LayerGroup(dataPoints));
    //this.markerClusterData = dataPoints;
    this.cd.markForCheck(); // forces redraw


  }

}
