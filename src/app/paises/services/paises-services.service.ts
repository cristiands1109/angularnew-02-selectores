import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServicesService {

  private _baseURL: string = 'https://restcountries.eu/rest/v2'
  private _regiones: string [] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']


  get regiones (): string [] {
    return [...this._regiones];
  }
  constructor( private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {

    return this.http.get<PaisSmall[]>(`${this._baseURL}/region/${region}?fields=alpha3Code;name`)

  }

  getPaisPorCodigo(codigo: string): Observable<Pais | null> {

    if (!codigo) {
      return of(null);
    }
    return this.http.get<Pais>(`${this._baseURL}/alpha/${codigo}`);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall | null> {


    return this.http.get<PaisSmall>(`${this._baseURL}/alpha/${codigo}?fields=alpha3Code;name`);
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {

    if ( !borders ) {
      return of([]);
    }

    const peticiones: Observable<any>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );

  }
}
