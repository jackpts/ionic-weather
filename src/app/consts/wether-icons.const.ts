import { WeatherEvents } from '../enums';

export const WEATHER_ICONS: { [key in WeatherEvents]: string } = {
  [WeatherEvents.Clear]: '../../assets/icons/clear.png',
  [WeatherEvents.Cloudy]: '../../assets/icons/cloudy.png',
  [WeatherEvents.Fog]: '../../assets/icons/cloudy.png',
  [WeatherEvents.PartlyCloudy]: '../../assets/icons/partly-cloudy.png',
  [WeatherEvents.PartlyCloudy2]: '../../assets/icons/partly-cloudy.png',
  [WeatherEvents.LongRainfall]: '../../assets/icons/long-rainfall.png',
  [WeatherEvents.ShortTermPrecipitation]: '../../assets/icons/short-term-precipitation.png',
  [WeatherEvents.RainfallAtTimes]: '../../assets/icons/rainfall-at-times.png',
  [WeatherEvents.Thunderstorm]: '../../assets/icons/thunderstorm.png',
};
