<template>
  <div>
    <b-navbar toggleable="md" variant="dark" type="dark" class="mb-5" style="padding: 0 1rem">
      <div class="container">
        <b-navbar-brand to="/">
          <img height="75px" src="/img/comit-dark-background.png" alt="COMIT LOGO">
          <sup><b-badge variant="warning">beta</b-badge></sup>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="w-100 justify-content-around lead">
            <b-nav-item-dropdown text="Vaccine Policies">
              <b-dropdown-item to="/pregnancy">
                Pregnancy
              </b-dropdown-item>
              <b-dropdown-item to="/lactation">
                Lactation
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <!-- <b-nav-item-dropdown text="Country Details">
              <b-dropdown-item to="#">
                Placeholder
              </b-dropdown-item>
            </b-nav-item-dropdown> -->
            <b-nav-item to="/about/methodology">
              Our Approach
            </b-nav-item>
            <b-nav-item-dropdown text="About">
              <b-dropdown-item to="/about/background">
                Background
              </b-dropdown-item>
              <b-dropdown-item to="/about/team">
                Team
              </b-dropdown-item>
              <b-dropdown-item to="/about/team/#disclaimer">
                Disclaimer
              </b-dropdown-item>
              <b-dropdown-item to="/about/contact">
                Contact Us
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
    <b-container>
      <Nuxt />
    </b-container>
    <footer class="container-fluid text-white mt-5" style="background-color: #3E454F">
      <b-container class="p-3">
        <b-row>
          <b-col class="my-auto">
            <img width="100%" src="/img/comit-dark-background.png">
          </b-col>
          <b-col class="text-right my-auto">
            A project of
          </b-col>
          <b-col class="my-auto">
            <img width="100%" src="/img/berman-dark-background.svg">
          </b-col>
          <b-col class="my-auto">
            <img width="100%" src="/img/cir-tall-dark-background.png">
          </b-col>
        </b-row>
        <b-row class="my-3">
          <b-col>
            <p>CITATION</p>
            <p>Berman Institute of Bioethics &amp; Center for Immunization Research, Johns Hopkins University. Covid-19 Maternal Immunization Tracker (COMIT). www.comitglobal.org. Accessed: {{ new Date().toLocaleString() }}.</p>
          </b-col>
          <b-col>
            <p>CONTACT</p>
            <p>If you have questions or comments, or would like to notify us of any technical issues you are experiencing with COMIT, please get in touch. We welcome and appreciate your valuable feedback.</p>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>

<script>
// export default {
//   data () {
//     return { countries: [], filters: {} }
//   },
//   async fetch () {
//     console.log('layout fetch called')
//     await this.$http.$get('/data/comit-v1.min.json')
//   }
// }
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.recommended {color: #54BCD6; fill: #54BCD6}
.recommended-bg {background-color: #54BCD6}
.permitted-for-all {color: #3D7632; fill: #3D7632}
.permitted-for-all-bg {background-color: #3D7632}
.permitted-with-qualifications {color: #FDB430; fill: #FDB430}
.permitted-with-qualifications-bg {background-color: #FDB430}
.not-recommended-with-exceptions {color: #FA774A; fill: #FA774A}
.not-recommended-with-exceptions-bg {background-color: #FA774A}
.prohibited {color: #9B001D; fill: #9B001D}
.prohibited-bg {background-color: #9B001D}
.no-language {color: darkgray; fill: darkgray}
.no-language-bg {background-color: darkgray}
</style>
