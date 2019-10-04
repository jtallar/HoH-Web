// javascript file for used components

Vue.component('toolbar', {
  template:
    `<v-app-bar app clipped-right color="black" dark>
          <!-- button/avatar/image for logo -->
          <v-btn icon>
            <v-avatar size="35">
              <v-img src="/resources/images/logo.png"></v-img>
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
                {{tab.name}}
              </v-tab>

              <v-tabs-slider color="white" />
            </v-tabs>
              
          </template>
        </v-app-bar>`,
  data() {
    return {
      active_tab: 1,
      tabs: [
        { index: 0, name: 'Home', dir: 'home.html' },
        { index: 1, name: 'Rooms', dir: 'rooms.html' },
        { index: 2, name: 'Devices', dir: 'devices.html' },
        { index: 3, name: 'Routines', dir: 'routines.html' }
      ]
    }
  },

})

Vue.component('panel', {
  props: {
    device: {
      type: String, // HACER ALGO DEPENDIENDO COMO FUNCIONE
      required: true
    }
  },
  data() {
    return {
      favorite: false
    }
  },
  template:
    `<v-navigation-drawer v-model="drawerRight" app clipped right permanent color='#E9E9E9' width="getWidth">
      <!-- header -->
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar tile>
            <v-img :src="getImg" :width="30"/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-capitalize">air conditioner</v-list-item-title>
            <v-list-item-subtitle class="text-capitalize">Living Room</v-list-item-subtitle>
          </v-list-item-content>
          <v-btn icon @click="toggleFav">
            <v-icon v-show="favorite">mdi-star</v-icon>
            <v-icon v-show="!favorite">mdi-star-outline</v-icon>
          </v-btn>
          <v-btn icon @click="launchSettings">
            <v-icon>mdi-settings</v-icon>
          </v-btn>
          </v-list-item>
        </template>
        <v-divider></v-divider>
        
        <!-- information and settings -->
        <panel-light/>
      </v-navigation-drawer>`,
  methods: {
    toggleFav() {
      this.favorite = !this.favorite;
    },
    launchSettings() {
      // do something here when motherfucker touches settings
    }
  },
  computed: {
    getImg() {
      return './resources/icons/web/vacuum_on.svg';
    },
    getWidth() {
      return screen.width / 5;
    }
  }
})

Vue.component('card-btn', {
  props: {
    href: {
      type: Number,
      required: true
    },
    ratio: {
      type: Number,
      default: 2
    },
    title: {
      type: String,
      required: true
    },
    img_name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minWidth: 100,
      maxWidth: 400
    }
  },
  template:
    `<v-btn tile class="ma-3" :width="getWidth" :height="getHeight" :href="getHref">
      <v-img :src="getImg" :width="getWidth" :height="getHeight">
        <div class="text-left grey darken-2 mt-5 pl-3 pa-1">
          <span class="text-uppercase white--text font-weight-light">
            {{ getTitle }}      
          </span>
        </div>
      </v-img>
    </v-btn>`,
  computed: {
    getHref() {
      return this.href;
    },
    getWidth() {
      return screen.width / 6; // ver si da limitarlo con max y min
    },
    getHeight() {
      return this.getWidth / this.ratio;
    },
    getImg() {
      return './resources/images/' + this.img_name + '.jpg';
    },
    getTitle() {
      return this.title; // aca ver de poner max y min caracteres
    }
  }
})

Vue.component('dev-btn', {
  props: {
    name: {
      type: String,
      required: true
    },
    icon_name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selected: true
    }
  },
  template:
    `<v-col class="text-center">
      <v-btn :outlined="selected" class="mt-4 ma-1" :width="getSize" :height="getSize" fab color="grey darken-4" @click="toggleSelected">
        <div>
          <v-img width="getIconSize" src="./resources/icons/web/air_conditioner_on.svg"/>
        </div>
      </v-btn>
      <div class="text-capitalize black--text font-weight-light mb-4">
        {{ name }}
      </div>
    </v-col>`,
  methods: {
    toggleSelected() {
      this.selected = !this.selected;
    }
  },
  computed: {
    getSize() {
      return screen.width / 10; // ver si da limitarlo con max y min
    },
    getIcon() {
      return './resources/icons/web/' + this.icon_name + '.svg';
    },
    getIconSize() {
      return this.getSize / 2;
    },
    getName() {
      return this.name; // aca ver de poner max y min caracteres
    }
  }
})

Vue.component('panel-light', {
  props: {
    device: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      state: false,
      color: '#FFF100',
      brightness: 10
    }
  },
  watch: { // here we set the new values
    state(newVal, oldVal) {
      
    },
    color(newVal, oldVal) {

    },
    brightness(newVal, oldVal) {

    }
  },
  template:
    `<v-container fluid>
      <v-layout align-center wrap>
        <v-layout column align-end mr-2>
          <h3>Off</h3>
        </v-layout>
        <v-layout column>
          <v-switch class="align-center justify-center" v-model="state" color="orange"></v-switch>
        </v-layout>
        <v-layout column>
          <h3>On</h3>
        </v-layout>
      </v-layout>
      <v-subheader>Color</v-subheader>
      <v-color-picker v-model="color" hide-inputs hide-mode-switch mode.sync="rgba" class="mx-auto" flat></v-color-picker>
      <v-subheader>Brightness</v-subheader>
      <v-slider v-model="brightness" class="mt-4" prepend-icon="mdi-brightness-6" thumb-label="always" thumb-size="25" color="orange" track-color="black" thumb-color="orange darken-2"></v-slider>
    </v-container>`,
  mounted: function() {
      // here we extract all the data
  }
})