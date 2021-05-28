export default (somethingIWontUse, inject) => {
  inject('getMostPermissiveLactationCode', (country) => {
    if (!country) { return undefined }

    // filter the authorities
    const phas = (country.authorities ? country.authorities : [])
      .filter(authority => authority.authorityType === 'Public Health Authority')

    if (phas.length === 0) { return undefined }

    // gather the policies from the filtered authorities, don't nest the arrays, sort them by date published / updated / accessed
    const phaPolicies = phas.flatMap(authority => (authority.policies ? authority.policies : []))
      .filter(policy => policy.lactationCode)
      .sort((policy1, policy2) => {
        return (policy2['datePublished/lastUpdated'] || policy2.dateAccessed || 'unknown').localeCompare((policy1['datePublished/lastUpdated'] || policy1.dateAccessed || 'unknown'))
      })

    if (phaPolicies.length === 0) { return undefined }

    // gather the vaccineIds from the reuslting policies
    const phaPoliciesVaccineIdSet = new Set(phaPolicies
      .flatMap((policy) => {
        if (policy.vaccinesNonSpecific) { return ['vaccines-non-specific'] }
        return (policy.vaccines ? policy.vaccines.map(vaccine => vaccine.id) : [])
      })
    )

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
        return policy1.lactationCode[0].rank - policy2.lactationCode[0].rank
      })

    if (phaCurrentPolicies.length === 0) { return undefined }

    return phaCurrentPolicies.shift().lactationCode
  })
}
