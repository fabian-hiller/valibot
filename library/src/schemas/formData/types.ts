/**
 * FormData path item type.
 */
export interface FormDataPathItem {
  type: 'formData';
  origin: 'value';
  input: FormData;
  key: string;
  value: any;
}
