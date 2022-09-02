import { Expose, Transform } from 'class-transformer';

export class WeatherStation {
  private static readonly cityDetailSplitter = '-';

  @Expose({ name: 'NAME_ST' })
  // eslint-disable-next-line max-len
  @Transform(({ value }) =>
    // transform `Минск-Независимости` --> `Минск`
    value.includes(WeatherStation.cityDetailSplitter) ? value.split(WeatherStation.cityDetailSplitter)[0] : value, { toClassOnly: true })
  city: string;

  @Expose({ name: 'ID_STATION' })
  id: string;

  timezone: number;
}
