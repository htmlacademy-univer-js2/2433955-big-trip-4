import { getRandomInt } from '../util';
import { MAX_PRICE } from '../const';

const Offers = {
  0:[
    {
      text:'Kontsert Death Grips v Miasse',
      cost: getRandomInt(MAX_PRICE),
      name:'event-offer-test',
      checked: false,
    }
  ],
  1: [
    {
      text: 'Rent a car ',
      cost: getRandomInt(MAX_PRICE),
      name: 'event-offer-rent',
      checked: false,
    }
  ],
  2:[
    {
      text: 'Add luggage',
      cost: getRandomInt(MAX_PRICE),
      name: 'event-offer-luggage',
      checked: false,
    },
    {
      text:'Switch to comfort',
      cost: getRandomInt(MAX_PRICE),
      name: 'event-offer-comfort',
      checked: false,
    },
  ],
  3:[
    {
      text:'Add breakfast ',
      cost: getRandomInt(MAX_PRICE),
      name: 'event-offer-breakfast',
      checked: false,
    },
  ],
};

const getOffersId = (type) => {
  switch(type.toLowerCase()){
    case ('drive'):{
      return 1;
    }
    case ('flight'):{
      return 2;
    }
    case ('check-in'):{
      return 3;
    }
    default: {
      return 0;
    }
  }
};


export {Offers, getOffersId};
