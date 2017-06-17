import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
	title = 'Weather';
	weatherOverView;
	keysOfWeatherOverView;
	geolocaltionErrMsg;
	isGettingGeo;
	statusMsg;
	actionDelayed = 2000;
	geoposition;
	refreshAnimation;

	constructor(private weatherService: WeatherService) { }

	ngOnInit() {
		this.getLocation();
		// this.statusMsg = 'Fetching Current Geolocation';
		// this.geolocaltionErrMsg = 'Geolocation is not supported by this browser.';
	}

	getLocation() {
		this.isGettingGeo = true;
		this.refreshAnimation = 'spin';
		this.statusMsg = 'Fetching Current Geolocation';
		if (navigator.geolocation) {
			return setTimeout(() =>
				navigator.geolocation
					.getCurrentPosition(
					position => this.getWeatherWithCurrentPosition(position),
					error => this.getGeolocationError(error)
					), this.actionDelayed);
		} else {
			this.geolocaltionErrMsg = 'Geolocation is not supported by this browser.';
			console.info(this.geolocaltionErrMsg);
			return setTimeout(() => {
				this.geoposition = [-1, -1];
				this._getWeatherAndSubscribe(this.geoposition);
			}
				,
				this.actionDelayed);
		}
	}

	getWeatherWithCurrentPosition(position) {
		console.log('getting geolocaion');
		console.log(position);
		this.geoposition = [position.coords.latitude, position.coords.longitude];
		return this._getWeatherAndSubscribe(this.geoposition);
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
		console.info(this.geolocaltionErrMsg);
		this.geoposition = [-1, -1];
		return this._getWeatherAndSubscribe(this.geoposition);
	}

	refresh() {
		if (!this.weatherOverView) return;
		return this._getWeatherAndSubscribe(this.geoposition);

	}
	_getWeatherAndSubscribe([lat, lon]) {
		this.weatherOverView = null;
		this.isGettingGeo = false;
		this.refreshAnimation = 'spin';
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
					this.keysOfWeatherOverView = Object.keys(data);
					this.refreshAnimation = '';
				}, this.actionDelayed);
			});
	}

}
