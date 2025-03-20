<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="作品名"
      name="title"
    >
      <UInput
        v-model="state.title"
        class="w-full"
        placeholder="作品名を入力してください"
      />
    </UFormField>

    <UFormField
      label="画像"
      name="image"
    >
      <UInput
        v-model="state.image"
        class="w-full"
        type="file"
        accept="image/*"
      />
    </UFormField>

    <URadioGroup
      v-model="state.borderColor"
      legend="枠線の色"
      :items="borderColors"
    />

    <UButton
      class="px-8"
      type="submit"
      size="lg"
    >
      生成
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod';

const schema = z.object({
  title: z.string(),
  image: z.string(),
  borderColor: z.string().min(4).max(9).regex(/^#/),
});

type Schema = z.output<typeof schema>;

const state = defineModel<Partial<Schema>>({
  required: true,
});

const borderColors = [
  { label: 'オレンジ', value: '#FF7F50' },
  { label: '黄', value: '#FFFF00' },
  { label: '青', value: '#0000FF' },
  { label: '緑', value: '#00FF00' },
  { label: 'ピンク', value: '#FFC0CB' },
  { label: '茶', value: '#A52A2A' },
];

const onSubmit = (e: FormSubmitEvent<Schema>) => {
  console.log(e);
};
</script>
