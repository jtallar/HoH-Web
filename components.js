// javascript file for used components
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
  mounted() {
    this.active_tab = this.tabs[this.tab].dir;
  }
})

Vue.component('panel', {
  data() {
    return {
      device: { name: "No Device Selected", room: {name: "Please Select a Device"}, type: {name: ""}, meta: {favorite: false} },
      selected: false
    }
  },
  template:
    `<v-navigation-drawer bottom app floating clipped right permanent color='#E9E9E9' :width="getWidth">
      <!-- header -->
      <template v-slot:prepend >
        <v-list-item two-line class="mb-2 mt-1">
          <v-list-item-avatar tile>
            <v-img eager :src="getImg" contain/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-capitalize">{{ device.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-capitalize">{{ device.room.name }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-btn icon @click="toggleFav">
            <v-icon v-show="device.meta.favorite && selected">mdi-star</v-icon>
            <v-icon v-show="!device.meta.favorite && selected">mdi-star-outline</v-icon>
          </v-btn>
          <v-btn icon @click="launchSettings">
            <v-icon v-show="selected">mdi-settings</v-icon>
          </v-btn>
        </v-list-item>
      </template>
      <v-divider class="mx-5"></v-divider>
        
      <!-- information and settings -->
      <component :is="getPanelContent" :device="device"></component>
    </v-navigation-drawer>`,
  methods: {
    toggleFav() {
      // this.device.meta.favorite = !this.device.meta.favorite;
      // if (this.device.meta.favorite) favDevices.push({
      //   devName, devCat, devRoom
      // });
      // console.log(favDevices);
    },
    launchSettings() {
      // do something here when motherfucker touches settings
    }
  },
  computed: {
    getImg() {
      switch (this.device.type.name) {
        case "lamp":
          return './resources/icons/web/lamp_on.svg';
        case "vacuum":
          return './resources/icons/web/vacuum_on.svg';
        case "ac":
          return './resources/icons/web/air_conditioner_on.svg';
        case "door":
          return './resources/icons/web/door_closed.svg';
        case "blinds":
          return './resources/icons/web/window_closed.svg';
        case "speaker":
          return './resources/icons/web/speaker_playing.svg';
        case "oven":
          return './resources/icons/web/oven_on.svg';
        default:
          return './resources/icons/generic/close.svg';
      }
    },
    getPanelContent() {
      switch (this.device.type.name) {
        case "lamp":
          return "panel-light";
        case "vacuum":
          return "panel-vacuum";
        case "ac":
          return "panel-airconditioner";
        case "door":
          return "panel-door";
        case "blinds":
          return "panel-window";
        case "speaker":
          return "panel-speaker";
        case "oven":
          return "panel-oven";
        default:
          return "panel-none";
      }
    },
    getWidth() {
      return screen.width / 5;
    }
  },
  async mounted() {
    this.$root.$on('Device Selected', (device) => {
      this.device = device;
      this.selected = true;
      console.log('Message recieved with ' + this.device);
    });
    this.$root.$on('Device Deselected', () => {
      this.device = { name: "No Device Selected", room: {name: "Please Select a Device"}, type: {name: ""}, meta: {favorite: false} };
      this.selected = false;
    });
  }
})

Vue.component('card-btn', {
  props: {
    type: {
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
    },
    width: {
      type: Number,
      default: 6
    },
    id: {
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
    `<v-col class="text-center">
      <v-btn tile class="ma-3" :width="getWidth" :height="getHeight" :href="getHref">
        <v-img :src="getImg" :width="getWidth" :height="getHeight">
          <div class="text-left grey darken-2 mt-5 pl-3 pa-1">
            <span class="text-uppercase white--text font-weight-light">
              {{ getTitle }}      
            </span>
          </div>
        </v-img>
      </v-btn>
    </v-col>`,

  computed: {
    getHref() {
      switch (this.type) {
        case "room":
          return "room.html?" + this.id + "+" + this.title.split(' ').join('_');
        case "device":
          return "device.html?" + this.id + "+" + this.title.split(' ').join('_');
        default:
            return "home.html"; // no deberia entrar nunca
      }
    },
    getWidth() {
      return screen.width / this.width; // ver si da limitarlo con max y min
    },
    getHeight() {
      return this.getWidth / this.ratio;
    },
    getImg() {
      return './resources/images/' + this.img_name;
    },
    getTitle() {
      return this.title; // aca ver de poner max y min caracteres
    }
  }
})

Vue.component('routine-btn', {
  props: {
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
    },
    width: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      snackbarCan: false,
      snackbarOk: false,
      dialog: false,
      minWidth: 100,
      maxWidth: 400
    }
  },
  template:
    `<v-container fluid>

      <v-dialog v-model="dialog" persistent width="410">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" tile class="ma-3" :width="getWidth" :height="getHeight" >
            <v-img :src="getImg" :width="getWidth" :height="getHeight">
              <div class="text-left grey darken-2 mt-5 pl-3 pa-1">
                <span class="text-uppercase white--text font-weight-light">
                  {{ getTitle }}      
                </span>
              </div>
            </v-img>
          </v-btn>
        </template>
        
        <v-card>
          <v-card-title/>
          <v-card-text class="body-1">Are you sure you want to execute this routine?</v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="red darken-1" text @click="dialog = false, snackbarCan = true">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="dialog = false, snackbarOk = true">Run Routine</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar @click="accept()" v-model="snackbarOk"> Routine has been executed!
        <v-btn color="green" text @click="snackbarOk = false"> OK </v-btn>
      </v-snackbar>
      <v-snackbar v-model="snackbarCan" > Operation cancelled.
        <v-btn color="red" text @click="snackbarCan = false"> OK </v-btn>
      </v-snackbar> 

    </v-container>`,
  methods: {
    current(name) {
      this.routine = name;
      return routine;
    }
  },
  computed: {
    getHref() {
      return this.href;
    },
    getWidth() {
      return screen.width / this.width; // ver si da limitarlo con max y min
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

Vue.component('sel-dev', {
  props: {
    room: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selected: false,
      devices: ['Light 1', 'Light 2', 'Oven', 'Air Aconditioner'],
      device: '',
    }
  },
  template:
    `<v-select v-model="device" :items="devices" :value="cat" label="Device" required @change="toggleSelected()"></v-text-field> `,
  methods: {
    toggleSelected() {
      this.selected = !this.selected;
      if (this.selected) {
        this.$root.$emit('Device Selected', this.device);
      } else {
        this.$root.$emit('Device Deselected');
      }
    }
  },
  computed: {

  },
  mounted() {

  }
})

Vue.component('dev-btn', {
  props: {
    device: {
      type: Object,
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
      <v-btn class="mb-1" :outlined="!selected" :width="getSize" :height="getSize" fab color="grey darken-4" @click="toggleSelected">
        <div>
          <v-img :max-width="getIconSize" :src="getImg" contain/>
        </div>
      </v-btn>
      <div class="text-capitalize black--text font-weight-light mb-1">
        {{ device.name }}
      </div>
    </v-col>`,
  methods: {
    toggleSelected() {
      this.selected = !this.selected;
      console.log(this.device);
      if (this.selected) {
        this.$root.$emit('Device Selected', this.device);
      } else {
        this.$root.$emit('Device Deselected');
      }
    }
  },
  computed: {
    getSize() {
      return screen.width / 13; // ver si da limitarlo con max y min
    },
    getIconSize() {
      return this.getSize / 2;
    },
    getName() {
      return this.device.name; // aca ver de poner max y min caracteres
    },
    getImg() {
      let stat = this.device.state.status;
      switch (this.device.type.name) {
        case "lamp":
          if(stat === "on")
            return './resources/icons/web/lamp_on.svg';
          else 
            return './resources/icons/web/lamp_off.svg';
        case "vacuum":
          if(stat === "on")
            return './resources/icons/web/vacuum_on.svg';
          else 
            return './resources/icons/web/vacuum_off.svg';
        case "ac":
          if(stat === "on")
            return './resources/icons/web/air_conditioner_on.svg';
          else
            return './resources/icons/web/air_conditioner_off.svg';
        case "door":
          if(stat === "closed")
            return './resources/icons/web/door_closed.svg';
          else{ 
            if(stat === "opened")
              return './resources/icons/web/door_opened.svg'; // NO EXISTS
            else
              return './resources/icons/web/door_locked.svg'; // NO EXISTS
          }
        case "blinds":
          if(stat === "closed")
            return './resources/icons/web/window_closed.svg';
          else 
            return './resources/icons/web/window_open.svg';
        case "speaker":
          if(stat === "playing")
            return './resources/icons/web/speaker_playing.svg';
          else
            return './resources/icons/web/speaker_off.svg';
        case "oven":
          if(stat === "on")
            return './resources/icons/web/oven_on.svg';
          else
            return './resources/icons/web/oven_off.svg';
        default:
          return './resources/icons/generic/close.svg';
      }
    }
  },
  mounted() {
    this.$root.$on('Device Selected', (device) => { // change for id
      if (this.selected && device.id != this.device.id) this.selected = !this.selected;
    });
  }
})

Vue.component('panel-light', {
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      state: false,
      color: '#FFF100',
      brightness: 10,
      id: undefined,
      error: false,
      errorMsg: ''
    }
  },
  watch: { // here we set the new values
    state(newVal, oldVal) {
      if (newVal) {
        this.sendAction(this.id, "turnOn");
      } else {
        this.sendAction(this.id, "turnOff");
      }
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
  methods: {
    async sendAction(id, action, param) {
      let rta = await execAction(id, action, param)
      .catch((error) => {
        this.errorMsg = error[0].toUpperCase() + error.slice(1);
        console.error(this.errorMsg);
      });
      if (!rta) {
        this.error = true;
      }
    }
  },
  mounted() {
    this.state = (this.device.state.status == "on");
    this.color = this.device.state.color;
    this.brightness = this.device.state.brightness;
    this.id = this.device.id;
  }
})

Vue.component('panel-oven', {
  props: {
    device: {
      type: Object,
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
  mounted() {
    // here we extract all the data
  }
})

Vue.component('panel-speaker', {
  props: {
    device: {
      type: Object,
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
  mounted() {
    // here we extract all the data
  }
})

Vue.component('panel-door', {
  props: {
    device: {
      type: Object,
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
      if (this.locked) {
        this.closed = 0;
      }
      // send stop to back
    }
  },
  mounted() {
    // here we extract all the data
  }
})

Vue.component('panel-window', {
  props: {
    device: {
      type: Object,
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
        <v-btn-toggle v-model="closed" tile color="orange darken-2" group mandatory>
            <v-btn>Closed</v-btn>
            <v-btn>Open</v-btn>
        </v-btn-toggle>
      </v-layout>
    </v-container>`,
  mounted() {
    // here we extract all the data
  }
})

Vue.component('panel-airconditioner', {
  props: {
    device: {
      type: Object,
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
  mounted() {
    // here we extract all the data
  }
})

Vue.component('panel-vacuum', {
  props: {
    device: {
      type: Object,
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
      rooms: [],
      error: false,
      errorMsg: ''
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
  async mounted() {
    let rta = await getAll("Room")
    .catch((error) => {
      this.errorMsg = error[0].toUpperCase() + error.slice(1);
      console.error(this.errorMsg);
    });;
    if (rta) {
      for (i of rta.result) {
        this.rooms.push(i.name);
      }
    } else {
      this.error = true;
    }

    if (!this.error) {
      
    }
  }
})

Vue.component('add-device', {

  data() {
    return {
      name: '',
      overlay: false,
      rooms: [],
      room: undefined,
      types: [],
      typedIds: [],
      type: undefined,
      error: false,
      errorText: false,
      errorMsg: '',
      noRooms: 0 // 0: sin cargar ; 1: hay rooms ; 2: no hay rooms
    }
  },
  watch: { // here we set the new values

  },
  template:
    `<v-container fluid>
      <v-overlay>
        <v-card v-show="noRooms == 1" max-width="700" light>
          <v-card-title>
              <span class="headline">Add Device</span>
          </v-card-title>
          <v-card-text>
              <v-container>
              <v-row>
                  <v-col cols="12">
                  <v-text-field v-model="name" label="Name" :error="errorText" required hint="Between 3 and 60 letters, numbers or spaces." clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                      <v-select v-model="room" :items="rooms" item-text="name" item-value="id" :value="room" label="Room" required></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                      <v-select v-model="type" :items="types" item-text="name" item-value="id" :value="type" label="Type" required></v-select>
                  </v-col>
              </v-row>
              </v-container>
          </v-card-text>
          <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="red darken-1" text @click="cancel()">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="accept()">Create</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-show="noRooms == 2" max-width="700" max-height="200" light justify-center>
          <v-card-title/>
          <v-row class="align-center">
            <v-col class="ml-4" cols="2">
              <v-img src="./resources/images/error.png" width="50"></v-img>
            </v-col>
            <v-col cols="9">
              <v-card-text class="body-1">Please create a room before adding devices</v-card-text>
            </v-col>
          </v-row>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="red darken-1" text @click="okNoRooms()">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-snackbar v-model="error" > {{ errorMsg }}
        <v-btn color="red" text @click="error = false; errorText = false"> OK </v-btn>
      </v-snackbar>
     
    </v-container>`,
  methods: {
    async accept() {
      if (this.name.length < 3 || this.name.length > 60) {
        this.errorMsg = 'Name must have between 3 and 60 characters!';
        this.error = true;
        this.errorText = true;
      } else if (!/^([a-zA-Z0-9 _]+)$/.test(this.name)) {
        this.errorMsg = 'Name must have letters, numbers or spaces!';
        this.error = true;
        this.errorText = true;
      } else {
        /* Crear device y luego agregar a room */
        console.log(this.type);
        let rta = await createDevice(this.name, this.type, false)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
        console.log(rta);
        if (rta) {
          let rta2 = await addDeviceToRoom(this.room, rta.result.id)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
          if (rta2) {
            this.resetVar();
            this.$root.$emit('Finished add', 0);
          } else {
            this.error = true;  
          }
        } else {
          this.error = true;
        }
      }
    },
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    okNoRooms() {
      this.resetVar();
      this.$root.$emit('Finished add', 2);
    },
    resetVar() {
      this.overlay = false;
      this.name = '';
      this.errorText = false;
    }
  },
  async mounted() {
    // here we extract all the data
    let rta = await getAll("Room")
    .catch((error) => {
      this.errorMsg = error[0].toUpperCase() + error.slice(1);
      console.error(this.errorMsg);
    });
    if (rta) {
      if (rta.result.length >= 1) {
        console.log(rta.result);
        for (i of rta.result) {
          var el = { name: i.name, id: i.id };
          this.rooms.push(el);
        }
        this.room = this.rooms[0].id;

        let rta2 = await getAll("Type")
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
        if (rta2) {
          for (i of rta2.result) {
            if (i.name != 'alarm' && i.name != 'refrigerator') {
              let el = { name: i.name[0].toUpperCase() + i.name.slice(1), id: i.id };
              this.types.push(el);
            }
          }
          this.type = this.types[0].id;
          this.overlay = true;
          this.noRooms = 1;
        } else {
          this.error = true;
        }
      } else {
        this.noRooms = 2;
      }
    } else {
      this.error = true;
    }
  }
})

Vue.component('edit-device', {

  data() {
    return {
      name: '',
      overlay: false,
      rooms: [],
      room: undefined,
      types: [],
      typedIds: [],
      type: undefined,
      error: false,
      errorText: false,
      errorMsg: '',
      noRooms: 0 // 0: sin cargar ; 1: hay rooms ; 2: no hay rooms
    }
  },
  watch: { // here we set the new values

  },
  template:
    `<v-container fluid>
      <v-overlay>
        <v-card v-show="noRooms == 1" max-width="700" light>
          <v-card-title>
              <span class="headline">Edit Device</span>
          </v-card-title>
          <v-card-text>
              <v-container>
              <v-row>
                  <v-col cols="12">
                  <v-text-field v-model="name" label="Name" :error="errorText" required hint="Between 3 and 60 letters, numbers or spaces." clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                      <v-select v-model="room" :items="rooms" item-text="name" item-value="id" :value="room" label="Room" required></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                      <v-select v-model="type" :items="types" item-text="name" item-value="id" :value="type" label="Type" required></v-select>
                  </v-col>
              </v-row>
              </v-container>
          </v-card-text>
          <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="red darken-1" text @click="cancel()">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="accept()">Create</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-show="noRooms == 2" max-width="700" max-height="200" light justify-center>
          <v-card-title/>
          <v-row class="align-center">
            <v-col class="ml-4" cols="2">
              <v-img src="./resources/images/error.png" width="50"></v-img>
            </v-col>
            <v-col cols="9">
              <v-card-text class="body-1">Please create a room before adding devices</v-card-text>
            </v-col>
          </v-row>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="red darken-1" text @click="okNoRooms()">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-snackbar v-model="error" > {{ errorMsg }}
        <v-btn color="red" text @click="error = false; errorText = false"> OK </v-btn>
      </v-snackbar>
     
    </v-container>`,
  methods: {
    async accept() {
      if (this.name.length < 3 || this.name.length > 60) {
        this.errorMsg = 'Name must have between 3 and 60 characters!';
        this.error = true;
        this.errorText = true;
      } else if (!/^([a-zA-Z0-9 _]+)$/.test(this.name)) {
        this.errorMsg = 'Name must have letters, numbers or spaces!';
        this.error = true;
        this.errorText = true;
      } else {
        /* Crear device y luego agregar a room */
        console.log(this.type);
        let rta = await createDevice(this.name, this.type, false)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
        console.log(rta);
        if (rta) {
          let rta2 = await addDeviceToRoom(this.room, rta.result.id)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
          if (rta2) {
            this.resetVar();
            this.$root.$emit('Finished add', 0);
          } else {
            this.error = true;  
          }
        } else {
          this.error = true;
        }
      }
    },
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    okNoRooms() {
      this.resetVar();
      this.$root.$emit('Finished add', 2);
    },
    resetVar() {
      this.overlay = false;
      this.name = '';
      this.errorText = false;
    }
  },
  async mounted() {
    // here we extract all the data
    let rta = await getAll("Room")
    .catch((error) => {
      this.errorMsg = error[0].toUpperCase() + error.slice(1);
      console.error(this.errorMsg);
    });
    if (rta) {
      if (rta.result.length >= 1) {
        console.log(rta.result);
        for (i of rta.result) {
          var el = { name: i.name, id: i.id };
          this.rooms.push(el);
        }
        this.room = this.rooms[0].id;

        let rta2 = await getAll("Type")
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
        if (rta2) {
          for (i of rta2.result) {
            if (i.name != 'alarm' && i.name != 'refrigerator') {
              let el = { name: i.name[0].toUpperCase() + i.name.slice(1), id: i.id };
              this.types.push(el);
            }
          }
          this.type = this.types[0].id;
          this.overlay = true;
          this.noRooms = 1;
        } else {
          this.error = true;
        }
      } else {
        this.noRooms = 2;
      }
    } else {
      this.error = true;
    }
  }
})

Vue.component('add-room', {
  data() {
    return {
      name: '',
      overlay: true,
      sheet: false,
      images: ['bedroom_01.jpg', 'bathroom_02.jpg', 'game_room_01.jpg', 'garage_01.jpg', 'kitchen_01.jpg', 'living_01.jpg', 'living_02.jpg', 'kitchen1.jpg'],
      image: undefined,
      error: false,
      errorText: false,
      errorMsg: ''
    }
  },
  watch: { // here we set the new values

  },
  template:
    `<v-container fluid>

      <v-overlay>
      <v-card max-width="700" light>
          <v-card-title>
              <span class="headline">Add Room</span>
          </v-card-title>
          
          <v-card-text>
              <v-container>
              <v-row>
                  <v-col cols="12">
                  <v-text-field v-model="name" label="Name" :error="errorText" required hint="Between 3 and 60 letters, numbers or spaces." clearable></v-text-field>
                  </v-col>
                  <v-row align="center" fixed>
                    <v-col cols="3" >
                    <v-btn color="orange" dark @click="sheet = !sheet">
                        Select image...
                    </v-btn>
                    </v-col>
                    <v-col>
                      <h3>{{ images[image] }}</h3>
                    </v-col>
                  </v-row>
              </v-row>
              </v-container>
          </v-card-text>
          
          <v-bottom-sheet v-model="sheet">
          <v-sheet  dark class="text-center" height="500px">
              <v-card dark max-width="15000" class="mx-auto">
                  <v-container class="pa-1">
                      <v-item-group v-model="image">
                          <v-row>
                          <v-col v-for="(item, i) in images" :key="i" cols="12" md="2">
                              <v-item v-slot:default="{ active, toggle }">
                              <v-img :src="\`./resources/images/\${item}\`"
                                  height="150" width="300" class="text-right pa-2" @click="toggle">
                                  <v-btn icon dark >
                                  <v-icon color="orange darken-2 ">
                                      {{ active ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                                  </v-icon>
                                  </v-btn>
                              </v-img>
                              </v-item>
                          </v-col>
                          </v-row>
                          <div class="flex-grow-1"></div>
                          <v-btn class="my-2" color="orange darken-2" @click="sheet = false">SELECT</v-btn>
                      </v-item-group>
                  </v-container>
              </v-card>
          </v-sheet>
          </v-bottom-sheet>

          <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="red darken-1" text @click="cancel()">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="accept()">Create</v-btn>
          </v-card-actions>
      </v-card>
      </v-overlay>
      <v-snackbar v-model="error" > {{ errorMsg }}
        <v-btn color="red" text @click="error = false; errorText = false"> OK </v-btn>
      </v-snackbar>
    </v-container>`,
  methods: {
    async accept() {
      if (this.name.length < 3 || this.name.length > 60) {
        this.errorMsg = 'Name must have between 3 and 60 characters!';
        this.error = true;
        this.errorText = true;
      } else if (!/^([a-zA-Z0-9 _]+)$/.test(this.name)) {
        this.errorMsg = 'Name must have letters, numbers or spaces!';
        this.error = true;
        this.errorText = true;
      } else if (this.image === undefined) {
        this.errorMsg = 'Select an image for the room!';
        this.error = true;
      } else {
        let rta = await createRoom(this.name, this.images[this.image], false)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
        if (rta) {
          this.resetVar();
          this.$root.$emit('Finished add', 0);
        } else {
          this.error = true;
        }
      }
    },
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    resetVar() {
      this.overlay = false;
      this.name = '';
      this.image = undefined;
      this.error = false;
      this.errorText = false;
    }
  },
  mounted() {
    // here we extract all the data
  }
})

Vue.component('new-routine', {
  data() {
    return {
      desc: ' ',
      name: ' ',
      snackbarCan: false,
      snackbarOk: false,
      sheet: false,
      rooms: ['Living Room', 'Kitchen', 'Bathroom', 'Garage', 'Bedroom', 'Entertainement'],
      room: 'Living Room',
      devices: ['Light 1', 'Light 2', 'Oven', 'Aire Aconditioner'],
      device: 'Light 1',
      actions: [],
      chip: true,
    }
  },
  watch: { // here we set the new values

  },
  template:
    `<v-container fluid>
      
        <v-card light max-height="600">
        <v-card-title>
            <span class="headline">New Routine</span>
            <v-col cols="12">
              <v-text-field outlined v-model="name" label="Routine Name" required></v-text-field>
            </v-col>
        </v-card-title>
        <v-card-text>
            <v-container>
            <v-row>
                <v-col cols="12">
                  <v-text-field v-model="desc" label="Action Description" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select v-model="room" :items="rooms" :value="room" label="Room" required></v-text-field>
                </v-col>
                <v-col cols="12" >
                  <sel-dev :name="name" :room="room" cat="Light" ></sel-dev>
                </v-col>
                <v-col cols="12" >
                  <div class="text-right">
                    <v-btn dark text right v-on="on" x-large color="orange darken-2" @click="addAction"> ADD ACTION </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" >
                  <div class="text-right">
                      <v-btn dark text right v-on="on" x-large color="red darken-2" @click="snackbarCan = true"> CANCEL </v-btn>
                      <v-btn dark text right v-on="on" x-large color="green darken-2" @click="snackbarOk = true"> CREATE </v-btn>
                  </div>
                </v-col>
            </v-row>
            </v-container>
          </v-card-text>
          </v-card>
          <br>
          <v-card light>
              <v-card-title>
                  <span class="headline">Added actions</span>
              </v-card-title>
              <v-card-text>
                  <v-container>
                      <v-row>
                          <v-col v-for="(item, i) in actions" :key="i" cols="12" md="2">
                              <v-chip v-if="chip" class="mr-2" color="green" outlined>
                                {{item}} 
                              </v-chip>
                          </v-col>                            
                      </v-row>
                  </v-container>
              </v-card-text>
              <v-snackbar v-model="snackbarOk" > Successfully created!
                      <v-btn color="green" text @click="snackbarOk = false" href="routines.html"> OK </v-btn>
              </v-snackbar>
              <v-snackbar v-model="snackbarCan" > Operation cancelled!
                      <v-btn color="red" text @click="snackbarCan = false" href="routines.html"> OK </v-btn>
              </v-snackbar>
          </v-card> 

    </v-container>`,
  methods: {
    // send form to back
    addAction() {
      this.actions.push(this.desc + ' - ' + this.room);
    }
  },
  mounted() {
    // here we extract all the data
  }
})

Vue.component('panel-none', {
  props: {
    device: {
      type: Object,
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
      <div class="mt-5 ma-1 title font-weight-bold">Hello Julian Ajax!</div>
      <div class="mb-5 ma-1 ">Welcome to your smart house! Here we have some tips for you.</div>
      
      <v-card dark class="mt-5 mb-5 ma-1">
        <v-card-title>Add a Device</v-card-title>
        <v-card-text>Search for the + button in the bottom right part of 
        any page and start adding new Devices</v-card-text>
      </v-card>
      
      <v-card dark class="mb-5 ma-1">
        <v-card-title>Device Settings</v-card-title>
        <v-card-text>Here in this panel are going to be shown the settings of the device 
        selected. Click on one to get started!</v-card-text>
      </v-card>
       
      <v-card dark class="mb-5 ma-1">
        <v-card-title>Tabs</v-card-title>
        <v-card-text>There are some tabs so you can find your devices faster! 
        Just click on them and choose the category you need.</v-card-text>
      </v-card>
        
      <v-card dark class="mb-5 ma-1">
        <v-card-title>Search</v-card-title>
        <v-card-text>If you can't find a specific device, routine or room
        you can search it by cicking in the search icon on the top right of the page.</v-card-text>
      </v-card>  
    </v-container>`,
  mounted() {
    // here we extract all the data
  }
})

Vue.component('add-btn', {
  props: {
    context: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      overlay: false,
      snackbarCan: false,
      snackbarOk: false
    }
  },
  template:
    `<v-container>
      <v-tooltip top>
          <template v-slot:activator="{ on }" >
            <v-btn fixed fab dark bottom right v-on="on" x-large class="mx-2 mt-5" color="orange darken-2" @click="overlay = true">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
        </template>
        <span v-show="getContext=='add-device'">Add Device</span>
        <span v-show="getContext=='add-room'">Add Room</span>
      </v-tooltip>
      <component v-show="overlay" :is="getContext"> </component>

      <v-snackbar v-model="snackbarOk" > Successfully created!
              <v-btn color="green" text @click="snackbarOk = false"> OK </v-btn>
      </v-snackbar>
      <v-snackbar v-model="snackbarCan" > Operation cancelled!
              <v-btn color="red" text @click="snackbarCan = false"> OK </v-btn>
      </v-snackbar>
    </v-container>`,
  computed: {
    getContext() {
      switch (this.context) {
        case 'room':
          return 'add-room';
        case 'device':
          return 'add-device';
        default:
          console.log('error');
      }
    }
  },
  mounted() {
    this.$root.$on('Finished add', (state) => {
      this.overlay = false;
      switch(state) {
        case 0:
          this.snackbarOk = true;
          break;
        case 1:
          this.snackbarCan = true;
          break;
      }
    });
  }
})

Vue.component('no-card', {
  props: {
    text: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 4
    },
    ratio: {
      type: Number,
      default: 2
    }
  },
  template:
    `<v-card dark class="ma-3 ml-5" :width="getWidth" :height="getHeight">
      <v-card-title></v-card-title>
      <v-card-title class="headline ma-5 justify-center">{{text}}</v-card-title>
    </v-card>`,
    computed: {
      getWidth() {
        return screen.width / this.width; // ver si da limitarlo con max y min
      },
      getHeight() {
        return screen.width/ 6 / this.ratio;
      },
    }
})

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
            <input filled placeholder="Username">
            <input type="password" placeholder="Password">
            <v-btn icon href="./home.html">
                <v-icon>mdi-forward</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
        </v-app-bar>`,
})

Vue.component('room-bar', {
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      overlay: false
    }
  },
  template:
    ` <v-container>
        <v-row class="align-center">
          <v-col>
            <v-btn icon href="rooms.html">
              <v-icon size="40">mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col>
              <div class="headline ml-5 text-left">{{ room.name }}</div>
          </v-col>
          <v-btn right class="ml-5" icon @click="toggleFavorite">
            <v-icon v-show="room.meta.favorite" size="40">mdi-star</v-icon>
            <v-icon v-show="!room.meta.favorite" size="40">mdi-star-outline</v-icon>
          </v-btn>

          <v-btn right class="mx-5" icon @click="overlay = true">
            <v-icon size="35">mdi-settings</v-icon>
          </v-btn>
        </v-row>

        <component v-show="overlay" :is="getComp" :room="room"> </component>

      </v-container>`,
  computed: {
    getComp () {
      if (this.room.name.length > 0)
        return 'edit-room';
    }
  },
  methods: {
    async toggleFavorite () {
      this.room.meta.favorite = !this.room.meta.favorite;
      console.log(this.room);
      let rta = await modifyRoom(this.room)
      .catch((error) => {
        this.errorMsg = error[0].toUpperCase() + error.slice(1);
        console.error(this.errorMsg);
      });
      if (rta) {
        console.log(rta.result);
      } else {
        this.error = true;
      }
    }
    
  },
  mounted() {

  }
})

Vue.component('edit-room', {
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      name: this.room.name,
      overlay: true,
      sheet: false,
      images: ['bedroom_01.jpg', 'bathroom_02.jpg', 'game_room_01.jpg', 'garage_01.jpg', 'kitchen_01.jpg', 'living_01.jpg', 'living_02.jpg', 'kitchen1.jpg'],
      // image: images.indexOf(this.room.meta.image),
      image: 0,
      error: false,
      errorText: false,
      errorMsg: ''
    }
  },
  watch: { // here we set the new values

  },
  template:
    `<v-container fluid>

      <v-overlay>
      <v-card max-width="700" light>
          <v-card-title>
              <span class="headline">Edit {{room.name}}</span>
          </v-card-title>
          
          <v-card-text>
              <v-container>
              <v-row>
                  <v-col cols="12">
                  <v-text-field v-model="name" label="Name" :error="errorText" required hint="Between 3 and 60 letters, numbers or spaces." clearable></v-text-field>
                  </v-col>
                  <v-row align="center" fixed>
                    <v-col cols="3" >
                    <v-btn color="orange" dark @click="sheet = !sheet">
                        Select image...
                    </v-btn>
                    </v-col>
                    <v-col>
                      <h3> {{ images[image] }} </h3>
                    </v-col>
                  </v-row>
              </v-row>
              </v-container>
          </v-card-text>
          
          <v-bottom-sheet v-model="sheet">
          <v-sheet  dark class="text-center" height="500px">
              <v-card dark max-width="15000" class="mx-auto">
                  <v-container class="pa-1">
                      <v-item-group v-model="image">
                          <v-row>
                          <v-col v-for="(item, i) in images" :key="i" cols="12" md="2">
                              <v-item v-slot:default="{ active, toggle }">
                              <v-img :src="\`./resources/images/\${item}\`" height="150" width="300" class="text-right pa-2" @click="toggle">
                                  <v-btn icon dark >
                                  <v-icon color="orange darken-2 ">
                                      {{ active ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                                  </v-icon>
                                  </v-btn>
                              </v-img>
                              </v-item>
                          </v-col>
                          </v-row>
                          <div class="flex-grow-1"></div>
                          <v-btn class="my-2" color="orange darken-2" @click="sheet = false">SELECT</v-btn>
                      </v-item-group>
                  </v-container>
              </v-card>
          </v-sheet>
          </v-bottom-sheet>

          <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="red darken-1" text @click="cancel()">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="apply()">Apply</v-btn>
          </v-card-actions>
      </v-card>
      </v-overlay>

      <v-snackbar v-model="error" > {{ errorMsg }}
        <v-btn color="red" text @click="error = false; errorText = false"> OK </v-btn>
      </v-snackbar>

    </v-container>`,

  methods: {
    async apply () {
      if (this.name.length < 3 || this.name.length > 60) {
        this.errorMsg = 'Name must have between 3 and 60 characters!';
        this.error = true;
        this.errorText = true;
      } else if (!/^([a-zA-Z0-9 _]+)$/.test(this.name)) {
        this.errorMsg = 'Name must have letters, numbers or spaces!';
        this.error = true;
        this.errorText = true;
      } else if (this.image === undefined) {
        this.errorMsg = 'Select an image for the room!';
        this.error = true;
      } else {
        this.room.name = this.name;
        this.room.meta.image = images[image];
        console.log(this.room);
        let rta = await modifyRoom(this.room)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
        if (rta) {
          console.log(rta.result);
          this.resetVar();
        } else {
          this.error = true;
        }
      }
    },
    cancel() {
      this.resetVar();
    },
    resetVar() {
      this.overlay = false;
      this.error = false;
      this.errorText = false;
    }
  },
  mounted() {
    console.log(this.room);
    // here we extract all the data
  }
})

Vue.component('room-cat', {
  props: {
    devices: {
      type: Array,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  template:
    ` <v-container>
        <v-row>
          <div class="title grey--text mt-4 ml-5">{{category}}</div>
        </v-row>
        <v-row>
          <v-col v-for="dev in devices" :key="dev.id" cols="auto">
            <dev-btn :device="dev"></dev-btn>
          </v-col>
        </v-row>
      </v-container>`,
  mounted() {
  }
})

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

Vue.component('test', {
  props: {
    room_id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    devices: {
      type: Array,
      required: true
    }
  },
  template:
  `<v-container>
    <v-row>
      <div class="title grey--text text-capitalize mt-4 ml-5">{{ title }}</div>
    </v-row>
    <v-row>
      <v-col v-for="dev in devices" cols="auto">
        <dev-btn :device="dev"></dev-btn>
      </v-col>
    </v-row>
  </v-container>`
})