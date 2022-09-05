import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { WeatherData, WeatherStation } from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class HomePage implements OnInit {
  public city$: Observable<string>;
  public weatherData$: Observable<WeatherData>;

  constructor(
    private readonly weatherAPI: WeatherService,
  ) {}

  ngOnInit(): void {
    this.getCity();
    this.getWeatherData();
  }

  doRefresh(event): void {
    this.getWeatherData();
    this.weatherData$.subscribe(() => event.target.complete());
  }

  private getCity(): void {
    this.city$ = this.weatherAPI.getWeatherStation().pipe(
      map((weatherStation: WeatherStation) => weatherStation.city),
      shareReplay(1),
    );
  }

  private getWeatherData(): void {
    this.weatherData$ = this.weatherAPI.getWeatherData();
  }
}
