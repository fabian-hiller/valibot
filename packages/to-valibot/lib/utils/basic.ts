const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const appendSchema = (s: string): string => (s.endsWith('Schema') ? s : `${s}Schema`);
const normalizeTitle = (s: string): string => s.replace(/ /g, '');
const slugify = (s: string): string => s.toLowerCase().replace(/ /g, '-');

export { capitalize, appendSchema, normalizeTitle, slugify };
