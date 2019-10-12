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
        /* Gets all routines from API */
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
    /* Initial fetch and sets regular fetch */
    mounted() {
        this.getRoutines();
        setInterval(()=> this.getRoutines(), 1000);
    }
})