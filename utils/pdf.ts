import type { GenerateProps } from '@pdfme/common';
import template from '~/assets/template.json';

export const getTemplate = (borderColor: string) => {
  const baseTemplate = template as unknown as GenerateProps['template'];
  baseTemplate.schemas[0][0].borderColor = borderColor;
  return baseTemplate;
};
