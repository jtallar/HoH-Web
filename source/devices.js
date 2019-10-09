new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    categories: [
      { title: 'Lighting', img: 'light_01.jpg' },
      { title: 'Apliances', img: 'apliances_01.jpg' },
      { title: 'Entertainment', img: 'entertainement_01.jpg' },
      { title: 'Air Conditioners', img: 'air_conditioner_01.jpg' },
      { title: 'Doors & Windows', img: 'house_02.jpg' }
    ]
  })
  
})