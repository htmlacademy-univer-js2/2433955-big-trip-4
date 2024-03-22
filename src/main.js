import Presenter from './presenter/presenter';
import TasksModel from './model/point-model';

const pageBody = document.querySelector('.page-body');
const tripControls = pageBody.querySelector('.trip-controls');
const tripsContainer = pageBody.querySelector('.trip-events');
const headerElement = pageBody.querySelector('.trip-controls');

const points = new TasksModel();

const presenter = new Presenter(
  {
    headerElement: headerElement,
    tripsElement: tripsContainer,
    controlElement: tripControls,
    pointsModel: points
  }
);

presenter.init();
