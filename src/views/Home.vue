<template>
  <v-container>
    <div style="max-width: 600px" class="ma-auto">
      <v-card class="">
        <v-row class="mt-2 mb-2">
          <v-avatar class="ma-auto ml-8" size="80">
            <v-img :src="this.icon" width="80" height="80" />
          </v-avatar>
          <v-col>
            <v-card-title> {{ profile.name }}</v-card-title>
            <v-card-text>{{ profile.content }}</v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import icon from "../assets/icon_500x500.png";
export default {
  name: "Home",
  data: () => ({
    icon: icon,
    profile: {
      name: "ぶっとん",
      content: "OECU W3 / Phaserを使ってWebゲームを制作している。",
    },
  }),
};
</script>
