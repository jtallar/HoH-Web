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
      { title: 'Lighting', img: 'light_01' },
      { title: 'Apliances', img: 'apliances_01' },
      { title: 'Entertainement', img: 'entertainement_01' },
      { title: 'Air Conditioners', img: 'air_conditioner_01' },
      { title: 'Doors & Windows', img: 'house_02' }
    ]
  })
  
})