<template>
  <v-container> </v-container>
</template>

<script>
export default {
  name: "Apps",
  data: () => ({
    filterTags: [],
    cards: [
      {
        img: "https://github.com/photonstorm/phaser/blob/v2.6.2/resources/Phaser%20Logo/2D%20Text/Phaser%202D%20No%20Glow.png",
        title: "Phaser + TypeScript + Viteの環境構築",
        desc: "Viteを使ってPhaser + TypeScriptでゲーム作りができる環境を構築します。",
        url: "https://qiita.com/Button501/items/0a2290d297f9876dc271",
        color: "green-lighten-1",
        platform: "Qiita",
        tags: ["phaser", "typescript", "vite"],
      },
    ],
    filterCards: [],
  }),
  computed: {
    selections() {
      const selections = [];

      for (const selection of this.filterTags) {
        selections.push(selection);
      }

      return selections;
    },
    selectionsCard() {
      const selections = [];

      for (let card of this.cards) {
        if (card.tags === undefined) break;
        for (let tag2 of card.tags) {
          for (let tag3 of this.filterTags) {
            if (selections.indexOf(card) === -1) {
              if (tag2 === tag3) selections.push(card);
            }
          }
        }
      }
      return selections;
    },
  },
  methods: {
    openWindow(url, title, width, height) {
      window.open(url, title, `resizable,width=${width},height=${height}`);
    },
    addShowTag(tag) {
      if (this.filterTags.indexOf(tag) === -1) {
        this.filterTags.push(tag);
      }
    },
  },
};
</script>

<style scoped></style>
