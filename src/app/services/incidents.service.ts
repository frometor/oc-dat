import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import * as _ from "lodash";


@Injectable()
export class IncidentsService {

  url: string = 'http://localhost:9200/incidents/incident/_search';

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
    "reset":true,
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
  private subjectfromMap2Table4Reports = new Subject<any>();
  private subjectfromTable2LineChart = new Subject<any>();
  private subjectOnInitTypesOfIncident = new Subject<any>();

  incidents$: Observable<any> = this.subject.asObservable();
  mapTableCommunication$: Observable<any> = this.subjectMapTable.asObservable();
  private searchTerm: String = null;
  private startDate: number = null;
  private endDate: number = null;
  private dateObject = {
    "startDate": null,
    "endDate": null
  };


  constructor(private http: Http) {

  }

  getIncidents(payload: any): Observable<any> {

    let incidentTypeString = "";
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post("http://localhost:9200/incidents/_delete_by_query'", this.FILTER_HTTP_REUQUEST_FAILURE, headers)
      .do(res => {
        // console.log("Filtered HTTP_REQUEST_FAILURE")
      });

    let postDataType: any = {
      "size": 10000,
      "query": {
        "bool": {
          "filter": {
            "bool": {
              "must": [
                {
                  "nested": {
                    "path": "reports",
                    "query": {
                      "bool": {
                        "must": [
                          {
                            "range": {
                              "reports.src.created": {
                                /*"gt": 100000000000*/
                                /*"lte":1000000*/
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
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
            "monthOfYear": {
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
    /* let postDataType: any = {
     size: 10000,
     "query": {
     "query_string": {
     "query": ""

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
     };*/
    /* {
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
     };*/


    /*
     //ST !=null
     if ((this.searchTerm != "") && (this.searchTerm != null)) {
     //date !=null
     if (this.dateObject != null) {
     //Type !=null
     if(payload.typesOfIncident != null && payload.typesOfIncident[0] != null){

     } else{
     //Type==null
     }
     }else{
     //date==null
     }
     }else{
     //ST==null

     }
     */

    if ((this.dateObject.startDate != null) && (this.dateObject.startDate != 0) && (this.dateObject.startDate != "0")) {
      console.log("DATEOBJECT != NULL", this.dateObject.startDate);
      postDataType.query.bool.filter.bool.must["0"].nested.query.bool.must["0"].range["reports.src.created"].gt = this.dateObject.startDate;

    }
    if ((this.dateObject.endDate != null) && (this.dateObject.endDate != 0) && (this.dateObject.endDate != "0")) {
      console.log("DATEOBJECT != NULL", this.dateObject.endDate);
      postDataType.query.bool.filter.bool.must["0"].nested.query.bool.must["0"].range["reports.src.created"].lte = this.dateObject.endDate;
      /*
       GET incidents/incident/_search
       {
       "query": {
       "nested" : {
       "path" : "reports",
       "query" : {
       "bool" : {
       "must" : [
       { "range" : {"reports.src.created": {"gt" : 10000000000}} }
       ]
       }
       }
       }
       }
       }
       */
    }
    //search term from searchInput is not empty or undefined
    if ((this.searchTerm != "") && (this.searchTerm != null)) {
      //search term from searchInput AND typesOfIncident are not empty or undefined
      if (payload.typesOfIncident != null && payload.typesOfIncident[0] != null) {
        incidentTypeString = _.map(payload.typesOfIncident, 'text').join('~ ');
        incidentTypeString += "~ " + this.searchTerm + "~";
        //   console.log("2B:", incidentTypeString);
        //postDataType.query.bool.must.query_string.query = (incidentTypeString);
        postDataType.query.bool.must = {
          "query_string": {
            "query": incidentTypeString
          }

        };

      } else {
        //searchTerm is not empty BUT typesOf Incidents is
        let searchtermArray = this.searchTerm.split(" ");
        let searchTermString = searchtermArray.join("~ ");
        searchTermString += "~";
        //incidentTypeString = _.map(searchtermArray, 'text').join('~ ');

        //postDataType.query.bool.must.query_string.query = searchTermString;
        postDataType.query.bool.must = {

          "query_string": {
            "query": searchTermString
          }

        };
        //  console.log("2A:", searchTermString);
      }
    }
    //ST == null but ToI != null
    else if (payload.typesOfIncident != null && payload.typesOfIncident[0] != null) {

      incidentTypeString = _.map(payload.typesOfIncident, 'text').join('~ ');
      //postDataType.query.bool.must.query_string.query = (incidentTypeString);
      // postDataType.query.bool.must.query_string.query = (incidentTypeString);
      postDataType.query.bool.must = {
        "query_string": {
          "query": incidentTypeString
        }
      };
      //  console.log("1B:", incidentTypeString);

    } else {
      // BOTH Values are null or undefined
      //Returns an empty saerch result from Elasticsearch
      //   console.log("1A:");
    }
      console.log("TO ES: postDataType: ", postDataType);
    return this.http.post(this.url, postDataType, headers)
      .map(res => res.json())
      .do(res => {
        console.log("from elasticsearch: ", res)
      })
      .do(incident => this.subject.next(incident));
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
    // console.log("incident Service: send Message");
    this.subjectfromMap2Table.next(message);
  }

  clearMessageFromMap2Table() {
    this.subjectfromMap2Table.next();
  }

  getMessageFromMap2Table(): Observable<any> {
    return this.subjectfromMap2Table.asObservable();
  }
  sendMessagefromTable2Map4Reports(id: any) {
    this.subjectfromMap2Table4Reports.next(id);
  }

  getMessagefromTable2Map4Reports(): Observable<any> {
    return this.subjectfromMap2Table4Reports.asObservable();
  }

  /*===================================================*/
  /*Input of search field*/
  sendMessageInputSearch(message: any): void {
    // console.log("IncidentService:sendMessageInputSearch", message);
    this.searchTerm = message;
    ///  this.subjectfromTable2Map.next(message);
  }

  /*===================================================*/
  /* Input of start and end Date*/
  sendMessageStartEndDate(startDate: number, endDate: number) {

    this.dateObject = {
      "startDate": null,
      "endDate": null
    };

    console.log("startDate", startDate);
    console.log("endDate", endDate);
    this.startDate = startDate;
    this.endDate = endDate;
    if ((startDate != null || startDate != 0) && (endDate != null || endDate != 0)) {
      this.dateObject.startDate = startDate;
      this.dateObject.endDate = endDate;

    }

    /*this.dateObject.push({
     "startDate": startDate,
     "endDate": endDate
     });*/
  }

  /*===================================================*/
  /*Communication from table to linechart*/
  sendMessageFromTable2lineChart(hit: any): Observable<any> {
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
                "interval": "day"
              }
            }
          }
        }
      }
    };

    return this.http.post(this.url, postDataLinechart, headers)
      .map(res => res.json())
      .do(res => {
      })
      .do(res => {
        // console.log("POST for Linechart ", res)
      })
      .do(incident => this.subjectfromTable2LineChart.next(incident));
  }

  getMessageFromTable2LineChart(): Observable<any> {
    return this.subjectfromTable2LineChart.asObservable();
  }

  onInitGetTypesOfIncident(postDataTypes) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.url, postDataTypes, headers)
      .map(res => res.json())
      .do(res => {
      })
      .do(res => {
        //  console.log("POST for ONINIT TYPES ", res)
      })
      .do(incident => this.subjectOnInitTypesOfIncident.next(incident));
  }

}
