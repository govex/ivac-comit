/* eslint-disable no-console */
const configFilename = '/scripts/comit-v1.config.json'

const config = require(process.cwd() + configFilename)

// start the clock. In the future this might use node/javascript performance tooling
const startDate = Date.now()

// load all the data from files and delete the fields not specified in the config file
const inputData = {}
for (const propertyName of Object.getOwnPropertyNames(config.input)) {
  inputData[propertyName] = require(process.cwd() + config.input[propertyName].filename)
  console.log(`loaded ${inputData[propertyName].length} records into '${propertyName}' from ${config.input[propertyName].filename}`)
}

// set up the skeleton for the output file
const output = {
  countries: [],
  authorities: [],
  policies: [],
  vaccines: []
  // TODO: (eventually) move policiesSelectChoices to a lookup array
}

// map the vaccine events for lookup
const vaccineEventsMap = new Map(inputData.vaccineCountryEvents.map(vce => [vce.id, { id: vce.id, ...vce.fields }]))

// map the choice by field name; each entry contains an array of the possible choices for that field
const policiesSelectChoicesMap = new Map()
for (const selectChoice of inputData.policiesSelectChoices) {
  if (policiesSelectChoicesMap.has(selectChoice.fields.fieldName)) {
    policiesSelectChoicesMap.get(selectChoice.fields.fieldName).push({ value: selectChoice.fields.possibleValue, rank: selectChoice.fields.valueRank })
  } else {
    policiesSelectChoicesMap.set(selectChoice.fields.fieldName, [{ value: selectChoice.fields.possibleValue, rank: selectChoice.fields.valueRank }])
  }
}

// map the authority review events for lookup
const authorityReviewEventsMap = inputData.authorityReviewEvents
  .reduce((arem, are) => {
    const authorityId = are.fields.Authority[0]
    const eventDate = are.fields.Date.split('T')[0]
    const eventArray = arem.get(authorityId)
    if (eventArray) {
      if (!eventArray.includes(eventDate)) {
        eventArray.push(eventDate)
      }
      return arem
    } else {
      return arem.set(authorityId, [eventDate])
    }
  }, new Map())
for (let [value] of authorityReviewEventsMap.values()) {
  value = Array.from(new Set(value))
}
console.log(`${inputData.authorityReviewEvents.length} authorityReviewEvents loaded`)

// iterate through the countries to process each one; push the result to the output.countries array.
for (const country of inputData.countries) {
  country.fields.id = country.id
  if (country.fields.VaccinesAuthorized) {
    country.fields.vaccineEvents = Array
      .from(country.fields.VaccinesAuthorized
        .map((id) => {
          const vaccineEvent = vaccineEventsMap.get(id)
          return { id: vaccineEvent.id, vaccineId: vaccineEvent.Vaccine[0], eventDate: vaccineEvent.EventDate, eventType: vaccineEvent.EventType }
        })
      )
    country.fields.vaccines = Array
      .from(country.fields.VaccinesAuthorized
        .flatMap((id) => {
          return vaccineEventsMap.get(id).Vaccine
        })
        .reduce((uniqueIds, id) => {
          return uniqueIds.add(id)
        }, new Set())
      )
  }

  for (const key of Object.getOwnPropertyNames(country.fields)) {
    if (!config.input.countries.fields.includes(key)) {
      delete country.fields[key]
    }
  }

  output.countries.push(country.fields)
}
output.countries.sort((country1, country2) => country1.Name.localeCompare(country2.Name))
output.countries.unshift(output.countries.splice(output.countries.findIndex(country => country.Name === 'Global'), 1)[0])
console.log(`${output.countries.length} countries loaded`)

const deletedPolicyIds = []

// iterate through the policies to process each one; push the result to the output.policies array
// exclude policies which are flagged for team review
for (const policy of inputData.policies) {
  if (policy.fields['Needs team review']) {
    deletedPolicyIds.push(policy.id)
  } else {
    policy.fields.id = policy.id
    policy.fields.countries = policy.fields['Authority Countries']
    for (const fieldName of policiesSelectChoicesMap.keys()) {
      if (policy.fields[fieldName]) {
        const optionsArray = policiesSelectChoicesMap.get(fieldName)
        if (Array.isArray(policy.fields[fieldName])) {
          policy.fields[fieldName] = policy.fields[fieldName]
            .map((value) => {
              return optionsArray.find(option => option.value === value)
            })
        } else {
          policy.fields[fieldName] = optionsArray.find(option => option.value === policy.fields[fieldName])
        }
      }
    }
    for (const key of Object.getOwnPropertyNames(policy.fields)) {
      if (!config.input.policies.fields.includes(key)) {
        delete policy.fields[key]
      }
    }
    output.policies.push(policy.fields)
  }
}
console.log(`${output.policies.length} policies loaded`)

// iterate through the authorities to process each one; push the result to the output.authorities array
for (const authority of inputData.authorities) {
  authority.fields.id = authority.id
  authority.fields.reviewEvents = authorityReviewEventsMap.get(authority.id)
  if (authority.fields.reviewEvents) { authority.fields.reviewEvents.sort() }
  if (authority.fields['Policy tracker']) {
    authority.fields.policies = authority.fields['Policy tracker']
      .filter(policyId => !deletedPolicyIds.includes(policyId))
  }
  for (const key of Object.getOwnPropertyNames(authority.fields)) {
    if (!config.input.authorities.fields.includes(key)) {
      delete authority.fields[key]
    }
  }
  output.authorities.push(authority.fields)
}
console.log(`${output.authorities.length} authorities loaded`)

// iterate through the vaccines to process each one; push the result fo the output.vaccines array
for (const vaccine of inputData.vaccines) {
  vaccine.fields.id = vaccine.id
  if (vaccine.fields.Policies) {
    vaccine.fields.Policies = vaccine.fields.Policies
      .filter(policyId => !deletedPolicyIds.includes(policyId))
  }
  for (const key of Object.getOwnPropertyNames(vaccine.fields)) {
    if (!config.input.vaccines.fields.includes(key)) {
      delete vaccine.fields[key]
    }
  }
  output.vaccines.push(vaccine.fields)
}
console.log(`${output.vaccines.length} vaccines loaded`)

// crosscheck policy counts
const authorityPoliciesFlatMap = output.authorities.flatMap(authority => authority.policies || [])
console.log(`${authorityPoliciesFlatMap.length} policies connected to authorities (should equal number of policies loaded)`)
if (authorityPoliciesFlatMap.length !== output.policies.length) {
  console.error('**** There may be orphaned policies ****')
} else {
  console.debug('There do not appear to be any orphaned policies')
}

const fs = require('fs')

// coerce all the object keys to camelCase (they are mostly plain language in Airtable)
const camelcaseKeys = require('camelcase-keys')
const camelizedOutput = camelcaseKeys(output, { deep: true, exclude: ['id'] })

console.info(`${Date.now() - startDate} milliseconds processing time`)

// write output to disk
if (config.output.normalFilename) {
  try {
    fs.writeFileSync(process.cwd() + config.output.normalFilename, JSON.stringify(camelizedOutput, null, 2), 'utf8')
    console.info(`all records written to ${config.output.normalFilename}`)
  } catch (err) {
    console.error(`could not write to ${config.output.normalFilename}`, err)
    process.exitCode = 1
  }
}

if (config.output.minifiedFilename) {
  try {
    fs.writeFileSync(process.cwd() + config.output.minifiedFilename, JSON.stringify(camelizedOutput), 'utf8')
    console.info(`all records written to ${config.output.minifiedFilename}`)
  } catch (err) {
    console.error(`could not write to ${config.output.minifiedFilename}`, err)
    process.exitCode = 1
  }
}
