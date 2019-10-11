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