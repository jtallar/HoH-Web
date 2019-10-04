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
        <panel-speaker/>
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
  data() {
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
      <v-slider v-model="brightness" class="mt-4" prepend-icon="mdi-brightness-6" 
        thumb-label="always" thumb-size="25" color="orange" track-color="black" thumb-color="orange darken-2"></v-slider>
    </v-container>`,
  mounted: function () {
    // here we extract all the data
  }
})

Vue.component('panel-oven', {
  props: {
    device: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      state: false,
      temperature: 90,
      heat_source: 2, // takes values from 0 to 2
      convection_mode: 2, // same
      grill_mode: 2 // same
    }
  },
  watch: { // here we set the new values
    state(newVal, oldVal) {

    },
    temperature(newVal, oldVal) {

    },
    heat_source(newVal, oldVal) {

    },
    convection_mode(newVal, oldVal) {

    },
    grill_mode(newVal, oldVal) {

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
      <v-subheader>Temperature</v-subheader>
      <v-slider v-model="temperature" class="mt-4" step="10" ticks="always" tick-size="4" min="90" max="230"
        thumb-label="always" thumb-size="25" color="orange" track-color="black"
        thumb-color="orange darken-2"></v-slider>
    
      <v-subheader>Heat Source</v-subheader>
      <v-layout column align-center>
        <v-btn-toggle v-model="heat_source" tile color="orange darken-2" group mandatory>
          <v-btn>Up</v-btn>
          <v-btn>Down</v-btn>
          <v-btn>Full</v-btn>
        </v-btn-toggle>
      </v-layout>

      <v-subheader>Convection Mode</v-subheader>
      <v-layout column align-center>
        <v-btn-toggle v-model="convection_mode" tile color="orange darken-2" group mandatory>
          <v-btn>Off</v-btn>
          <v-btn>Eco</v-btn>
          <v-btn>Full</v-btn>
        </v-btn-toggle>
      </v-layout>

      <v-subheader>Grill Mode</v-subheader>
      <v-layout column align-center>
        <v-btn-toggle v-model="grill_mode" tile color="orange darken-2" group mandatory>
          <v-btn>Off</v-btn>
          <v-btn>Eco</v-btn>
          <v-btn>Full</v-btn>
        </v-btn-toggle>
      </v-layout>
    </v-container>`,
  mounted: function () {
    // here we extract all the data
  }
})

Vue.component('panel-speaker', {
  props: {
    device: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      state: false,
      playlist: true,
      elapsed_time: '2:05', // should be a number
      song_name: 'No Song in Queue',
      song_artist: 'Unknown Artist',
      play: true,
      volume: 5,
      genres: ['Reggae', 'Reggaeton', 'Rock', 'Cumbia', 'Pop', 'Jazz', 'Folklore'],
      genre: 'Rock'
    }
  },
  watch: { // here we set the new values
    state(newVal, oldVal) {

    },
    play(newVal, oldVal) { 
      // se podria hacer aca el play ya que tiene v-model
    },
    volume(newVal, oldVal) {
      // update volume
    },
    genre(newVal, oldVal) {

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

      <v-list-item three-line>
        <v-list-item-content>
          <v-list-subtitle>{{ getTime }}</v-list-subtitle>
          <v-list-item-title>{{ song_name }}</v-list-item-title>
          <v-list-item-subtitle>{{ song_artist }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn icon width="50" height="50">
          <v-icon v-show="playlist" @click="playlist = !playlist" size="40">mdi-playlist-plus</v-icon>
          <v-icon v-show="!playlist" @click="playlist = !playlist" size="40">mdi-playlist-check</v-icon>
        </v-btn>
      </v-list-item>

      <v-layout align-center wrap ma-3>
        <v-layout column mr-3>
          <v-btn icon @click="skipPrevious()">
            <v-icon size="60">mdi-skip-previous-circle</v-icon>
          </v-btn>
        </v-layout>

        <v-layout column>
          <v-btn icon @click="playPause()">
            <v-icon v-show="play" size="60">mdi-play-circle</v-icon>
            <v-icon v-show="!play" size="60">mdi-pause-circle</v-icon>
          </v-btn>
        </v-layout>

        <v-layout column ml-3 mr-3>
          <v-btn icon @click="skipNext()">
            <v-icon size="60">mdi-skip-next-circle</v-icon>
          </v-btn>
        </v-layout>

        <v-layout column align-end>
          <v-btn icon @click="stop()">
            <v-icon size="60">mdi-stop-circle</v-icon>
          </v-btn>
        </v-layout>
      </v-layout>

      <v-subheader>Volume</v-subheader>
      <v-slider v-model="volume" class="mt-4" prepend-icon="mdi-volume-medium" thumb-label="always"
        thumb-size="25" color="orange" track-color="black" thumb-color="orange darken-2"></v-slider>
      
      <v-select v-model="genre" :items="genres" :label="Genre" required ></v-select>
    </v-container>`,
  methods: {
    skipPrevious() {
      // do something here to skip song
      // update values
    },
    skipNext() {
      // same 
    },
    playPause() {
      this.play = !this.play; 
      // sennd play to back
    },
    stop() {
      this.play = false;
      // send stop to back
    }
  },
  computed: {
    getTime() {
      return this.elapsed_time; // here to do conversion secs to something printable
    }
  },
  mounted: function () {
    // here we extract all the data
  }
})