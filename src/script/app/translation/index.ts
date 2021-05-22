type TemplateTranslation = (word: { [label: string]: string|number }) => string

export interface Dictionary {
  [component: string]: {
    [entry: string]: string|TemplateTranslation
  }
}

export default class Translator {
  dict: Dictionary
}
