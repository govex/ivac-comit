export default (somethingIWontUse, inject) => {
  inject('getMostRecentOrPermissivePolicy', (options) => {
    // check for options and set defaults
    if (!options.country) { return undefined }
    if (!options.code) { return undefined }

    if (!options.vaccineIds) {
      options.vaccineIds = []
    } else if (!Array.isArray(options.vaccineIds)) {
      options.vaccineIds = [options.vaccineIds]
    }

    if (!options.authorityTypes) {
      options.authorityTypes = ['Public Health Authority']
    } else if (!Array.isArray(options.authorityTypes)) {
      options.authorityTypes = [options.authorityTypes]
    }

    if (options.beforeDate) {
      try {
        const beforeDate = new Date(options.beforeDate)
        options.beforeDate = beforeDate.toISOString().slice(0, 10)
      } catch {
        options.beforeDate = undefined
      }
    }

    // filter the authorities, by authority type, or return all authorities if no authorityTypes specified.
    const phas = options.authorityTypes.length === 0
      ? (options.country.authorities || [])
      : (options.country.authorities || [])
          .filter(authority => options.authorityTypes.includes(authority.authorityType))

    // if we don't have any authorities, there's no more work to do
    if (phas.length === 0) { return undefined }

    // gather the policies from the filtered authorities, don't nest the arrays, sort them by date published / updated / accessed
    // also remove policies which don't have the code field we are looking for
    let phaPolicies = phas.flatMap(authority => (authority.policies ? authority.policies : []))
      .filter(policy => policy[options.code])
      .sort((policy1, policy2) => {
        return (policy2['datePublished/lastUpdated'] || policy2.dateAccessed || 'unknown').localeCompare((policy1['datePublished/lastUpdated'] || policy1.dateAccessed || 'unknown'))
      })

    // remove any policies after beforeDate, if it's specified
    if (options.beforeDate) {
      phaPolicies = phaPolicies.filter((policy) => {
        return (policy['datePublished/lastUpdated'] || policy.dateAccessed) <= options.beforeDate
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

    // remove any vaccine items which are being filtered out (via the 'vaccineIds' parameter in this method call)
    if (options.vaccineIds.length > 0) {
      phaPoliciesVaccineIdSet.forEach((vaccineId) => {
        if (!options.vaccineIds.includes(vaccineId)) {
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
        return policy1[options.code][0].rank - policy2[options.code][0].rank
      })

    // return the top item from this policy array; if the array is empty, it will return undefined
    return phaCurrentPolicies.shift()
  })
}
