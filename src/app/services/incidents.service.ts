import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable, BehaviorSubject} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import {incidents} from "../elements/data/incident";

export const EMPTY_INCIDENT: any = {};

@Injectable()
export class IncidentsService {

  private subject = new BehaviorSubject(EMPTY_INCIDENT);

  incidents$: Observable<any> = this.subject.asObservable();

  //url: string = './assets/data/incidents.json';
  //url: string = 'http://localhost:9200/incidents/_search/?pretty=1';
  url: string = 'http://localhost:9200/incidents/incident/_search';
  //postData: any = {};
  postData: any = {
    "size": 10000,
    "aggs": {
      "types_of_incident": {
        "terms": {
          "field": "types.type.keyword"
        }
      }
    }
  };
  /*
   curl -XPOST "http://localhost:9200/incidents/incident/_search" -d'
   {
   "query": {
   "term": {"state": "closed"}
   }
   }'
   */

  constructor(private http: Http) {
  }

  getAllIncidents() {
    // return incidents;
    return this.http.request('./assets/data/incidents.json')
      .map((res: Response) => res.json());
  }

  getAllIncidentsPost() {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Acces-Control-Allow-Origin', '*');
    // return this.http.post(this.url, this.postData,headers)
    return this.http.get(this.url, this.postData)
      .map(res => res.json());
    /*.subscribe(
     data => {
     this.subject.next(data)
     }
     )*/
  }

  getSearchIncidents(searchInput: Object): Observable<any> {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers}); // Create a request option
    return this.http.post(this.url, this.postData, options)
      .map(res => res.json())
      .do(data => console.log(data))
      .do(data => this.subject.next(data))
      .publishLast().refCount();
    //publish only once
  }

}
