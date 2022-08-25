import { HeroComponent } from './hero.component';
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroComponent (shallow test)', () => {

  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    // il TestBed e' una utility che ci permette di testare sia un componente sia il suo template. Creiamo in pratica un modulo speciale solo per il fine dl test
    // configureTestingModule prende un parametro che e' un oggetto che corrisponde nel layout ad app.module, ma a noi ci interessa solo la sezione declaration e in determinate circostanze di providers
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA]
      // questo l'ho aggiunto perche' nel template c'e' un router link non importato, meglio non usarlo perche' potrebbe nascondere errori utili
    });

    // creato il modulo possiamo creare il componente con createComponent passando come argomento il tipo del componente che andremo a creare. Usando questa funzione diciamo al testbed di usare il modulo creato precedentemente

    // il createComponent ritorna un ComponentFixture, un wrapper per il component usato per testare che ha delle proprieta' in piu'.
    //Percio' settiamo la varibile fixture uguale al risultato di TestBed.createComponent

    fixture = TestBed.createComponent(HeroComponent);

    // avendo la fixture possiamo accedere a diverse cose che riguardano il component, come l'instanza stessa del componet => fixture.componentInstance
  });

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = {
      id: 1,
      name: 'superman',
      strength: 50
    };

    expect(fixture.componentInstance.hero.name).toEqual('superman');
  });

  it('should render the hero name in an ancvhor tag', () => {
    fixture.componentInstance.hero = {
      id: 1,
      name: 'superman',
      strength: 50
    };

    //finche' non si va partire la ricerca dei cambiamenti non avviene il binding della proprieta' del template
    fixture.detectChanges();

    //nativeElement si aggancia all'elemento del dom che contiene il template
    expect(fixture.nativeElement.querySelector('a').textContent).toContain('superman');

    //versione con debugElement, ma perchè? Perchè come fixture è un wrapper che aggiunge ulteriori attività che potrebbero essere utili
    // let deA = fixture.debugElement.query(By.css('a'));
    // expect(deA.nativeElement.querySelector('a').textContent).toContain('superman');
  })
})
