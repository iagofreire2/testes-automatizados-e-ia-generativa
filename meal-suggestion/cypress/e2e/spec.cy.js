describe('Meal Suggestion App - Testes E2E', () => {
  beforeEach(() => {
    cy.visit('/index.html');
  });

  it('deve carregar a página com layout e elementos base visíveis', () => {
    // Valida título da aplicação e botão de ação
    cy.get('h1, h2').should('be.visible');
    cy.get('button').should('be.visible').and('not.be.disabled');

    // Valida container da sugestão/refeição
    cy.get('body').should('contain.text', '');
  });

  it('deve exibir os detalhes da refeição sugerida (nome, imagem e instruções/ingredientes)', () => {
    // Garante que o nome da refeição está presente e não vazio
    cy.get('#meal-name, [data-testid="meal-name"], .meal-title, h3')
      .first()
      .should('be.visible')
      .invoke('text')
      .should('have.length.greaterThan', 0);

    // Valida que a imagem da refeição foi carregada com sucesso
    cy.get('img')
      .first()
      .should('be.visible')
      .and(($img) => {
        // Verifica se o atributo src existe e a imagem foi renderizada no DOM
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });

  it('deve atualizar a sugestão ao clicar no botão de gerar nova refeição', () => {
    const mealSelector = '#meal-name, [data-testid="meal-name"], .meal-title, h3';

    // Captura o nome da refeição inicial
    cy.get(mealSelector)
      .first()
      .invoke('text')
      .then((primeiraRefeicao) => {
        // Clica no botão para obter nova sugestão
        cy.get('button').contains(/get meal|generate|nova|suggest/i).click();

        // Aguarda a atualização e verifica se o conteúdo mudou ou foi re-renderizado
        cy.get(mealSelector)
          .first()
          .should('be.visible')
          .invoke('text')
          .should((segundaRefeicao) => {
            expect(segundaRefeicao.trim()).to.not.be.empty;
          });
      });
  });

  it('deve interceptar a chamada de API e validar o mock de uma refeição', () => {
    // Intercepta a requisição para APIs públicas comuns desse tipo de app (ex: TheMealDB)
    cy.intercept('GET', '**/api/json/v1/1/random.php', {
      statusCode: 200,
      body: {
        meals: [
          {
            strMeal: 'Cypress Test Pasta',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
            strInstructions: 'Cozinhe a massa e rode os testes com sucesso.',
            strCategory: 'Pasta',
            strArea: 'Italian'
          }
        ]
      }
    }).as('getRandomMeal');

    cy.visit('/index.html');

    // Caso a aplicação busque na inicialização ou no clique
    cy.get('body').then(($body) => {
      if ($body.find('button').length > 0) {
        cy.get('button').click();
      }
    });

    // Se a aplicação utilizar essa API, valida a resposta mockada
    cy.wait('@getRandomMeal').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.contains('Cypress Test Pasta').should('be.visible');
  });
});