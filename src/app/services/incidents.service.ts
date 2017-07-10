import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable()
export class IncidentsService {

  //url: string = './assets/data/incidents.json';
  //url: string = 'http://localhost:9200/incidents/_search/?pretty=1';
  url: string = 'http://localhost:9200/incidents/incident/_search';
  /*postData: any = {

   };*/
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

  EMPTY_SEARCH: any = {
    "took": 3,
    "timed_out": false,
    "_shards": {
      "total": 5,
      "successful": 5,
      "failed": 0
    },
    "hits": {
      "total": 4,
      "max_score": 1,
      "hits": []
    },
    "aggregations": {
      "types_of_incident": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": []
      }
    }
  };

  private subject = new BehaviorSubject(this.EMPTY_SEARCH);

  /*
   private subject = new BehaviorSubject({"took": 3,
   "timed_out": false,
   "_shards": {
   "total": 5,
   "successful": 5,
   "failed": 0
   },
   "hits": {},
   });*/

  incidents$: Observable<any> = this.subject.asObservable();

  constructor(private http: Http) {

  }

  getIncidents(): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    /*  return this.http.get(this.url)
     .map(res => res.json())
     .do(res => {console.log("RES: ", res)})
     .do(incident=> this.subject.next(incident));
     */
    return this.http.post(this.url, this.postData, headers)
      .map(res => res.json())
      .do(res => {
       // console.log("from elasticsearch: ", res)
      })
      .do(incident => this.subject.next(incident));
    // .publishLast().refCount();
  }

  resetSearch() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.url, this.postData, headers)
      .map(res => res.json())
      .do(res => {
        console.log("from elasticsearch: ", res)
      })
      .do(incident => this.subject.next(this.EMPTY_SEARCH));
  }

}
