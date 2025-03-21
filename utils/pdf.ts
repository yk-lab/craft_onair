import type { GenerateProps } from '@pdfme/common';
import template from '~/assets/template.json';

export const getTemplate = (borderColor: string) => {
  const baseTemplate = JSON.parse(JSON.stringify(template)) as GenerateProps['template'];
  if (baseTemplate.schemas?.[0]?.[0]) {
    baseTemplate.schemas[0][0].borderColor = borderColor;
  }
  return baseTemplate;
};
