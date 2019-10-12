new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    options: [
      { title: 'Profiles' },
      { title: 'Settings' },
      { title: 'Help' }
    ],
    favDevices: [],
    favRooms: [],
    favRoutines: [],
    gotData: false,
    error: false,
    errorMsg: ''
  }),
  methods: {
    /* Gets favorite rooms */
    async getFavRooms() {
      let rta = await getAll("Room")
        .catch((error) => {
          if (!error === undefined) {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          }
        });
      if (rta) {
        this.favRooms = [];
        if (rta.result.length >= 1) {
          console.log(rta.result);
          for (i of rta.result) {
            if (i.meta.favorite) {
              this.favRooms.push(i);
            }
          }
        }
      } else {
        this.error = true;
      }
    },
    /* Gets favorite devices */
    async getFavDevices() {
      let rta = await getAll("Device")
        .catch((error) => {
          if (!error === undefined) {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          }
        });
      if (rta) {
        this.favDevices = [];
        for (i of rta.devices) {
          if (i.meta.favorite) {
            this.favDevices.push(i);
          }
        }
      } else {
        this.error = true;
      }
    },
    /* Gets favorite routines */
    async getFavRoutines() {
      let rta = await getAll("Routine")
        .catch((error) => {
          if (!error === undefined) {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          }
        });
      if (rta) {
        this.favRoutines = [];
        for (i of rta.result) {
          if (i.meta.favorite) {
            var el = { name: i.name, id: i.id, image: i.meta.image };
            this.favRoutines.push(el);
          }
        }
        this.gotData = true;
        this.error = false;
      } else {
        this.error = true;
      }
    },
    /* Wrapper for all getters */
    async getFavs() {
      this.getFavDevices();
      this.getFavRooms();
      this.getFavRoutines();
    }
  },
  /* Initial fetch and sets regular fetch */
  async mounted() {
    this.getFavs();
    setInterval(()=> this.getFavs(), 1000);
  }
})