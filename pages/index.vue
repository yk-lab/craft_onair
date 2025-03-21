<template>
  <UPage class="container mx-auto max-w-screen-md bg-white rounded-lg px-4 py-8">
    <UPageHeader title="工作オンエア ジェネレータ" />

    <UPageBody>
      <WorkForm
        v-model="work"
      />
    </UPageBody>
  </UPage>
</template>

<script lang="ts" setup>
const work = ref({
  title: '',
  image: '',
  borderColor: '',
});
</script>
