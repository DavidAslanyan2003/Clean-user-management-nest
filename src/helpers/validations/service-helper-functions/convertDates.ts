import { LanguageEnum } from '../../../helpers/enums/language.enum';

const months = {
  '01': {
    en: 'January',
    ru: 'Январь',
    hy: 'հունվար',
  },
  '02': {
    en: 'February',
    ru: 'Февраль',
    hy: 'Փետրվար',
  },
  '03': {
    en: 'March',
    ru: 'Март',
    hy: 'Մարտ',
  },
  '04': {
    en: 'April',
    ru: 'Апрель',
    hy: 'Ապրիլ',
  },
  '05': {
    en: 'May',
    ru: 'Май',
    hy: 'Մայիս',
  },
  '06': {
    en: 'June',
    ru: 'Июнь',
    hy: 'Հունիս',
  },
  '07': {
    en: 'July',
    ru: 'Июль',
    hy: 'Հուլիս',
  },
  '08': {
    en: 'August',
    ru: 'Август',
    hy: 'Օգոստոս',
  },
  '09': {
    en: 'September',
    ru: 'Сеньтябрь',
    hy: 'Սեպտեմբեր',
  },
  '10': {
    en: 'October',
    ru: 'Октябрь',
    hy: 'Հոկտեմբեր',
  },
  '11': {
    en: 'November',
    ru: 'Ноябрь',
    hy: 'Նոյեմբեր',
  },
  '12': {
    en: 'December',
    ru: 'Декабрь',
    hy: 'Դեկտեմբեր',
  },
};

export const convertDates = (date: Date | string, language?: LanguageEnum) => {
  if (typeof date !== 'string' && language) {
    const dateStr = date.toISOString();
    const month = dateStr[5] + dateStr[6];
    const day = dateStr[8] + dateStr[9];
    const year = dateStr.toString().slice(0, 4);
    return `${months[month][language]} ${day}, ${year}`;
  }
  return date;
};
