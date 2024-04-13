import Presenter from './presenter/presenter';
import PointsModel from './model/point-model';
import FiltersModel from './model/filters-model';
import { POINTS_COUNT } from './const';

const pageBody = document.querySelector('.page-body');
const tripControls = pageBody.querySelector('.trip-controls');
const tripsContainer = pageBody.querySelector('.trip-events');
const headerElement = pageBody.querySelector('.trip-controls');

const points = new PointsModel();
const filters = new FiltersModel(POINTS_COUNT);

const presenter = new Presenter(
  {
    headerElement: headerElement,
    tripsElement: tripsContainer,
    controlElement: tripControls,
    pointsModel: points,
    filterModel: filters
  }
);

presenter.init();
