<template>
  <v-container>
    <div v-show="this.filterTags.length === 0">
      <v-card
        v-for="(card, i) of cards"
        :key="i"
        class="mb-4"
        v-bind="getThumbnail"
      >
        <v-img :src="card.img" :lazy-src="card.img" width="600">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-card-title
          class="pt-3"
          style="text-overflow: inherit; white-space: unset"
        >
          <a v-bind:href="card.url">
            {{ card.title }}
          </a>
        </v-card-title>
        <v-card-text class="text-medium-emphasis">
          {{ card.desc }}
        </v-card-text>
        <div class="pl-4 mb-2">
          <v-chip
            small
            class="mr-2"
            v-for="(tag, j) in card.tags"
            :key="j"
            @click="addShowTag(tag)"
          >
            {{ tag }}
          </v-chip>
        </div>
      </v-card>
    </div>
    <!--  filtered tag  -->
    <div v-show="this.filterTags.length > 0">
      <div class="mb-5">
        <v-chip
          small
          closable
          class="mr-2"
          v-for="(tag, i) in selections"
          :key="tag"
          @click:close="filterTags.splice(i, 1)"
        >
          {{ tag }}
        </v-chip>
      </div>
      <v-card v-for="(card, i) of cards" :key="i" class="mb-4">
        <v-sheet width="100%" height="250" :color="card.color">
          <v-row
            align-content="center"
            justify="center"
            class="pt-3"
            style="height: 100%"
          >
            <v-sheet
              width="100%"
              height="80%"
              color="white"
              class="ma-8"
              rounded
            >
              <div style="width: 100%; height: 100%" class="pa-3">
                <h1
                  class="d-flex text-center justify-center"
                  style="align-items: center; width: 100%; height: 80%"
                >
                  {{ card.title }}
                </h1>
                <h2
                  class="d-flex justify-end text-right"
                  style="align-items: center; width: 100%; height: 20%"
                >
                  {{ card.platform }}
                </h2>
              </div>
            </v-sheet>
          </v-row>
        </v-sheet>
        <v-card-title
          class="pt-3"
          style="text-overflow: inherit; white-space: unset"
        >
          <a v-bind:href="card.url">
            {{ card.title }}
          </a>
        </v-card-title>
        <v-card-text class="text-medium-emphasis">
          {{ card.desc }}
        </v-card-text>
        <div class="pl-4 mb-2">
          <v-chip
            small
            class="mr-2"
            v-for="(tag, j) in card.tags"
            :key="j"
            @click="addShowTag(tag)"
          >
            {{ tag }}
          </v-chip>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import articlesData from "./articlesData.json";
export default {
  name: "ArticlesDev",
  data: () => ({
    filterTags: [],
    cards: articlesData,
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
    getThumbnail() {
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
      for (let card of this.cards) {
        let url = CORS_PROXY + card.url;
        fetch(url)
          .then((res) => res.text())
          .then((text) => {
            const el = new DOMParser().parseFromString(text, "text/html");
            const headEls = el.head.children;
            Array.from(headEls).map((v) => {
              const prop = v.getAttribute("property");
              if (!prop) return;
              if (prop === "og:image") {
                card.img = v.getAttribute("content");
              }
            });
          });
      }
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
