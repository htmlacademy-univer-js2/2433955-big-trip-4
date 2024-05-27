import Presenter from './presenter/main-presenter';
import PointsModel from './model/point-model';
import FiltersModel from './model/filters-model';
import PointsApiService from './api-service/points-api-service';
import { AUTHORIZATION, END_POINT } from './const';
import OffersModel from './model/offers-model';
import OffersApiService from './api-service/offers-api-service';
import DestinationsModel from './model/destinations-model';
import DestinationsApiService from './api-service/destinations-api-service';

const pageBody = document.querySelector('.page-body');
const mainContainer = pageBody.querySelector('.trip-events');
const pointsContainer = pageBody.querySelector('.trip-events__list');
const headerElement = pageBody.querySelector('.trip-controls');

const filtersModel = new FiltersModel();

const points = new PointsModel ({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const offers = new OffersModel ({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});

const destinations = new DestinationsModel ({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});

const presenter = new Presenter (
  {
    controlsDiv: headerElement,
    tripsSection: mainContainer,
    pointsUl: pointsContainer,
    destinationsModel: destinations,
    offersModel: offers,
    pointsModel: points,
    filtersModel: filtersModel
  }
);

presenter.init();

// я доделаю ;(
