/* Component for the device page bar */
Vue.component('device-bar', {
    props: {
      title: {
        type: String,
        required: true
      }
    },
    template:
      `<v-container>
        <v-row class="align-center">
          <v-col>
            <v-btn icon href="devices.html">
              <v-icon size="40">mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <div class="headline ml-5 text-left">{{ title }}</div>
          </v-col>
        </v-row>
      </v-container>`
  })