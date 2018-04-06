const fs = require('fs')
const Normalize = require('./NormalizeModule')
const normalize = new Normalize.Normalize() // We can use just one instance in the whole file

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
    return this.fraudResults
  }
}

// Create class OrderLine, with an attribute for each column
class OrderLine {
  constructor (line) {
    let items = normalize.normalizeLine(line).split(',')
    this.orderId = Number(items[0])
    this.dealId = Number(items[1])
    this.email = normalize.normalizeEmail(items[2].toLowerCase())
    this.street = normalize.normalizeStreet(items[3].toLowerCase())
    this.city = items[4].toLowerCase()
    this.state = normalize.normalizeState(items[5].toLowerCase())
    this.zipCode = items[6]
    this.creditCard = items[7]
  }
  isFraudulent (otherLine) {
    // A second transaction is fraudulent if it has same deal and email but different credit card
    // OR same deal, same state, same zip code, same street and same city but different credit card
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
    return this.creditCard === otherLine.creditCard
  }
}

module.exports = { OrderFile }
