const pointTypes = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];

const destinations = [
  'Miass',
  'Chelyabinsk',
  'Amsterdam',
  'Prague',
  'Luxembourg',
];

const BLANC_TEST =
{
  type: null,
  destination: null,
  cost: 0,
  date: {
    start: null,
    end: null,
  },
  offers: [

  ],
  desctiption:'',
  photosSrc: []
};

const DATE_FORMAT_EDIT = 'DD/MM/YY hh:mm';
const DATE_FORMAT_POINT_DAY = 'MMM DD';
const DATE_FORMAT_POINT_HOURS = 'hh-mm';

const PHOTOS_COUNT = 20;
const MAX_PRICE = 2000;
const MAX_OFFER_ID = 5;
const POINTS_COUNT = 12;

export {pointTypes, destinations, BLANC_TEST, DATE_FORMAT_EDIT, DATE_FORMAT_POINT_DAY,
  DATE_FORMAT_POINT_HOURS, PHOTOS_COUNT, MAX_PRICE, MAX_OFFER_ID, POINTS_COUNT};
