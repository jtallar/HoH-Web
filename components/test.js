// a javascript for components testing purpose

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
      active_tab: 1,
      tabs: [
        {index: 0, name: 'Home', dir: '../home.html'},
        {index: 1, name: 'Rooms', dir: 'test.html'},
        {index: 2, name: 'Devices', dir: '#two'},
        {index: 3, name: 'Routines', dir: '#tree'}
      ]
    }
  })