new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    room: { id: '', name: '', meta: { image: '', favorite: false } },
    id: '',
    error: false,
    errorMsg: '',
    gotData: false,
    lighting: [],
    appliances: [],
    entertainment: [],
    airconditioners: [],
    doorswindows: [],
  }),
  methods: {
    /* Adds device to its category Array */
    addToCat(device) {
      switch (device.type.name) {
        case "lamp":
          this.lighting.push(device);
          break;
        case "door":
        case "blinds":
          this.doorswindows.push(device);
          break;
        case "speaker":
          this.entertainment.push(device);
          break;
        case "oven":
        case "refrigerator":
        case "vacuum":
          this.appliances.push(device);
          break;
        case "ac":
          this.airconditioners.push(device);
          break;
      }
    },
    /* Gets data for room, and its devices */
    async getRoomData() {
      let rta = await getRoom(this.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        this.room = rta.result;
      } else {
        this.error = true;
      }

      if (!this.error) {
        let rta = await getRoomDevices(this.room.id)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
        if (rta) {
          this.lighting = [];
          this.entertainment = [];
          this.appliances = [];
          this.airconditioners = [];
          this.doorswindows = [];
          for (dev of rta.result) {
            dev.room = { id: this.id, name: this.room.name };
            this.addToCat(dev);
          }
          document.title = this.room.name;
          this.gotData = true;
        } else {
          this.error = true;
        }
      }
    }
  },
  /* Retrieves data from URL, makes initial fetch and sets regular fetch */
  async mounted() {
    this.id = location.search.substr(1).split('+')[0];
    this.getRoomData();
    setInterval(()=> this.getRoomData(), 1000);

  }

})