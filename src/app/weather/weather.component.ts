import { Component, OnInit, Input } from '@angular/core';

import { iconRef } from './weatherIcon';

@Component({
	selector: 'app-weather',
	// templateUrl: './weather.component.html',
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.sass']
})
export class WeatherComponent implements OnInit {
	@Input() weather;
	tempUnitCelsius = false;
	temp;
	ref = iconRef;

	constructor() { }

	ngOnInit() {
		this.setTemperature(this.tempUnitCelsius);
		this.setBgImg();
	}

	setBgImg() {
		let dayOrNight =
			this.weather.dt > this.weather.sys.sunrise &&
			this.weather.dt < this.weather.sys.sunset ?
			'day' : 'night';
		let icon;
		let weatherCode = this.weather.weather[0].id.toString();
		if (weatherCode === '800') {
			icon = this.ref['800'];
		} else {
			icon = this.ref[weatherCode[0]];
		}
		return `${window.location.href}assets/img/${dayOrNight}/${icon}.png`;
	}

	setTemperature(isInCelsius: boolean) {
		let tempK = this.weather.main.temp;
		let tempF = (tempK - 273.15) * 9 / 5 + 32;
		if (!isInCelsius) {
			return this.temp = Math.round(tempF);
		}
		return this.temp = Math.round(tempK - 273.15);
	}

	toggleTempUnit() {
		this.tempUnitCelsius = !this.tempUnitCelsius;
		return this.setTemperature(this.tempUnitCelsius);
	}

}
