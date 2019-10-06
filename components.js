// javascript file for used components

Vue.component('toolbar', {
  template:
    `<v-app-bar app clipped-right color="black" dark>
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
        { index: 1, name: 'Rooms', dir: 'roomSelection.html' },
        { index: 2, name: 'Devices', dir: 'deviceCategories.html' },
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
      devName: "",
      devCat: "",
      devRoom: "",
      favorite: false
    }
  },
  template:
    `<v-navigation-drawer app clipped right permanent color='#E9E9E9' :width="getWidth">
      <!-- header -->
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar tile>
            <v-img :src="getImg" contain/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-capitalize">{{ devName }}</v-list-item-title>
            <v-list-item-subtitle class="text-capitalize">{{ devRoom }}</v-list-item-subtitle>
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
      <component :is="getPanelContent"></component>
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
      switch (this.devCat) {
        case "Light":
          return './resources/icons/web/lamp_on.svg';
        case "Vacuum":
          return './resources/icons/web/vacuum_on.svg';
        case "Air Conditioner":
          return './resources/icons/web/air_conditioner_on.svg';
        case "Door":
          return './resources/icons/web/door_closed.svg';
        case "Window":
          return './resources/icons/web/window_closed.svg';
        case "Speaker":
          return './resources/icons/web/speaker_playing.svg';
        case "Oven":
          return './resources/icons/web/oven_on.svg';
        default:
          return './resources/icons/generic/close.svg';
      }
    },
    getPanelContent() {
      switch (this.devCat) {
        case "Light":
          return "panel-light";
        case "Vacuum":
          return "panel-vacuum";
        case "Air Conditioner":
          return "panel-airconditioner";
        case "Door":
          return "panel-door";
        case "Window":
          return "panel-window";
        case "Speaker":
          return "panel-speaker";
        case "Oven":
          return "panel-oven";
        default:
          return "panel-none";
      }
    },
    getWidth() {
      return screen.width / 5;
    }
  },
  mounted() {
    this.$root.$on('Device Selected', (devName, devRoom, devCat) => {
      this.devName = devName;
      this.devCat = devCat;
      this.devRoom = devRoom;
      console.log('Message recieved with ' + this.devName + ' ; ' + this.devCat + ' ; ' + this.devRoom);
    });
    this.$root.$on('Device Deselected', () => {
      this.devName = "";
      this.devCat = "";
      this.devRoom = "";
    });
  }
})

Vue.component('card-btn', {
  props: {
    href: {
      type: String,
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
    cat: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selected: false
    }
  },
  template:
    `<v-col class="text-center">
      <v-btn :outlined="!selected" class="mt-4 ma-1" :width="getSize" :height="getSize" fab color="grey darken-4" @click="toggleSelected">
        <div>
          <v-img :width="getIconSize" :src="getImg"/>
        </div>
      </v-btn>
      <div class="text-capitalize black--text font-weight-light mb-4">
        {{ name }}
      </div>
    </v-col>`,
  methods: {
    toggleSelected() {
      this.selected = !this.selected;
      if (this.selected) {
        this.$root.$emit('Device Selected', this.name, this.room, this.cat);
      } else {
        this.$root.$emit('Device Deselected');
      }
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
    },
    getImg() {
      switch (this.cat) {
        case "Light":
          return './resources/icons/web/lamp_on.svg';
        case "Vacuum":
          return './resources/icons/web/vacuum_on.svg';
        case "Air Conditioner":
          return './resources/icons/web/air_conditioner_on.svg';
        case "Door":
          return './resources/icons/web/door_closed.svg';
        case "Window":
          return './resources/icons/web/window_closed.svg';
        case "Speaker":
          return './resources/icons/web/speaker_playing.svg';
        case "Oven":
          return './resources/icons/web/oven_on.svg';
        default:
          return './resources/icons/generic/close.svg';
      }
    }
  },
  mounted() {
    this.$root.$on('Device Selected', (name, room, cat) => {
      if (this.selected && name !== this.name) this.selected = !this.selected;
    });
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
          <v-list-item-subtitle>{{ getTime }}</v-list-item-subtitle>
          <v-list-item-title>{{ song_name }}</v-list-item-title>
          <v-list-item-subtitle>{{ song_artist }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn icon @click="addPlaylist()" >
          <v-icon v-show="playlist" size="40">mdi-playlist-plus</v-icon>
          <v-icon v-show="!playlist" size="40">mdi-playlist-check</v-icon>
        </v-btn>
      </v-list-item>

      <v-layout align-center wrap ma-3>
        <v-layout column>
          <v-btn icon @click="skipPrevious()">
            <v-icon size="60">mdi-skip-previous-circle</v-icon>
          </v-btn>
        </v-layout>

        <v-layout column>
          <v-btn icon @click="playPause()">
            <v-icon v-show="!play" size="60">mdi-play-circle</v-icon>
            <v-icon v-show="play" size="60">mdi-pause-circle</v-icon>
          </v-btn>
        </v-layout>

        <v-layout column>
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
      
      <v-select v-model="genre" :items="genres" required ></v-select>
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
    },
    addPlaylist() {
      this.playlist = !this.playlist;
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

Vue.component('panel-door', {
  props: {
    device: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      closed: 0, // 0: closed, 1: open
      locked: false
    }
  },
  template:
    `<v-container fluid>
      <v-layout align-center>
        <v-layout column>
          <v-btn-toggle v-model="closed" tile color="orange darken-2" group mandatory>
            <v-btn>Closed</v-btn>
            <v-btn>Open</v-btn>
          </v-btn-toggle>
        </v-layout>
        <v-layout column>
          <v-btn icon @click="lock()">
            <v-icon v-show="locked" size="40">mdi-lock</v-icon>
            <v-icon v-show="!locked" size="40">mdi-lock-open-outline</v-icon>
          </v-btn>
        </v-layout>
      </v-layout>
    </v-container>`,
  methods: {
    lock() {
      this.locked = !this.locked;
      if (this.locked){
        this.closed = 0;
      }
      // send stop to back
    }
  },
  mounted: function () {
    // here we extract all the data
  }
})

Vue.component('panel-window', {
  props: {
    device: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      closed: 0, // 0: closed, 1: open
    }
  },
  template:
    `<v-container fluid>
      <v-layout column align-center>
        <v-btn-toggle v-model="text" tile color="orange darken-2" group mandatory>
            <v-btn>Closed</v-btn>
            <v-btn>Open</v-btn>
        </v-btn-toggle>
      </v-layout>
    </v-container>`,
  mounted: function () {
    // here we extract all the data
  }
})

Vue.component('panel-airconditioner', {
  props: {
    device: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      state: false,
      temperature: 24,
      mode: 2, // takes values from 0 to 2
      fan_speed: 25, // 25, 50, 75, 100
      auto_fan_speed: false,
      vertical_wings: 90, // 22.5, 45, 77.5, 90 (VER SI SE REDONDEA LOS QUE TIENEN COMA)
      auto_vertical_wings: false,
      horizontal_wings: 0, // -90, -45, 0, 45, 90
      auto_horizontal_wings: false,
    }
  },
  watch: { // here we set the new values
    state(newVal, oldVal) {

    },
    temperature(newVal, oldVal) {

    },
    mode(newVal, oldVal) {

    },
    fan_speed(newVal, oldVal) {

    },
    auto_fan_speed(newVal, oldVal) {

    },
    vertical_wings(newVal, oldVal) {

    },
    auto_vertical_wings(newVal, oldVal) {

    },
    horizontal_wings(newVal, oldVal) {

    },
    auto_horizontal_wings(newVal, oldVal) {

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
      <v-slider v-model="temperature" class="mt-4" step="1" ticks="always" tick-size="4" min="18" max="38"
          thumb-label="always" thumb-size="25" color="orange" track-color="black" thumb-color="orange darken-2"></v-slider>
    
      <v-subheader>Mode</v-subheader>
      <v-layout column align-center>
          <v-btn-toggle v-model="mode" tile color="orange darken-2" group mandatory>
              <v-btn>Cold</v-btn>
              <v-btn>Vent</v-btn>
              <v-btn>Heat</v-btn>
          </v-btn-toggle>
      </v-layout>

      <v-subheader>Fan Speed</v-subheader>
      <v-row>
        <v-col cols="8">
          <v-slider v-model="fan_speed" class="mt-4" step="25" ticks="always" tick-size="4" min="25" max="100"
          thumb-label="always" thumb-size="25" color="orange" track-color="black"
          thumb-color="orange darken-2" :disabled="auto_fan_speed"></v-slider>
        </v-col>
        <v-col>
          <v-checkbox label="Auto" color="orange darken-2" @change="auto_fan_speed = !auto_fan_speed"></v-checkbox>
        </v-col>
      </v-row>
      <v-subheader>Vertical Wings</v-subheader>
      <v-row>
        <v-col cols="8">
          <v-slider v-model="vertical_wings" class="mt-4" step="22.5" ticks="always" tick-size="4" min="22.5" max="90"
          thumb-label="always" thumb-size="25" color="orange" track-color="black"
          thumb-color="orange darken-2" :disabled="auto_vertical_wings"></v-slider>
        </v-col>
        <v-col>
          <v-checkbox label="Auto" color="orange darken-2" @change="auto_vertical_wings = !auto_vertical_wings"></v-checkbox>
        </v-col>
      </v-row>
      <v-subheader>Horizontal Wings</v-subheader>
      <v-row>
        <v-col cols="8">
          <v-slider v-model="horizontal_wings" class="mt-4" step="45" ticks="always" tick-size="4" min="-90" max="90"
          thumb-label="always" thumb-size="25" color="orange" track-color="black"
          thumb-color="orange darken-2" :disabled="auto_horizontal_wings"></v-slider>
        </v-col>
        <v-col>
          <v-checkbox label="Auto" color="orange darken-2" @change="auto_horizontal_wings = !auto_horizontal_wings"></v-checkbox>
        </v-col>
      </v-row>
    </v-container>`,
  mounted: function () {
    // here we extract all the data
  }
})

Vue.component('panel-vacuum', {
  props: {
    device: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      state: false,
      play: false,
      charging: false,
      mode: 0, // 0: vacuum, 1: mop
      room: 'Living Room',
      charging_base: 'Bathroom',
      rooms: ['Living Room', 'Kitchen', 'Bathroom']
    }
  },
  watch: { // here we set the new values
    state(newVal, oldVal) {

    },
    play(newVal, oldVal) {
      // se podria hacer aca el play ya que tiene v-model
    },
    charging(newVal, oldVal) {
      // update volume
    },
    mode(newVal, oldVal) {

    },
    room(newVal, oldVal) {

    },
    charging_base(newVal, oldVal) {

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

      <v-layout align-center wrap ma-3>
        <v-layout column ml-5>
            <v-btn icon @click="playPause()">
                <v-icon v-show="play" size="60">mdi-play-circle</v-icon>
                <v-icon v-show="!play" size="60">mdi-pause-circle</v-icon>
            </v-btn>
        </v-layout>
        <v-layout column>
            <v-btn class="my-2" color="orange darken-2" block @click="goToCharge()" width="100">
                <h3 v-show="!charging">GO CHARGE</h3>
                <h3 v-show="charging">CHARGING</h3>
            </v-btn>
        </v-layout>
      </v-layout>

      <v-subheader>Mode</v-subheader>
      <v-layout column align-center>
          <v-btn-toggle v-model="mode" tile color="orange darken-2" group mandatory>
              <v-btn>Vacuum</v-btn>
              <v-btn>Mop</v-btn>
          </v-btn-toggle>
      </v-layout>

      <v-subheader>Room to Clean</v-subheader>
      <v-select v-model="room" :items="rooms" :value="room" required></v-select>

      <v-subheader>Charging Base in</v-subheader>
      <v-select v-model="charging_base" :items="rooms" :value="charging_base" required></v-select>
    </v-container>`,
  methods: {
    playPause() {
      this.play = !this.play;
      // sennd play to back
    },
    goToCharge() {
      this.charging = !this.charging;
      // send stop to back
    }
  },
  mounted: function () {
    // here we extract all the data
  }
})

Vue.component('panel-none', {
  props: {
    device: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      closed: 0, // 0: closed, 1: open
    }
  },
  template:
    `<v-container fluid>
      <v-layout column align-center>
        <h2>Select a device</h2>
      </v-layout>
    </v-container>`,
  mounted: function () {
    // here we extract all the data
  }
})