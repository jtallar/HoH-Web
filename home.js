new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    fab: false,
    hidden: false,
    tabs: null,
    switch1: true,
    options: [
      { title: 'Profiles' },
      { title: 'Settings' },
      { title: 'Help' }
    ],
  })
  
})