const BLANC_TEST =
{
  type: 'bus',
  destination: null,
  cost: 0,
  date: {
    start: null,
    end: null,
  },
  offers: [],
  activeOffers: 0,
  description: '',
  photosSrc: ['https://loremflickr.com/248/152?random=$0)']
};

const DATE_FORMAT_EDIT = 'DD/MM/YY hh:mm';
const DATE_FORMAT_POINT_DAY = 'MMM DD';
const DATE_FORMAT_POINT_HOURS = 'hh-mm';

const PHOTOS_COUNT = 20;
const MAX_PRICE = 2000;
const MAX_OFFER_ID = 5;
const POINTS_COUNT = 4;

const PresenterModes = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortTypes = {
  DEFAULT: 'default',
  BY_PRICE: 'price',
  BY_TIME: 'time',
};

const FilterTypes = {
  ALL: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const UserActions = {
  UPDATE_POINT: 'update',
  ADD_POINT: 'add',
  DELETE_POINT: 'delete',
};

const UpdateTypes = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const AUTHORIZATION = 'Basic kol8af7o4q2xe74';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

export { BLANC_TEST, DATE_FORMAT_EDIT, DATE_FORMAT_POINT_DAY,
  DATE_FORMAT_POINT_HOURS, PHOTOS_COUNT, MAX_PRICE, MAX_OFFER_ID, POINTS_COUNT,
  PresenterModes, SortTypes, FilterTypes, UpdateTypes, UserActions, AUTHORIZATION, END_POINT };
