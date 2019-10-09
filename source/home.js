new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    options: [
      { title: 'Profiles' },
      { title: 'Settings' },
      { title: 'Help' }
    ],
    favDevices: [],
    favRooms: [],
    favRoutines: []
  }),
  async mounted() {
    // here we extract all the data
    let rta = await getAll("Room")
    .catch((error) => {
      this.errorMsg = error[0].toUpperCase() + error.slice(1);
      console.error(this.errorMsg);
    });
    if (rta) {
      if (rta.result.length >= 1) {
        console.log(rta.result);
        for (i of rta.result) {
          if(i.meta.favorite){
            this.favRooms.push(i);
          }
        }
       // this.room = this.rooms[0].id;        
      } 
    } else {
      this.error = true;
    }

    let rta2 = await getAll("Device")
    .catch((error) => {
      this.errorMsg = error[0].toUpperCase() + error.slice(1);
      console.error(this.errorMsg);
    });
    if (rta2) {
      for (i of rta2.result) {
        if(i.meta.favorite){
          this.favDevices.push(i);
        }
      }
    } else {
      this.error = true;
    }

    let rta3 = await getAll("Routine")
    .catch((error) => {
      this.errorMsg = error[0].toUpperCase() + error.slice(1);
      console.error(this.errorMsg);
    });
    if (rta3) {
      for (i of rta3.result) {
        if(i.meta.favorite){
          var el = { name: i.name, id: i.id, image: i.meta.image };
          this.favRoutines.push(el);
        }
      }
    } else {
      this.error = true;
    }
  
  }
  
})