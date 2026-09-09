describe('GET /customers', () => {
  const apiUrl = Cypress.expose('API_URL')

  context('Cenários de sucesso', () => {
    it('retorna 200 e a estrutura correta com os parâmetros padrão', () => {
      cy.request('GET', `${apiUrl}/customers?page=1&limit=10`).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('customers').and.to.be.an('array')
        expect(body).to.have.property('pageInfo').and.to.be.an('object')
        expect(body.customers.length).to.be.at.most(10)
        expect(body.pageInfo.currentPage).to.eq(1)
        expect(body.pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')

        if (body.customers.length > 0) {
          const [customer] = body.customers
          expect(customer).to.have.property('id').that.is.a('number')
          expect(customer).to.have.property('name').that.is.a('string')
          expect(customer).to.have.property('employees').that.is.a('number')
          expect(customer).to.have.property('size').that.is.a('string')
          expect(customer).to.have.property('industry').that.is.a('string')
          expect(customer).to.have.property('address')
          expect(customer).to.have.property('contactInfo')

          if (customer.address !== null) {
            expect(customer.address).to.have.all.keys('street', 'city', 'state', 'zipCode', 'country')
          }

          if (customer.contactInfo !== null) {
            expect(customer.contactInfo).to.have.all.keys('name', 'email')
          }
        }
      })
    })

    it('retorna 200 e respeita a paginação com page e limit', () => {
      const page = 2
      const limit = 5

      cy.request('GET', `${apiUrl}/customers?page=${page}&limit=${limit}`).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.customers.length).to.be.at.most(limit)
        expect(body.pageInfo.currentPage).to.eq(page)
      })
    })

    it('retorna 200 e filtra clientes pela indústria Technology', () => {
      const industry = 'Technology'

      cy.request('GET', `${apiUrl}/customers?industry=${industry}`).then(({ status, body }) => {
        expect(status).to.eq(200)
        body.customers.forEach(({ industry: customerIndustry }) => {
          expect(customerIndustry).to.eq(industry)
        })
      })
    })

    it('retorna 200 e filtra clientes com porte Small (menos de 100 funcionários)', () => {
      const size = 'Small'

      cy.request('GET', `${apiUrl}/customers?size=${size}`).then(({ status, body }) => {
        expect(status).to.eq(200)
        body.customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.lessThan(100)
        })
      })
    })

    it('retorna 200 e filtra clientes com porte Medium (entre 100 e 999 funcionários)', () => {
      const size = 'Medium'

      cy.request('GET', `${apiUrl}/customers?size=${size}`).then(({ status, body }) => {
        expect(status).to.eq(200)
        body.customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.at.least(100)
          expect(employees).to.be.lessThan(1000)
        })
      })
    })

    it('retorna 200 e filtra clientes com porte Enterprise (entre 1000 e 9999 funcionários)', () => {
      const size = 'Enterprise'

      cy.request('GET', `${apiUrl}/customers?size=${size}`).then(({ status, body }) => {
        expect(status).to.eq(200)
        body.customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.at.least(1000)
          expect(employees).to.be.lessThan(10000)
        })
      })
    })

    it('retorna 200 e filtra clientes com porte Large Enterprise (entre 10000 e 49999 funcionários)', () => {
      const size = 'Large Enterprise'

      cy.request('GET', `${apiUrl}/customers?size=${encodeURIComponent(size)}`).then(({ status, body }) => {
        expect(status).to.eq(200)
        body.customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.at.least(10000)
          expect(employees).to.be.lessThan(50000)
        })
      })
    })

    it('retorna 200 e filtra clientes com porte Very Large Enterprise (50000 ou mais funcionários)', () => {
      const size = 'Very Large Enterprise'

      cy.request('GET', `${apiUrl}/customers?size=${encodeURIComponent(size)}`).then(({ status, body }) => {
        expect(status).to.eq(200)
        body.customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.at.least(50000)
        })
      })
    })

    it('retorna 200 ao recuperar clientes combinando múltiplos parâmetros', () => {
      const page = 2
      const limit = 10
      const size = 'Medium'
      const industry = 'Technology'

      cy.request('GET', `${apiUrl}/customers?page=${page}&limit=${limit}&size=${size}&industry=${industry}`).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.pageInfo.currentPage).to.eq(page)
        expect(body.customers.length).to.be.at.most(limit)
        body.customers.forEach(({ size: customerSize, industry: customerIndustry, employees }) => {
          expect(customerSize).to.eq(size)
          expect(customerIndustry).to.eq(industry)
          expect(employees).to.be.at.least(100)
          expect(employees).to.be.lessThan(1000)
        })
      })
    })
  })

  context('Cenários de erro', () => {
    it('retorna 400 quando page for um valor negativo', () => {
      cy.request('GET', `${apiUrl}/customers?page=-1`).then(({ status }) => {
        expect(status).to.eq(400)
      })
    })

    it('retorna 400 quando page for um valor não numérico', () => {
      cy.request('GET', `${apiUrl}/customers?page=invalid`).then(({ status }) => {
        expect(status).to.eq(400)
      })
    })

    it('retorna 400 quando limit for zero', () => {
      cy.request('GET', `${apiUrl}/customers?limit=0`).then(({ status }) => {
        expect(status).to.eq(400)
      })
    })

    it('retorna 400 quando limit for um valor não numérico', () => {
      cy.request('GET', `${apiUrl}/customers?limit=invalid`).then(({ status }) => {
        expect(status).to.eq(400)
      })
    })

    it('retorna 400 quando size não for suportado', () => {
      cy.request('GET', `${apiUrl}/customers?size=UnsupportedSize`).then(({ status }) => {
        expect(status).to.eq(400)
      })
    })

    it('retorna 400 quando industry não for suportada', () => {
      cy.request('GET', `${apiUrl}/customers?industry=UnsupportedIndustry`).then(({ status }) => {
        expect(status).to.eq(400)
      })
    })
  })
})