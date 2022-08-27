import { HttpClientModule } from '@angular/common/http';
import { MessageService } from './message.service';
import { HeroService } from './hero.service';
import { TestBed } from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing"
import { inject } from '@angular/core/testing';

describe('HeroService', () => {
  let mockMessageService;
  //controller necessario per gestire il mock HttpClient
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add'])

    TestBed.configureTestingModule({
      // angular fornisce un mock HttpClient
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        {
          provide: MessageService,
          useValue: mockMessageService
        }
      ]
    });
    //per gestire il controller facciamo come con fixture ma invece di createcomponent usiamo inject, un metodo speciale del testbed che in pratica accede al dependency injection registry
    //quindi se lo gli do il tipo HttpTestingController, cercherà nel dependency injection registry questo modulo del testbed e troverà il service correlato per poterelo egstire
    httpTestingController = TestBed.inject(HttpTestingController);
    //per gestire l'HeroService (per esempio) in questo modo
    service = TestBed.inject(HeroService);
  });

  describe('getHero', () => {

    // invece di una empty function uso inject che prende due parametri, un array e una callbnack
    it('should call get with the correct URL', () => {
      //call getHero() e passo un parametro per l'id e faccio il subscribe visto che ritorna un observable e quindi per far partire la chiamata
      service.getHero(4).subscribe(hero => {
        //expect(hero.id).toEqual(4);
      });

      //test that URL was correct
      // diciamo al testing controler che ci dovrà essere una GET request e vogliamo che si aspetti che avvenga. Per questo usiamo expectOne() che accetta come un url come parametro e si aspetta che corrisponda a quello della chiamata e ritorna un mock
      const req = httpTestingController.expectOne('api/heroes/4');

      // chiamo flush che è un metodo che ci fa decidere quali dati ritornare quando la chiamata è fatta
      req.flush({id: 4, name: 'spiderman', strength: 55});

      // in questo caso invece di expect chiamiamo il metodo dell'httpTestingController .verify per verificare che solo le richieste che ci aspettiamo e non altre siano fatte
      httpTestingController.verify();

      //questo può essere un modo per ovviare al fatto che non c'era un expect e che karma desse un warning(ma in realtà verify() era già tutto ciò di cui avevamo bisogno)
      expect(req.request.method).toBe('GET')
    });
  });
})
