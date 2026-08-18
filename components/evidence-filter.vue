<template>
  <div class="flex flex-column mt-3">
    <b-form-group label-for="drt" label="Include categories:">
      <b-form-checkbox-group 
        :options="evidenceCategories" 
        v-model="selectedEvidenceCategories" 
        @change="() => { updateValue() }"
        class="d-flex flex-row flex-wrap align-items-center"
      >
        <b-button 
          variant="link" 
          @click="(e) => {selectedEvidenceCategories = evidenceCategories; updateValue(); e.target.blur()}"
        >
          show all
        </b-button>
      </b-form-checkbox-group>      
    </b-form-group>
    <svg :viewBox="`0 0 ${locals.width} ${locals.height}`"></svg>
    <div class="d-flex flex-row align-items-center">
      <span class="m-1">Showing {{
        Array.isArray(selectionRange) && selectionRange.length === 2
        ? selectionRange[0].toISOString().slice(0,10) + ' to ' + selectionRange[1].toISOString().slice(0,10)
        : 'all dates (select a range on the above graph to filter the list)' }}
      </span>
      <b-button :style="{ 'visibility': Array.isArray(selectionRange) && selectionRange.length === 2 ? 'visible' : 'hidden'}" variant="link" @click="(e) => { selectionReset() }">show all</b-button>
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  export default {
    emits: ['update:modelValue'],
    data () {
      return {
        selectedEvidenceCategories: [],
        selecting: false,
        selectionRange: undefined,
        locals: {
          height: 100,
          width: 1000,
          bins: 30
        },
        value: []
      }
    },
    props: {
      aspectRatio: {
        type: Number,
        default() { return 4 }
      },
      endDate: {
        type: String,
        default () { return undefined }
      },
      evidenceTimeline: {
        type: Array,
        default () { return [] }
      },
      graphHeight: {
        type: Number,
        default () { return undefined }
      },
      policyBins: {
        type: Number,
        default () { return 30 }
      },
      policyTimeline: {
        type: Array,
        default () { return [] }
      },
      policyType: {
        type: Object,
        default () { return undefined }
      },
      startDate: {
        type: String,
        default () { return undefined }
      }
    },
    created () {
      this.selectedEvidenceCategories = this.evidenceCategories
      this.value = this.evidenceTimeline.slice()
      this.locals.height = this.graphHeight || Math.round(this.locals.width / this.aspectRatio)
    },
    mounted () {

      this.locals.width = this.$el.offsetWidth
      this.locals.height = this.graphHeight || Math.round(this.locals.width / this.aspectRatio)
      this.locals.svg = d3.select(this.$el.querySelector("svg"))
      this.locals.scaleX = d3
          .scaleTime(this.displayedDateRange, [10, this.locals.width - 10])
          .clamp(true),
      this.locals.scaleY = d3
          .scaleLinear()
          .domain([0, d3.max(this.statsTimeline, (d) => d.value)])
          .range([20, this.locals.height]),
      this.locals.scalePolicyColors = d3
          .scaleOrdinal()
          .domain(Object.keys(this.policyType.lookup))
          .range(
            Object.values(this.policyType.lookup)
              .map(v => v.color)
          )

      this.locals.svg.append('g').attr('id', 'areas')
      this.locals.svg.append('g').attr('id', 'lines')
      this.locals.svg.append("g").attr('id', 'axis').attr('transform', 'translate(0, 20)')

      const axis = d3.axisTop(this.locals.scaleX)
        .ticks(this.locals.width / 100)

      this.locals.svg.select('#axis')
        .call(axis)

      this.locals.svg.append("line")
        .attr("x1", -10)
        .attr("x2", -10)
        .attr("y1", 0)
        .attr("y2", this.locals.height)
        .attr("id", "mousehover")
        .style("stroke", "lightgrey");

      this.locals.svg.append("rect")
        .attr("id", "darken-left")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", this.locals.height)
        .attr("width", 0)
        .style("opacity", "0.3")
        .style("fill", "black")
        .style("stroke: none")

      this.locals.svg.append("rect")
        .attr("id", "darken-right")
        .attr("x", this.locals.width)
        .attr("y", 0)
        .attr("height", this.locals.height)
        .attr("width", 0)
        .style("opacity", "0.3")
        .style("fill", "black")
        .style("stroke: none")

      this.locals.svg.on("mousemove", (e) => {
        // const hoveredDate = this.locals.scaleX.invert(e.offsetX).toISOString().slice(0, 10)
        // d3.select("#mousehover").attr("x1", e.offsetX).attr("x2", e.offsetX)
        // this.$emit("hover", hoveredDate)

        if (this.selecting) {
          this.selectionUpdate(e.offsetX, e.movementX)
        }
      })


      // this.svg.on("mouseout", (e) => {
      //   if (this.selecting) {
      //     d3.select("#darken-right")
      //     .attr("x", e.offsetX)
      //     .attr("width", this.svgProperties.width - e.offsetX)
      //     this.selecting = false
      //   }
      // })

      this.locals.svg.on("mousedown", (e) => {
        this.selecting = true
        this.selectionRange = []
        this.selectionRange.push(this.locals.scaleX.invert(e.offsetX))
        d3.select("#darken-left")
          .attr("width", e.offsetX)
        d3.select("#darken-right")
          .attr("x", e.offsetX +1 )
          .attr("width", this.locals.width - e.offsetX - 1)
      })

      this.locals.svg.on("mouseup", (e) => {
        const secondDate = this.locals.scaleX.invert(e.offsetX)

        if (this.selectionRange[0] > secondDate ) {
          this.selectionRange.unshift(secondDate)
        } else {
          this.selectionRange.push(secondDate)
        }
        this.selecting = false
        this.updateValue()
      })

      this.updateGraph()

    },
    updated () {
      this.updateGraph()
    },
    watch: {
      policyType (oldValue, newValue) {
        this.updateGraph()
      },
    },
    computed: {
      displayedDateRange () {
        const startDate = new Date(this.startDate)
        const endDate = new Date(this.endDate)

        return [
          !isNaN(startDate) ? startDate : d3.min(this.policyTimeline, d => d.date),
          !isNaN(endDate) ? endDate : d3.max(this.policyTimeline, d => d.date)
        ]
      },
      evidenceCategories () {
        return [...new Set(this.evidenceTimeline.map(e => e.Category))]
      },
      evidenceTimelineFilteredForSelectedCategories () {
        return this.evidenceTimeline
          .filter(e => this.selectedEvidenceCategories.includes(e.Category))
      },
      statsTimeline () {
        return this.policyTimeline.flatMap((te) => {
          return Object.entries(te[this.policyType.codingType]).map(
            ([key, value]) => {
              return {
                date: new Date(te.date),
                code: key,
                value
              };
            }
          );
        })
      }
    },
    methods: {
      selectionReset () {
        d3.select('#darken-left').attr('width', 0)
        d3.select('#darken-right').attr('x', this.locals.width).attr('width', 0)
        this.selectionRange.splice(0)

        this.updateValue()
      },
      selectionUpdate (pointerX) {
        const left = d3.select("#darken-left")
        const leftWidth = left.attr("width")
        const right = d3.select("#darken-right")
        const rightX = right.attr("x")
        
        if (pointerX < leftWidth) {
          left.attr("width", pointerX)
        }

        if (pointerX > rightX) {
          right.attr("x", pointerX)
          right.attr("width", this.locals.width - pointerX)
        }
      },

      updateGraph() {

        const stackableKeys = [...new Set(this.statsTimeline.map((s) => s.code))]

        const codingType = this.policyType.codingType

        const stackableAreas = d3
          .stack()
          .keys(stackableKeys)
          .value((item, key) => item[codingType][key])
          (this.policyTimeline)

        const areaGenerator = d3
          .area()
          .x((d) => this.locals.scaleX(new Date(d.data.date)))
          .y0((d) => this.locals.scaleY(d[0]))
          .y1((d) => this.locals.scaleY(d[1]))

        this.locals.svg.select("#areas").selectAll("path")
          .data(stackableAreas)
          .join("path")
            .attr("d", areaGenerator)
            .attr("fill", (d) => this.locals.scalePolicyColors(d.key))
            .style("strokewidth", 0);

        const startDate = this.displayedDateRange[0]
        const binnedEvidence = d3
          .bin()
          .thresholds(Math.round(this.locals.width / this.policyBins))
          .value((d) => d3.max([startDate, d.date]))
          (this.evidenceTimelineFilteredForSelectedCategories)
          .filter(b => b.length > 0)

        this.locals.svg.select("#lines")
          .selectAll("line")
          .data(binnedEvidence)
          .join("line")
            .attr("x1", (d) => this.locals.scaleX(new Date(d.x0 + (d.x1 - d.x0) / 2)))
            .attr("x2", (d) => this.locals.scaleX(new Date(d.x0 + (d.x1 - d.x0) / 2)))
            .attr("y1", this.locals.scaleY(0))
            .attr("y2", this.locals.height)
            .style("stroke", "black")
            .style("stroke-width", (d) => d.length)
        
        this.locals.svg.select("#lines")
          .selectAll("circle")
          .data(binnedEvidence)
          .join("circle")
            .attr("cx", (d) => this.locals.scaleX(new Date(d.x0 + (d.x1 - d.x0) / 2)))
            .attr("cy", this.locals.height - 11)
            .attr("r", 11)
            .attr("fill", "#ffffff")
            .attr("stroke", "#A0A0A0")
        
        this.locals.svg.select("#lines")
          .selectAll("text")
          .data(binnedEvidence)
          .join("text")
            .attr("x", (d) => this.locals.scaleX(new Date(d.x0 + (d.x1 - d.x0) / 2)))
            .attr("y", this.locals.height - 9)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text((d) => d.length)

      },
      updateValue () {
        let newValue = this.evidenceTimelineFilteredForSelectedCategories

        if (Array.isArray(this.selectionRange) && this.selectionRange.length === 2) {
          newValue = newValue.filter(e => e.date >= this.selectionRange[0] && e.date <= this.selectionRange[1])
        }

        this.value.length = 0
        this.value.push(...newValue)
        this.updateGraph()
        this.$emit("change", this.value)
      }
    }
  }
</script>

<style>
  svg {
    cursor: text
  }
  text {
    user-select: none
  }
</style>