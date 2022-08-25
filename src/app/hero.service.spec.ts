import { HttpClientModule } from '@angular/common/http';
import { MessageService } from './message.service';
import { HeroService } from './hero.service';
import { TestBed } from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing"

describe('HeroService', () => {
  let mockMessageService;
  //controller necessario per gestire il mock HttpClient
  let httpTestingController: HttpTestingController;

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
    //per gestire il controller facciamo come con fixture ma invece di create component usiamo inject, un metodo speciale del testbed che in pratica accede al dependency injection registry
    //quindi se lo gli do il tipo HttpTestingController, cercherà nel dependency injection registry questo modulo del testbed e troverà il service correlato per poterelo egstire
    httpTestingController = TestBed.inject(HttpTestingController);

    //per gestire l'HeroService (per esempio) in questo modo
    let heroSrv = TestBed.inject(HeroService);
  })
})
