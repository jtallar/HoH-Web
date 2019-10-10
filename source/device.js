new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    error: false,
    errorMsg: '',
    title: "",
    types: [],
    devices: [],
    rooms: []
  }),
  methods: {
    async getDevices() {
      for (type of this.types) {
        let rta = await getAllFromType(type.id)
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
              i["type"] = type;
              this.devices.push(i);
              var aux = i.room;
              this.rooms.push(aux);
            }
            this.rooms = new Set(this.rooms);
            this.rooms = [...this.rooms];
            console.log("heloooooo");
          }
        } else {
          this.error = true;
        }
      }
    },
    getDataFromUrl() {
      var aux = location.search.substr(2).split('+');

      for (var i = 0; i < aux.length - 1; i++) {
        var aux2 = { id: aux[i], name: aux[++i] }
        this.types.push(aux2);
      }
      this.title = aux[aux.length - 1].split('_').join(' ');
    }
  },
  mounted() {
    this.getDataFromUrl();
    this.getDevices();
    let timer = setInterval(()=> this.getDevices(), 1000);
  }

})