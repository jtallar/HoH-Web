new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    categories: [
      { title: 'Lighting', img: 'light_01.jpg', id: '' },
      { title: 'Apliances', img: 'apliances_01.jpg', id: '' },
      { title: 'Entertainment', img: 'entertainement_01.jpg', id: '' },
      { title: 'Air Conditioners', img: 'air_conditioner_01.jpg', id: '' },
      { title: 'Doors & Windows', img: 'house_02.jpg', id: '' }
    ]
  })
  
})