export default (somethingIWontUse, inject) => {
  inject('getVaccineRecommendationsFromAuthority', (authority, vaccineIds = []) => {
    if (!authority || !authority.policies) { return [] }

    const policies = Array
      .from(authority.policies)
      .sort((policy1, policy2) => {
        return (policy2['datePublished/lastUpdated'] || policy2.dateAccessed || 'unknown').localeCompare((policy1['datePublished/lastUpdated'] || policy1.dateAccessed || 'unknown'))
      })

    let vaccines = policies.flatMap(policy => policy.vaccines || [])

    if (vaccineIds.length > 0) {
      vaccines = vaccines.filter(vaccine => vaccineIds.includes(vaccine.id))
    }

    if (vaccines.length === 0) { return [] }

    const vaccinesMap = new Map()
    for (const vaccine of vaccines) {
      if (vaccine) {
        vaccinesMap.set(vaccine.id, { ...vaccine })
      }
    }

    // now turn the map of vaccines into the list we need
    return Array.from(vaccinesMap.values()).map((vaccine) => {
      return {
        id: vaccine.id,
        displayName: vaccine.displayName,
        otherNames: vaccine.otherNames,
        mostRecentPregnancyCode: policies.find(policy => policy.vaccines?.some(thisVaccine => thisVaccine.id === vaccine.id)).pregnancyCode,
        mostRecentLactationCode: policies.find(policy => policy.vaccines?.some(thisVaccine => thisVaccine.id === vaccine.id)).lactationCode,
        policyDate: policies.find(policy => policy.vaccines?.some(thisVaccine => thisVaccine.id === vaccine.id))['datePublished/lastUpdated']
      }
    })
  })
}
