export const state = () => ({})

export const actions = {
  async nuxtServerInit ({ commit }) {
    const myData = await fetch(`http://localhost:${process.env.PORT || 3000}/data/comit-v1.min.json`).then(res => res.json())
    const myReconstructedData = methods.reconstructReferences(myData)
    // await commit('coreData/load', myReconstructedData)
    await commit('countries/load', myReconstructedData.countries)
    await commit('authorities/load', myReconstructedData.authorities)
    await commit('policies/load', myReconstructedData.policies)
    await commit('vaccines/load', myReconstructedData.vaccines)
  }
}

export const methods = {
  reconstructReferences (sourceData, identifier = 'id') {
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

    for (const sourceDataArrayKey of sourceDataArrayKeys) {
      delete sourceData[sourceDataArrayKey + 'Map']
    }

    return sourceData
  }
}
