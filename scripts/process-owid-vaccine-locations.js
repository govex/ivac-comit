const countriesFilename = 'scripts/countries.json'
const vaccinesFilename = 'scripts/vaccines.json'
const vaccineCountryEventsFilename = 'scripts/vaccine-country-events.json'
const owidVaccineLocationsFilename = 'scripts/owid-vaccine-locations.csv'
const duplicateVaccineCountryEventsFilename = 'scripts/vaccine-country-events-duplicate.json'
const outputFilename = 'scripts/vaccine-country-events-to-upload.json'
const outputErrorsFilename = 'scripts/owid-vaccine-location-errors.json'

// load the data from airtable files
const countries = require(countriesFilename)
const vaccines = require(vaccinesFilename)
const vaccineCountryEvents = require(vaccineCountryEventsFilename)

const fs = require('fs')

// load countries into a Map keyed by airtable identifier
const countriesByIdMap = new Map(countries.map(country => [country.id, country]))
console.log(`loaded ${countriesByIdMap.size} countries by id`)

// load countries into a Map keyed by ISO3
const countriesByIso3Map = new Map(countries.map(country => [country.fields.iso3166Alpha3Code, country]))
console.log(`loaded ${countriesByIso3Map.size} countries by ISO-3`)

// load vaccines into a Map keyed by airtable identifier
const vaccinesMap = new Map(vaccines.map(vaccine => [vaccine.id, vaccine]))
console.log(`loaded ${vaccinesMap.size} vaccines by id`)

// load vccines into a Map keyed by OWID identifier; for this we need to split the OWID identifiers from the airtable field, separated by commas
const vaccinesByOwidNameMap = new Map(
  vaccines.reduce((output, vaccine) => {
    if (vaccine.fields.owidName) {
      vaccine.fields.owidName.split(',').forEach((name) => {
        output.push([name, vaccine])
      })
    }
    return output
  }, [])
)
console.log(`loaded vaccines by ${vaccinesByOwidNameMap.size} owidNames`)

// set up an empty array to detect duplicate vaccine-country-events. if things are working properly, this array should always be empty
const duplicateVaccineCountryEvents = []

// set up a new map. entries are keyed in the format 'owidName|countryIso3|eventType'
// where there are multiple identifiers for the same vaccine, those entries are duplicated in this map
const vaccineCountryEventsMap = new Map()
vaccineCountryEvents.forEach((vaccineCountryEvent) => {
  if (vaccineCountryEvent.fields.Vaccine && vaccineCountryEvent.fields.Country) {
    const vaccine = vaccinesMap.get(vaccineCountryEvent.fields.Vaccine[0])
    const country = countriesByIdMap.get(vaccineCountryEvent.fields.Country[0])
    vaccine.fields.owidName?.split(',').forEach((vaccineName) => {
      const vaccineCountryEventsMapKey = vaccineName + '|' + country.fields.iso3166Alpha3Code + '|' + vaccineCountryEvent.fields.EventType
      if (!vaccineCountryEventsMap.has(vaccineCountryEventsMapKey)) {
        vaccineCountryEventsMap.set(vaccineCountryEventsMapKey, vaccineCountryEvent)
      } else {
        duplicateVaccineCountryEvents.push(vaccineCountryEvent)
      }
    })
  }
})
console.log(`loaded ${vaccineCountryEventsMap.size} vaccine-country-events`)
console.warn(`found ${duplicateVaccineCountryEvents.length} duplicate vaccine-country-events`)
if (duplicateVaccineCountryEvents.length > 0) { console.warn('***there may be an issue with the source vaccine-country-events data in airtable***') }

fs.writeFile(duplicateVaccineCountryEventsFilename, JSON.stringify(duplicateVaccineCountryEvents, null, 2), 'utf8', (err) => {
  if (err) {
    console.error(err)
    process.exitCode = 1
  } else {
    console.info(`${duplicateVaccineCountryEvents.length} records written to '${duplicateVaccineCountryEventsFilename}'`)
  }
})

const owidVaccineLocations = []
const fcsv = require('fast-csv')
fcsv.parseFile(owidVaccineLocationsFilename, { headers: true })
  // don't continue if there is an error
  .on('error', (error) => { console.error(error); process.exit(1) })
  // add each row to the array
  .on('data', row => owidVaccineLocations.push(row))
  // when the file is done, process the data
  .on('end', (rowCount) => {
    console.info(`read ${owidVaccineLocations.length}/${rowCount} rows from '${owidVaccineLocationsFilename}'`)
    const newVaccineCountryEvents = []
    let rowCounter = 0
    owidVaccineLocations.forEach((owidVaccineLocation) => {
      owidVaccineLocation.vaccines?.split(', ').forEach((owidVaccineName) => {
        rowCounter += 1
        // console.log(owidVaccineName + '|' + owidVaccineLocation.iso_code)
        if (!vaccineCountryEventsMap.has(owidVaccineName + '|' + owidVaccineLocation.iso_code + '|Started Administering Vaccine')) {
          newVaccineCountryEvents.push({ vaccine: owidVaccineName, ...owidVaccineLocation })
        }
      })
    })
    console.log(`found ${rowCounter} records, of which ${newVaccineCountryEvents.length} are new events`)

    const output = newVaccineCountryEvents.reduce((output, newVaccineCountryEvent) => {
      const country = countriesByIso3Map.get(newVaccineCountryEvent.iso_code)
      const vaccine = vaccinesByOwidNameMap.get(newVaccineCountryEvent.vaccine)
      if (country && vaccine) {
        output.newEvents.push({
          Country: [country.id],
          Vaccine: [vaccine.id],
          EventType: 'Started Administering Vaccine',
          Source: newVaccineCountryEvent.source_website
        })
      } else {
        output.errors.push({
          owidName: newVaccineCountryEvent.vaccine,
          owidIso3Code: newVaccineCountryEvent.iso_code,
          matchedCountry: !!country,
          matchedVaccine: !!vaccine
        })
      }
      return output
    }, { newEvents: [], errors: [] })

    // write the output file to readable format
    fs.writeFile(outputFilename, JSON.stringify(output.newEvents, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err)
        process.exitCode = 1
      } else {
        console.info(`${output.newEvents.length} records written to '${outputFilename}'`)
      }
    })

    fs.writeFile(outputErrorsFilename, JSON.stringify(output.errors, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err)
        process.exitCode = 1
      } else {
        console.info(`${output.errors.length} records written to '${outputErrorsFilename}'`)
      }
    })
  })
