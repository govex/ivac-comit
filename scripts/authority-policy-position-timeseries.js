// the authority policy position time series is a list of events, each of which represents a change in the
// most permissive policy position for that authority.

// each time series event contains a timestamp, a link to the most permissive pregnancy policy, a link to the most permissive
// lactation policy, in the structure of
// [
//   {
//     date: 'YYYY-MM-DD',                               // date of the event
//     eventType: 'pregnancyPolicyPositionChange',       // event type: pregnancyPolicyPositionChange, lacationPolicyPositionChange, more tbd
//     policy: '[record id]'                             // link to the related policy causing the change
//     previousPolicy?: '[record id]'                    // link to the previous policy position
//   },
//   ...
// ]

// get input filename from the command line
const inputFilename = process.argv[2]

// if it wasn't specified, end here
if (!inputFilename) {
  console.error('Usage: node authority-policy-position-timeseries.js <input filename>')
  process.exit(1)
}

// get output filename from the command line
let outputFilename = process.argv[3]

// if it wasn't specified, use the input filename as the output filename
if (!outputFilename) {
  console.warn('No output filename specified, using input filename: ' + inputFilename)
  outputFilename = inputFilename
}

// for each authority, get the list of policies
//   obtain the date for each policy, add it to the list of dates
//   sort the list of dates in order
//   obtain the most permissive pregnancy & lactation policy for each date
//   add it to the time series
//   deduplicate the time series, so only changes are recorded

// load the data
console.info('Loading data from ' + inputFilename)
const comitData = require(process.cwd() + '/' + inputFilename)

// set up a map of policies
const policiesMap = new Map()
for (const policy of comitData.policies) {
  policiesMap.set(policy.id, policy)
}

// // set up a map of vaccines
// const vaccinesMap = new Map()
// for (const vaccine of comitv1.vaccines) {
//   vaccinesMap.set(vaccine.id, vaccine)
// }

const getMostPermissivePolicy = (options) => {
  // check for options and set defaults
  if (options.code === undefined) {
    return undefined
  }
  if (options.policies === undefined || options.policies.length === 0) {
    return undefined
  }
  if (options.beforeDate) {
    try {
      const beforeDate = new Date(options.beforeDate)
      options.beforeDate = beforeDate.toISOString().slice(0, 10)
    } catch {
      options.beforeDate = undefined
    }
  }

  // remove policies which don't have the code field we are looking for
  // and sort the policies by publication date if available or accessed date if available or 'unknown
  let phaPolicies = options.policies
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
      return (policy.vaccines ? policy.vaccines : [])
    })
  )

  // 
  const vaccinesEvalutated = [...phaPoliciesVaccineIdSet]

  // we don't need to filter vaccines for this function, but leaving this code here in case we want to do it later
  // // remove any vaccine items which are being filtered out (via the 'vaccineIds' parameter in this method call)
  // if (options.vaccineIds.length > 0) {
  //   phaPoliciesVaccineIdSet.forEach((vaccineId) => {
  //     if (!options.vaccineIds.includes(vaccineId)) {
  //       phaPoliciesVaccineIdSet.delete(vaccineId)
  //     }
  //   })
  // }

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
        } else if (policy.vaccines && policy.vaccines.some(vaccineId => phaPoliciesVaccineIdSet.has(vaccineId))) {
          for (const vaccineId of policy.vaccines) {
            phaPoliciesVaccineIdSet.delete(vaccineId)
          }
          return true
        }
      }
      return false
    })
  // and sort the resulting policies by policy position ranking
    .sort((policy1, policy2) => {
      return policy1[options.code][0].rank - policy2[options.code][0].rank
    })

  // return the top item from this policy array; if the array is empty, it will return undefined
  return {policy: phaCurrentPolicies.shift(), vaccines: vaccinesEvalutated}
}

const authorities = comitData.authorities

// iterate through each authority and create the time series
for (const authority of authorities) {
  authority.policyPositionEvents = []

  const authorityPolicies = (authority.policies || [])
    .map(policyId => policiesMap.get(policyId))

  authorityPolicies.forEach((policy) => {
    // create a new
    const eventDate = policy['datePublished/lastUpdated'] || policy.dateAccessed || 'unknown'

    const pregnancyPolicyAtDate = getMostPermissivePolicy({
      beforeDate: eventDate,
      code: 'pregnancyCode',
      policies: authorityPolicies
    })

    if (pregnancyPolicyAtDate) {
      authority.policyPositionEvents.push({
        date: eventDate,
        ...pregnancyPolicyAtDate,
        type: 'pregnancyPolicyPositionChange'
      })
    }

    const lactationPolicyAtDate = getMostPermissivePolicy({
      beforeDate: eventDate,
      code: 'lactationCode',
      policies: authorityPolicies
    })

    if (lactationPolicyAtDate) {
      authority.policyPositionEvents.push({
        date: eventDate,
        ...lactationPolicyAtDate,
        type: 'lactationPolicyPositionChange'
      })
    }

    // const pregnancyEvent = {
    //   date: eventDate,
    //   policy: getMostPermissivePolicy({
    //     beforeDate: eventDate,
    //     code: 'pregnancyCode',
    //     policies: authorityPolicies
    //   }),
    //   type: 'pregnancyPolicyPositionChange'
    // }

    // const lactationEvent = {
    //   date: eventDate,
    //   policy: getMostPermissivePolicy({
    //     beforeDate: eventDate,
    //     code: 'lactationCode',
    //     policies: authorityPolicies
    //   }),
    //   type: 'lactationPolicyPositionChange'
    // }

    // // add these to the authorit's policyPositionEvents array
    // authority.policyPositionEvents.push(
    //   pregnancyEvent, lactationEvent
    // )
  })

  authority.policyPositionEvents.sort((event1, event2) => {
    return event1.date.localeCompare(event2.date)
  })

  // eliminate duplicate time series events and add descriptions
  authority.policyPositionEvents = authority.policyPositionEvents
    .reduce((accumulator, event) => {
      // find all the events of the same type which have already been accumulated
      const sameTypeEvents = accumulator.filter(e => e.type === event.type)

      // if there are no events of this type, just add the event
      if (sameTypeEvents.length === 0) {
        accumulator.push(event)
      } else {
        const mostRecentAccumulatedEvent = sameTypeEvents.slice(-1)[0]
        event.previousPolicy = mostRecentAccumulatedEvent.policy?.id
        switch (event.type) {
          case 'pregnancyPolicyPositionChange':
            if (event.policy?.pregnancyCode?.[0]?.rank !== mostRecentAccumulatedEvent.policy?.pregnancyCode?.[0]?.rank) {
              accumulator.push(event)
            }
            break
          case 'lactationPolicyPositionChange':
            if (event.policy?.lactationCode?.[0]?.rank !== mostRecentAccumulatedEvent.policy?.lactationCode?.[0]?.rank) {
              accumulator.push(event)
            }
            break
        }
      }
      return accumulator
    }, [])
    // replace the policy objects with their ids
    .map((event) => {
      return { ...event, policy: event.policy?.id }
    })
}

const fs = require('fs')
try {
  fs.writeFileSync(process.cwd() + '/' + outputFilename, JSON.stringify(comitData), 'utf8')
  console.info(`wrote authority policy position event data to ${outputFilename}`)
} catch (err) {
  console.error('Error writing file ' + outputFilename + ': ' + err)
}
