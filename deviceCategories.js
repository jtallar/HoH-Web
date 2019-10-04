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
    categories: [
      { title: 'Air Conditioners', img: 'light_01' },
      { title: 'Doors', img: 'light_01' },
      { title: 'Lights', img: 'light_01' },
      { title: 'Ovens', img: 'light_01' },
      { title: 'Speakers', img: 'light_01' },
      { title: 'Vacuums', img: 'light_01' },
      { title: 'Windows & Blinds', img: 'light_01' }
    ]
  })
  
})