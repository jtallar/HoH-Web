new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({
        routines: [
            { name: 'Leave Home', image: 'leaving_01' },
            { name: 'Go to Work', image: 'going_work_01' },
            { name: 'Time to sleep', image: 'sleeping_01' },
            { name: 'Vacations', image: 'vacations_01' }
        ],
    }),
    mounted() {
        this.title = location.search.split('_').join(' ').substr(1);
    }

})