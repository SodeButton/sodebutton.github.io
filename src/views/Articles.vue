<template>
  <v-container>
    <div v-show="this.filterTags.length === 0">
      <v-card
        v-for="(card, i) of cards"
        :key="i"
        class="mb-4 ma-auto"
        style="max-width: 600px"
      >
        <v-img :src="card.img" :lazy-src="card.img" width="100%">
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
  </v-container>
</template>

<script>
import articlesData from "./articlesData.json";
export default {
  name: "Articles",
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
