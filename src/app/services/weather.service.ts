import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InputData, WeatherData, WeatherStation } from '../models';
import { map, tap } from 'rxjs/operators';
import { MapTo } from '../decorators';
import { WeekDay } from '../enums';

const weekDaysMap: { [key in number]: WeekDay } = {
  12: WeekDay.Mon,
  36: WeekDay.Tue,
  60: WeekDay.Wed,
  84: WeekDay.Thu,
  108: WeekDay.Fri,
  132: WeekDay.Sat,
  156: WeekDay.Sun,
};

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient,
  ) { }

  @MapTo(WeatherStation)
  getWeatherStation(id: number = 26851): Observable<WeatherStation> {
    const queryString = `https://pogoda.by/api/v2/meteo-stations/city/${id}`;

    return this.http.get<WeatherStation[]>(queryString).pipe(
      map((result: WeatherStation[]) => (Array.isArray(result) ? result[0] : result))
    );
  }

  // @MapTo(WeatherData)
  getWeatherData(): Observable<WeatherData> {
    const queryString = 'https://pogoda.by/api/v2/numeric-weather/6/26851/3';

    return this.http.get<WeatherData>(queryString).pipe(
      tap((res) => {
        console.log('serv res obj.val[0]=', Object.values(res)[0]);
      }),
      map((result) => Object.values(result)[0]),
      map((result) => this.mapHoursObject(result)),
    );
  }

  private mapHoursObject(weatherObject: InputData): WeatherData {
    const weatherData: WeatherData = {
      precipitations: [],
      tmpMins: [],
      tmpMaxs: [],
      weatherTypes: [],
      weekDays: [],
    };

    for(let i = 12; i <= 156; i+=24) {
      weatherData.precipitations.push(weatherObject[i].PRECIP);
      weatherData.tmpMins.push(weatherObject[i].TMP);
      weatherData.tmpMaxs.push(i+12 in weatherObject ? weatherObject[i+12].TMP : weatherObject[i].TMP);
      weatherData.weatherTypes.push(weatherObject[i].TypeWeather);
      weatherData.weekDays.push(i in weekDaysMap ? weekDaysMap[i] : null);
    }

    return weatherData;
  }
}
