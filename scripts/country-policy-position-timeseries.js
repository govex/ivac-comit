// the country policy position time series is a list of events, each of which represents a change in the
// most permissive policy position for that country. It flattens and de-duplicates the time series from its public health authorities

// each time series event contains a timestamp, a link to the most permissive pregnancy policy, a link to the most permissive
// lactation policy, in the structure of
// [
//   {
//     date: 'YYYY-MM-DD',                               // date of the event
//     eventType: 'policy-change',                       // the type of event
//     policy: '[id]',                                   // the id of the policy
//     previousPolicy?: '[id]',                          // the id of the previous policy
//   },
//   ...
// ]

// include the authority types which define each country's policy position
const authorityTypes = [
  'Public Health Authority'
]

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

// read the input file
const comitData = require(process.cwd() + '/' + inputFilename)

// set up a map of authorities
const authoritiesMap = new Map()
for (const authority of comitData.authorities) {
  authoritiesMap.set(authority.id, authority)
}

// set up a map of policies
const policiesMap = new Map()
for (const policy of comitData.policies) {
  policiesMap.set(policy.id, policy)
}

for (const country of comitData.countries) {
  if (country.authorities) {
    country.policyPositionEvents = country.authorities
      // get all the policy position events from all the authorities for this country, and add their authority ID to them
      .flatMap((authorityId) => {
        // get the authority
        const authority = authoritiesMap.get(authorityId)
        // if there are policy position events...
        if (authority.policyPositionEvents) {
          // return a new set of them with the authority id and type included for each one
          return authority.policyPositionEvents.map((ppEvent) => {
            return { authority: authority.id, authorityType: authority.authorityType, ...ppEvent }
          })
        }
        return []
      })
      // filter out any events which aren't for the authority types we're interested in
      .filter((ppEvent) => {
        return authorityTypes.includes(ppEvent.authorityType)
      })
      // de-duplicate the events if policy positions don't change
      .reduce((accumulator, event) => {
        const sameTypeEvents = accumulator.filter(e => e.type === event.type)
        // if there are no other events of this type yet, just add this one
        if (sameTypeEvents.length === 0) {
          accumulator.push(event)
        } else {
          // otherwise we need to compare this one and the previous one
          const previousEvent = sameTypeEvents.slice(-1)[0]
          const currentPolicy = policiesMap.get(event.policy)
          event.previousPolicy = previousEvent.policy
            ? policiesMap.get(previousEvent.policy)
            : undefined

          let currentCode = 999, previousCode =999

          switch (event.type) {
            case 'pregnancyPolicyPositionChange':
              currentCode = currentPolicy?.pregnancyCode?.[0].rank
              previousCode = event.previousPolicy?.pregnancyCode?.[0]?.rank

              // if (event.previousPolicy && currentPolicy?.pregnancyCode?.[0].rank !== 999) {
              //   if (currentPolicy?.pregnancyCode?.[0]?.rank !== event.previousPolicy?.pregnancyCode?.[0]?.rank) {
              //     accumulator.push(event)
              //   }              
              // }
              break
            case 'lactationPolicyPositionChange':
              currentCode = currentPolicy?.lactationCode?.[0].rank
              previousCode = event.previousPolicy?.lactationCode?.[0]?.rank

              // if (event.previousPolicy && currentPolicy?.lactationCode?.[0].rank !== 999) {
              //   if (currentPolicy?.lactationCode?.[0]?.rank !== event.previousPolicy?.lactationCode?.[0]?.rank) {
              //     accumulator.push(event)
              //   }
              // }
              break
          }
          if (previousCode === 999 && currentCode !== 999) {
            accumulator.push(event)
          } else if (currentCode < previousCode) {
            accumulator.push(event)
          } else if ((currentCode !== 999) && (currentCode > previousCode)) {
            if (previousEvent.vaccines.filter(v => !event.vaccines.includes(v)).length === 0) {
              accumulator.push(event)
            }
          }
        }
        return accumulator
      }, [])
      .map((ppEvent) => {
        return { ...ppEvent, previousPolicy: ppEvent.previousPolicy?.id, authorityType: undefined }
      })
  }
}

const fs = require('fs')
try {
  fs.writeFileSync(process.cwd() + '/' + outputFilename, JSON.stringify(comitData), 'utf8')
  console.info(`wrote country policy position event data to ${outputFilename}`)
} catch (err) {
  console.error('Error writing file ' + outputFilename + ': ' + err)
}
