describe('GET /customers', () => {
  const apiUrl = Cypress.expose('API_URL')

  context('Cenários de sucesso', () => {
    it('retorna 200 e a estrutura correta com os parâmetros padrão', () => {
      // Arrange
      const endpoint = `${apiUrl}/customers`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers, pageInfo } = body
        const { currentPage, totalPages, totalCustomers } = pageInfo
        const [firstCustomer] = customers
        const { id, name, employees, size, industry, address, contactInfo } = firstCustomer

        expect(status).to.eq(200)
        expect(customers).to.be.an('array')
        expect(customers.length).to.be.at.most(10)
        expect(pageInfo).to.be.an('object')
        expect(currentPage).to.eq(1)
        expect(totalPages).to.be.a('number')
        expect(totalCustomers).to.be.a('number')

        expect(id).to.be.a('number')
        expect(name).to.be.a('string')
        expect(employees).to.be.a('number')
        expect(size).to.be.a('string')
        expect(industry).to.be.a('string')

        if (address !== null) {
          const { street, city, state, zipCode, country } = address
          expect(street).to.be.a('string')
          expect(city).to.be.a('string')
          expect(state).to.be.a('string')
          expect(zipCode).to.be.a('string')
          expect(country).to.be.a('string')
        }

        if (contactInfo !== null) {
          const { name: contactName, email } = contactInfo
          expect(contactName).to.be.a('string')
          expect(email).to.be.a('string')
        }
      })
    })

    it('retorna 200 e clientes da página solicitada com page', () => {
      // Arrange
      const page = 2
      const endpoint = `${apiUrl}/customers?page=${page}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { pageInfo } = body
        const { currentPage } = pageInfo

        expect(status).to.eq(200)
        expect(currentPage).to.eq(page)
      })
    })

    it('retorna 200 e respeita o limite de registros com limit', () => {
      // Arrange
      const limit = 5
      const endpoint = `${apiUrl}/customers?limit=${limit}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        expect(customers.length).to.be.at.most(limit)
      })
    })

    it('retorna 200 e apenas clientes com porte Small (menos de 100 funcionários)', () => {
      // Arrange
      const size = 'Small'
      const endpoint = `${apiUrl}/customers?size=${size}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.lessThan(100)
        })
      })
    })

    it('retorna 200 e apenas clientes com porte Medium (entre 100 e 999 funcionários)', () => {
      // Arrange
      const size = 'Medium'
      const endpoint = `${apiUrl}/customers?size=${size}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.at.least(100)
          expect(employees).to.be.lessThan(1000)
        })
      })
    })

    it('retorna 200 e apenas clientes com porte Enterprise (entre 1000 e 9999 funcionários)', () => {
      // Arrange
      const size = 'Enterprise'
      const endpoint = `${apiUrl}/customers?size=${size}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.at.least(1000)
          expect(employees).to.be.lessThan(10000)
        })
      })
    })

    it('retorna 200 e apenas clientes com porte Large Enterprise (entre 10000 e 49999 funcionários)', () => {
      // Arrange
      const size = 'Large Enterprise'
      const endpoint = `${apiUrl}/customers?size=${encodeURIComponent(size)}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.at.least(10000)
          expect(employees).to.be.lessThan(50000)
        })
      })
    })

    it('retorna 200 e apenas clientes com porte Very Large Enterprise (50000 ou mais funcionários)', () => {
      // Arrange
      const size = 'Very Large Enterprise'
      const endpoint = `${apiUrl}/customers?size=${encodeURIComponent(size)}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.at.least(50000)
        })
      })
    })

    it('retorna 200 e apenas clientes da indústria Logistics', () => {
      // Arrange
      const industry = 'Logistics'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ industry: customerIndustry }) => {
          expect(customerIndustry).to.eq(industry)
        })
      })
    })

    it('retorna 200 e apenas clientes da indústria Retail', () => {
      // Arrange
      const industry = 'Retail'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ industry: customerIndustry }) => {
          expect(customerIndustry).to.eq(industry)
        })
      })
    })

    it('retorna 200 e apenas clientes da indústria Technology', () => {
      // Arrange
      const industry = 'Technology'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ industry: customerIndustry }) => {
          expect(customerIndustry).to.eq(industry)
        })
      })
    })

    it('retorna 200 e apenas clientes da indústria HR', () => {
      // Arrange
      const industry = 'HR'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ industry: customerIndustry }) => {
          expect(customerIndustry).to.eq(industry)
        })
      })
    })

    it('retorna 200 e apenas clientes da indústria Finance', () => {
      // Arrange
      const industry = 'Finance'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { customers } = body

        expect(status).to.eq(200)
        customers.forEach(({ industry: customerIndustry }) => {
          expect(customerIndustry).to.eq(industry)
        })
      })
    })
  })

  context('Cenários de erro', () => {
    it('retorna 400 quando page for igual a 0', () => {
      // Arrange
      const page = 0
      const endpoint = `${apiUrl}/customers?page=${page}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { error } = body

        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('retorna 400 quando page for igual a -1', () => {
      // Arrange
      const page = -1
      const endpoint = `${apiUrl}/customers?page=${page}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { error } = body

        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('retorna 400 quando page não for um número', () => {
      // Arrange
      const page = 'invalid'
      const endpoint = `${apiUrl}/customers?page=${page}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { error } = body

        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('retorna 400 quando limit for igual a 0', () => {
      // Arrange
      const limit = 0
      const endpoint = `${apiUrl}/customers?limit=${limit}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { error } = body

        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('retorna 400 quando limit for igual a -1', () => {
      // Arrange
      const limit = -1
      const endpoint = `${apiUrl}/customers?limit=${limit}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { error } = body

        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('retorna 400 quando limit não for um número', () => {
      // Arrange
      const limit = 'invalid'
      const endpoint = `${apiUrl}/customers?limit=${limit}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { error } = body

        expect(status).to.eq(400)
        expect(error).to.eq('Invalid page or limit. Both must be positive numbers.')
      })
    })

    it('retorna 400 quando size não for suportado', () => {
      // Arrange
      const size = 'SuperSize'
      const endpoint = `${apiUrl}/customers?size=${size}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { error } = body

        expect(status).to.eq(400)
        expect(error).to.eq('Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.')
      })
    })

    it('retorna 400 quando industry não for suportada', () => {
      // Arrange
      const industry = 'Automotive'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // Assert
        const { error } = body

        expect(status).to.eq(400)
        expect(error).to.eq('Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.')
      })
    })
  })
})

