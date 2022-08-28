import { FormsModule } from '@angular/forms';
import { ComponentFixture } from '@angular/core/testing';
import { HeroService } from './../hero.service';
import { ActivatedRoute } from '@angular/router';
import { HeroDetailComponent } from './hero-detail.component';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { of } from 'rxjs';

describe('HeroDetailComponent', () => {

  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute, mockHeroService, mockLocation;

  beforeEach(() => {
    //in questo caso è più semplice creare un mock a mano
    mockActivatedRoute = {
      snapshot: {paramMap: {get: () => '3'}}
    };
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);


    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: HeroService, useValue: mockHeroService},
        {provide: Location, useValue: mockLocation}
      ]
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(of({id:3, name: 'torpedine', strength: 100}));
  });

  //controlliamo che l'hero name sia renderizzato correttamente, controlliamo il rendering iniziale
  it('should render the hero name in h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('TORPEDINE');
  });
});
