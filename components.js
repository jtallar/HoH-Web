// javascript file for used components

Vue.component('toolbar', {
    template:
        `<v-app-bar app clipped-right color="black" dark>
          <!-- button/avatar/image for logo -->
          <v-btn icon>
            <v-avatar size="35">
              <v-img src="/resources/images/logo.png"></v-img>
            </v-avatar>
          </v-btn>
  
          <!-- title of toolbar -->
          <v-toolbar-title>House of Hands</v-toolbar-title>
  
          <div class="flex-grow-1"></div>
  
          <!-- button/icon for search, account and more -->
          <template v-if="$vuetify.breakpoint.smAndUp">
              <v-btn icon>
                 <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-account</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
  
          <!-- tabs for navigation -->
          <template v-slot:extension>
            <v-tabs v-model="tabs" background-color="orange" fixed-tabs>
              <v-tab href="#one">Home</v-tab>
              <v-tab href="#two">Rooms</v-tab>
              <v-tab href="#three">Devices</v-tab>
              <v-tab href="#four">Routines</v-tab>
              <v-tabs-slider color="white" />
            </v-tabs>
          </template>
        </v-app-bar>`
  })
  
  Vue.component('panel', {
    template:
        `<v-navigation-drawer v-model="drawerRight" app clipped right permanent>      
            <!-- top bar -->
            <template v-slot:prepend>
                <v-list-item two-line>
                    <v-list-item-avatar>
                        <img src="https://randomuser.me/api/portraits/women/81.jpg">
                    </v-list-item-avatar>
  
                    <v-list-item-content>
                        <v-list-item-title>Table Light</v-list-item-title>
                        <v-list-item-subtitle>Kitchen</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-btn icon>
                        <v-icon>mdi-settings</v-icon>
                    </v-btn>
                </v-list-item>
            </template>
  
            <v-divider></v-divider>
  
            <!-- information container -->
            <v-container fluid>
                <v-switch v-model="switch1" color="orange" label="On"></v-switch>
                <v-subheader>Color</v-subheader>
                <v-color-picker hide-canvas hide-inputs flat></v-color-picker>
                <v-subheader>Brightness</v-subheader>
                <v-slider v-model="media" prepend-icon="mdi-brightness-6" thumb-label="always" thumb-size="20"></v-slider>
            </v-container>
        </v-navigation-drawer>`
  })