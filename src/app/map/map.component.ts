import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
//import {incidents} from '../elements/data/incident';
import LatLngExpression = L.LatLngExpression;
import LatLngLiteral = L.LatLngLiteral;
import * as _ from "lodash";
import {IncidentsService} from "../services/incidents.service";
import map = L.map;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {

  //markerGroup
  markerLayer;
  markerLayerGroup;
  polygonLayerGroup;

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
  incidentPoints: any[] = [];
  incidentPolygons: any[] = [];

  private typesArray: any[];

  constructor(private incidentService: IncidentsService, private cd: ChangeDetectorRef) {
    // Object.assign(this, {incidents});
  }

  onMapReady(map: L.Map) {

    this.incidentService.incidents$.subscribe(
      data => {
        if (this.markerLayerGroup != null) {
          map.removeLayer(this.markerLayerGroup);
          //map.removeLayer(this.markerClusterGroup);
          this.cd.markForCheck(); // forces redraw
        }
        if (this.markerLayerGroup != null) {
          map.removeLayer(this.polygonLayerGroup);
          this.cd.markForCheck(); // forces redraw
        }
        this.incidents = data.hits.hits;
       // console.log("MAP: INCIDENTS: ", this.incidents);
        this.drawMarker(this.incidents, map);
        //this.cd.markForCheck(); // marks path
      }
    );

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

      //  var polygon = L.polygon([[9.470214843750002,52.51736993382123],[10.316162109375002,52.51736993382123],[10.316162109375002,52.05365163550058],[9.470214843750002,52.05365163550058],[9.470214843750002,52.51736993382123]]).addTo(map);

      /*var polygon = L.polygon([
       [51.509, -0.08],
       [51.503, -0.06],
       [51.51, -0.047]
       ]).addTo(map);
       */
    }
    //let dataPoints: any[] = [];
    let markers = [];

    let dataPointsMarker: any[] = [];

    for (let incident of this.incidentPoints) {

      // console.log("incidnet", incident);
      //   if (incident.location.type == "Point" && incident.types[0] != null) {
      //  console.log("sth", incident.types[0].type);
      this.typesArray = [];

      for (let incidentType of incident.types) {
        this.typesArray.push(incidentType.type);
      }

      let thelatlong = {lat: incident.location.coordinates[1], lng: incident.location.coordinates[0]};


      dataPointsMarker.push(L.marker(thelatlong, {icon: this.customIcon,title:incident.id}).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray));


      //this.markerClusterGroup.addLayer(L.marker(thelatlong, {icon: this.customIcon}).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray));
      /// L.marker(thelatlong, {icon: this.customIcon}).bindPopup("Lat:" + incident.location.coordinates[1] + " | Lng: " + incident.location.coordinates[0] + "<br>Types:" + this.typesArray).addTo(map);
      //L.marker({"lat":incident.location.coordinates[1],"lng": incident.location.coordinates[0]}, {icon: this.customIcon}).bindPopup("Types:" +  this.typesArray).addTo(map)

      // }

    }
    //this.markerClusterGroup.addTo(map);
    this.markerLayerGroup =  L.featureGroup(dataPointsMarker).addTo(map);
    this.polygonLayerGroup = new L.LayerGroup(dataPointsPolygon).addTo(map);
    this.markerLayerGroup.on("click", function (event) {
      let clickedMarker = event.layer;
      // do some stuff…
      console.log("Clicked",clickedMarker.options.title);
      map.setView(clickedMarker._latlng,map.getZoom())

    });
//    map.addLayer(new L.LayerGroup(dataPoints));
    //this.markerClusterData = dataPoints;
    this.cd.markForCheck(); // forces redraw


  }

}
