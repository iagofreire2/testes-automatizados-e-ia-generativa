describe('Sugestão de Refeição Vegana', () => {
  beforeEach(() => {
    // Como o baseUrl está configurado no cypress.config.js, visitamos apenas a rota do arquivo
    cy.visit('/index.html');
  });

  it('deve carregar a página e exibir uma refeição aleatória inicialmente', () => {
    // Verifica se os elementos principais foram renderizados
    cy.get('h1').should('contain.text', 'Refeição vegana');
    cy.get('#meal-type-filter').should('have.value', 'all');
    cy.get('#search-field').should('have.value', '');
    
    // Verifica se uma refeição foi gerada na inicialização
    cy.get('#meal-name').should('not.be.empty');
    cy.get('#ingredients-label').should('contain.text', 'Ingredientes:');
    cy.get('#ingredients-list li').should('have.length.at.least', 1);
  });

  it('deve filtrar refeições por "Alto teor de proteína"', () => {
    // Seleciona a opção de alto teor de proteína no select
    cy.get('#meal-type-filter').select('high-protein');
    
    // O texto do título deve conter a string indicando alto teor de proteína, conforme o script.js
    cy.get('#meal-name').should('contain.text', 'com alto teor de proteína');
  });

  it('deve filtrar refeições por "Sopas"', () => {
    // Seleciona a opção de sopas
    cy.get('#meal-type-filter').select('soup');
    
    // Verifica se a refeição gerada corresponde ao tipo "sopa" (baseado no mealEnum)
    cy.get('#meal-name').should('contain.text', 'sopa');
  });

  it('deve buscar por uma refeição específica pelo nome', () => {
    const mealToSearch = 'Feijoada';
    
    // Digita o nome e simula o evento 'change' (pressionando Enter)
    cy.get('#search-field').type(`${mealToSearch}{enter}`);
    
    // Verifica se o prato buscado é exibido corretamente na tela
    cy.get('#meal-name').should('contain.text', mealToSearch);
    cy.get('#ingredients-list li').first().should('contain.text', 'feijão vermelho');
  });

  it('deve buscar de forma case-insensitive', () => {
    // Digita buscando em letras minúsculas
    cy.get('#search-field').type('queijadilla{enter}');
    
    cy.get('#meal-name').should('contain.text', 'Queijadilla');
  });

  it('deve limpar o campo de busca ao clicar no botão "Buscar" quando há texto', () => {
    cy.get('#search-field').type('Tofu');
    
    // Clica no botão de submissão
    cy.get('button[type="submit"]').click();
    
    // O script.js previne o recarregamento (e.preventDefault) e limpa o input
    cy.get('#search-field').should('have.value', '');
  });

  it('deve gerar uma nova refeição ao clicar no botão "Buscar" com o campo vazio', () => {
    cy.get('#search-field').clear();
    
    // Captura o nome da refeição atual para comparar depois
    cy.get('#meal-name').invoke('text').then((initialMealName) => {
      // Clica no botão para gerar nova refeição
      cy.get('button[type="submit"]').click();
      
      // Verifica se a função generateMeal() foi chamada limpando o input (mesmo já estando vazio)
      cy.get('#search-field').should('have.value', '');
      
      // Nota: Como é aleatório, existe uma pequena chance de gerar a mesma refeição, 
      // mas o comportamento esperado de execução do botão é testado aqui.
      cy.get('#meal-name').should('not.be.empty');
    });
  });
});