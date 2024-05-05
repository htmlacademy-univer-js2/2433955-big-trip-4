import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInt = (maxNumber) => Math.floor(Math.random() * maxNumber);

const humanizeTaskDueDate = (dueDate, format) => dueDate ? dayjs(dueDate).format(format) : '';

const countDuration = (dateStart, dateEnd) => dayjs(dateEnd).diff(dateStart, 'm');

const isEscKey = (evt) => evt.key === ('Escape');

export {getRandomArrayElement, humanizeTaskDueDate, countDuration, getRandomInt, isEscKey};
