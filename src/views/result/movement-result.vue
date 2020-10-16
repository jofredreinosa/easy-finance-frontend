<template>
  <div>
    <v-breadcrumbs :items="breadcrumbsItems" />
    <v-container
      fluid
    >
      <base-material-card
        icon=""
        :title="title"
      >
        <div class="mt-2">
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              Búsqueda por fechas
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateFormatted"
                    dense
                    label="Desde"
                    hint="DD/MM/YYYY"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    outlined
                    @blur="date = parseDate(dateFormatted)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  @input="menu1 = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateFormattedTo"
                    dense
                    label="Hasta"
                    hint="DD/MM/YYYY"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    outlined
                    @blur="dateTo = parseDate(dateFormattedTo)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dateTo"
                  no-title
                  @input="menu2 = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-btn
                small
                outlined
                fab
                color="teal"
                @click="searchMovements()"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-data-table
          dense
          :headers="headers"
          :items="resultItems"
          :loading="loading"
          height="170px"
          class="mt-5"
        >
          <template v-slot:item.formattedtotal="{ item }">
            <span
              v-show="item.operationtype == 'I'"
              class="text-blue"
            >
              {{ item.formattedtotal }}
            </span>
            <span
              v-show="item.operationtype == 'E'"
              class="text-red"
            >
              {{ item.formattedtotal }}
            </span>
          </template>
        </v-data-table>
      </base-material-card>
      <v-snackbar
        v-model="snackShow"
        :timeout="snackTimeOut"
        :color="snackColor"
      >
        {{ snackText }}

        <template
          v-slot:action="{ attrs }"
        >
          <v-btn
            color="accent"
            text
            v-bind="attrs"
            @click="snackShow = false"
          >
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
  import config from '../../config.json'
  import axios from 'axios'

  export default {
    name: 'MovementResult',
    data: () => ({
      breadcrumbsItems: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/',
        },
        {
          text: 'Resultados',
          disabled: true,
          to: '',
        },
      ],
      headers: [
        {
          text: 'Tipo de Movimiento', align: 'start', sortable: true, value: 'desctype',
        },
        {
          text: 'Cantidad de movimientos', align: 'center', sortable: true, value: 'quantity',
        },
        {
          text: 'Total', align: 'end', sortable: true, value: 'formattedtotal',
        },
      ],
      balance: '',
      title: '',
      date: null,
      dateFormatted: '',
      dateTo: null,
      dateFormattedTo: '',
      menu1: false,
      menu2: false,
      resultItems: [],
      loading: false,
      snackShow: false,
      snackText: '',
      snackColor: '',
      snackTimeOut: 3500,
    }),

    computedDateFormatted () {
      return this.formatDate(this.date)
    },

    computedDateFormattedTo () {
      return this.formatDate(this.dateTo)
    },

    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
      dateTo (val) {
        this.dateFormattedTo = this.formatDate(this.dateTo)
      },
    },

    mounted () {
      this.loadDataMovements()
    },

    methods: {

      loadDataMovements (from = null, to = null) {
        const url = config.API_ENDPOINT + 'result/' + from + '/' + to
        this.loading = true
        axios.get(url).then((result) => {
          this.resultItems = result.data.data
          this.calculateBalance(this.resultItems)
        }).catch((error) => {
          this.loading = false
          this.snackText = error
          this.snackColor = 'warning'
          this.snackShow = true
        }).finally(() => { this.loading = false })
      },

      searchMovements () {
        if ((this.date || this.dateTo) || (!this.date && !this.dateTo)) {
          if (this.validateDates()) {
            this.loadDataMovements(this.date, this.dateTo)
          }
        } else {
          this.snackText = 'Debe seleccionar fechas para realizar la búsqueda'
          this.snackColor = 'warning'
          this.snackShow = true
        }
      },

      validateDates () {
        if (this.date && this.dateTo && this.date > this.dateTo) {
          this.snackText = 'La fecha desde no puede ser mayor a la fecha hasta'
          this.snackColor = 'error'
          this.snackShow = true
          return false
        }
        return true
      },

      calculateBalance (data) {
        let balance = 0
        data.forEach(movement => {
          const value = movement.operationtype === 'I' ? parseFloat(movement.total) : parseFloat(movement.total) * -1
          balance += value
        })

        this.title = 'Total Balance: $' + new Intl.NumberFormat().format(balance)
      },

      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },

      parseDate (date) {
        if (!date) return null

        const chartSplit = date.indexOf('-') > 0 ? '-' : '/'
        const [day, month, year] = date.split(chartSplit)
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },
  }
</script>

<style scoped>
  .text-red {
    color: red;
  }
  .text-blue {
    color: blue;
  }
</style>
