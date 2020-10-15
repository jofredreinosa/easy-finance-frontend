<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="70%"
      persistent
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
          dense
          flat
        >
          <v-toolbar-title
            class="white--text"
          >
            <v-icon
              v-if="!edit"
              dark
              class="mr-2"
            >
              mdi-plus-circle-outline
            </v-icon>
            <v-icon
              v-if="edit"
              dark
              class="mr-2"
            >
              mdi-pencil
            </v-icon>
            {{ title }}
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-container
            id="user-profile"
            fluid
            tag="section"
          >
            <v-row justify="center">
              <v-col
                cols="12"
              >
                <v-form
                  id="form"
                  ref="form"
                  v-model="valid"
                  autocomplete="off"
                  class="mt-5"
                >
                  <v-container class="py-0">
                    <v-row
                      v-if="itemToHandleView"
                      dense
                    >
                      <v-col
                        cols="12"
                        md="3"
                      >
                        <v-autocomplete
                          ref="transactionType"
                          v-model="itemToHandleView.transactiontypes"
                          :loading="loading"
                          autofocus
                          :items="transactionTypes"
                          return-object
                          label="Tipo de Transacción"
                          item-text="desctype"
                          :rules="idtypeRules"
                          outlined
                          dense
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        md="3"
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
                              label="Fecha de transacción"
                              hint="DD/MM/YYYY"
                              persistent-hint
                              :rules="dateRules"
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
                        md="3"
                      >
                        <v-text-field
                          v-model="itemToHandleView.transactionnumber"
                          dense
                          label="N° de Documento"
                          class="purple-input"
                          :rules="numberRules"
                          outlined
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        md="3"
                        class="text-right"
                      >
                        <v-text-field
                          v-model="itemToHandleView.transactionamount"
                          dense
                          label="Monto"
                          :rules="amountRules"
                          class="purple-input text-right"
                          type="number"
                          outlined
                        />
                      </v-col>

                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="itemToHandleView.transactionmotive"
                          dense
                          label="Detalle de transacción"
                          :rules="motiveRules"
                          class="purple-input"
                          outlined
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        class="text-right"
                      >
                        <v-btn
                          color="red darken-1"
                          text
                          outlined
                          @click="close"
                        >
                          Cerrar
                        </v-btn>

                        <v-btn
                          color="success"
                          class="mr-0 ml-2"
                          :loading="saving"
                          :disabled="saving"
                          @click="save"
                        >
                          <v-icon class="mr-2">
                            mdi-content-save
                          </v-icon>
                          <span v-if="!edit">
                            Crear
                          </span>
                          <span v-if="edit">
                            Editar
                          </span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-col>
            </v-row>

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
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackShow"
      :timeout="snackTimeOut"
      :color="snackColor"
      :multi-line="snackMulti === 'multi-line'"
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
  </div>
</template>

<script>
  import config from '../../../config.json'
  import axios from 'axios'

  export default {
    name: 'Movement',
    data: (vm) => ({
      dialog: false,
      title: '',
      edit: false,
      saving: false,
      valid: false,
      itemToHandleView: null,
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: '',
      menu1: false,
      menu2: false,
      transactionTypes: [],
      form: {
        idtype: null,
        transactiondate: null,
        transactionnumber: null,
        transactionmotive: null,
        transactionamount: 0,
      },
      idtypeRules: [
        v => !!v || 'Tipo es obligatorio',
      ],
      dateRules: [
        v => !!v || 'La fecha es obligatoria',
      ],
      numberRules: [
        v => !!v || 'El número de transacción es obligatorio',
      ],
      amountRules: [
        v => !!v || 'El monto debe ser diferente de cero',
        v => (!!v && v !== '0') || 'El monto debe ser diferente de cero',
      ],
      motiveRules: [
        v => !!v || 'La descripción es obligatoria',
      ],
      snackShow: false,
      snackText: '',
      snackColor: '',
      snackTimeOut: 4500,
      snackMulti: 'multi-line',
    }),

    computedDateFormatted () {
      return this.formatDate(this.date)
    },

    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
    },

    mounted () {
      this.loadInitialData()
    },

    methods: {
      loadInitialData () {
        const url = config.API_ENDPOINT + 'transactiontype'
        this.loading = true
        axios.get(url).then((result) => {
          this.transactionTypes = result.data.data
        }).catch((error) => {
          this.loading = false
          this.snackText = 'Ha ocurrido un Error: ' + error
          this.snackColor = 'error'
          this.snackShow = true
        }).finally(() => { this.loading = false })
      },

      show (item) {
        this.dialog = true
        this.itemToHandleView = item
        if (this.itemToHandleView) {
          this.dateFormatted = this.parseDate(this.itemToHandleView.transactiondate)
          this.title = 'Editar Movimiento Financiero'
          this.edit = true
        } else {
          this.itemToHandleView = {
            idtype: '',
            transactionnumber: '',
            transactiondate: '',
            transactionamount: 0,
            transactionmotive: '',
            transactiontypes: {},
          }
          this.title = 'Crear Movimiento Financiero'
          this.edit = false
          setTimeout(() => {
            this.$refs.form.reset()
          })
        }
      },

      close () {
        this.$refs.form.reset()
        this.$emit('loadInitialData')
        this.dialog = false
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

      save () {
        if (this.$refs.form.validate()) {
          this.itemToHandleView.transactiondate = this.date

          const itemMovement = {
            idtype: this.itemToHandleView.transactiontypes.id,
            transactiondate: this.itemToHandleView.transactiondate,
            transactionnumber: this.itemToHandleView.transactionnumber,
            transactionamount: this.itemToHandleView.transactionamount,
            transactionmotive: this.itemToHandleView.transactionmotive,
          }

          if (this.edit) {
            this.editMovement(itemMovement)
          } else {
            this.createMovement(itemMovement)
          }
        }
      },

      createMovement (data) {
        const url = config.API_ENDPOINT + 'movement'
        this.saving = true
        axios.post(url, data).then((result) => {
          this.snackText = result.data.message
          this.snackColor = 'success'
          this.snackShow = true
          this.clearForm()
        }).catch((error) => {
          this.snackText = error.response ? error.response.data.message : error
          this.snackColor = 'error'
          this.snackShow = true
        }).finally(() => {
          this.saving = false
          this.close()
        })
      },

      editMovement (data) {
        const url = config.API_ENDPOINT + 'movement/' + this.itemToHandleView.id
        this.saving = true
        axios.put(url, data).then((result) => {
          this.snackText = result.data.message
          this.snackColor = 'success'
          this.snackShow = true
          this.clearForm()
        }).catch((error) => {
          this.snackText = error.response ? error.response.data.message : error
          this.snackColor = 'error'
          this.snackShow = true
        }).finally(() => {
          this.saving = false
          this.close()
        })
      },

      clearForm () {
        this.$refs.form.reset()
        this.date = new Date().toISOString().substr(0, 10)
        this.$refs.transactionType.focus()
      },
    },

  }
</script>

<style scoped>
  .item-link {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
