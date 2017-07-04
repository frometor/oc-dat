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
  url: string = 'http://localhost:9200/incident/_search/?pretty=1';
  postData: any = {};

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
    return this.http.get(this.url, this.postData)
      .map(res => res.json());
      /*.subscribe(
        data => {
          this.subject.next(data)
        }
      )*/
  }

  getSearchIncidents(searchInput:Object):Observable<any>{
    console.log("getSearchIncidents()");

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.post(this.url,this.postData, options)
      .map(res=>res.json())
      .do(data=>console.log(data))
      .do(data=>this.subject.next(data))
      .publishLast().refCount();
    //publish only once


  }

}
