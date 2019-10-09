new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
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
  methods: {
    async getDevices() {
      
    }
  },
  mounted () {
    this.title = location.search.split('_').join(' ').substr(1);
    
  }
  
})