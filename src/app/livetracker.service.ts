import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LivetrackerService {

  constructor(private _http: HttpClient) {  }


  getAllDatesLiveData() {
    return this._http.get('../assets/mock/compfareavgdata.json')
              .map(result => result);
  }

  getDepartureFullData() {
    return this._http.get('../assets/mock/compfarefulldetails.json')
              .map(result => result);
  }

  getDepartureHistoryAndForecastData() {
    return this._http.get('../assets/mock/farehistoryandforecast.json')
              .map(result => result);
  }

}
