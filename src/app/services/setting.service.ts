import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISettings, SettingsGet } from '../models/settings';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  key = '$2b$10$IvNEJpkMEyo3Zat95ohKdem5ykpjDaE523MDuAuQUN3aeW0QtuagS';

  constructor(private http: HttpClient) { }

  getSettings(): Observable<SettingsGet> {
    const headers = new HttpHeaders().set('secret-key', this.key);
    return this.http.get<SettingsGet>(
      'https://api.jsonbin.io/b/5e9476a0e41a7f4da62c6f50/latest',
      { headers }
    );
  }

  updateSettings(settings: ISettings): Observable<SettingsGet> {
    const data = JSON.stringify(settings);
    const headers = new HttpHeaders().set('secret-key', this.key);
    headers.set('Content-Type', 'application/json');
    return this.http.put<any>(
      'https://api.jsonbin.io/b/5e9476a0e41a7f4da62c6f50',
      { data },
      { headers }
    ).pipe(map((response) => {
        return response.data as SettingsGet;
      }));
  }

}
