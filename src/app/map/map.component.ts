import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {incidents} from '../elements/data/incident';
import LatLngExpression = L.LatLngExpression;
import LatLngLiteral = L.LatLngLiteral;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

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
    center: L.latLng([52, 0])
  };

  customIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  incidents: any[];
  incidentPoints:any[]=[];
  incidentPolygons:any[]=[];

  private typesArray: any[];

  constructor() {
    Object.assign(this, {incidents});
  }

  onMapReady(map: L.Map) {

    for (let incidentP of incidents) {
      //filter out points
      if (incidentP.location.type == "Point" && incidentP.types[0] != null) {
        this.incidentPoints.push(incidentP);
      }
      else if(incidentP.location.type == "Polygon" && incidentP.types[0] != null){
        this.incidentPolygons.push(incidentP);
      }
    }


   // var markers=L.markerClusterGroup();

    this.typesArray=[];

    for (let incidentPol of this.incidentPolygons) {
      console.log("incident polygons:",incidentPol.location.coordinates[0][0]);
     //swaps lat with lng because leaflet is other way round than normal
      for (let latLng of incidentPol.location.coordinates[0] ){
        let tmp = latLng[0];
        latLng[0]=latLng[1];
        latLng[1]=tmp;
      }
      this.typesArray=[];
      for(let incidentType of incidentPol.types){
        this.typesArray.push(incidentType.type);
      }
      L.polygon(incidentPol.location.coordinates[0]).bindPopup("Types:" +  this.typesArray).addTo(map);
    //  var polygon = L.polygon([[9.470214843750002,52.51736993382123],[10.316162109375002,52.51736993382123],[10.316162109375002,52.05365163550058],[9.470214843750002,52.05365163550058],[9.470214843750002,52.51736993382123]]).addTo(map);

      /*var polygon = L.polygon([
       [51.509, -0.08],
       [51.503, -0.06],
       [51.51, -0.047]
       ]).addTo(map);
       */
    }

    for (let incident of this.incidentPoints) {
      console.log("incidnet", incident);
   //   if (incident.location.type == "Point" && incident.types[0] != null) {
        console.log("sth", incident.types[0].type);
        this.typesArray=[];

        for(let incidentType of incident.types){
          this.typesArray.push(incidentType.type);
        }

        let thelatlong={lat: incident.location.coordinates[1], lng: incident.location.coordinates[0]};
        L.marker(thelatlong, {icon: this.customIcon}).bindPopup("Lat:"+incident.location.coordinates[1]+" | Lng: "+ incident.location.coordinates[0]+"<br>Types:" +  this.typesArray).addTo(map);
        //L.marker({"lat":incident.location.coordinates[1],"lng": incident.location.coordinates[0]}, {icon: this.customIcon}).bindPopup("Types:" +  this.typesArray).addTo(map)

     // }

    }



    // Do stuff with map
    /*   L.marker([51.5, -0.09],{icon: this.customIcon}).addTo(map)
     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
     .openPopup();*/
  }

/*  markerClusterReady(markerCluster: L.MarkerClusterGroup) {
    // Do stuff with group
  }*/

  ngOnInit() {

  }

}
