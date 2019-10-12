/* Floating button for adding routines, devices and rooms */
Vue.component('add-btn', {
  props: {
    context: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: false
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
      <component v-show="overlay" :is="getContext" :default="room"> </component>

      <v-snackbar v-model="snackbarOk" > {{snackbarMsg}}
        <v-btn color="green" text @click="snackbarOk = false"> OK </v-btn>
      </v-snackbar>
      <v-snackbar v-model="snackbarCan" > {{snackbarMsg}}
        <v-btn color="red" text @click="snackbarCan = false"> OK </v-btn>
      </v-snackbar>
    </v-container>`,
  computed: {
    /* Select component to use given the context */
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
    /* Data received through messages to show snackbar */
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

/* Overlay for adding a device */
Vue.component('add-device', {
  props: {
    default: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      name: '',
      rooms: [],
      room: "",
      types: [],
      typedIds: [],
      type: undefined,
      error: false,
      errorText: false,
      errorMsg: '',
      noRooms: 0
    }
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
                  <v-text-field v-model="name" label="Name" :error="errorText" required hint="Between 3 and 20 letters, numbers or spaces." clearable></v-text-field>
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
              <v-img src="./resources/images/error.png" class="error-img-width"></v-img>
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
    /* Function to create a new device */
    async accept() {
      if (this.name.length < 3 || this.name.length > 20) {
        this.errorMsg = 'Name must have between 3 and 20 characters!';
        this.error = true;
        this.errorText = true;
      } else if (!/^([a-zA-Z0-9 _]+)$/.test(this.name)) {
        this.errorMsg = 'Name must have letters, numbers or spaces!';
        this.error = true;
        this.errorText = true;
      } else {
        /* Create device y and then add to a room */
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
    /* Cancel button function */
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    /* If theres no rooms added */
    okNoRooms() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    /* Resets everything */
    resetVar() {
      this.name = '';
      this.error = false;
      this.errorText = false;
    },
    /* Retrieve data from API (Rooms and Types) */
    async getData() {
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
            if (el.id === this.default) this.room = el.id;
          }
          if (this.default === "") this.room = this.rooms[0].id;
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
  },
  /* Executed when mounted */
  async mounted() {
    this.getData();
  }
})

/* Overlay for adding a room */
Vue.component('add-room', {
  data() {
    return {
      name: '',
      sheet: false,
      images: ['bathroom.jpg', 'bathroom1.jpg', 'bathroom2.jpg', 'bathroom3.jpg', 'bedroom.jpg', 'bedroom1.jpg', 'bedroom2.jpg', 'bedroom3.jpg', 'bedroom4.jpg',
                'gameroom.jpg', 'gameroom1.jpg', 'garage.jpg', 'garden.jpg', 'hall.jpg', 'kitchen.jpg', 'kitchen1.jpg', 'livingroom.jpg', 'livingroom1.jpg',
                'livingroom2.jpg', 'livingroom3.jpg', 'livingroom4.jpg'],
      image: undefined,
      error: false,
      errorText: false,
      errorMsg: ''
    }
  },
  template:
    `<v-container fluid>
      <v-overlay>
        <v-card class="add-room-card" light>
          <v-card-title>
            <span class="headline">Add Room</span>
          </v-card-title>
          
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="name" label="Name" :error="errorText" required hint="Between 3 and 30 letters, numbers or spaces." clearable></v-text-field>
                </v-col>
                <v-row align="center" fixed>
                  <v-col cols="4">
                    <v-btn color="orange" dark @click="sheet = !sheet">Select image...</v-btn>
                  </v-col>
                  <v-col cols="8" >
                    <h3>{{ images[image] }}</h3>
                  </v-col>
                </v-row>
              </v-row>
            </v-container>
          </v-card-text>
          
          <v-bottom-sheet v-model="sheet">
            <v-sheet  dark class="text-center" >
              <v-card dark max-width="15000" class="mx-auto">
                <v-container class="pa-1">
                  <v-item-group v-model="image">
                    <v-row>
                      <v-col v-for="(item, i) in images" :key="i" cols="12" md="2">
                        <v-item v-slot:default="{ active, toggle }">
                          <v-img :src="\`./resources/images/room/\${item}\`" class="text-right pa-2 add-room-img" @click="toggle">
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
    /* Function to create a new room */
    async accept() {
      if (this.name.length < 3 || this.name.length > 30) {
        this.errorMsg = 'Name must have between 3 and 30 characters!';
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
    /* Emit singal and reset when cancel */
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    /* Reset al variables */
    resetVar() {
      this.name = '';
      this.image = undefined;
      this.error = false;
      this.errorText = false;
    }
  }
})

// TODO complete here when routine is finished
/* Overlay for adding a routine */
Vue.component('new-routine', {
  data() {
    return {
      error: false,
      errorMsg: "",

      sheet: false,
      image: undefined,
      images: ['work.jpg', 'vacations.jpg', 'sleep.jpg', 'home.jpg'],

      name: "",
      show_param: false,
      params: undefined,
      final_param: undefined,
      color_param: '#FFFFFF',

      slider: false,
      color: false,
      picker: false,

      rooms: [],
      room: "",
      devices: [],
      device: "",
      options: [],
      option: "",
      actions: [],
    }
  },
  /* When data selected, fetch data */
  watch: {
    room(newVal, oldVal) {
      if (newVal === "") return;
      this.getDevices(newVal);
      this.resetParams();
    },
    device(newVal, oldVal) {
      if (newVal === "") return;
      this.getActions(this.devices.find(x => x.id === newVal).type.id);
      this.resetParams();
    },
    option(newVal, oldVal) {
      if (newVal === "") return;
      this.resetParams();
      var aux = this.options.find(x => x.name === newVal);
      if (aux.params.length === 0) return;
      this.show_param = true;
      this.params = aux.params[0];
      this.params.name = this.getOptionName(this.params.name);
      console.error(this.params);
      if (this.params.name === "Color") this.color = true;
      else if (this.params.name === "Mode" || this.params.type === "string") this.picker = true;
      else this.slider = true;
    }
  },
  template:
    `<v-container fluid>

      <v-overlay>      
        <v-card light >
          <v-card-title>
            <span class="headline">New Routine</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field outlined label="Routine Name" v-model="name" required class="mx-5"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-btn class="mt-2" color="orange" dark @click="sheet = !sheet">Select image...</v-btn>
                  </v-col>
                  <v-col cols="3">
                    <div class="mt-3"><h3>{{ images[image] }}</h3></div>
                </v-col>
                <v-col cols="4" >
                  <v-select flex-grow="false" v-model="room" :items="rooms" item-value="id" item-text="name" :value="room" label="Room" required></v-select>
                </v-col>
                <v-col cols="4" >
                  <v-select v-model="device" :items="devices" item-value="id" item-text="name" :value="device" label="Device" required></v-select>
                </v-col>
                <v-col cols="4" >
                  <v-select v-model="option" :items="options" item-value="name" item-text="name" :value="option" label="Action" required></v-select>
                </v-col>
                <v-container v-if="show_param">

                  <v-slider v-if="slider" v-model="final_param" :label="params.name" :min="params.minValue" :max="params.maxValue" 
                    class="mt-4" thumb-label="always" thumb-size="25" color="orange" track-color="black" thumb-color="orange darken-2"></v-slider>

                  <v-col v-if="picker" cols="auto" >
                    <v-select v-model="final_param" :items="params.supportedValues" :label="params.name" required></v-select>
                  </v-col>

                  <v-color-picker v-if="color" v-model="color_param" hide-inputs hide-mode-switch mode.sync="rgba" class="mx-auto" flat></v-color-picker>

                </v-container>
                <v-col cols="12" >
                  <div class="text-right">
                    <v-btn dark text right x-large color="orange darken-2" @click="addAction"> ADD ACTION </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" >
                  <div class="text-right">
                    <v-btn dark text right x-large color="red darken-2" @click="cancel()"> CANCEL </v-btn>
                    <v-btn dark text right x-large color="green darken-2" @click="create()"> CREATE </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
        <br/>
        <v-card light class="scroll">
          <v-card-title>
            <span class="headline">Added actions</span>
          </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <div v-for="(item, i) in actions" :key="i">
                    <v-chip class="ma-2" color="green" outlined>
                      {{item.meta.desc}} 
                    </v-chip>
                  </div>                            
                </v-row>
              </v-container>
            </v-card-text>
            <v-snackbar v-model="error" > {{ errorMsg }}
              <v-btn color="red" text @click="error = false"> OK </v-btn>
            </v-snackbar>
          </v-card> 

          <v-bottom-sheet v-model="sheet">
            <v-sheet  dark class="text-center" >
              <v-card dark max-width="15000" class="mx-auto">
                <v-container class="pa-1">
                  <v-item-group v-model="image">
                    <v-row>
                      <v-col v-for="(item, i) in images" :key="i" cols="12" md="2">
                        <v-item v-slot:default="{ active, toggle }">
                          <v-img :src="\`./resources/images/routine/\${item}\`" class="text-right pa-2 add-room-img" @click="toggle">
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
        </v-overlay>
      </v-container>`,
  methods: {
    /* Translators of the API intel */
    getOptionName(name) {
      var aux = name.split(/(?=[A-Z])/).join(' ');
      return aux[0].toUpperCase() + aux.substr(1);
    },
    getActionName(name) {
      var aux = name.split(' ').join('');
      return aux[0].toLowerCase() + aux.substr(1);
    },

    /* When routine is created */
    async create() {
      if (this.actions.length === 0) {
        this.errorMsg = 'Routine has no actions!';
        this.error = true;
        return;
      }
      if (this.name === "") {
        this.errorMsg = 'Routine has no name!';
        this.error = true;
        return;
      }
      if (this.image === undefined) {
        this.errorMsg = 'Routine has no image!';
        this.error = true;
        return;
      }
      this.addRtn();
      this.resetAll();
      this.$root.$emit('Finished add', 0);
    },
    /*  When operation is canceled */
    cancel() {
      this.resetAll();
      this.$root.$emit('Finished add', 1);
    },
    /* Generates proper action format and adds it to actions Array */
    addAction() {
      var room_name = this.rooms.find(x => x.id === this.room).name;
      var dev_name = this.devices.find(x => x.id === this.device).name;
      if (this.color) this.final_param = this.color_param.substr(1);
      var param_name = (this.show_param) ? " -> " + this.final_param : "";
      var desc = room_name + " -> " + dev_name + " -> " + this.option + param_name;

      if (this.show_param) {
        this.actions.push({
          device: { id: this.device },
          actionName: this.getActionName(this.option),
          params: [this.final_param],
          meta: { desc: desc }
        });
      } else {
        this.actions.push({
          device: { id: this.device },
          actionName: this.getActionName(this.option),
          params: [],
          meta: { desc: desc }
        });
      }
      this.resetVar();
    },
    /* Resets params view */
    resetParams() {
      this.show_param = false;
      this.picker = false;
      this.color = false;
      this.slider = false;
      this.option = "";
    },
    /* Resets properties when action added */
    resetVar() {
      this.resetParams();
      this.resetVar();
      this.options = [];
      this.devices = [];
      this.error = false;
      this.room = "";
      this.device = "";
      this.option = "";
      this.final_param = "";      
    },
    /*  Resets all properties */
    resetAll() {
      this.resetVar();
      this.name = "";
      this.actions = [];
      this.image = undefined;     
    },
    /* Adds routine to API */
    async addRtn() {
      let rta = await addRoutine(this.name, this.actions, this.images[this.image]) // TODO addd real handling of image
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
    /* Fetches all rooms from API */
    async getRooms() {
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
      } else {
        this.error = true;
      }
    },
    /* Gets devices given a Room id */
    async getDevices(id) {
      if (!this.error) {
        let rta = await getRoomDevices(id)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
        if (rta) {
          this.devices = [];
          for (dev of rta.result) {
            this.devices.push(dev);
          }
        } else {
          this.error = true;
        }
      }
    },
    /* Gets actions given a device type */
    async getActions(id) {
      if (!this.error) {
        let rta = await getType(id)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
        if (rta) {
          this.options = rta.result.actions;
          for (act of this.options) act.name = this.getOptionName(act.name);
        } else {
          this.error = true;
        }
      }
    }
  },
  /* Initial room fetch from API */
  async mounted() {
    this.getRooms();

  }
})

