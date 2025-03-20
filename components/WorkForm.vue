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
        class="w-full"
        type="file"
        accept="image/*"
        @change="handleFileChange"
      />
    </UFormField>

    <URadioGroup
      v-model="state.borderColor"
      legend="枠線の色"
      :items="borderColors"
    />

    <div
      v-if="state.borderColor"
      class="mt-2 flex items-center gap-2 text-sm text-muted"
    >
      <div
        class="w-6 h-6 rounded border"
        :style="{ backgroundColor: state.borderColor }"
      />
      <span>選択中の色</span>
    </div>
    <div
      v-else
      class="mt-2 flex items-center gap-2 text-sm text-muted"
    >
      <span>枠線を選択してください</span>
    </div>

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
import { getDefaultFont } from '@pdfme/common';
import { image, rectangle, text } from '@pdfme/schemas';
import * as z from 'zod';
import { getTemplate } from '~/utils/pdf';

const NOTO_SANS_JP_URL = 'https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75vY0rw-oME.ttf';

const schema = z.object({
  title: z.string(),
  image: z.instanceof(File),
  borderColor: z.string().min(4).max(9).regex(/^#/),
});

type Schema = z.output<typeof schema>;

const state = defineModel<Partial<Schema>>({
  required: true,
});

const borderColors = [
  { label: 'オレンジ', value: '#ff8c00' },
  { label: '黄', value: '#ffcc33' },
  { label: '青', value: '#0066ff' },
  { label: '緑', value: '#66cc00' },
  { label: 'ピンク', value: '#eb6ea5' },
  { label: '茶', value: '#cd853f' },
];

const readFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    state.value.image = input.files[0];
  }
};

const onSubmit = async (_e: FormSubmitEvent<Schema>) => {
  const { generate } = await import('@pdfme/generator');

  const imageBase64 = state.value.image ? await readFile(state.value.image) : '';

  generate({
    template: getTemplate(state.value.borderColor ?? '#000000'),
    inputs: [{
      name: state.value.title,
      image: imageBase64,
    }],
    plugins: { text, rectangle, image },
    options: {
      font: {
        ...getDefaultFont(),
        NotoSansJP: {
          fallback: false,
          data: NOTO_SANS_JP_URL,

        },
      },
      lang: 'ja',
    },
  }).then((pdf) => {
    const blob = new Blob([new Uint8Array(pdf.buffer)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
    URL.revokeObjectURL(url);
  });
};
</script>
