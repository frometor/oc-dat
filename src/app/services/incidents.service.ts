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

  FILTER_HTTP_REUQUEST_FAILURE = {
    "query": {
      "match": {
        "tags.keyword": "_http_request_failure"
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

  private subjectfromTable2Map = new Subject<any>();
  private subjectfromMap2Table = new Subject<any>();
  private subjectfromTable2LineChart = new Subject<any>();

  incidents$: Observable<any> = this.subject.asObservable();
  mapTableCommunication$: Observable<any> = this.subjectMapTable.asObservable();
  private searchTerm: String = null;

  constructor(private http: Http) {

  }

  getIncidents(payload: any): Observable<any> {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post("http://localhost:9200/incidents/_delete_by_query'", this.FILTER_HTTP_REUQUEST_FAILURE, headers)
      .do(res => {
        console.log("Filtered HTTP_REQUEST_FAILURE")
      });
    //{"match": {"types.type": "artifice"}},
//    {"match":{"types.type": "fire"}}

    let postDataType: any =
      {
        "size": 10000,
        "query": {
          "bool": {
            "should": [
              {
                "nested": {
                  "path": "types",
                  "query": {
                    "bool": {
                      "should": []
                    }
                  }
                }
              }
            ]
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
          },
          "incidents_per_day": {
            "nested": {
              "path": "reports"
            },
            "aggs": {
              "dayOfWeek": {
                "terms": {
                  "script": {
                    "lang": "painless",
                    "inline": "doc['reports.src.created'].date.dayOfWeek"
                  }
                }
              }
            }
          },
          "incidents_per_month": {
            "nested": {
              "path": "reports"
            },
            "aggs": {
              "dayOfWeek": {
                "terms": {
                  "script": {
                    "lang": "painless",
                    "inline": "doc['reports.src.created'].date.monthOfYear"
                  }
                }
              }
            }
          }
        }
      };


    //console.log("payload", payload);
    // console.log("this.postdata", postDataType);

    if ((this.searchTerm != "") && (this.searchTerm != null)) {
      console.log("this.searchTerm", this.searchTerm);
      //postDataType.query.bool.should[1].nested.query.bool.should.push({"match": {"reports.source.description": this.searchTerm}});
      postDataType.query.bool.should.push({
        "nested": {
          "path": "reports",
          "query": {
            "bool": {
              "should": [
                {
                  "match": {
                    "reports.src.description": this.searchTerm
                  }
                }
              ]
            }
          }
        }
      });

      postDataType.query.bool.should[0].nested.query.bool.should.push({"match": {"types.type": this.searchTerm}});

    }

    //.hits.hits["0"]._source.reports["0"].src.description

    if (payload.typesOfIncident != null && payload.typesOfIncident[0] != null) {

      //if (payload.hasOwnProperty("typesOfIncident")) {
      // console.log("payload.typesOfIncident[0] != null", payload.typesOfIncident);
      for (let i = 0; i < payload.typesOfIncident.length; i++) {
        postDataType.query.bool.should[0].nested.query.bool.should.push({"match": {"types.type": payload.typesOfIncident[i].id}});
      }
      console.log("1: this.searchTerm", postDataType);
      return this.http.post(this.url, postDataType, headers)
        .map(res => res.json())
        .do(res => {
          console.log("from TYPES OF INCIDENT: ", res)
        })
        .do(incident => this.subject.next(incident));
    } else {
      console.log("2: this.searchTerm", postDataType);
      // return this.http.post(this.url, this.postData, headers)
      return this.http.post(this.url, postDataType, headers)
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

  sendMessageFromTable2Map(message: any): void {
    this.subjectfromTable2Map.next(message);
  }

  clearMessageFromTable2Map() {
    this.subjectfromTable2Map.next();
  }

  getMessageFromTable2Map(): Observable<any> {
    return this.subjectfromTable2Map.asObservable();
  }

  sendMessageFromMap2Table(message: any): void {
    console.log("incident Service: send Message");
    this.subjectfromMap2Table.next(message);
  }

  clearMessageFromMap2Table() {
    this.subjectfromMap2Table.next();
  }

  getMessageFromMap2Table(): Observable<any> {
    return this.subjectfromMap2Table.asObservable();
  }

  /*===================================================*/
  /*Input of search field*/
  sendMessageInputSearch(message: any): void {
    console.log("IncidentService:sendMessageInputSearch", message);
    this.searchTerm = message;
    ///  this.subjectfromTable2Map.next(message);
  }

  /*===================================================*/
  /*Communication from table to linechart*/
  sendMessageFromTable2lineChart(hit: any):Observable<any> {
    console.log("sendMessageFromTable2lineChart");
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let postDataLinechart = {
      "query": {
        "match": {
          "id": hit._id
        }

      },
      "aggs": {
        "incidents_per_month": {
          "nested": {
            "path": "reports"
          },
          "aggs": {
            "incident_month": {
              "date_histogram": {
                "field": "reports.src.created",
                "interval": "year"
              }
            }
          }
        }
      }
    };
    console.log("sendMessageFromTable2lineChart2222");

    return this.http.post(this.url, postDataLinechart, headers)
      .map(res => res.json())
      .do(res=>{console.log("HDBASD")})
      .do(res => {
        console.log("POST for Linechart ", res)
      })
      .do(incident => this.subjectfromTable2LineChart.next(incident));
  }

  getMessageFromTable2LineChart(): Observable<any> {
    return this.subjectfromTable2LineChart.asObservable();
  }
}
