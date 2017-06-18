import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from './weather.service';

import { Subscription } from 'rxjs/Subscription';
import { style, state, animate, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	providers: [WeatherService],
	animations: [
		trigger('fadeInOut', [
			state('in', style({ opacity: 1 })),
			transition('void => *', [
				style({ opacity: 0 }),
				animate(1500)
			]),
			transition('* => void', [
				animate(0, style({ opacity: 0 }))
			])
		])
	]
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'Weather';
	actionDelayed = 2000;
	weatherOverView;
	statusMsg: string;
	geolocaltionErrMsg: string;
	isGettingGeo: boolean;
	latLonArr;
	isRefreshing: boolean;
	subscription: Subscription;

	constructor(private weatherService: WeatherService) { }

	ngOnInit() {
		this.getLocation();
	}

	getLocation() {
		this.isGettingGeo = true;
		this.isRefreshing = true;
		this.statusMsg = 'Fetching Current Geolocation';

		if (!navigator.geolocation) {
			this.geolocaltionErrMsg = 'Geolocation is not supported by this browser.';
			return setTimeout(() => {
				this.latLonArr = [-1, -1];
				this._getWeatherAndSubscribe(this.latLonArr);
			}, this.actionDelayed);
		}
		return setTimeout(() =>
			navigator.geolocation
				.getCurrentPosition(
				position => this.getWeatherWithCurrentPosition(position),
				error => this.getGeolocationError(error)
				),
			this.actionDelayed
		);
	}

	getWeatherWithCurrentPosition(position) {
		this.latLonArr = [position.coords.latitude, position.coords.longitude];
		return this._getWeatherAndSubscribe(this.latLonArr);
	}

	getGeolocationError(error) {
		let msg: string;
		switch (error.code) {
			case error.PERMISSION_DENIED:
				msg = 'User denied the request for Geolocation.';
				break;
			case error.POSITION_UNAVAILABLE:
				msg = 'Location information is unavailable.';
				break;
			case error.TIMEOUT:
				msg = 'The request to get user location timed out.';
				break;
			case error.UNKNOWN_ERROR:
				msg = 'An unknown error occurred.';
				break;
		}
		this.geolocaltionErrMsg = msg;
		this.latLonArr = [-1, -1];
		return this._getWeatherAndSubscribe(this.latLonArr);
	}

	refresh() {
		if (!this.weatherOverView) return;
		this.isRefreshing = true;
		return this._getWeatherAndSubscribe(this.latLonArr);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	_getWeatherAndSubscribe([lat, lon]) {
		this.weatherOverView = null;
		this.isGettingGeo = false;

		let randomCityText = '';
		if (lat === -1 && lon === -1) {
			randomCityText = ' of A Major Random City';
		}
		this.statusMsg = `Fetching Current Weather${randomCityText}`;

		return this.weatherService.getWeather(lat, lon)
			.subscribe(data => {
				console.log(data);
				setTimeout(() => {
					this.weatherOverView = data;
					this.isRefreshing = false;
				}, this.actionDelayed);
			});
	}

}
