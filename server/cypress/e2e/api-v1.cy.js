describe('GET /customers', () => {
  const baseUrl = 'http://localhost:3001/customers'

  context('Cenários de Sucesso (200 OK)', () => {
    it('deve retornar a lista de clientes com os parâmetros padrão (page=1, limit=10, size=All, industry=All)', () => {
      cy.request('GET', baseUrl).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('customers').and.to.be.an('array')
        expect(response.body).to.have.property('pageInfo').and.to.be.an('object')

        // Validação da paginação padrão
        expect(response.body.customers.length).to.be.at.most(10)
        expect(response.body.pageInfo.currentPage).to.eq(1)
        expect(response.body.pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')

        // Validação da estrutura dos objetos de cliente
        if (response.body.customers.length > 0) {
          const customer = response.body.customers[0]
          expect(customer).to.have.property('id').that.is.a('number')
          expect(customer).to.have.property('name').that.is.a('string')
          expect(customer).to.have.property('employees').that.is.a('number')
          expect(customer).to.have.property('size').that.is.a('string')
          expect(customer).to.have.property('industry').that.is.a('string')

          // address e contactInfo podem ser objetos ou null
          expect(customer).to.have.property('address')
          if (customer.address !== null) {
            expect(customer.address).to.have.all.keys('street', 'city', 'state', 'zipCode', 'country')
          }

          expect(customer).to.have.property('contactInfo')
          if (customer.contactInfo !== null) {
            expect(customer.contactInfo).to.have.all.keys('name', 'email')
          }
        }
      })
    })

    it('deve respeitar a paginação personalizada com page e limit', () => {
      const page = 2
      const limit = 5

      cy.request('GET', `${baseUrl}?page=${page}&limit=${limit}`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.customers.length).to.be.at.most(limit)
        expect(response.body.pageInfo.currentPage).to.eq(page)
      })
    })

    it('deve filtrar clientes por indústria (ex: Technology)', () => {
      const industry = 'Technology'

      cy.request('GET', `${baseUrl}?industry=${industry}`).then((response) => {
        expect(response.status).to.eq(200)
        response.body.customers.forEach((customer) => {
          expect(customer.industry).to.eq(industry)
        })
      })
    })

    context('Validação dinâmica do atributo size baseado no número de funcionários', () => {
      const sizeCategories = [
        { size: 'Small', min: 0, max: 99 },
        { size: 'Medium', min: 100, max: 999 },
        { size: 'Enterprise', min: 1000, max: 9999 },
        { size: 'Large Enterprise', min: 10000, max: 49999 },
        { size: 'Very Large Enterprise', min: 50000, max: Infinity }
      ]

      sizeCategories.forEach(({ size, min, max }) => {
        it(`deve filtrar corretamente por size='${size}' respeitando a faixa de funcionários`, () => {
          cy.request('GET', `${baseUrl}?size=${encodeURIComponent(size)}`).then((response) => {
            expect(response.status).to.eq(200)
            response.body.customers.forEach((customer) => {
              expect(customer.size).to.eq(size)
              expect(customer.employees).to.be.at.least(min)
              if (max !== Infinity) {
                expect(customer.employees).to.be.at.most(max)
              }
            })
          })
        })
      })
    })

    it('deve recuperar clientes combinando múltiplos parâmetros (exemplo da documentação)', () => {
      const url = `${baseUrl}?page=2&limit=10&size=Medium&industry=Technology`

      cy.request('GET', url).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.pageInfo.currentPage).to.eq(2)
        expect(response.body.customers.length).to.be.at.most(10)

        response.body.customers.forEach((customer) => {
          expect(customer.size).to.eq('Medium')
          expect(customer.industry).to.match(/Technology/i)
          expect(customer.employees).to.be.within(100, 999)
        })
      })
    })
  })

  context('Cenários de Erro (400 Bad Request)', () => {
    it('deve retornar 400 quando page for um valor inválido ou negativo', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}?page=-1`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })

      cy.request({
        method: 'GET',
        url: `${baseUrl}?page=invalid`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('deve retornar 400 quando limit for um valor inválido ou menor que 1', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}?limit=0`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })

      cy.request({
        method: 'GET',
        url: `${baseUrl}?limit=abc`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('deve retornar 400 quando size não for suportado', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}?size=SuperSize`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('deve retornar 400 quando industry não for suportada', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}?industry=Automotive`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })
  })
})