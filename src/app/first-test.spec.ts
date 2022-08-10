// describe e' una funzine di jasmin che ci permette di raggruppare i test. Accetta 2 parametri, una stringa che e' come una descrizione di questa parte di test e una funzione callback che contiene i test

describe('my first test', () => {
  //esempio
  let sut; // system under test

  //  setup in comune che runna prima di ogni test, serve per resettare lo state e non inquinare i test successivi con dei dati precedenti
  beforeEach(() => {
    sut = {};
  })

  // il test case vero e proprio anche qui prende due parametri, stringa(meglio se descrittiva ) e callback
  it('should be true if true', () => {
    //pattern a-a-a per test (opzionale)

    // arrange (questo passaggio imposta il test case)
    sut.a = false; //inizializzo una proprieta' dell'oggetto a false

    //act (sul comportamento. Dovrebbero riguardare la cosa principale da testare.)
    sut.a = true;

    //assert (asserisre i risutati aspttati per suscitar una risposta e verificarla)
    expect(sut.a).toBe(true); //un 'matcher' di jasmin
  })
})
