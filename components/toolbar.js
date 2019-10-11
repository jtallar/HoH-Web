/* Toolbar component used through all the web */
Vue.component('toolbar', {
  props: {
    tab: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      active_tab: undefined,
      tabs: [
        { index: 0, name: 'Home', dir: 'home.html' },
        { index: 1, name: 'Rooms', dir: 'rooms.html' },
        { index: 2, name: 'Devices', dir: 'devices.html' },
        { index: 3, name: 'Routines', dir: 'routines.html' }
      ]
    }
  },
  template:
    `<v-app-bar app clipped-right color="black" dark >
          <!-- button/avatar/image for logo -->
          <v-btn icon href="./home.html">
            <v-avatar size="35">
              <v-img src="./resources/images/logo.png"></v-img>
            </v-avatar>
          </v-btn>
  
          <!-- title of toolbar -->
          <v-toolbar-title>House of Hands</v-toolbar-title>
  
          <div class="flex-grow-1"></div>
  
          <!-- button/icon for search, account and more -->
          <template v-if="$vuetify.breakpoint.smAndUp">
              <v-btn icon>
                  <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-account</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
  
          <!-- tabs for navigation -->
          <template v-slot:extension>
            <v-tabs grow v-model="active_tab" background-color="orange">
              <v-tab v-for="tab of tabs" :key="tab.index" :href="tab.dir">
                {{ tab.name }}
              </v-tab>

              <v-tabs-slider color="white" />
            </v-tabs>
              
          </template>
        </v-app-bar>`,
  /* On mount select current tab */
  mounted() {
    this.active_tab = this.tabs[this.tab].dir;
  }
})

/* Toolbar for login page */
Vue.component('toolbar-login', {
  template:
    `<v-app-bar app clipped-right color="black" dark >
          <!-- button/avatar/image for logo -->
          <v-btn icon href="./login.html">
            <v-avatar size="35">
              <v-img src="./resources/images/logo.png"></v-img>
            </v-avatar>
          </v-btn>
  
          <!-- title of toolbar -->
          <v-toolbar-title>House of Hands</v-toolbar-title>
  
          <div class="flex-grow-1"></div>
  
          <!-- login -->
          <template v-if="$vuetify.breakpoint.smAndUp">
          <v-row justify="end">
              <v-col cols="6" sm="3">
                <v-text-field label="Username" filled></v-text-field>
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field label="Password" type="password" filled></v-text-field>
              </v-col>
            </v-row>
            <v-btn icon href="./home.html">
                <v-icon>mdi-forward</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
        </v-app-bar>`,
})