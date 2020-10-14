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
            {{ title }}
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-form
              id="form"
              ref="form"
              v-model="valid"
              autocomplete="off"
            >
              <v-row v-if="itemToHandleView">
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <v-text-field
                    v-model="itemToHandleView.codetype"
                    dense
                    :rules="codeRules"
                    label="Código"
                    outlined
                    class="text-uppercase"
                    autofocus
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="itemToHandleView.desctype"
                    dense
                    :rules="descriptionRules"
                    label="Descripción"
                    outlined
                    class="text-uppercase"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <v-select
                    v-model="itemToHandleView.operationtype"
                    dense
                    :items="typeItems"
                    :rules="typeRules"
                    item-text="text"
                    item-value="value"
                    label="Tipo Operación"
                    outlined
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-1"
            text
            outlined
            @click="close"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            outlined
            :loading="saving"
            :disabled="saving"
            @click="save"
          >
            Guardar
            <template v-slot:loader>
              <v-progress-circular
                :width="3"
                :size="20"
                indeterminate
                color="info"
              />
              <span class="ml-1">Guardando...</span>
            </template>
          </v-btn>
        </v-card-actions>
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
  /* eslint-disable */
  import config from '../../../config.json'
  import axios from 'axios'

  export default {
    name: 'TransactionTypesCreateOrEdit',

    data: () => ({
      edit: false,
      saving: false,
      valid: false,
      dialog: false,
      title: '',
      snackShow: false,
      snackMulti: 'multi-line',
      snackText: '',
      snackColor: '',
      snackTimeOut: 3500,
      itemToHandleView: null,
      typeItems: [
        { value: '', text: 'Seleccione...' },
        { value: 'I', text: 'ENTRADA' },
        { value: 'E', text: 'SALIDA' },
      ],
      codeRules: [
        v => !!v || 'Código es obligatorio',
        v => (!!v && v.length == 3) || 'El código debe tener 3 caracteres',
      ],
      descriptionRules: [
        v => !!v || 'La descripción es obligatoria',
      ],
      typeRules: [
        v => (v != -1) || 'El tipo es obligatorio',
      ],

    }),

    methods: {
      show (item) {
        this.dialog = true
        this.itemToHandleView = item
        if (this.itemToHandleView) {
          this.title = 'Editar Tipo de Transacción'
          this.edit = true
        } else {
          this.itemToHandleView = {
            codetype: '',
            desctype: '',
            operationtype: '',
            statustype: 'A',
          }
          this.title = 'Crear Tipo de Transacción'
          this.edit = false
          setTimeout(()=> {
            this.$refs.form.reset()
          })
        }
      },

      close () {
        this.$refs.form.reset()
        this.$emit('loadInitialData')
        this.dialog = false
      },

      save () {
        if ( this.$refs.form.validate() ) {
          this.saving = true
          let url = ''
          if ( ! this.edit ) { // Creando 
            url = config.API_ENDPOINT + 'transactiontype'
            axios.post(url, this.itemToHandleView).then((result) => {
              this.snackText = result.data.message
              this.snackColor = 'success'
              this.snackShow = true
              this.close()
            }).catch((error) => {
              this.processError(error.response.data);
            }).finally(() => { this.saving = false })
          }
          else { // editando
            url = config.API_ENDPOINT + 'transactiontype/' + this.itemToHandleView.id
            axios.put(url, this.itemToHandleView).then((result) => {
                this.snackText = result.data.message
                this.snackColor = 'success'
                this.snackShow = true
                this.close()
            }).catch((error) => {
              this.processError(error.response.data);
            }).finally(() => { this.saving = false })
          }
        }
      },

      processError(error) {
        let errors = error.errors;
        let message = '';
        message = error.message;
        if ( errors ) {
          message = message + '\n';
          for (let key in errors){
            if (errors.hasOwnProperty(key)) {
              message = message + errors[key] + '\n';
            }
          }
        }
        this.snackText = message
        this.snackColor = 'error'
        this.snackShow = true
      }
    },
  }
</script>
