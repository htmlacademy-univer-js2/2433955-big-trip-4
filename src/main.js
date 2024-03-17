import Presenter from './presenter/presenter';

const pageBody = document.querySelector('.page-body');
const tripControls = pageBody.querySelector('.trip-controls');
const tripsContainer = pageBody.querySelector('.trip-events');

const presenter = new Presenter({
  header: pageBody.querySelector('.trip-controls'),
  trips: tripsContainer,
  control: tripControls,
});

presenter.init();
