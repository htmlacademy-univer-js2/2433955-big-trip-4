import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInt = (maxNumber) => Math.floor(Math.random() * maxNumber);

const humanizeTaskDueDate = (dueDate, format) => dueDate ? dayjs(dueDate).format(format) : '';

const countDuration = (dateStart, dateEnd) => dayjs(dateEnd).diff(dateStart, 'm');

const isEscKey = (evt) => evt.key === ('Escape');

const updateItem = (items, update) => {
  const updatedItems = items.map((item) => (item.id === update.id ? update : item));
  return updatedItems;
};

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

const sortByTime = (point1, point2) => {
  const time1 = dayjs(point1.date.start).hour() * 60 + dayjs(point1.date.start).minute();
  const time2 = dayjs(point2.date.start).hour() * 60 + dayjs(point2.date.start).minute();

  return getWeightForNullDate(point1.date.start, point2.date.start) ?? time1 - time2;
};

const sortByEvent = (point1, point2) =>
  point1.type[0].localeCompare(point2.type[0]);

const sortByPrice = (point1, point2) =>
  point2.cost - point1.cost;

const sortByDefault = (point1, point2) => {
  const weight = getWeightForNullDate(point1.date.start, point2.date.start);

  return weight ?? dayjs(point1.date.start).diff(dayjs(point2.date.start));
};

const isPointPresent = (point) => {
  const now = dayjs();
  return (
    dayjs(point.date.start).isSame(now) ||
    (dayjs(point.date.start).isBefore(now) && dayjs(point.date.end).isAfter(now))
  );
};

const filter = {
  'everything': (data) => [...data],
  'future': (data) => data.filter((point) => dayjs(point.date.start).isAfter(dayjs())),
  'present': (data) => data.filter(isPointPresent),
  'past': (data) => data.filter((point) => dayjs(point.date.end).isBefore(dayjs())),
};

export { getRandomArrayElement, humanizeTaskDueDate, countDuration, getRandomInt, updateItem,
  sortByDefault, sortByEvent, sortByPrice, sortByTime, isEscKey, filter };
