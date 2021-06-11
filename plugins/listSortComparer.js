export default (somethingIWontUse, inject) => {
  inject('listSortComparer', (aRow, bRow, key, sortDesc, formatter, compareOptions, compareLocale) => {
    let aRowRank = 999
    let bRowRank = 999
    switch (key) {
      case 'name':
        if (aRow.name === 'Global') { return -1 }
        if (bRow.name === 'Global') { return 1 }
        return aRow.name.localeCompare(bRow.name)
      case 'wbIncomeLevelName':
        if (aRow.wbIncomeLevelSort < bRow.wbIncomeLevelSort) { return -1 }
        if (aRow.wbIncomeLevelSort > bRow.wbIncomeLevelSort) { return 1 }
        return 0
      case 'providerVisit':
        if (aRow.providerVisit) {
          aRowRank = aRow.providerVisit.rank
        }
        if (bRow.providerVisit) {
          bRowRank = bRow.providerVisit.rank
        }
        if (aRowRank < bRowRank) { return -1 }
        if (aRowRank > bRowRank) { return 1 }
        return 0
      case 'pregnancyTest':
        if (aRow.pregnancyTest) {
          aRowRank = aRow.pregnancyTest.rank
        }
        if (bRow.pregnancyTest) {
          bRowRank = bRow.pregnancyTest.rank
        }
        if (aRowRank < bRowRank) { return -1 }
        if (aRowRank > bRowRank) { return 1 }
        return 0
      case 'mostPermissivePregnancyCode':
      case 'mostPermissiveLactationCode':
        if (aRow[key]) {
          aRowRank = aRow[key][0].rank
        }
        if (bRow[key]) {
          bRowRank = bRow[key][0].rank
        }
        if (aRowRank < bRowRank) { return -1 }
        if (aRowRank > bRowRank) { return 1 }
        return 0
      default:
        return undefined
    }
  })
}
