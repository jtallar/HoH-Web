new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    width: 4,
    error: false,
    errorMsg: '',
    categories: [
      { title: "Lighting", img: "light_01.jpg", id: "" },
      { title: "Appliances", img: "appliances_01.jpg", id: "" },
      { title: "Air Conditioners", img: "air_conditioner_01.jpg", id: "" },
      { title: "Entertainment", img: "entertainment_01.jpg", id: "" },
      { title: "Doors & Windows", img: "house_02.jpg", id: "" }
    ],
    types: []
  }),
  methods: {
    /* Gets all the types from API */
    async getTypes() {
      let rta = await getAll("Type")
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        this.categories[0].id = "";
        this.categories[1].id = "";
        this.categories[2].id = "";
        this.categories[3].id = "";
        this.categories[4].id = "";
        console.log(rta.result);
        if (rta.result.length >= 1) {
          for (i of rta.result) {
            var el = { name: i.name, id: i.id };
            this.sortType(el);
          }
        }
      } else {
        this.error = true;
      }
    },
    /* Sorts each type to a new category */
    sortType(type) {
      switch (type.name) {
        case "speaker":
          this.categories[3].id += "+" + type.id + "+" + type.name;
          break;
        case "blinds":
          this.categories[4].id += "+" + type.id + "+" + type.name;
          break;
        case "lamp":
          this.categories[0].id += "+" + type.id + "+" + type.name;
          break;
        case "oven":
          this.categories[1].id += "+" + type.id + "+" + type.name;
          break;
        case "ac":
          this.categories[2].id += "+" + type.id + "+" + type.name;
          break;
        case "door":
          this.categories[4].id += "+" + type.id + "+" + type.name;
          break;
        case "refrigerator":
          this.categories[1].id += "+" + type.id + "+" + type.name;
          break;
      }
    }
  },
  /* Initial fetch and sets regular fetch */
    async mounted() {
      this.getTypes();
      setInterval(()=> this.getTypes(), 1000);
    }

  })