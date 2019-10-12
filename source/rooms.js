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
    gotData: false,
    error: false,
    errorMsg: ''
  }),
  methods: {
    /* Gets all rooms from API */
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
        this.gotData = true;       
      } else {
        this.error = true;
      }
    }
  },
  /* Initial fetch and sets regular fetch */
  async mounted() {
    this.getRooms();
    setInterval(()=> this.getRooms(), 1000);
  }

})