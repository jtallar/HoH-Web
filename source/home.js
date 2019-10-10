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
    async getFavRooms() {
      let rta = await getAll("Room")
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
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
          // this.room = this.rooms[0].id;        
        }
      } else {
        this.error = true;
      }
    },
    async getFavDevices() {
      let rta = await getAll("Device")
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        this.favDevices = [];
        for (i of rta.result) {
          if (i.meta.favorite) {
            this.favDevices.push(i);
          }
        }
      } else {
        this.error = true;
      }
    },
    async getFavRoutines() {
      let rta = await getAll("Routine")
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
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
      } else {
        this.error = true;
      }
    },
    async getFavs() {
      this.getFavDevices();
      this.getFavRooms();
      this.getFavRoutines();
    }
  },
  async mounted() {
    // here we extract all the data
    this.getFavs();
    let timer = setInterval(()=> this.getFavs(), 1000);
  }
})