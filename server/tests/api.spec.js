import { test, expect } from '@playwright/test'

const apiUrl = process.env.API_URL || 'http://localhost:3001'

test.describe('GET /customers', () => {
  test.describe('Cenários de sucesso', () => {
    test('retorna 200 e a estrutura correta com os parâmetros padrão', async ({ request }) => {
      // Arrange
      const endpoint = `${apiUrl}/customers`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers, pageInfo } = body
      const { currentPage, totalPages, totalCustomers } = pageInfo
      const [firstCustomer] = customers
      const { id, name, employees, size, industry, address, contactInfo } = firstCustomer

      expect(status).toBe(200)
      expect(Array.isArray(customers)).toBe(true)
      expect(customers.length).toBeLessThanOrEqual(10)
      expect(typeof pageInfo).toBe('object')
      expect(currentPage).toBe(1)
      expect(typeof totalPages).toBe('number')
      expect(typeof totalCustomers).toBe('number')

      expect(typeof id).toBe('number')
      expect(typeof name).toBe('string')
      expect(typeof employees).toBe('number')
      expect(typeof size).toBe('string')
      expect(typeof industry).toBe('string')

      if (address !== null) {
        const { street, city, state, zipCode, country } = address
        expect(typeof street).toBe('string')
        expect(typeof city).toBe('string')
        expect(typeof state).toBe('string')
        expect(typeof zipCode).toBe('string')
        expect(typeof country).toBe('string')
      }

      if (contactInfo !== null) {
        const { name: contactName, email } = contactInfo
        expect(typeof contactName).toBe('string')
        expect(typeof email).toBe('string')
      }
    })

    test('retorna 200 e clientes da página solicitada com page', async ({ request }) => {
      // Arrange
      const page = 2
      const endpoint = `${apiUrl}/customers?page=${page}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { pageInfo } = body
      const { currentPage } = pageInfo

      expect(status).toBe(200)
      expect(currentPage).toBe(page)
    })

    test('retorna 200 e respeita o limite de registros com limit', async ({ request }) => {
      // Arrange
      const limit = 5
      const endpoint = `${apiUrl}/customers?limit=${limit}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      expect(customers.length).toBeLessThanOrEqual(limit)
    })

    test('retorna 200 e apenas clientes com porte Small (menos de 100 funcionários)', async ({ request }) => {
      // Arrange
      const size = 'Small'
      const endpoint = `${apiUrl}/customers?size=${size}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ size: customerSize, employees }) => {
        expect(customerSize).toBe(size)
        expect(employees).toBeLessThan(100)
      })
    })

    test('retorna 200 e apenas clientes com porte Medium (entre 100 e 999 funcionários)', async ({ request }) => {
      // Arrange
      const size = 'Medium'
      const endpoint = `${apiUrl}/customers?size=${size}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ size: customerSize, employees }) => {
        expect(customerSize).toBe(size)
        expect(employees).toBeGreaterThanOrEqual(100)
        expect(employees).toBeLessThan(1000)
      })
    })

    test('retorna 200 e apenas clientes com porte Enterprise (entre 1000 e 9999 funcionários)', async ({ request }) => {
      // Arrange
      const size = 'Enterprise'
      const endpoint = `${apiUrl}/customers?size=${size}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ size: customerSize, employees }) => {
        expect(customerSize).toBe(size)
        expect(employees).toBeGreaterThanOrEqual(1000)
        expect(employees).toBeLessThan(10000)
      })
    })

    test('retorna 200 e apenas clientes com porte Large Enterprise (entre 10000 e 49999 funcionários)', async ({ request }) => {
      // Arrange
      const size = 'Large Enterprise'
      const endpoint = `${apiUrl}/customers?size=${encodeURIComponent(size)}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ size: customerSize, employees }) => {
        expect(customerSize).toBe(size)
        expect(employees).toBeGreaterThanOrEqual(10000)
        expect(employees).toBeLessThan(50000)
      })
    })

    test('retorna 200 e apenas clientes com porte Very Large Enterprise (50000 ou mais funcionários)', async ({ request }) => {
      // Arrange
      const size = 'Very Large Enterprise'
      const endpoint = `${apiUrl}/customers?size=${encodeURIComponent(size)}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ size: customerSize, employees }) => {
        expect(customerSize).toBe(size)
        expect(employees).toBeGreaterThanOrEqual(50000)
      })
    })

    test('retorna 200 e apenas clientes da indústria Logistics', async ({ request }) => {
      // Arrange
      const industry = 'Logistics'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ industry: customerIndustry }) => {
        expect(customerIndustry).toBe(industry)
      })
    })

    test('retorna 200 e apenas clientes da indústria Retail', async ({ request }) => {
      // Arrange
      const industry = 'Retail'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ industry: customerIndustry }) => {
        expect(customerIndustry).toBe(industry)
      })
    })

    test('retorna 200 e apenas clientes da indústria Technology', async ({ request }) => {
      // Arrange
      const industry = 'Technology'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ industry: customerIndustry }) => {
        expect(customerIndustry).toBe(industry)
      })
    })

    test('retorna 200 e apenas clientes da indústria HR', async ({ request }) => {
      // Arrange
      const industry = 'HR'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ industry: customerIndustry }) => {
        expect(customerIndustry).toBe(industry)
      })
    })

    test('retorna 200 e apenas clientes da indústria Finance', async ({ request }) => {
      // Arrange
      const industry = 'Finance'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { customers } = body

      expect(status).toBe(200)
      customers.forEach(({ industry: customerIndustry }) => {
        expect(customerIndustry).toBe(industry)
      })
    })
  })

  test.describe('Cenários de erro', () => {
    test('retorna 400 quando page for igual a 0', async ({ request }) => {
      // Arrange
      const page = 0
      const endpoint = `${apiUrl}/customers?page=${page}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { error } = body

      expect(status).toBe(400)
      expect(error).toBe('Invalid page or limit. Both must be positive numbers.')
    })

    test('retorna 400 quando page for igual a -1', async ({ request }) => {
      // Arrange
      const page = -1
      const endpoint = `${apiUrl}/customers?page=${page}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { error } = body

      expect(status).toBe(400)
      expect(error).toBe('Invalid page or limit. Both must be positive numbers.')
    })

    test('retorna 400 quando page não for um número', async ({ request }) => {
      // Arrange
      const page = 'invalid'
      const endpoint = `${apiUrl}/customers?page=${page}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { error } = body

      expect(status).toBe(400)
      expect(error).toBe('Invalid page or limit. Both must be positive numbers.')
    })

    test('retorna 400 quando limit for igual a 0', async ({ request }) => {
      // Arrange
      const limit = 0
      const endpoint = `${apiUrl}/customers?limit=${limit}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { error } = body

      expect(status).toBe(400)
      expect(error).toBe('Invalid page or limit. Both must be positive numbers.')
    })

    test('retorna 400 quando limit for igual a -1', async ({ request }) => {
      // Arrange
      const limit = -1
      const endpoint = `${apiUrl}/customers?limit=${limit}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { error } = body

      expect(status).toBe(400)
      expect(error).toBe('Invalid page or limit. Both must be positive numbers.')
    })

    test('retorna 400 quando limit não for um número', async ({ request }) => {
      // Arrange
      const limit = 'invalid'
      const endpoint = `${apiUrl}/customers?limit=${limit}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { error } = body

      expect(status).toBe(400)
      expect(error).toBe('Invalid page or limit. Both must be positive numbers.')
    })

    test('retorna 400 quando size não for suportado', async ({ request }) => {
      // Arrange
      const size = 'SuperSize'
      const endpoint = `${apiUrl}/customers?size=${size}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { error } = body

      expect(status).toBe(400)
      expect(error).toBe('Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.')
    })

    test('retorna 400 quando industry não for suportada', async ({ request }) => {
      // Arrange
      const industry = 'Automotive'
      const endpoint = `${apiUrl}/customers?industry=${industry}`

      // Act
      const response = await request.get(endpoint)
      const status = response.status()
      const body = await response.json()

      // Assert
      const { error } = body

      expect(status).toBe(400)
      expect(error).toBe('Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.')
    })
  })
})