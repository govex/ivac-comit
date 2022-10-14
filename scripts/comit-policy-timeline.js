// get input filename from the command line
const inputFilename = process.argv[2] || "static/data/comit-v1.min.json"

// if it wasn't specified, end here
if (!inputFilename) {
  console.error('Usage: node comit-policy-timeline.js <input filename>')
  process.exit(1)
}

// get output filename from the command line
let outputFilename = process.argv[3] || 'content/data/comit-v1.json'

// if it wasn't specified, use the input filename as the output filename
if (!outputFilename) {
  console.warn('No output filename specified, using input filename: ' + inputFilename)
  outputFilename = inputFilename
}

// read the input file
const comitData = require(process.cwd() + '/' + inputFilename)

// helper to map event types to policy fields
const policyEventTypes = {
  "pregnancyPolicyPositionChange": { policyField: "pregnancyCode", clockKey: "pregnancy" },
  "lactationPolicyPositionChange": { policyField: "lactationCode", clockKey: "lactation" }
}

// set up a map of policies
const policiesMap = new Map()
for (const policy of comitData.policies) {
  policiesMap.set(policy.id, policy)
}

const totalCountryCount = comitData.countries.filter(c => c.wbRegion).length

// set up some helper objects
const defaultClock = { 1: 0, 2:0, 3:0, 4:0, 5:0, 999: 0, unknown: totalCountryCount }

const allEvents = comitData.countries
  .flatMap(c => c.policyPositionEvents || [])
  .sort((a, b) => a.date.localeCompare(b.date))
  .map(ppe => ({
    ...ppe,
    newCode: policiesMap.get(ppe.policy)[policyEventTypes[ppe.type].policyField][0].rank,
    oldCode: ppe.previousPolicy
      ? policiesMap.get(ppe.previousPolicy)[policyEventTypes[ppe.type].policyField][0].rank
      : undefined
  }))

// group all events by date
const allEventsByDate = new Map()
allEvents.forEach(e => {
  if (allEventsByDate.has(e.date)) {
    allEventsByDate.get(e.date).push(e)
  } else {
    allEventsByDate.set(e.date, [e])
  }
})

const timeline = []

const thisDate = new Date(allEvents[0].date + "T00:00:00Z")
const now = new Date()
const clocks = Object.fromEntries(Object.values(policyEventTypes).map(pet => [pet.clockKey, Object.assign({}, defaultClock)]))

while (thisDate < now) {
  const thisDateString = thisDate.toISOString().slice(0,10)
  const eventsForThisDate = allEventsByDate.get(thisDateString) || []
  eventsForThisDate.forEach(event => {
    clocks[policyEventTypes[event.type].clockKey][event.newCode] += 1
    if (event.oldCode) {
      clocks[policyEventTypes[event.type].clockKey][event.oldCode] -= 1
    } else {
      clocks[policyEventTypes[event.type].clockKey].unknown -= 1
    }
  })

  timeline.push({
    date: thisDate.toISOString(),
    events: eventsForThisDate,
    ...Object.fromEntries(Object.values(policyEventTypes).map(pet => [pet.clockKey, Object.assign({}, clocks[pet.clockKey])]))
  })
  // add 1 day to thisDate
  thisDate.setUTCDate(thisDate.getUTCDate() + 1)
}

comitData.statsTimeline = timeline

const fs = require('fs')
try {
  fs.writeFileSync(process.cwd() + '/' + outputFilename, JSON.stringify(comitData), 'utf8')
  console.info(`wrote country policy position event data to ${outputFilename}`)
} catch (err) {
  console.error('Error writing file ' + outputFilename + ': ' + err)
}