export default (somethingIWontUse, inject) => {
  inject('reconstructReferences', (sourceData, identifier = 'id') => {
    const sourceDataKeys = Object.keys(sourceData)
    const sourceDataArrayKeys = []
    for (const sourceDataKey of sourceDataKeys) {
      if (Array.isArray(sourceData[sourceDataKey])) {
        sourceDataArrayKeys.push(sourceDataKey)
        const sourceDataArrayMapName = sourceDataKey + 'Map'
        sourceData[sourceDataArrayMapName] = new Map(
          sourceData[sourceDataKey].map(arrayItem => [arrayItem[identifier], arrayItem])
        )
      }
    }

    // iterate through each array
    for (const sourceDataArrayKey of sourceDataArrayKeys) {
      // iterate through each array element
      for (const sourceDataArrayElement of sourceData[sourceDataArrayKey]) {
        const sourceDataArrayElementKeys = Object.keys(sourceDataArrayElement)
        // iterate through each sourceDataArrayElement key
        for (const sourceDataArrayElementKey of sourceDataArrayElementKeys) {
          // if the key name matches one in our list of source Arrays
          if (sourceDataArrayKeys.includes(sourceDataArrayElementKey)) {
            // swap out the identifiers for the actual entities
            sourceDataArrayElement[sourceDataArrayElementKey] = sourceDataArrayElement[sourceDataArrayElementKey].map(
              id => sourceData[sourceDataArrayElementKey + 'Map'].get(id)
            )
          }
        }
      }
    }

    for (const ppe of sourceData.countries.flatMap(c => c.policyPositionEvents || []).filter(ppe => ppe)) {
      ppe.authority = sourceData.authoritiesMap.get(ppe.authority)
      ppe.policy = sourceData.policiesMap.get(ppe.policy)
      ppe.previousPolicy ? sourceData.policiesMap.get(ppe.previousPolicy) : null
    }

    for (const ppe of sourceData.authorities.flatMap(a => a.policyPositionEvents || []).filter(ppe => ppe)) {
      ppe.authority = sourceData.authoritiesMap.get(ppe.authority)
      ppe.policy = sourceData.policiesMap.get(ppe.policy)
      ppe.previousPolicy ? sourceData.policiesMap.get(ppe.previousPolicy) : null
    }

    for (const sourceDataArrayKey of sourceDataArrayKeys) {
      delete sourceData[sourceDataArrayKey + 'Map']
    }

    return sourceData
  })
}
