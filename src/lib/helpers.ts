import { formatDistance as formatDistanceDateFns } from 'date-fns';
import { pl } from 'date-fns/locale';

const COUNT_OF_DAYS = 31;
const COUNT_OF_VIEWS = 1000;

export const daysAgoFromNow = (date: string) => {
  const now = new Date();
  const postDate = new Date(date);

  const diff = now.getTime() - postDate.getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const isAfterDate = (date: string) => {
  const now = new Date();
  const postDate = new Date(date);

  return now.getTime() > postDate.getTime();
};

export const isBeforeDate = (date: string) => {
  const now = new Date();
  const postDate = new Date(date);

  return now.getTime() < postDate.getTime();
};

export const makeKeywords = (input: string | string[]): string => {
  let words: string[] = [];

  if (typeof input === 'string') {
    words = input.split(' ');
  } else {
    words = input.flat().filter((word) => word !== '');
  }

  return words.join(', ');
};

export const formatDistance = (date: string) =>
  formatDistanceDateFns(new Date(date), new Date(), {
    locale: pl,
    addSuffix: true,
  });

export const isHot = (views: number, date: string) =>
  views > COUNT_OF_VIEWS && daysAgoFromNow(date) < COUNT_OF_DAYS;

export const delay = (ms: number) =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, ms));
