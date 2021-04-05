import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchFilter } from './app.models';

@Injectable()
export class AppService {
    constructor(private http: HttpClient) { }

    private baseUrl = "http://localhost:4200/api/json/mattilsynet/smilefjes/tilsyn?";

    getRestaurants(filter: SearchFilter, page: number = 1) {
        return this.http.get(this.baseUrl + filter.getQueryString() + `page=${page}`);
    }
}