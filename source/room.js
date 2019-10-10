new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    room: { name: '', meta: { image: '', favorite: false } },
    id: undefined,
    error: false,
    errorMsg: '',
    gotData: false,
    lighting: [],
    appliances: [],
    entertainment: [],
    airconditioners: [],
    doorswindows: [],
    types: [],
    devices: [
      { name: 'prueba0', cat: 'Air Conditioner', room: 'Living Room' },
      { name: 'prueba1', cat: 'Door', room: 'Bathroom' },
      { name: 'prueba2', cat: 'Light', room: 'Living Room' },
      { name: 'prueba3', cat: 'Oven', room: 'Kitchen' },
      { name: 'prueba4', cat: 'Speaker', room: 'Living Room' },
      { name: 'prueba5', cat: 'Vacuum', room: 'Bedroom' },
      { name: 'prueba6', cat: 'Window', room: 'Living Room' }
    ]
  }),
  methods : {
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
    }
  },
  async mounted () {
    this.id = location.search.substr(1).split('+')[0];
    let rta = await getRoom(this.id)
    .catch((error) => {
      this.errorMsg = error[0].toUpperCase() + error.slice(1);
      console.error(this.errorMsg);
    });
    if (rta) {
      console.log(rta.result);
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
        for (dev of rta.result) {
          dev.room = {id: this.id, name: this.room.name};
          this.addToCat(dev);
        }
        console.log(this.lighting.length);
        console.log(this.entertainment.length);
        console.log(this.airconditioners.length);
        console.log(this.doorswindows.length);
        console.log(this.appliances.length);
        this.gotData = true;
      } else {
        this.error = true;
      }
    }
  }
  
})