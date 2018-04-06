// Create module with functions that do not depend on the classes in FraudRadar file

class Normalize {
  normalizeEmail (email) {
    let aux = email.split('@')
    let atIndex = aux[0].indexOf('+')
    aux[0] = atIndex < 0 ? aux[0].replace('.', '') : aux[0].replace('.', '').substring(0, atIndex - 1)
    return aux.join('@')
  }

  normalizeStreet (street) {
    return street.replace('st.', 'street').replace('rd.', 'road')
  }

  normalizeState (state) {
    return state.replace('il', 'illinois').replace('ca', 'california').replace('ny', 'new york')
  }

  // The following is needed because some lines have \r and some don't, and the comparisons would fail

  normalizeLine (line) {
    return line.replace('\r', '')
  }
}

module.exports = { Normalize }
