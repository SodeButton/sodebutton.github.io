<template>
  <pre
    class="command-line rounded-lg"
    :data-output="output"
    data-prompt="$"
    :data-label="label"
  ><code class="language-shell" v-html="Prism.highlight(code, Prism.languages['shell'], 'shell')"></code></pre>
</template>

<script setup>
import Prism from "prismjs";

const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  output: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});
const { code, output } = props;
</script>

<script>
export default {
  name: "PreviewCommandLine",
};
</script>

<style scoped></style>
