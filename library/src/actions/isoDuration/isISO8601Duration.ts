const ALTERNATE_FORMAT: RegExp = /^[-+]?P\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const PERIOD_REGEX: RegExp = /\./g;
const COMMA_REGEX: RegExp = /,/g;
const WEEK_PART: RegExp = /\d+W/;
const DATE_PARTS: RegExp = /\d+[YMD]/;
const DATE_PARTS_ORDER: RegExp = /^(\d+([\.,]\d+)?Y)?(\d+([\.,]\d+)?M)?(\d+([\.,]\d+)?D)?(\d+([\.,]\d+)?W)?$/;
const TIME_PARTS_ORDER: RegExp = /^(\d+([\.,]\d+)?H)?(\d+([\.,]\d+)?M)?(\d+([\.,]\d+)?S)?$/;

export const isISO8601Duration = (input: unknown): boolean => {
  if (!input || typeof input !== 'string') return false;
  if (!input.startsWith('P') || input === 'P' || input === 'PT') return false;

  if (ALTERNATE_FORMAT.test(input)) return true;
  
  const totalDecimalPeriods = (input.match(PERIOD_REGEX) || []).length;
  const totalDecimalCommas = (input.match(COMMA_REGEX) || []).length;
  if (totalDecimalPeriods > 0 && totalDecimalCommas > 0) return false;

  const parts = input.substring(1).split('T');

  if (parts.length > 2) return false;

  const datePart = parts[0];
  const timePart = parts[1];

  if (timePart === '') return false;

  const hasWeeks = WEEK_PART.test(datePart);
  const hasOtherDateParts = DATE_PARTS.test(datePart);
  if (hasWeeks && hasOtherDateParts) return false;

  if (datePart !== '' && !DATE_PARTS_ORDER.test(datePart)) return false;
  if (typeof timePart === 'string' && timePart !== '' && !TIME_PARTS_ORDER.test(timePart)) return false;

  return true;
}