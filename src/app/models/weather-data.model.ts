import { Expose, plainToInstance, Transform } from 'class-transformer';
import { WeekDay } from '../enums';

export interface InputDataItem {
  PRECIP: number;
  ADVANCE_TIME: number;
  TMP: number;
  TMP_MIN: number;
  TMP_MAX: number;
  PRESSURE_MIN: number;
  PRESSURE_MAX: number;
  WINDSP_MIN: number;
  WINDSP_MAX: number;
  TypeWeather: string;
  WINDSP: number;
}

export interface InputData {
  // @ts-ignore
  [key]: InputDataItem;
}

export class WeatherData {
  precipitations: number[];
  tmps: number[];
  tmpMins: number[];
  tmpMaxs: number[];
  weatherTypes: string[];
  weatherEventIcons: string[];
  weekDays: WeekDay[];
  startDay: WeekDay;
  wind: number[];
}
