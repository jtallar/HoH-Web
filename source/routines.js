new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({
        error: false,
        errorMsg: '',
        routines: [],
        gotData: false
    }),
    methods: {
        async getRoutines() {
            let rta = await getAll("Routine")
                .catch((error) => {
                    this.errorMsg = error[0].toUpperCase() + error.slice(1);
                    console.error(this.errorMsg);
                });
            if (rta) {
                console.log(rta.result);
                if (rta.result.length >= 1)
                    for (i of rta.result)
                        this.routines.push(i);
                this.gotData = true;
            } else {
                this.error = true;
            }
        }
    },
    mounted() {
        this.getRoutines();
    }

})