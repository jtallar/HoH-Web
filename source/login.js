Vue.component('toolbar-login', {
  template:
    `<v-app-bar app clipped-right color="black" dark >
          <!-- button/avatar/image for logo -->
          <v-btn icon href="./login.html">
            <v-avatar size="35">
              <v-img src="./resources/images/logo.png"></v-img>
            </v-avatar>
          </v-btn>
  
          <!-- title of toolbar -->
          <v-toolbar-title>House of Hands</v-toolbar-title>
  
          <div class="flex-grow-1"></div>
  
          <!-- login -->
          <template v-if="$vuetify.breakpoint.smAndUp">
            <input filled placeholder="Username">
            <input type="password" placeholder="Password">
            <v-btn icon href="./home.html">
                <v-icon>mdi-forward</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
        </v-app-bar>`,
})