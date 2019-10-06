// a javascript for components testing purpose

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
      color: '#FFF100',
      favorite: false,
      room: 'Living Room',
      chargingBase: 'Bathroom',
      charging: false,
      playVac: true,
      playMusic: true,
      playlist: false,
      autoFanSpeed: false,
      autoHorWings: false,
      autoVerWings: false,
      lockDoor: false,
    
      name: ' ',
      overlay: true,
      snackbarCan: false,
      snackbarOk: false,
      sheet: false,
      image: 0,
      floors: ['First', 'Second', 'Other'],
      floor: 'First',
      rooms: ['Living Room', 'Kitchen', 'Bathroom', 'Garage', 'Bedroom','Entertainement'],
      room: 'Living Room',
      devices: ['Light 1', 'Light 2', 'Oven', 'Aire Aconditioner'],
      device: 'Light 1',
      
      active_tab: 1,
      tabs: [
        {index: 0, name: 'Home', dir: '../home.html'},
        {index: 1, name: 'Rooms', dir: 'test.html'},
        {index: 2, name: 'Devices', dir: '#two'},
        {index: 3, name: 'Routines', dir: '#tree'}
      ]
    }
  })