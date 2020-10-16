<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
        <base-material-stats-card
          :color="subIconColor"
          icon="mdi-calculator"
          title="Saldo Actual"
          :value="balance"
          :sub-icon="subIcon"
          :sub-icon-color="subIconColor"
          :sub-text="subText"
          :loading="loading"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import config from '../../config.json'
  import axios from 'axios'
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        balance: '',
        subIcon: '',
        subIconColor: '',
        subText: '',
        loading: false,
      }
    },

    mounted () {
      this.loadDataMovements()
    },

    methods: {
      loadDataMovements () {
        const param = null
        const url = config.API_ENDPOINT + 'result/' + param + '/' + param
        this.loading = true
        axios.get(url).then((result) => {
          this.calculateBalance(result.data.data)
        }).catch((error) => {
          this.loading = false
          this.snackText = error
          this.snackColor = 'error'
          this.snackShow = true
        }).finally(() => { this.loading = false })
      },

      calculateBalance (data) {
        let balance = 0
        data.forEach(movement => {
          const value = movement.operationtype === 'I' ? parseFloat(movement.total) : parseFloat(movement.total) * -1
          balance += value
        })

        this.subIcon = balance < 0 ? 'mdi-cash-remove' : 'mdi-cash-check'

        this.subIconColor = balance < 0 ? 'red' : 'blue'

        this.subText = balance < 0 ? 'Balance Negativo' : 'Balance Positivo'

        this.balance = new Intl.NumberFormat().format(balance)
      },

    },
  }
</script>
