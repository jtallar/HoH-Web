new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    height: screen.height - 127, // size of the toolbar
  }),
})
