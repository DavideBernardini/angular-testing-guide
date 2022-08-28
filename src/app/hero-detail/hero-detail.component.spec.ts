import { FormsModule } from '@angular/forms';
import { ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
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
      snapshot: { paramMap: { get: () => '3' } }
    };
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);


    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation }
      ]
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'torpedine', strength: 100 }));
  });

  //controlliamo che l'hero name sia renderizzato correttamente, controlliamo il rendering iniziale
  it('should render the hero name in h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('TORPEDINE');
  });

  ////////////////////////////
  ///////async test//////////
  //////////////////////////
  // utilizzo la fake async function, in pratica wrappo la callback del test con una chiamata fakeAsync in modo da trattare il nostro codice asincrono come sincrono e controlla il clock mentre il test runna. "asyncZone"
  it('should call updateHero when save is called', fakeAsync(() => {
    //dobbiamo dire all'heroService di ritornare un observable
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    // chiamo il metodo save
    fixture.componentInstance.save();

    tick(250);

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));
});
