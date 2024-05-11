import { getRandomArrayElement, getRandomInt } from '../util';
import { pointTypes, destinations, POINTS_COUNT, PHOTOS_COUNT, MAX_OFFER_ID, MAX_PRICE, dates } from '../const';


const createPoint = (id) =>({
  type: getRandomArrayElement(pointTypes),
  destination: getRandomArrayElement(destinations),
  id: id,
  cost: getRandomInt(MAX_PRICE),
  date: getRandomArrayElement(dates),
  offers:{
    id: getRandomInt(MAX_OFFER_ID)
  },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  photosSrc:[`https://loremflickr.com/248/152?random=${getRandomInt(PHOTOS_COUNT)}`],
});

const mockPoints = Array.from( {length: POINTS_COUNT} , createPoint);

const getRandomPoint = () => getRandomArrayElement(mockPoints);

export {getRandomPoint};
