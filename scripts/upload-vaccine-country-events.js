const vaccineCountryEventsToUploadFilename = 'scripts/vaccine-country-events-to-upload.json'

const Airtable = require('airtable')
const vaccineCountryEventsToUpload = require(process.cwd() + '/' + vaccineCountryEventsToUploadFilename)

if (process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_VACCINECOUNTRYEVENTS_TABLENAME) {
  const airtableAPIKey = process.env.AIRTABLE_API_KEY
  const base = new Airtable({ apiKey: airtableAPIKey }).base(process.env.AIRTABLE_BASE_ID)
  console.log(`airtable connection initialized; uploading ${vaccineCountryEventsToUpload.length} response records`)
  for (const vaccineCountryEvent of vaccineCountryEventsToUpload) {
    base(process.env.AIRTABLE_VACCINECOUNTRYEVENTS_TABLENAME).create(
      vaccineCountryEvent, (err, record) => {
        if (err) { console.log(`vaccineCountryEvent: ${vaccineCountryEvent} - ${err}`) }
      })
  }
} else {
  console.error('Missing an environment variable. (AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_VACCINECOUNTRYEVENTS_TABLENAME) ')
  process.exitCode = 1
}
