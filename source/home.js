new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    options: [
      { title: 'Profiles' },
      { title: 'Settings' },
      { title: 'Help' }
    ],
    favDevices: [],
    favRooms: [],
    favRoutines: []
  }),
  mounted () {
    setInterval(function(){
      // get de los favorites
      }, 1000);

  }
  
})