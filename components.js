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
      device: { name: "No Device Selected", room: { name: "Please Select a Device" }, type: { name: "" }, meta: { favorite: false } },
      selected: false,
      settings: false,

      snackbarCan: false,
      snackbarOk: false,
      snackbarMsg: ''
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
          <v-btn icon v-show="selected" @click="toggleFavorite">
            <v-icon v-show="device.meta.favorite">mdi-star</v-icon>
            <v-icon v-show="!device.meta.favorite">mdi-star-outline</v-icon>
          </v-btn>
          <v-btn icon v-show="selected" @click="settings = true">
            <v-icon>mdi-settings</v-icon>
          </v-btn>
        </v-list-item>
      </template>
      <v-divider class="mx-5"></v-divider>        
      
      <component v-show="settings" :is="getComp" :device="device"> </component>

      <!-- information and settings -->
      <component :is="getPanelContent" :device="device"></component>

      <v-snackbar v-model="snackbarOk" > {{snackbarMsg}}
              <v-btn color="green" text @click="snackbarOk = false"> OK </v-btn>
      </v-snackbar>
      <v-snackbar v-model="snackbarCan" > {{snackbarMsg}}
              <v-btn color="red" text @click="snackbarCan = false"> OK </v-btn>
      </v-snackbar>
    </v-navigation-drawer>`,
  methods: {
    async toggleFavorite() {
      this.device.meta.favorite = !this.device.meta.favorite;
      console.log(this.device);
      let rta = await modifyDevice(this.device.id, this.device.name, this.device.meta.favorite)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
      } else {
        this.error = true;
      }
    },
    launchSettings() {
      // do something here when motherfucker touches settings
    }
  },
  computed: {
    getComp() {
      if (this.selected)
        return 'edit-device';
    },
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
        case "refrigerator":
          return './resources/icons/web/fridge.svg'
        default:
          return './resources/icons/generic/close.svg';
      }
    },
    getPanelContent() {
      switch (this.device.type.name) {
        case "lamp":
          return "panel-light";
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
        case "refrigerator":
          return "panel-refrigerator"
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
      this.device = { name: "No Device Selected", room: { name: "Please Select a Device" }, type: { name: "" }, meta: { favorite: false } };
      this.selected = false;
    });
    this.$root.$on('Finished edit', (name, exit) => {
      this.settings = false;
      this.device.name = name;
      if (exit) {
        this.device = { name: "No Device Selected", room: { name: "Please Select a Device" }, type: { name: "" }, meta: { favorite: false } };
        this.selected = false;
      }
      // switch (state) {
      //   case 1:
      //     this.snackbarMsg = 'Operation cancelled!';
      //     this.snackbarCan = true;
      //     break;
      //   case 2:
      //     this.snackbarMsg = 'Successfully edited!';
      //     this.snackbarOk = true;
      //     break;
      //   case 3:
      //     this.snackbarMsg = 'Successfully deleted!';
      //     this.snackbarCan = true;
      //     break;
      // }
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
          <v-img eager :max-width="getIconSize" :src="getImg" contain/>
        </div>
      </v-btn>
      <div class="text-capitalize black--text font-weight-light mb-1">
        {{ device.name }}
      </div>
    </v-col>`,
  computed: {
    getSize() {
      return screen.width / 13; // ver si da limitarlo con max y min
    },
    getIconSize() {
      if (this.device.type.name === "refrigerator" || this.device.type.name === "door") return this.getSize / 3;
      return this.getSize / 2;
    },
    getName() {
      return this.device.name; // aca ver de poner max y min caracteres
    },
    getImg() {
      let stat = this.device.state.status;
      switch (this.device.type.name) {
        case "lamp":
          if (stat === "on")
            return './resources/icons/web/lamp_on.svg';
          else
            return './resources/icons/web/lamp_off.svg';
        case "vacuum":
          if (stat === "on")
            return './resources/icons/web/vacuum_on.svg';
          else
            return './resources/icons/web/vacuum_off.svg';
        case "ac":
          if (stat === "on")
            return './resources/icons/web/air_conditioner_on.svg';
          else
            return './resources/icons/web/air_conditioner_off.svg';
        case "door":
          if (stat === "closed")
            return './resources/icons/web/door_closed.svg';
          else {
            if (stat === "opened")
              return './resources/icons/web/door_opened.svg'; // NO EXISTS
            else
              return './resources/icons/web/door_locked.svg'; // NO EXISTS
          }
        case "blinds":
          if (stat === "closed")
            return './resources/icons/web/window_closed.svg';
          else
            return './resources/icons/web/window_open.svg';
        case "speaker":
          if (stat === "playing")
            return './resources/icons/web/speaker_playing.svg';
          else
            return './resources/icons/web/speaker_off.svg';
        case "oven":
          if (stat === "on")
            return './resources/icons/web/oven_on.svg';
          else
            return './resources/icons/web/oven_off.svg';
        case "refrigerator":
          return "./resources/icons/web/fridge.svg";
        default:
          return './resources/icons/generic/close.svg';
      }
    },
  },
  methods: {
    updateDev(device) {
      this.device.state.status = device.state.status;
      this.device.name = device.name;
    },
    toggleSelected() {
      this.selected = !this.selected;
      console.log(this.device);
      if (this.selected) {
        this.$root.$emit('Device Selected', this.device);
      } else {
        this.$root.$emit('Device Deselected');
      }
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        this.updateDev(rta.result);
      } else {
        this.error = true;
      }
    }
  },
  async mounted() {
    this.$root.$on('Device Selected', (device) => {
      if (this.selected && device.id != this.device.id) this.selected = !this.selected;
    });
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
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
      state: (this.device.state.status == "on"),
      color: "#" + this.device.state.color,
      brightness: this.device.state.brightness,
      error: false,
      errorMsg: '',
    }
  },
  watch: { // here we set the new values
    state(newVal, oldVal) {
      if (newVal) {
        this.sendAction("turnOn", []);
      } else {
        this.sendAction("turnOff", []);
      }
    },
    color(newVal, oldVal) {
      this.sendAction("setColor", [newVal.substr(1)]);
    },
    brightness(newVal, oldVal) {
      this.sendAction("setBrightness", [newVal])
    }
  },
  template:
    `<v-container fluid>
      <v-layout align-center wrap>
        <v-layout column align-end mr-2>
          <h3>Off</h3>
        </v-layout>
        <v-layout column>
          <v-switch class="align-center justify-center" v-model="state" :key="state" color="orange"></v-switch>
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
    updateDev(dev) {
      this.state = (dev.state.status == "on");
      this.color = "#" + dev.state.color;
      this.brightness = dev.state.brightness;
    },
    async sendAction(action, param) {
      let rta = await execAction(this.device.id, action, param)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        this.updateDev(rta.result);
      } else {
        this.error = true;
      }
    }
  },
  mounted() {
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
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
      state: (this.device.state.status == "on"),
      temperature: this.device.state.temperature,
      heat_source: this.getHeatIndex(this.device.state.heat),
      convection_mode: this.getConvectionIndex(this.device.state.convection),
      grill_mode: this.getGrillIndex(this.device.state.grill)
    }
  },
  watch: { // here we set the new values
    state(newVal, oldVal) {
      if (newVal) {
        this.sendAction("turnOn", []);
      } else {
        this.sendAction("turnOff", []);
      }
    },
    temperature(newVal, oldVal) {
      this.sendAction("setTemperature", [newVal])
    },
    heat_source(newVal, oldVal) {
      var aux = "conventional";
      if (newVal === 0)
        aux = "top";
      else if (newVal === 1)
        aux = "bottom";
      this.sendAction("setHeat", [aux]);
    },
    convection_mode(newVal, oldVal) {
      var aux = "normal";
      if (newVal === 0)
        aux = "off";
      else if (newVal === 1)
        aux = "eco";
      this.sendAction("setConvection", [aux]);
    },
    grill_mode(newVal, oldVal) {
      var aux = "large";
      if (newVal === 0)
        aux = "off";
      else if (newVal === 1)
        aux = "eco";
      this.sendAction("setGrill", [aux]);
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
  methods: {
    async sendAction(action, param) {
      let rta = await execAction(this.device.id, action, param)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
    getHeatIndex(name) {
      switch (name) {
        case "top":
          return 0;
        case "bottom":
          return 1;
        case "conventional":
          return 2;
      }
    },
    getGrillIndex(name) {
      switch (name) {
        case "off":
          return 0;
        case "eco":
          return 1;
        case "large":
          return 2;
      }
    },
    getConvectionIndex(name) {
      switch (name) {
        case "off":
          return 0;
        case "eco":
          return 1;
        case "normal":
          return 2;
      }
    },
    updateDev(device) {
      this.state = (device.state.status == "on");
      this.temperature = device.state.temperature;
      this.heat_source = this.getHeatIndex(device.state.heat);
      this.convection_mode = this.getConvectionIndex(device.state.convection);
      this.grill_mode = this.getGrillIndex(device.state.grill);
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        this.updateDev(rta.result);
      } else {
        this.error = true;
      }
    }
  },
  mounted() {
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
  }
})

Vue.component('panel-refrigerator', {
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      temperature: this.device.state.temperature,
      freezer_temp: this.device.state.freezerTemperature,
      mode: this.getModeIndex(this.device.state.mode)
    }
  },
  watch: { // here we set the new values
    temperature(newVal, oldVal) {
      this.sendAction("setTemperature", [newVal])
    },
    freezer_temp(newVal, oldVal) {
      this.sendAction("setFreezerTemperature", [newVal])
    },
    mode(newVal, oldVal) {
      var aux = "party";
      if (newVal === 0)
        aux = "default";
      else if (newVal === 1)
        aux = "vacation";
      this.sendAction("setMode", [aux]);
    }
  },
  template:
    `<v-container fluid>
      <v-subheader class="mt-5">Temperature</v-subheader>
      <v-slider v-model="temperature" class="mt-4" step="1" ticks="always" tick-size="4" min="2" max="8"
        thumb-label="always" thumb-size="25" color="orange" track-color="black"
        thumb-color="orange darken-2"></v-slider>

      <v-subheader>Freezer Temperature</v-subheader>
      <v-slider v-model="freezer_temp" class="mt-4" step="1" ticks="always" tick-size="4" min="-20" max="-8"
        thumb-label="always" thumb-size="25" color="orange" track-color="black"
        thumb-color="orange darken-2"></v-slider>
    
      <v-subheader>Mode</v-subheader>
      <v-layout column align-center>
        <v-btn-toggle v-model="mode" tile color="orange darken-2" group mandatory>
          <v-btn>Normal</v-btn>
          <v-btn>Vacation</v-btn>
          <v-btn>Party</v-btn>
        </v-btn-toggle>
      </v-layout>

    </v-container>`,
  methods: {
    async sendAction(action, param) {
      let rta = await execAction(this.device.id, action, param)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
    getModeIndex(name) {
      switch (name) {
        case "vacation":
          return 1;
        case "party":
          return 2;
        case "default":
          return 0;
      }
    },
    updateDev(device) {
      this.temperature = device.state.temperature;
      this.freezer_temp = device.state.freezerTemperature;
      this.mode = this.getModeIndex(device.state.mode);
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        this.updateDev(rta.result);
      } else {
        this.error = true;
      }
    }
  },
  mounted() {
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
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
      state: undefined,
      playlist: true,
      elapsed_time: '2:05', // should be a number
      song_name: 'No Song in Queue',
      song_artist: 'Unknown Artist',
      play: true,
      volume: this.device.state.volume,
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
  computed: {
    getTime() {
      return this.elapsed_time; // here to do conversion secs to something printable
    }
  },
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
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        // this.device = rta.result; // updateDev
      } else {
        this.error = true;
      }
    }
  },
  mounted() {
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
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
      closed: (this.device.state.status === "opened") ? 1 : 0,
      locked: (this.device.state.lock === "locked")
    }
  },
  watch: {
    closed(newVal, oldVal) {
      if (newVal === 0)
        this.sendAction("close", []);
      else {
        this.sendAction("open", []);
        this.locked = false;
      }
    },
    locked(newVal, oldVal) {
      if (newVal)
        this.sendAction("lock", []);
      else this.sendAction("unlock", []);
    }
  },
  template:
    `<v-container fluid>
      <v-layout align-center class="ma-5">
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
    },
    async sendAction(action, param) {
      let rta = await execAction(this.device.id, action, param)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
    updateDev(device) {
      this.closed = (device.state.status === "opened") ? 1 : 0;
      this.locked = (device.state.lock === "locked");
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        this.updateDev(rta.result);
      } else {
        this.error = true;
      }
    }
  },
  mounted() {
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
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
      closed: this.getClosedIndex(this.device.state.status),
      moving: this.getStatus(this.device.state.status),
      progress: this.device.state.level,
    }
  },
  watch: {
    closed(newVal, oldVal) {
      if (newVal === 0) {
        this.sendAction("close", []);
        this.closing = true;
      } else {
        this.sendAction("open", []);
        this.opening = true;
      }
    }
  },
  template:
    `<v-container fluid>
      <v-layout column align-center class="ma-5">
        <v-btn-toggle v-model="closed" tile color="orange darken-2" group mandatory>
            <v-btn :disabled="moving" >Closed</v-btn>
            <v-btn :disabled="moving" >Open</v-btn>
        </v-btn-toggle>
        <v-subheader v-show="progress > 0 && progress < 100" class="text-capitalize">{{device.state.status}}</v-subheader>
        <v-progress-linear v-show="progress > 0 && progress < 100" v-model="progress" color="orange"></v-progress-linear>
      </v-layout>
    </v-container>`,
  methods: {
    async sendAction(action, param) {
      let rta = await execAction(this.device.id, action, param)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
    getClosedIndex(status) {
      if (status === "closed" || status == "closing") return 0;
      return 1;
    },
    getStatus(status) {
      return (status === "opening" || status == "closing");
    },
    updateDev(device) {
      this.device.state.status = device.state.status;
      this.closed = this.getClosedIndex(device.state.status);
      this.moving = this.getStatus(device.state.status);
      this.progress = device.state.level;
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        this.updateDev(rta.result);
      } else {
        this.error = true;
      }
    }
  },
  mounted() {
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
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
      state: (this.device.state.status === "on"),
      temperature: this.device.state.temperature,
      mode: this.getModeIndex(this.device.state.mode),
      fan_speed: this.getSpeedNumber(this.device.state.fanSpeed),
      auto_fan_speed: (this.device.state.fanSpeed === "auto"),
      vertical_wings: this.getSwingNumber(this.device.state.verticalSwing),
      auto_vertical_wings: (this.device.state.verticalSwing === "auto"),
      horizontal_wings: this.getSwingNumber(this.device.state.horizontalSwing),
      auto_horizontal_wings: (this.device.state.horizontalSwing === "auto"),
    }
  },
  watch: {
    state(newVal, oldVal) {
      if (newVal)
        this.sendAction("turnOn", []);
      else this.sendAction("turnOff", []);
    },
    temperature(newVal, oldVal) {
      this.sendAction("setTemperature", [newVal]);
    },
    mode(newVal, oldVal) {
      var aux = "heat";
      if (newVal === 0)
        aux = "cold";
      else if (newVal === 1)
        aux = "fan";
      this.sendAction("setMode", [aux]);
    },
    fan_speed(newVal, oldVal) {
      this.sendAction("setFanSpeed", [newVal.toString()]);
    },
    auto_fan_speed(newVal, oldVal) {
      if (newVal)
        this.sendAction("setFanSpeed", ["auto"]);
      else this.sendAction("setFanSpeed", [this.fan_speed.toString()]);

    },
    vertical_wings(newVal, oldVal) {
      this.sendAction("setVerticalSwing", [Math.trunc(newVal).toString()]);
    },
    auto_vertical_wings(newVal, oldVal) {
      if (newVal)
        this.sendAction("setVerticalSwing", ["auto"]);
      else this.sendAction("setVerticalSwing", [Math.trunc(this.vertical_wings).toString()]);
    },
    horizontal_wings(newVal, oldVal) {
      this.sendAction("setHorizontalSwing", [newVal.toString()]);
    },
    auto_horizontal_wings(newVal, oldVal) {
      if (newVal)
        this.sendAction("setHorizontalSwing", ["auto"]);
      else this.sendAction("setHorizontalSwing", [this.horizontal_wings.toString()]);
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
          <v-checkbox label="Auto" color="orange darken-2" v-model="auto_fan_speed"></v-checkbox>
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
          <v-checkbox label="Auto" color="orange darken-2" v-model="auto_vertical_wings"></v-checkbox>
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
          <v-checkbox label="Auto" color="orange darken-2" v-model="auto_horizontal_wings"></v-checkbox>
        </v-col>
      </v-row>
    </v-container>`,
  methods: {
    getSpeedNumber(str) {
      if (str === "auto") return 50;
      return parseInt(str, 10);
    },
    getSwingNumber(str) {
      if (str === "auto") return 45;
      return parseInt(str, 10);
    },
    getModeIndex(mode) {
      switch (mode) {
        case "cool":
          return 0;
        case "fan":
          return 1;
        case "heat":
          return 2;
      }
    },
    async sendAction(action, param) {
      let rta = await execAction(this.device.id, action, param)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
    updateDev(device) {
      this.state = (device.state.status === "on");
      this.temperature = device.state.temperature;
      this.mode = this.getModeIndex(device.state.mode);
      this.fan_speed = this.getSpeedNumber(device.state.fanSpeed);
      this.auto_fan_speed = (device.state.fanSpeed === "auto");
      this.vertical_wings = this.getSwingNumber(device.state.verticalSwing);
      this.auto_vertical_wings = (device.state.verticalSwing === "auto");
      this.horizontal_wings = this.getSwingNumber(device.state.horizontalSwing);
      this.auto_horizontal_wings = (device.state.horizontalSwing === "auto");
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        this.updateDev(rta.result);
      } else {
        this.error = true;
      }
    }
  },
  mounted() {
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
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
      this.$root.$emit('Finished add', 1);
    },
    resetVar() {
      this.overlay = false;
      this.name = '';
      this.error = false;
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
            if (i.name != 'alarm' && i.name != 'vacuum') {
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
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      name: this.device.name,
      overlay: true,
      rooms: [],
      // room: { name: this.device.room.name, id: this.device.room.id },
      room: this.device.room.id,
      types: [],
      type: { name: this.device.type.name[0].toUpperCase() + this.device.type.name.slice(1), id: this.device.type.id },
      dialog: false,
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
              <span class="headline">Editing "{{device.name}}"</span>
              <v-row justify="end">
              <v-btn right class="mx-5" icon @click="dialog = true">
                <v-icon size="30">mdi-delete</v-icon>
              </v-btn>
              </v-row>
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
                      <v-select disabled :label="type.name" required></v-select>
                  </v-col>
              </v-row>
              </v-container>
          </v-card-text>
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
     
      <v-dialog v-model="dialog" persistent width="410">        
        <v-card>
          <v-card-title>Device: {{name}}</v-card-title>
          <v-card-text class="body-1">Are you sure you want to delete it?</v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="red darken-1" text @click="cancelRemove()">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="removeDevice()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>`,
  methods: {
    async apply() {
      if (this.name.length < 3 || this.name.length > 60) {
        this.errorMsg = 'Name must have between 3 and 60 characters!';
        this.error = true;
        this.errorText = true;
      } else if (!/^([a-zA-Z0-9 _]+)$/.test(this.name)) {
        this.errorMsg = 'Name must have letters, numbers or spaces!';
        this.error = true;
        this.errorText = true;
      } else {
        this.device.name = this.name;
        // this.device.room.id = this.room;
        let rta = await modifyDevice(this.device.id, this.name, this.device.meta.favorite)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
        if (rta) {
          console.error(this.room);
          console.error(this.device.room.id);
          let roomChanged = (this.room != this.device.room.id);
          if (roomChanged) {
            let rta = await deleteDeviceFromRoom(this.device.id)
              .catch((error) => {
                this.errorMsg = error[0].toUpperCase() + error.slice(1);
                console.error(this.errorMsg);
              });
            if (rta) {
              let rta = await addDeviceToRoom(this.room, this.device.id)
                .catch((error) => {
                  this.errorMsg = error[0].toUpperCase() + error.slice(1);
                  console.error(this.errorMsg);
                });
              if (!rta) {
                this.error = true;
              }
            } else {
              this.error = true;
            }
          }
          if (!this.error) {
            this.resetVar();
            this.$root.$emit('Finished edit', this.name, roomChanged);
            this.$root.$emit('Finished add', 2);
          }
        } else {
          this.error = true;
        }
      }
    },
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished edit', this.name, false);
      this.$root.$emit('Finished add', 1);
    },
    cancelRemove() {
      this.dialog = false;
      this.$root.$emit('Finished add', 1);
    },
    async removeDevice() {
      this.dialog = false;

      let rta = await deleteDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        this.resetVar();
        this.$root.$emit('Finished edit', this.name, true);
        this.$root.$emit('Finished add', 3);
        window.location.reload();
      } else {
        this.error = true;
      }
    },
    resetVar() {
      this.name = this.device.name;
      this.room = this.device.room.id;
      this.overlay = false;
      this.error = false;
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
      for (i of rta.result) {
        var el = { name: i.name, id: i.id };
        this.rooms.push(el);
      }
      this.overlay = true;
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
      <v-card width="700" light>
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
                    <v-col cols="4">
                    <v-btn color="orange" dark @click="sheet = !sheet">
                        Select image...
                    </v-btn>
                    </v-col>
                    <v-col cols="8" >
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
      overlay: true,
      desc: ' ',
      name: ' ',
      snackbarCan: false,
      snackbarOk: false,
      sheet: false,
      rooms: ['Living Room', 'Kitchen', 'Bathroom', 'Garage', 'Bedroom', 'Entertainement'],
      room: ' ',
      devices: ['1', '2'],
      device: ' ',
      options: [],
      option: ' ',
      actions: [],
      chip: true,
    }
  },
  watch: { // here we set the new values

  },
  template: // en sel-dev hay que ver que mandarle bien, segun como armes esto @Mati Brula
    `<v-container fluid>

      <v-overlay>      
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
                  <v-col cols="3" >
                    <v-select v-model="room" :items="rooms" :value="room" label="Room" required></v-text-field>
                  </v-col>
                  <v-col cols="4" >
                    <v-select v-model="device" :items="devices" :value="device" label="Device" required></v-text-field>
                  </v-col>
                  <v-col cols="5" >
                    <v-select v-model="option" :items="options" :value="option" label="Action" required></v-text-field>
                  </v-col>
                  <v-container>
                        <h1>CAJITA DEL DEVICE CUANDO CORRESPONDA</h1>
                  </v-container>
                  <v-col cols="12" >
                    <div class="text-right">
                      <v-btn dark text right v-on="on" x-large color="orange darken-2" @click="addAction"> ADD ACTION </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" >
                    <div class="text-right">
                        <v-btn dark text right v-on="on" x-large color="red darken-2" @click="cancel()"> CANCEL </v-btn>
                        <v-btn dark text right v-on="on" x-large color="green darken-2" @click="create()"> CREATE </v-btn>
                    </div>
                  </v-col>
              </v-row>
              </v-container>

            </v-card-text>
          </v-card>
          <br>
          <v-card light max-height="300" class="scroll">
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
                      <v-btn color="green" text @click="snackbarOk = false"> OK </v-btn>
              </v-snackbar>
              <v-snackbar v-model="snackbarCan" > Operation cancelled!
                      <v-btn color="red" text @click="snackbarCan = false"> OK </v-btn>
              </v-snackbar>
          </v-card> 
      </v-overlay>

    </v-container>`,
  methods: {
    // send form to back
    create() {
      this.resetVar();
      this.$root.$emit('Finished add', 0);
    },
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    addAction() {
      this.actions.push(this.desc + ' - ' + this.device + ' - ' + this.room);
    },
    resetVar() {
      this.overlay = false;
      // todo lo que haya que apagar
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
      snackbarOk: false,
      snackbarMsg: ''
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
        <span v-show="getContext=='new-routine'">Add Routine</span>
      </v-tooltip>
      <component v-show="overlay" :is="getContext"> </component>

      <v-snackbar v-model="snackbarOk" > {{snackbarMsg}}
              <v-btn color="green" text @click="snackbarOk = false"> OK </v-btn>
      </v-snackbar>
      <v-snackbar v-model="snackbarCan" > {{snackbarMsg}}
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
        case 'routine':
          return 'new-routine';
        default:
          console.log('error');
      }
    }
  },
  mounted() {
    // Convendria recibir state (error o no error para color) y mensaje
    this.$root.$on('Finished add', (state) => {
      this.overlay = false;
      switch (state) {
        case 0:
          this.snackbarMsg = 'Successfully created!';
          this.snackbarOk = true;
          break;
        case 1:
          this.snackbarMsg = 'Operation cancelled!';
          this.snackbarCan = true;
          break;
        case 2:
          this.snackbarMsg = 'Successfully edited!';
          this.snackbarOk = true;
          break;
        case 3:
          this.snackbarMsg = 'Successfully deleted!';
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
      return screen.width / 6 / this.ratio;
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
    getComp() {
      if (this.room.name.length > 0)
        return 'edit-room';
    }
  },
  methods: {
    async toggleFavorite() {
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
    this.$root.$on('Finished add', (state) => {
      this.overlay = false;
      switch (state) {
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
      image: 0,
      dialog: false,
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
      <v-card width="700" light>
          <v-card-title>
              <span class="headline">Editing "{{room.name}}"</span>
              <v-row justify="end">
              <v-btn right class="mx-5" icon @click="dialog = true">
                <v-icon size="30">mdi-delete</v-icon>
              </v-btn>
              </v-row>
          </v-card-title>
          
          <v-card-text>
              <v-container>
              <v-row>
                  <v-col cols="12">
                  <v-text-field v-model="name" label="Name" :error="errorText" required hint="Between 3 and 60 letters, numbers or spaces." clearable></v-text-field>
                  </v-col>
                  <v-row align="center" fixed>
                    <v-col cols="4" >
                    <v-btn color="orange" dark @click="sheet = !sheet">
                        Select image...
                    </v-btn>
                    </v-col>
                    <v-col cols="8">
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

      <v-dialog v-model="dialog" persistent width="410">        
        <v-card>
          <v-card-title>Room: {{name}}</v-card-title>
          <v-card-text class="body-1">Are you sure you want to delete it?</v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="red darken-1" text @click="cancelRemove()">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="removeRoom()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>`,

  methods: {
    async apply() {
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
        this.room.meta.image = this.images[this.image];
        console.log(this.room);
        let rta = await modifyRoom(this.room)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
        if (rta) {
          console.log(rta.result);
          this.$root.$emit('Finished add', 2);
          this.resetVar();
        } else {
          this.error = true;
        }
      }
    },
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    cancelRemove() {
      this.dialog = false;
      this.errorMsg = 'Canceled Delete';
      this.error = true;
    },
    async removeDev(id) {
      let rta = await deleteDevice(id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
    async removeRoom() {
      this.dialog = false;

      let rta = await getRoomDevices(this.room.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        for (dev of rta.result) {
          this.removeDev(dev.id);
        }
      } else {
        this.error = true;
      }

      if (!this.error) {
        let rta = await deleteRoom(this.room.id)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
        if (rta) {
          this.resetVar();
          window.location.replace('rooms.html');
        } else {
          this.error = true;
        }
      }
    },
    resetVar() {
      this.overlay = false;
      this.error = false;
      this.errorText = false;
    }
  },
  mounted() {
    console.log(this.room);
    this.image = this.images.indexOf(this.room.meta.image);
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

Vue.component('dev-cat', {
  props: {
    room: {
      type: Object,
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
        <div class="title grey--text text-capitalize mt-4 ml-5">{{ room.name }}</div>
      </v-row>
      <v-row >
        <div v-for="dev in devices" :key="dev.id">
          <v-col v-if="dev.room.id === room.id" cols="auto">
            <dev-btn :device="dev"></dev-btn>
          </v-col>
        </div>
      </v-row>
    </v-container>`
})