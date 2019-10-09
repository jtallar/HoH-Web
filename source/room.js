new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    room: { name: '', meta: { image: '', favorite: false } },
    error: false,
    errorMsg: '',
    favorite: false,
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
    let id = location.search.substr(1);
    let rta = await getRoom(id)
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
          this.addToCat(dev);
        }
      } else {
        this.error = true;
      }
    }
  }
  
})