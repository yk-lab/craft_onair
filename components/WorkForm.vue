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

const isLoading = ref(false);
const error = ref<string | null>(null);

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

const loadImage = async (file: File) => {
  const image = new Image();
  const url = URL.createObjectURL(file);
  image.src = url;

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = reject;
  });
};

const convertToJpg = async (file: File) => {
  const image = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(image, 0, 0);
  return canvas.toDataURL('image/jpeg');
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    state.value.image = input.files[0];
  }
};

const onSubmit = async (_e: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  error.value = null;

  try {
    const { generate } = await import('@pdfme/generator');

    const imageBase64 = state.value.image ? await convertToJpg(state.value.image) : '';

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
      const newWindow = window.open(url);
      if (newWindow) {
        newWindow.addEventListener('load', () => {
          URL.revokeObjectURL(url);
        });
      }
    }).catch((err) => {
      console.error('PDF生成エラー:', err);
      error.value = 'PDFの生成に失敗しました';
    });
  }
  catch (err) {
    console.error('処理エラー:', err);
    error.value = '処理中にエラーが発生しました。';
  }
  finally {
    isLoading.value = false;
  }
};
</script>
