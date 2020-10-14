<template>
  <div>
    <v-breadcrumbs :items="breadcrumbsItems" />
    <v-container
      fluid
    >
      <base-material-card
        icon=""
        title="Tipos de Transacción"
      >
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              color="primary"
              absolute
              right
              v-bind="attrs"
              v-on="on"
              @click="createItem()"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Nuevo Tipo de Transacción</span>
        </v-tooltip>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar..."
          hide-details
          style="width:30%;"
        />
        <v-data-table
          dense
          :headers="headers"
          :items="transactionTypes"
          :search="search"
          :loading="loading"
          height="220px"
          class="mt-5"
        >
          <template v-slot:item.operationtype="{ item }">
            <span
              v-show="item.operationtype == 'I'"
              class="text-blue"
            >
              ENTRADA (+)
            </span>
            <span
              v-show="item.operationtype == 'E'"
              class="text-red"
            >
              SALIDA (-)
            </span>
          </template>

          <template
            v-slot:item.actions="{ item }"
          >
            <v-icon
              small
              dark
              class="mr-8"
              color="info"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>

            <v-icon
              small
              dark
              color="error"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
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
            color="blue"
            text
            v-bind="attrs"
            @click="snackShow = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>

    <transactiontypecreateoredit
      ref="transactiontypecreateoredit"
      @loadInitialData="loadInitialData"
    />
    <confirm
      ref="confirm"
    />
  </div>
</template>

<script>
  import config from '../../../config.json'
  import axios from 'axios'
  import confirm from '../../shared/ConfirmDialog'
  import transactiontypecreateoredit from './transactionTypes-createOrEdit'

  export default {
    name: 'TransactionTypesList',

    components: {
      transactiontypecreateoredit,
      confirm,
    },

    data: () => ({
      breadcrumbsItems: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '',
        },
        {
          text: 'Listado de Tipos de Transacción',
          disabled: true,
          to: '',
        },
      ],
      search: '',
      headers: [
        {
          text: 'Código', align: 'start', sortable: true, value: 'codetype',
        },
        {
          text: 'Descripción', align: 'start', sortable: true, value: 'desctype',
        },
        {
          text: 'Tipo de operación', align: 'start', sortable: true, value: 'operationtype',
        },
        {
          text: 'Acciones', align: 'center', sortable: false, value: 'actions',
        },
      ],
      transactionTypes: [],
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
        const url = config.API_ENDPOINT + 'transactiontype'
        this.loading = true
        axios.get(url).then((result) => {
          if (result.data) {
            this.transactionTypes = result.data.data
          }
        }).catch((error) => {
          this.loading = false
          this.snackText = error
          this.snackColor = 'error'
          this.snackShow = true
        }).finally(() => { this.loading = false })
      },

      createItem () {
        this.$refs.transactiontypecreateoredit.show()
      },

      editItem (rowData) {
        const item = rowData
        this.$refs.transactiontypecreateoredit.show(item)
      },

      async deleteItem (rowData) {
        const message = {
          title: '¿Seguro de Eliminar el tipo de transacción?',
          subtitle: rowData.codetype + ' - ' + rowData.desctype,
        }
        if (await this.$refs.confirm.open('Eliminar', message, { color: 'error', confirmText: 'Si, eliminar', cancelText: 'No, cerrar' })) {
          const url = config.API_ENDPOINT + 'transactiontype/' + rowData.id
          this.loading = true
          axios.delete(url).then((result) => {
            if (result) {
              this.snackText = result.data.message
              this.snackColor = 'success'
              this.snackShow = true
              this.loadInitialData()
            } else {
              this.snackText = result.data.message
              this.snackColor = 'error'
              this.snackShow = true
            }
          }).catch((error) => {
            this.loading = false
            this.snackText = error
            this.snackColor = 'error'
            this.snackShow = true
          }).finally(() => { this.loading = false })
        }
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
