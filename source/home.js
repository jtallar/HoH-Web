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
    favRoutines: [],
    gotData: false,
    error: false,
    errorMsg: ''
  }),
  async mounted() {
    // here we extract all the data
    let rta = await getAll("Room")
    .catch((error) => {
      this.errorMsg = error[0].toUpperCase() + error.slice(1);
      console.error(this.errorMsg);
    });
    if (rta) {
      console.log(rta.result);
      if (rta.result.length >= 1) {
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

    if (!this.error){
      let rta = await getAll("Device")
      .catch((error) => {
        this.errorMsg = error[0].toUpperCase() + error.slice(1);
        console.error(this.errorMsg);
      });
      console.log(rta);
      if (rta) {
        console.log(rta.devices);
        for (i of rta.devices) {
          if(i.meta.favorite){
            this.favDevices.push(i);
          }
        }
      } else {
        this.error = true;
      }
    }

    if (!this.error) {
      let rta = await getAll("Routine")
      .catch((error) => {
        this.errorMsg = error[0].toUpperCase() + error.slice(1);
        console.error(this.errorMsg);
      });
      console.log(rta);
      if (rta) {
        console.log(rta.result);
        for (i of rta.result) {
          if(i.meta.favorite){
            var el = { name: i.name, id: i.id, image: i.meta.image };
            this.favRoutines.push(el);
          }
        }
        this.gotData = true;
      } else {
        this.error = true;
      }
    }
  
 }
  
})