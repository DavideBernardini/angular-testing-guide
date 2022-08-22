import { of } from 'rxjs';
import { HeroesComponent } from './../heroes/heroes.component';

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
    })
  })
})
