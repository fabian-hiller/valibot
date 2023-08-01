import i18next from 'i18next';
import * as en_validation from './locales/en/validation.json';
import * as ptBR_validation from './locales/pt-BR/validation.json';

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "validation";
    resources: {
      validation: typeof en_validation;
    };
  }
}

i18next.init({
  fallbackLng: 'en',
  defaultNS: 'validation',
  resources: {
    en: {
      validation: en_validation,
    },
    'pt-BR': {
      validation: ptBR_validation,
    },
  },
});

export { i18next };