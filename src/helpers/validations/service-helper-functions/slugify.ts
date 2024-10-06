import slugify from 'slugify';

export const slugifyText = (text: string, dateText?: Date): string => {
  if (dateText) {
    const fullText = `${text}-${Math.floor(dateText.getTime())}`;
    return slugify(fullText, { lower: true });
  }
  return slugify(text, { lower: true });
};
