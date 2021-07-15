<template>
  <div>
    <b-navbar toggleable="md" variant="primary" type="dark" style="padding: 0 1rem">
      <div class="container">
        <b-navbar-brand to="/">
          <img height="75px" src="/img/comit-dark-background.png" alt="COMIT LOGO">
          <!-- <sup v-if="showBetaBadge"><b-badge variant="warning">beta</b-badge></sup> -->
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="w-100 justify-content-around lead">
            <b-nav-item-dropdown text="Policies">
              <b-dropdown-item to="/pregnancy">
                Pregnancy explorer
              </b-dropdown-item>
              <b-dropdown-item to="/lactation">
                Lactation explorer
              </b-dropdown-item>
              <b-dropdown-item to="/vaccines/matrix/pregnancy">
                Pregnancy vaccine/country matrix
              </b-dropdown-item>
              <b-dropdown-item to="/vaccines/matrix/lactation">
                Lactation vaccine/country matrix
              </b-dropdown-item>
              <b-dropdown-item to="/vaccines/summary">
                Vaccine comparison summary
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item to="/about/methodology">
              Our Approach
            </b-nav-item>
            <b-nav-item-dropdown text="About">
              <b-dropdown-item to="/about/comit#overview">
                Overview
              </b-dropdown-item>
              <b-dropdown-item to="/about/comit#Background">
                Background
              </b-dropdown-item>
              <b-dropdown-item to="/about/comit#maps-and-features">
                Maps &amp; Features
              </b-dropdown-item>
              <b-dropdown-item to="/about/comit#team">
                Team
              </b-dropdown-item>
              <b-dropdown-item to="/about/comit#disclaimers">
                Disclaimers
              </b-dropdown-item>
              <b-dropdown-item to="/about/contact">
                Contact Us
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
    <b-container fluid class="bg-dark text-light mb-4">
      <b-container>
        <em>COVID-19 Vaccine policies for pregnant and lactating people worldwide.</em>
      </b-container>
    </b-container>
    <b-container>
      <Nuxt />
    </b-container>
    <footer class="container-fluid text-white mt-5 bg-primary text-light">
      <b-container class="p-3">
        <b-row class="align-items-center justify-content-between mb-3">
          <img width="30%" src="/img/comit-dark-background.png">
          <!-- <span>A project of</span> -->
          <img width="50%" src="/img/universitylogo-bi-cir-combined-gentona-pdflogo.svg">
        </b-row>
        <b-row class="justify-content-start mb-5">
          <b-col>
            The COMIT policy tracker was developed with support from the
            <b-link href="https://www.gatesfoundation.org/">
              Bill &amp; Melinda Gates Foundation
            </b-link> and
            <b-link href="https://wellcome.org/">
              Wellcome
            </b-link>.
          </b-col>
        </b-row>
        <b-row class="align-items">
          <b-col col md="6">
            <p class="text-uppercase">
              Citation
            </p>
            <p>
              Berman Institute of Bioethics &amp; Center for Immunization Research, Johns Hopkins University. Covid-19 Maternal Immunization Tracker (COMIT). www.comitglobal.org. Accessed: {{ new Date().toLocaleString() }}.
            </p>
          </b-col>
          <b-col col md="6">
            <p class="text-uppercase">
              Contact
            </p>
            <p>
              If you have questions or comments, or would like to notify us of any technical issues you are experiencing with COMIT, please
              <b-link to="/about/contact">
                get in touch
              </b-link>
              . We welcome and appreciate your valuable feedback.
            </p>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>

<script>
export default {
  async fetch () {
    const myData = await fetch(`http://localhost:${process.env.PORT || 3000}/data/comit-v1.min.json`).then(res => res.json())
    const myReconstructedData = this.$root.$reconstructReferences(myData)
    await this.$store.commit('countries/load', myReconstructedData.countries)
    await this.$store.commit('authorities/load', myReconstructedData.authorities)
    await this.$store.commit('policies/load', myReconstructedData.policies)
    await this.$store.commit('vaccines/load', myReconstructedData.vaccines)
  },
  computed: {
    showBetaBadge () {
      return process.end.HIDE_BETA_BADGE !== 'true'
    }
  }
}
</script>
