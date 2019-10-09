new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    room: {name: '', meta: {image: '', favorite: false} },
    error: false,
    errorMsg: '',
    favorite: false,
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
  methods: {
    async toggleFavorite () {
      this.room.meta.favorite = !this.room.meta.favorite;
      console.log(this.room);
      let rta = await modifyRoom(this.room)
      .catch((error) => {
        this.errorMsg = error[0].toUpperCase() + error.slice(1);
        console.error(this.errorMsg);
      });
      if (rta) {
        console.log(rta.result);
      } else {
        this.error = true;
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
  }
  
})