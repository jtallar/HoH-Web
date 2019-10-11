new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    error: false,
    errorMsg: '',
    title: "",
    types: [],
    devices: [],
    rooms: [],
  }),
  methods: {
    async getDevices() {
      var auxDev = [];
      var auxRooms = [];
      for (type of this.types) {
        let rta = await getAllFromType(type.id)
          .catch((error) => {
            this.errorMsg = error[0].toUpperCase() + error.slice(1);
            console.error(this.errorMsg);
          });
        if (rta) {
          console.log(rta.result);
          if (rta.result.length >= 1) {
            for (i of rta.result) {
              i["type"] = type;
              auxDev.push(i);
              var aux = i.room;
              if (this.notContains(aux, auxRooms)) auxRooms.push(aux);
            }
          }
          if (type === this.types[this.types.length-1]) {
            this.rooms = auxRooms;
            this.devices = auxDev;
          }
        } else {
          this.error = true;
        }
      }
    },
    notContains(room, arr) {
      for (data of arr) {
        if (data.id === room.id) return false;
      }
      return true;
    },
    getDataFromUrl() {
      var aux = location.search.substr(2).split('+');

      for (var i = 0; i < aux.length - 1; i++) {
        var aux2 = { id: aux[i], name: aux[++i] }
        this.types.push(aux2);
      }
      this.title = aux[aux.length - 1].split('_').join(' ');
      document.title = this.title;
    }
  },
  mounted() {
    this.getDataFromUrl();
    this.getDevices();
    let timer = setInterval(() => this.getDevices(), 3000);
  }

})