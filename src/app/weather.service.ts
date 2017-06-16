import { Injectable } from '@angular/core';
import { Jsonp, Http, Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { cityIds } from './majorCityIds';
@Injectable()
export class WeatherService {

	constructor(
		private http: Http,
		private jsonp: Jsonp
	) { }

	getWeather(latitude, longitude): Observable<any> {
		// openweathermap API https://openweathermap.org/current
		let url = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather';
		let params = new URLSearchParams();
		params.set('appid', '65f8e732df4b70351096a4d8ed83ada0');
		params.set('format', 'json');
		params.set('callback', 'JSONP_CALLBACK');

		if (latitude === -1 && longitude === -1) {
			let randomCityId = cityIds[Math.floor(Math.random() * cityIds.length)];
			params.set('id', randomCityId);
		} else {
			params.set('lat', latitude);
			params.set('lon', longitude);
		}

		return this.jsonp
			.get(url, {search: params})
			.map(response => <string[]> response.json());

		// darksky API https://darksky.net/dev/docs
		// let url = 'https://api.darksky.net/forecast/c0e15da8e5f928c36b1674f211f98f0e';
		// let params = new URLSearchParams();
		// params.set('format', 'json');
		// params.set('callback', 'JSONP_CALLBACK');

		// return this.jsonp
		// 	.get(`${url}/${latitude},${longitude}`, {search: params})
		// 	.map(response => <string[]> response.json());
	}

	// private extractData(res: Response): object {
	// 	let body = res.json()[1];
	// 	return body || {};
	// }
}
