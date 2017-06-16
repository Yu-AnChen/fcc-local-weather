import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	providers: [WeatherService]
})
export class AppComponent implements OnInit {
	title = 'Weather';
	weatherOverView;
	keysOfWeatherOverView;
	geolocaltionErrMsg;
	isGettingGeo;
	statusMsg;
	actionDelayed = 4000;

	constructor(private weatherService: WeatherService) { }

	ngOnInit() {
		this.getLocation();
		// this.statusMsg = 'Fetching Current Geolocation';
		// this.geolocaltionErrMsg = 'Geolocation is not supported by this browser.';
	}

	getLocation() {
		this.isGettingGeo = true;
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
			return setTimeout(() =>
				this._getWeatherAndSubscribe(-1, -1),
				this.actionDelayed);
		}
	}

	getWeatherWithCurrentPosition(position) {
		console.log('getting geolocaion');
		console.log(position);
		return this._getWeatherAndSubscribe(position.coords.latitude, position.coords.longitude);
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
		return this._getWeatherAndSubscribe(-1, -1);
	}

	_getWeatherAndSubscribe(lat, lon) {
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
					this.keysOfWeatherOverView = Object.keys(data);
				}, this.actionDelayed);
			});
	}

}
