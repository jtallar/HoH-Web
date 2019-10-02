// a javascript for components testing purpose

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
      items: [
        {
          src: 'bedroom_01.jpg',
        },
        {
          src: 'bathroom_02.jpg',
        },
        {
          src: 'game_room_01.jpg',
        },
        {
          src: 'garage_01.jpg',
        },
        {
          src: 'kitchen_01.jpg',
        },
        {
          src: 'living_01.jpg',
        },
        {
          src: 'living_02.jpg',
        },
        {
          src: 'entertainement_01.jpg',
        },
        {
          src: 'kitchen1.jpg',
        },
      ],
      overlay: false,
      snackbarCan: false,
      snackbarOk: false,
      sheet: false,
      active_tab: 1,
      tabs: [
        {index: 0, name: 'Home', dir: 'home.html'},
        {index: 1, name: 'Rooms', dir: 'rooms.html'},
        {index: 2, name: 'Devices', dir: '#two'},
        {index: 3, name: 'Routines', dir: '#tree'}
      ]
    }
  })