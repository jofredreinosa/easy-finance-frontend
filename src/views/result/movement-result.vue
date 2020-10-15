<template>
  <div>
    <v-breadcrumbs :items="breadcrumbsItems" />
    <v-container
      fluid
    >
      <base-material-card
        icon=""
        title="Resultados"
      >
        <v-data-table
          dense
          :headers="headers"
          :items="resultItems"
          :loading="loading"
          height="220px"
          class="mt-5"
        />
      </base-material-card>
    </v-container>
  </div>
</template>

<script>
  /* import config from '../../config.json'
  import axios from 'axios' */

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
      search: '',
      headers: [
        {
          text: 'Tipo de Movimiento', align: 'start', sortable: true, value: 'desctype',
        },
        {
          text: 'Cantidad de movimientos', align: 'center', sortable: true, value: 'quantity',
        },
        {
          text: 'Total', align: 'start', sortable: true, value: 'formattedtotal',
        },
      ],
      resultItems: [],
      loading: false,
      snackShow: false,
      snackText: '',
      snackColor: '',
      snackTimeOut: 2500,
    }),

    mounted () {
      this.loadInitialData()
    },

    methods: {

      loadInitialData () {

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
