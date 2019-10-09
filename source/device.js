new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    title: undefined,
    ids: [],
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
  mounted () {
    var aux = location.search.substr(2).split('+');
    for (elem of aux) 
      this.ids.push(elem);
    this.title = this.ids.pop().split('_').join(' ');
  }
  
})