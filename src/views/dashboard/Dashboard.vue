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
          color="orange"
          icon="mdi-calculator"
          title="Saldo Actual"
          value="184"
          sub-icon="mdi-alert"
          sub-icon-color="red"
          sub-text="Ganancias"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
      }
    },

    methods: {
    },
  }
</script>
