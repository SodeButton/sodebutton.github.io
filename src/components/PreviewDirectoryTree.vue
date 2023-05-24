<template>
  <pre
    class="rounded-lg directory-tree data-remove-initial-line-feed"
    :data-line="line"
  ><code class="language-diff-treeview diff-highlight">{{code}}</code></pre>
</template>

<script setup>
const props = defineProps({
  code: {
    type: String,
    default: "",
  },
});
const { code, line } = props;
</script>

<script>
export default {
  name: "PreviewTree",
};
</script>

<style scoped></style>
