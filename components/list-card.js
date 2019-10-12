/* Component for card button for rooms or categories */
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
  template:
    `<v-col class="text-center">
      <v-btn tile class="ma-3" :width="getWidth" :height="getHeight" :href="getHref">
        <v-img :src="getImg" :width="getWidth" :height="getHeight">
          <div class="text-left grey darken-2 mt-5 pl-3 pa-1">
            <span class="text-uppercase white--text font-weight-light">
              {{ title }}      
            </span>
          </div>
        </v-img>
      </v-btn>
    </v-col>`,

  computed: {
    /* Generates the proper url */
    getHref() {
      switch (this.type) {
        case "room":
          return "room.html?" + this.id + "+" + this.title.split(' ').join('_');
        case "device":
          return "device.html?" + this.id + "+" + this.title.split(' ').join('_');
        default:
          return "home.html";
      }
    },
    /* Sizing of the card given the screen real size */
    getWidth() {
      return screen.width / this.width;
    },
    getHeight() {
      return this.getWidth / this.ratio;
    },
    /* Obtain image source */
    getImg() {
      return './resources/images/' + this.img_name;
    }
  }
})

// TODO implement functionality here
/* Component for the routine card button with its  funcitonality */
Vue.component('routine-btn', {
  props: {
    routine: {
      type: Object,
      required: true
    },
    ratio: {
      type: Number,
      default: 2
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
    }
  },
  template:
    `<v-container fluid>
      <!-- Cannot use css with v-dialog  -->
      <v-dialog v-model="dialog" persistent width="410">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" tile class="ma-3" :width="getWidth" :height="getHeight" >
            <v-img :src="getImg" :width="getWidth" :height="getHeight">
              <div class="text-left grey darken-2 mt-5 pl-3 pa-1">
                <span class="text-uppercase white--text font-weight-light">
                  {{ routine.name }}      
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
            <v-btn color="red darken-1" text @click="cancel()">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="accept()">Run Routine</v-btn>
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
  computed: {
    /* Sizing of the card given a certain screen */
    getWidth() {
      return screen.width / this.width;
    },
    getHeight() {
      return this.getWidth / this.ratio;
    },
    /* Obtain image source */
    getImg() {
      return './resources/images/' + this.routine.meta.img;
    }
  },
  methods: {
    /* When the routine gets acepted to run */
    accept() {
      this.dialog = false;
      this.snackbarOk = true;
      this.runRoutine();
    },
    /* When routine gets declined */
    cancel() {
      this.dialog = false;
      this.snackbarCan = true;
    },
    /* Executes routine on API */
    async runRoutine() {
      let rta = await execRoutine(this.routine.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (!rta) {
        this.error = true;
      }
    },
  }
})

/* Component used when there is no routine, room, or device created */
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
    /* Card dimensions */
    getWidth() {
      return screen.width / this.width;
    },
    getHeight() {
      return screen.width / 6 / this.ratio;
    },
  }
})