
<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar
        dark
        :color="options.color"
        dense
        flat
      >
        <v-toolbar-title
          class="white--text"
        >
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text
        v-show="!!message"
        class="pa-4"
      >
        <p class="text-center">
          <span class="message-title"> {{ message.title }} </span>
        </p>
        <p class="text-center">
          {{ message.subtitle }}
        </p>
      </v-card-text>
      <v-card-actions
        class="pt-0"
      >
        <v-spacer />
        <v-btn
          color="info darken-1"
          outlined
          text
          @click.native="agree"
        >
          {{ options.confirmText }}
        </v-btn>
        <v-btn
          color="error"
          outlined
          text
          @click.native="cancel"
        >
          {{ options.cancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      resolve: null,
      reject: null,
      message: { title: '', subtitle: '' },
      title: null,
      options: {
        color: 'primary',
        width: 450,
        zIndex: 200,
        confirmText: 'Aceptar',
        cancelText: 'Cancelar',
      },
    }),

    methods: {
      open (title, message, options) {
        this.dialog = true
        this.title = title
        this.message = message
        this.options = Object.assign(this.options, options)
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },

      agree () {
        this.resolve(true)
        this.dialog = false
      },

      cancel () {
        this.resolve(false)
        this.dialog = false
      },

    },
  }
</script>

<style scoped>
.message-title {
  font-size: 20px;
}

</style>
