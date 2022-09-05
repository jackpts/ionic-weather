import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InputData, InputDataItem, WeatherData, WeatherStation } from '../models';
import { map, tap } from 'rxjs/operators';
import { MapTo } from '../decorators';
import { WEATHER_ICONS, WEEK_DAYS } from '../consts';
import { WeekDay } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private currentDay: WeekDay = WeekDay.Mon;

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

  // British Oxford id=517987
  // Belarus Minsk id=26851
  getWeatherData(id: number = 26851): Observable<WeatherData> {
    const queryString = `https://pogoda.by/api/v2/numeric-weather/2/${id}`;

    return this.http.get<WeatherData>(queryString).pipe(
      tap((result: InputData) => {
        const byKeyStartValue = (day: WeekDay): RegExpMatchArray => day.match(Object.keys(result)[0].substring(0, 2));
        const weekDayFromAPI: WeekDay = Object.values(WeekDay).find(byKeyStartValue);

        if (weekDayFromAPI) {
          this.currentDay = weekDayFromAPI;
        }
      }),
      map((result: InputData) => Object.values(result)[0]),
      map((result: InputDataItem) => this.mapHoursObject(Object.values(result))),
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
      startDay: this.currentDay,
      wind: [],
    };
    const hoursMultiplier: number = weatherObject.length / WEEK_DAYS.length;

    for(let i = 0; i <= weatherObject.length; i+=hoursMultiplier) {
      if (weatherObject[i]) {
        weatherData.precipitations.push(weatherObject[i].PRECIP);
        weatherData.tmps.push(weatherObject[i].TMP);
        weatherData.tmpMins.push(weatherObject[i].TMP_MIN);
        weatherData.wind.push(weatherObject[i].WINDSP);

        const weatherType: string = weatherObject[i].TypeWeather;
        weatherData.weatherTypes.push(weatherType);
        if (weatherType in WEATHER_ICONS) {
          weatherData.weatherEventIcons.push(WEATHER_ICONS[weatherType]);
        }
      }
      if (i % hoursMultiplier === 0) {
        weatherData.weekDays.push(this.getDayOfWeekByShiftNumber(i/hoursMultiplier));
      }
      if (i+1 in weatherObject) {
        weatherData.tmpMaxs.push(weatherObject[i+1].TMP_MAX);
      } else if (i in weatherObject) {
        weatherData.tmpMaxs.push(weatherObject[i].TMP_MAX);
      }
    }

    return weatherData;
  }

  private getDayOfWeekByShiftNumber(shiftNumber: number): WeekDay {
    const currentDayPos: number = WEEK_DAYS.indexOf(this.currentDay);
    const doubleWeekDaysArray: WeekDay[] = [...WEEK_DAYS, ...WEEK_DAYS];

    return doubleWeekDaysArray[currentDayPos + shiftNumber];
  }
}
