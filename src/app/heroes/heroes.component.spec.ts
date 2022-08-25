import { HeroComponent } from './../hero/hero.component';
import { By } from '@angular/platform-browser';
import { HeroService } from './../hero.service';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { HeroesComponent } from './../heroes/heroes.component';
import { Hero } from '../hero';

describe('HeroesComponent', () => {
  //definisco variabile pr il component
  let component: HeroesComponent
  let herosMock;
  let mockHeroService;

  beforeEach(() =>{
    herosMock = [
      {id: 1, name: 'Spiderman', strenght: 8},
      {id: 2, name: 'Wonderwoman', strenght: 24},
      {id: 3, name: 'Superman', strenght: 55}
    ];

    //cosi' jasmine crea un oggetto che ha questi tre metodi
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])

    component = new HeroesComponent(mockHeroService)
  })

  describe('delete', () => {

    //state-based test, abbiamo controllato che loi state del component sia cambiato
    it('it should remove the indicated hero from the hero list', () => {
      mockHeroService.deleteHero.and.returnValue(of(true))

      component.heroes = herosMock;

      let heroToDelete = herosMock[2];

      component.delete(heroToDelete);

      expect(component.heroes.includes(heroToDelete)).toBeFalsy();
    });

    //interaction test
    it('should call deleteHero', () => {
      mockHeroService.deleteHero.and.returnValue(of(true))

      component.heroes = herosMock;

      let heroToDelete = herosMock[2];

      component.delete(heroToDelete);

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroToDelete);
    });
  })
})

// SHALLOW TESTS
describe('HeroesComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;

  let herosMock;
  let mockHeroService;

  @Component({
    selector: 'app-hero',
    template: '<div></div>',
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
    // @Output() delete = new EventEmitter();
  }

  beforeEach(() => {
    herosMock = [
      {id: 1, name: 'Spiderman', strenght: 8},
      {id: 2, name: 'Wonderwoman', strenght: 24},
      {id: 3, name: 'Superman', strenght: 55}
    ];
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        FakeHeroComponent
      ],
      providers: [
        {provide: HeroService, useValue: mockHeroService}
      ]
    });

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should set heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(herosMock));

    //per far partire l'ngOnInit dobbiamo far partire il detectChanges
    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toBe(3);
  });

  it('should create one li for each hero', () => {

    mockHeroService.getHeroes.and.returnValue(of(herosMock));

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
  })
});

//depp integration test
describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;

  let herosMock;
  let mockHeroService;

  beforeEach(() => {
    herosMock = [
      {id: 1, name: 'Spiderman', strenght: 8},
      {id: 2, name: 'Wonderwoman', strenght: 24},
      {id: 3, name: 'Superman', strenght: 55}
    ];
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent
      ],
      providers: [
        {provide: HeroService, useValue: mockHeroService}
      ],
      //schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(HeroesComponent);

  });

  it('should render each hero as a HeroComponent', () => {

    mockHeroService.getHeroes.and.returnValue(of(herosMock));

    //run ngOnInit
    fixture.detectChanges();

    fixture.debugElement.queryAll(By.directive)
  })
});
