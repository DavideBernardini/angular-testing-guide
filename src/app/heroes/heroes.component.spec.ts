import { HeroComponent } from './../hero/hero.component';
import { By } from '@angular/platform-browser';
import { HeroService } from './../hero.service';
import { Component, Directive, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { HeroesComponent } from './../heroes/heroes.component';
import { Hero } from '../hero';

// creo una finta rauterLink directive per rimanere in ascolto del router link
@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

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

  // mock del child component
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
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        {provide: HeroService, useValue: mockHeroService}
      ]
    });

    fixture = TestBed.createComponent(HeroesComponent);

  });

  it('should render each hero as a HeroComponent', () => {

    mockHeroService.getHeroes.and.returnValue(of(herosMock));

    //run ngOnInit
    fixture.detectChanges();

    // in angular un componente é una sottoclasse di una directive, un tipo più specializzato di directive
    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));

    for(let i = 0; i < heroComponentDEs.length; i++)
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(herosMock[i]);
  });

  //in questo caso abbiamo triggerato un evento tramite l'elemento html
  it(`should call heroService.deleteHero when the Hero Components delete button is called (html)`, () => {

    //con spyOn diciamo a jasmine di trovare il metodo delete nel nostro HeroComponent e controllarlo, se viene chiamato
    spyOn(fixture.componentInstance, 'delete');

    mockHeroService.getHeroes.and.returnValue(of(herosMock));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    ////con trigerEventHandler indichiamo l'evento da triggerare e l'oggetto che va ritornato.
    //In questo caso vogliamo che abbia un metodo stopPropagation, può anche esere un metodo vuoto tanto vogliamo solo che sia chiamato
    heroComponents[0].query(By.css('button'))
      .triggerEventHandler('click', {stopPropagation : () => {}});

    //questa può essere una versione stringata ma che testa meno
    heroComponents[0].triggerEventHandler('delete', undefined);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(herosMock[0]);
  });

  //rispetto al precedente test in questa versione possiamo dire al child component di attivare il delete() senza triggerarlo tramite l'html
  it(`should call heroService.deleteHero when the Hero Components delete button is called (only method)`, () => {

    //con spyOn diciamo a jasmine di trovare il metodo delete nel nostro HeroComponent e controllarlo, se viene chiamato
    spyOn(fixture.componentInstance, 'delete');

    mockHeroService.getHeroes.and.returnValue(of(herosMock));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    //heroComponents è un array di elementi per debuggare, prendiamo il primo, lo tipizziamo come HeroComponent e con componentInstance prendiamo la classe del componente, HeroComponent. Così richiamiamo il metodo delete e (essendo un event emitter) emittiamo un valore undefined giusto per far partire l'evento (in effetti )
    (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(herosMock[0]);
  });

  ///////////////////////////////////
  ////////// gestire input /////////
  /////////////////////////////////
  it('should add a new hero to the hero list when add button is clicked', () => {

    mockHeroService.getHeroes.and.returnValue(of(herosMock));
    fixture.detectChanges();
    // dato che andremo a creare un nuovo hero e ciò che prendiamo dall'input è il nome, creo una variabile
    const name = 'batman';
    //dato che addHero nel beforeEach lo abbiamo mockato non facendogli ritorniare niente, facciamo questo
    mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 160}));

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement; //native element per avere un riferimento nel dom dell'elemento di debugelement

    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    //simuliamo il digitare il nome nell'input
    inputElement.value = name;

    //passare null perchè in questo caso l'event object non importa in questo caso (non viene usato)
    addButton.triggerEventHandler('click', null);

    fixture.detectChanges(); // aggiorniamo l'html

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent

    expect(heroText).toContain(name);
  });

  // testo il routerlink
  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(herosMock));
    fixture.detectChanges();

    //creo un array dei componenti child heroComponent che si trovano nel componente heroes
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    //questo mi da un debugEwlement per l'ancor tag nel quale c'è il router link
    //vogliamo un aggancio alla classe navigateTo quindi utilizzo injector.get che mi da una directive sul debugElement che ho passato nel tipo, RouterLinkDirectiveStub che mi ritorna la sua instance per lo specifico HeroComponent
    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub)).injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/1');
  });
});
