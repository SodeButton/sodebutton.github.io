<template>
  <pre
    :class="option + ' line-numbers rounded-lg'"
    :data-label="filename"
  ><code :class="'language-'+ type" v-html="Prism.highlight(code, Prism.languages[type], type)"></code></pre>
</template>

<script setup>
import Prism from "prismjs";

const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "html",
  },
  option: {
    type: String,
    default: "",
  },
  filename: {
    type: String,
    default: "",
  },
});
const { code, type, option, filename } = props;
</script>

<script>
export default {
  name: "PreviewCode",
};
</script>

<style scoped></style>
