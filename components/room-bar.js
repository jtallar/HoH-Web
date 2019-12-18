/* Component for the room page bar */
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
    /* When in a existen room, edit is available */
    getComp() {
      if (this.room.name.length > 0)
        return 'edit-room';
    }
  },
  methods: {
    /* Sets this room to favorites */
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
  /* Comunication with snackbars */
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

/* Component for editing a room properties */
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
      images: ['bathroom.jpg', 'bathroom1.jpg', 'bathroom2.jpg', 'bathroom3.jpg', 'bedroom.jpg', 'bedroom1.jpg', 'bedroom2.jpg', 'bedroom3.jpg', 'bedroom4.jpg',
                'gameroom.jpg', 'gameroom1.jpg', 'garage.jpg', 'garden.jpg', 'hall.jpg', 'kitchen.jpg', 'kitchen1.jpg', 'livingroom.jpg', 'livingroom1.jpg',
                'livingroom2.jpg', 'livingroom3.jpg', 'livingroom4.jpg', 'garden1.jpg', 'homeoffice.jpg', 'homeoffice1.jpg'],
      image: 0,
      dialog: false,
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
            <span class="headline">Editing "{{room.name}}"</span>
            <v-row justify="end">
              <v-btn right class="mx-5" icon @click="dialog = true">
                <v-icon size="40">mdi-delete</v-icon>
              </v-btn>
            </v-row>
          </v-card-title>
          
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="name" label="Name" :error="errorText" required hint="Between 3 and 30 letters, numbers or spaces." clearable></v-text-field>
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
            <v-sheet  dark class="text-center">
              <v-card dark class="mx-auto">
                <v-container class="pa-1">
                  <v-item-group v-model="image">
                    <v-row>
                      <v-col v-for="(item, i) in images" :key="i" cols="12" md="2">
                        <v-item v-slot:default="{ active, toggle }">
                          <v-img :src="\`./resources/images/room/\${item}\`" class="text-right pa-2 add-room-img" @click="toggle" :alt="item">
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
    /* For applying changes to the room in matter */
    async apply() {
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
    /* When cancel editing */
    cancel() {
      this.resetVar();
      this.$root.$emit('Finished add', 1);
    },
    /* When cancel remove */
    cancelRemove() {
      this.dialog = false;
      this.errorMsg = 'Canceled Delete';
      this.error = true;
    },
    /* Removes a device given its id */
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
    /* Removes the room in matter */
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
    /* Resets variables */
    resetVar() {
      this.overlay = false;
      this.error = false;
      this.errorText = false;
    }
  },
  /* Executed when mounted */
  mounted() {
    console.log(this.room);
    this.image = this.images.indexOf(this.room.meta.image);
  }
})