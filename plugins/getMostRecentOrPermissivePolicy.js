export default (somethingIWontUse, inject) => {
  inject('getMostRecentOrPermissivePolicy', (country, code, vaccines = [], authorityTypes = ['Public Health Authority'], beforeDate = undefined) => {
    if (!country) { return undefined }
    if (!code) { return undefined }

    // filter the authorities, by authority type, or return all authorities if no authorityTypes specified.
    const phas = authorityTypes.length === 0
      ? (country.authorities ? country.authorities : [])
      : (country.authorities ? country.authorities : [])
          .filter(authority => authorityTypes.includes(authority.authorityType))

    // if we don't have any authorities, there's no more work to do
    if (phas.length === 0) { return undefined }

    // gather the policies from the filtered authorities, don't nest the arrays, sort them by date published / updated / accessed
    // also remove policies which don't have the code field we are looking for
    let phaPolicies = phas.flatMap(authority => (authority.policies ? authority.policies : []))
      .filter(policy => policy[code])
      .sort((policy1, policy2) => {
        return (policy2['datePublished/lastUpdated'] || policy2.dateAccessed || 'unknown').localeCompare((policy1['datePublished/lastUpdated'] || policy1.dateAccessed || 'unknown'))
      })

    // remove any policies after beforeDate, if it's specified
    if (beforeDate) {
      phaPolicies = phaPolicies.filter((policy) => {
        return (policy['datePublished/lastUpdated'] || policy.dateAccessed) <= beforeDate
      })
    }

    // if we don't have any resulting policies, there's no more work to do
    if (phaPolicies.length === 0) { return undefined }

    // gather the vaccineIds from the resulting policies
    const phaPoliciesVaccineIdSet = new Set(phaPolicies
      .flatMap((policy) => {
        if (policy.vaccinesNonSpecific) { return ['vaccines-non-specific'] }
        return (policy.vaccines ? policy.vaccines.map(vaccine => vaccine.id) : [])
      })
    )

    // remove any vaccine items which are being filtered out (via the 'vaccines' parameter in this method call)
    if (vaccines.length > 0) {
      phaPoliciesVaccineIdSet.forEach((vaccineId) => {
        if (!vaccines.includes(vaccineId)) {
          phaPoliciesVaccineIdSet.delete(vaccineId)
        }
      })
    }

    // if we don't have any vaccine identifiers (which in theory shouldn't happen), there's no more work to do
    if (phaPoliciesVaccineIdSet.size === 0) { return undefined }

    // now get only the most recent policies which cover all the vaccines we accumulated
    const phaCurrentPolicies = phaPolicies
      .filter((policy) => {
        if (phaPoliciesVaccineIdSet.size > 0) {
          if (policy.vaccinesNonSpecific) {
            if (phaPoliciesVaccineIdSet.has('vaccines-non-specific')) {
              phaPoliciesVaccineIdSet.delete('vaccines-non-specific')
              return true
            }
          } else if (policy.vaccines && policy.vaccines.some(vaccine => phaPoliciesVaccineIdSet.has(vaccine.id))) {
            for (const vaccine of policy.vaccines) {
              phaPoliciesVaccineIdSet.delete(vaccine.id)
            }
            return true
          }
        }
        return false
      })
      .sort((policy1, policy2) => {
        return policy1[code][0].rank - policy2[code][0].rank
      })

    // return the top item from this policy array; if the array is empty, it will return undefined
    return phaCurrentPolicies.shift()
  })
}
