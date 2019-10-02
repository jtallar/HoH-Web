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
            <v-tabs grow background-color="orange">
            <v-tab v-for="tab of tabs" :key="tab.index" :href="tab.dir">
              {{tab.name}}
            </v-tab>
          </template>
        </v-app-bar>`,
  data() {
    return {
      active_tab: 1,
      tabs: [
        { index: 0, name: 'Home', dir: 'home.html' },
        { index: 1, name: 'Rooms', dir: 'rooms.html' },
        { index: 2, name: 'Devices', dir: 'devices.html' },
        { index: 3, name: 'Routines', dir: '#tree' }
      ]
    }
  },

})

Vue.component('panel', {
  template:
    `<v-navigation-drawer v-model="drawerRight" app clipped right permanent>      
            <!-- top bar -->
            <template v-slot:prepend>
                <v-list-item two-line>
                    <v-list-item-avatar>
                        <img src="https://randomuser.me/api/portraits/women/81.jpg">
                    </v-list-item-avatar>
  
                    <v-list-item-content>
                        <v-list-item-title>Table Light</v-list-item-title>
                        <v-list-item-subtitle>Kitchen</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-btn icon>
                        <v-icon>mdi-settings</v-icon>
                    </v-btn>
                </v-list-item>
            </template>
  
            <v-divider></v-divider>
  
            <!-- information container -->
            <v-container fluid>
                <v-switch v-model="switch1" color="orange" label="On"></v-switch>
                <v-subheader>Color</v-subheader>
                <v-color-picker hide-canvas hide-inputs flat></v-color-picker>
                <v-subheader>Brightness</v-subheader>
                <v-slider v-model="media" prepend-icon="mdi-brightness-6" thumb-label="always" thumb-size="20"></v-slider>
            </v-container>
        </v-navigation-drawer>`
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
    `<v-btn tile :width="getWidth" :height="getHeight" :href="getHref">
      <v-img :src="getImg" :width="getWidth" :height="getHeight">
      <div class="text-left grey darken-2 mt-5 pl-3 pa-1">
        <span class="text-uppercase white--text font-weight-light">
           {{ getTitle }}      
        </span>
      </div>
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
      <v-btn :outlined="selected" class="mt-4 ma-1" :width="getSize" :height="getSize" fab color="grey darken-4" @click="updateView">
        <div>
          <v-img width="getIconSize" src="./resources/icons/web/air_conditioner_on.svg"></v-img>
        </div>
      </v-btn>
      <div class="text-capitalize black--text font-weight-light mb-4">
        {{ name }}
      </div>
    </v-col>`,
  methods: {
    updateView() {
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