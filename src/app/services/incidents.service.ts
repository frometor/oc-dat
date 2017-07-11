import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import * as _ from "lodash";


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
      "types_of_incidents": {
        "nested": {
          "path": "types"
        },
        "aggs": {
          "number_of_incident": {
            "terms": {
              "field": "types.type.keyword",
              "size": 30
            }
          }
        }
      }
    }
  };

  EMPTY_SEARCH: any = {
    "took": 3,
    "timed_out": false,
    "_shards": {
      "total": 2,
      "successful": 2,
      "failed": 0
    },
    "hits": {
      "total": 0,
      "max_score": 1,
      "hits": []
    },
    "aggregations": {
      "types_of_incidents": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "number_of_incident": {
          "buckets": []
        }
      }
    }
  };

  private subject = new BehaviorSubject(this.EMPTY_SEARCH);
  private subjectMapTable = new BehaviorSubject({});

  private subject2 = new Subject<any>();

  incidents$: Observable<any> = this.subject.asObservable();
  mapTableCommunication$: Observable<any> = this.subjectMapTable.asObservable();


  constructor(private http: Http) {

  }


  sendMessage(message: string):void {
    this.subject2.next({ text: message });
  }

  clearMessage() {
    this.subject2.next();
  }

  getMessage(): Observable<any> {
    return this.subject2.asObservable();
  }


  getIncidents(payload: any): Observable<any> {
    //{"match": {"types.type": "artifice"}},
//    {"match":{"types.type": "fire"}}

    let postDataType = {
      "query": {
        "nested": {
          "path": "types",
          "query": {
            "bool": {
              "should": []
            }
          }
        }

      },
      "aggs": {
        "types_of_incidents": {
          "nested": {
            "path": "types"
          },
          "aggs": {
            "number_of_incident": {
              "terms": {
                "field": "types.type.keyword",
                "size": 30
              }
            }
          }
        }
      }
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    //console.log("payload", payload);
    // console.log("this.postdata", postDataType);

    if (payload.typesOfIncident != null && payload.typesOfIncident[0] != null) {

      //if (payload.hasOwnProperty("typesOfIncident")) {
      // console.log("payload.typesOfIncident[0] != null", payload.typesOfIncident);
      for (let i = 0; i < payload.typesOfIncident.length; i++) {
        postDataType.query.nested.query.bool.should.push({"match": {"types.type.keyword": payload.typesOfIncident[i].id}});
      }

      return this.http.post(this.url, postDataType, headers)
        .map(res => res.json())
        .do(res => {
          console.log("from TYPES OF INCIDENT: ", res)
        })
        .do(incident => this.subject.next(incident));
    } else {
      return this.http.post(this.url, this.postData, headers)
        .map(res => res.json())
        .do(res => {
          console.log("from elasticsearch: ", res)
        })
        .do(incident => this.subject.next(incident));
      // .publishLast().refCount();
    }
  }

  resetSearch() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.url, this.postData, headers)
      .map(res => res.json())
      .do(res => {
        // console.log("from elasticsearch: ", res)
      })
      .do(incident => this.subject.next(this.EMPTY_SEARCH));
  }

  /*===================================================*/
  /* Communication between Map and table*/
  sendCommunicateMapTable(payload: any) {
    this.subjectMapTable.next(payload);
  }
  getCommunicateMapTable(): Observable<any> {
    return this.subjectMapTable.asObservable();
  }

}
