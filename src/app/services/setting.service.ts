import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISettings, SettingsGet } from '../models/settings';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private http: HttpClient) { }

  getSettings(): Observable<ISettings> {
    return this.http.get<ISettings>('http://localhost:3000/settings');
  }

  updateSettings(settings: ISettings): Observable<ISettings> {
    const queryString = 'https://my-json-server.typicode.com/liliia2/typicode_db/settings';
    const data = JSON.stringify(settings);

    return this.http.post<any>(queryString, data).pipe(map((response) => {
      console.log('response', response);
      return response.data as ISettings;
    }));
    
  }

}
