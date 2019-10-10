new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    title: undefined,
    ids: [],
    devices: [],
    rooms: []
  }),
  methods: {
    async getDevices() {
      for (id of ids) {
        let rta = await getAllFromType(id)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
        if (rta) {
          console.log(rta.result);
          if (rta.result.length >= 1) {
            this.devices = [];
            this.rooms = [];
            for (i of rta.result) {
              i.type.id = this.id;
              this.devices.push(i);
              var aux = { id: i.room.id, title: i.room.name };
              this.rooms.push(aux);
            }
            this.rooms = new Set(this.rooms);
            this.rooms = [...this.rooms];
          }
        } else {
          this.error = true;
        }
      }
    },
    getRooms() {

    }
  },
  mounted() {
    var aux = location.search.substr(2).split('+');
    for (elem of aux)
      this.ids.push(elem);
    this.title = this.ids.pop().split('_').join(' ');

    this.getDevices();






  }

})