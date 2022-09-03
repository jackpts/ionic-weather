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

  private res;

  constructor(
    private readonly weatherAPI: WeatherService,
  ) {}

  public ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData() {
    this.city$ = this.weatherAPI.getWeatherStation().pipe(
      map((weatherStation: WeatherStation) => weatherStation.city),
      shareReplay(1),
    );

    this.weatherAPI.getWeatherData().subscribe((response: WeatherData) => {
      this.res = response;
      console.log('resp=', this.res);
    });
    this.weatherData$ = this.weatherAPI.getWeatherData();
  }

}
