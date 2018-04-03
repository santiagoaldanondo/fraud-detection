const fs = require('fs')
class OrderFile {
  constructor (filePath) {
    this.orders = []
    this.fraudResults = []

    // READ FRAUD LINES
    let fileContent = fs.readFileSync(filePath, 'utf8')
    let lines = fileContent.split('\n')
    for (let line of lines) {
      let order = new OrderLine(line)
      this.orders.push(order)
    }
  }

  check () {
    // CHECK FRAUD
    for (let i = 0; i < this.orders.length; i++) {
      let current = this.orders[i]
      let isFraudulent = false

      for (let j = i + 1; j < this.orders.length; j++) {
        isFraudulent = false
        isFraudulent = current.isFraudulent(this.orders[j])
        if (isFraudulent) {
          this.fraudResults.push({
            isFraudulent: true,
            orderId: this.orders[j].orderId
          })
        }
      }
    }
    console.log(this.fraudResults)
    return this.fraudResults
  }
}

// Create class OrderLine, with an attribute for each column
class OrderLine {
  constructor (line) {
    let items = line.split(',')
    this.orderId = Number(items[0])
    this.dealId = Number(items[1])
    this.email = normalizeEmail(items[2].toLowerCase())
    this.street = normalizeStreet(items[3].toLowerCase())
    this.city = items[4].toLowerCase()
    this.state = normalizeState(items[5].toLowerCase())
    this.zipCode = items[6]
    this.creditCard = items[7]
  }
  isFraudulent (otherLine) {
    return (this.sameDeal(otherLine) &&
      this.sameEmail(otherLine) &&
      !this.sameCreditCard(otherLine)) ||
      (this.sameDeal(otherLine) &&
      this.sameState(otherLine) &&
      this.sameZipCode(otherLine) &&
      this.sameStreet(otherLine) &&
      this.sameCity(otherLine) &&
      !this.sameCreditCard(otherLine))
  }
  sameDeal (otherLine) {
    return this.dealId === otherLine.dealId
  }
  sameEmail (otherLine) {
    return this.email === otherLine.email
  }
  sameState (otherLine) {
    return this.state === otherLine.state
  }
  sameZipCode (otherLine) {
    return this.zipCode === otherLine.zipCode
  }
  sameStreet (otherLine) {
    return this.street === otherLine.street
  }
  sameCity (otherLine) {
    return this.city === otherLine.city
  }
  sameCreditCard (otherLine) {
    console.log(this.creditCard)
    console.log(otherLine.creditCard)
    return this.creditCard === otherLine.creditCard
  }
}

// Declare functions that do not depend on the previous classes and might be used in other places

function normalizeEmail (email) {
  let aux = email.split('@')
  let atIndex = aux[0].indexOf('+')
  aux[0] = atIndex < 0 ? aux[0].replace('.', '') : aux[0].replace('.', '').substring(0, atIndex - 1)
  return aux.join('@')
}

function normalizeStreet (street) {
  return street.replace('st.', 'street').replace('rd.', 'road')
}

function normalizeState (state) {
  return state.replace('il', 'illinois').replace('ca', 'california').replace('ny', 'new york')
}

module.exports = { OrderFile }
