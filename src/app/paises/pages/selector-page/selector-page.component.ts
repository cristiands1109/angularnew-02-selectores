import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServicesService } from '../../services/paises-services.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { map, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  //llenar selectores

  regiones: string [] = [];
  paises: PaisSmall [] = [];
  // fronteras: string [] = [];
  fronteras: PaisSmall [] = [];

  //
  cargando: boolean = false;
  constructor(private fb: FormBuilder,
              private paisService: PaisesServicesService) { }

  ngOnInit(): void {
    this.regiones = this.paisService.regiones

    //cuando cambie la region

    this.miFormulario.get('region')?.valueChanges // nos subcribimos al cambio de valor del swich regiones para poder obtener los paises acorde a las region seleccionada
    .pipe(
      tap(  () => {
            this.miFormulario.get('pais')?.reset('') // purgamos el switch paises en caso de que haya un cambio en la region
            this.cargando = true;
      }),
      switchMap(region => this.paisService.getPaisesPorRegion(region)) // hacemos el llamado a la funcion para obtener los paises
    )
    .subscribe(paises => {  // nos suncribimos para poder llenar el arreglo de paises con los resultados obtenidos
      this.paises = paises
      this.cargando = false
      console.log('paises', paises);
    })


    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this.paisService.getPaisPorCodigo( codigo ) ),
        switchMap( pais => this.paisService.getPaisesPorCodigos( pais?.borders! ) )
      )
      .subscribe( paises => {
        // this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        this.cargando = false;
      })

    
    
    
    // .subscribe(pais => {
    //   console.log(pais);
    // })
    // this.miFormulario.get('pais')?.valueChanges
    // .pipe(
    //   switchMap(pais => this.paisService.getPaisPorCodigo(pais.alpha3Code))
    // )
    // .subscribe(frontera => {
    //   this.fronteras = frontera
    //   console.log(this.fronteras);
    // })
  }

  guardar() {
    console.log(this.miFormulario.value, 'guardado');
  }
}
