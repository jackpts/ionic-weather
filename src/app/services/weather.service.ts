import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InputData, InputDataItem, WeatherData, WeatherStation } from '../models';
import { map, tap } from 'rxjs/operators';
import { MapTo } from '../decorators';
import { WEEK_DAYS, WEATHER_ICONS } from '../consts';

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

  // British Oxford id=517987, timezone=1
  // Belarus Minsk id=26851, timezone=3
  getWeatherData(id: number = 26851, timezone: number = 3): Observable<WeatherData> {
    const queryString = `https://pogoda.by/api/v2/numeric-weather/6/${id}/${timezone}`;

    return this.http.get<WeatherData>(queryString).pipe(
      map((result) => Object.values(result)[0]),
      map((result) => this.mapHoursObject(Object.values(result))),
    );
  }

  private mapHoursObject(weatherObject: InputDataItem[]): WeatherData {
    const weatherData: WeatherData = {
      precipitations: [],
      tmps: [],
      tmpMins: [],
      tmpMaxs: [],
      weatherTypes: [],
      weatherEventIcons: [],
      weekDays: [],
    };

    for(let i = 0; i <= weatherObject.length; i+=4) {
      if (weatherObject[i]) {
        weatherData.precipitations.push(weatherObject[i].PRECIP);
        weatherData.tmps.push(weatherObject[i].TMP);
        weatherData.tmpMins.push(weatherObject[i].TMP_MIN);

        const weatherType: string = weatherObject[i].TypeWeather;
        weatherData.weatherTypes.push(weatherType);
        if (weatherType in WEATHER_ICONS) {
          weatherData.weatherEventIcons.push(WEATHER_ICONS[weatherType]);
        }
      }
      if (i % 4 === 0) {
        weatherData.weekDays.push(WEEK_DAYS[i / 4]);
      }
      if (i+1 in weatherObject) {
        weatherData.tmpMaxs.push(weatherObject[i+1].TMP_MAX);
      } else if (i in weatherObject) {
        weatherData.tmpMaxs.push(weatherObject[i].TMP_MAX);
      }
    }

    return weatherData;
  }
}
