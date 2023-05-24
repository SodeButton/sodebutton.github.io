<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" v-if="display.smAndDown" fixed app>
      <v-list dense nav>
        <v-list-item
          v-for="item in links"
          :key="item.title"
          :to="item.to"
          :title="item.title"
          route
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app elevate-on-scroll>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="display.smAndDown"
      ></v-app-bar-nav-icon>

      <v-spacer v-if="!display.smAndDown"></v-spacer>
      <v-img
        alt="logo"
        :src="logo"
        max-height="40px"
        min-height="40px"
        max-width="40px"
        min-width="40px"
        class="mr-4"
      />
      <h2 class="mr-4">Buttome</h2>
      <v-tabs
        v-if="!display.smAndDown"
        grow
        style="max-width: 320px"
        color="blue"
      >
        <v-tab
          v-for="(item, i) in links"
          :key="i"
          :to="item.to"
          router
          style="font-size: 0.8em"
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>

      <v-spacer v-if="display.smAndDown"></v-spacer>

      <v-row class="mr-5" justify="end">
        <v-btn icon href="https://twitter.com/Button501">
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn icon href="https://github.com/SodeButton">
          <v-icon>mdi-github</v-icon>
        </v-btn>
        <v-btn icon @click="toggleTheme()">
          <v-fade-transition hide-on-leave>
            <v-icon v-show="theme.global.current.value.dark" color="#ffcc99">
              mdi-weather-sunny
            </v-icon>
          </v-fade-transition>

          <v-fade-transition hide-on-leave>
            <v-icon v-show="!theme.global.current.value.dark" color="#6677cc">
              mdi-weather-night
            </v-icon>
          </v-fade-transition>
        </v-btn>
      </v-row>

      <v-spacer v-if="!display.smAndDown"></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view class="mt-4" style="max-width: 800px" />
    </v-main>
  </v-app>
</template>
<script>
import { ref } from "vue";
import { useDisplay, useTheme } from "vuetify";
import logo from "./assets/logo.png";
export default {
  name: "App",
  setup() {
    const display = ref(useDisplay());
    const theme = useTheme();
    if (localStorage.getItem("theme"))
      theme.global.name.value = localStorage.getItem("theme");
    return {
      display,
      theme,
      toggleTheme() {
        theme.global.name.value = theme.global.current.value.dark
          ? "light"
          : "dark";
        localStorage.setItem("theme", theme.global.name.value);
      },
    };
  },
  data: () => ({
    drawer: false,
    logo,
    links: [
      {
        title: "Home",
        icon: "mdi-home",
        to: "/",
      },
      {
        title: "Apps",
        icon: "mdi-play",
        to: "/apps",
      },
      {
        title: "Articles",
        icon: "mdi-note",
        to: "/articles",
      },
    ],
  }),

  methods: {},
};
</script>
