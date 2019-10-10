new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    options: [
      { title: 'Profiles' },
      { title: 'Settings' },
      { title: 'Help' }
    ],
    rooms: [],
    error: false,
    errorMsg: ''
  }),
  methods: {
    async getRooms() {
      let rta = await getAll("Room")
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        if (rta.result.length >= 1) {
          this.rooms = [];
          for (i of rta.result) {
            var el = { name: i.name, id: i.id, img: i.meta.image };
            this.rooms.push(el);
          }
        }         
      } else {
        this.error = true;
      }
    }
  },
  async mounted() {
    this.getRooms();
    lettimer = setInterval(()=> this.getRooms(), 1000)
  }

})