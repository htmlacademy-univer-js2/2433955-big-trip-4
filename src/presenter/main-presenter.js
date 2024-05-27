import SortView from '../view/sort-view.js';
import TripsContainer from '../view/tripsContainer-view.js';
import {render, remove} from '../framework/render.js';
import EmptyPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import { sortByTime, sortByPrice, sortByDefault, filter } from '../util.js';
import { SortTypes, UserActions, FilterTypes, UpdateTypes} from '../const.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import Observable from '../framework/observable.js';

export default class Presenter extends Observable {
  #pointsContainer = new TripsContainer();
  #headerElement;
  #mainContainerElement;
  #pointsModel;
  #filterModel;
  #noPointsComponent = null;
  #sortElement = null;
  #currentSortType = SortTypes.DEFAULT;
  #filterType = FilterTypes.ALL;
  #pointPresenters = new Map();
  #newPointPresenter;
  #filter;
  #loadingComponent;
  #isLoading = true;
  #offersModel;
  #destinationsModel;

  constructor(
    {
      controlsDiv,
      tripsSection,
      pointsModel,
      filterModel,
      offersModel,
      destinationsModel
    }){

    super();

    this.#headerElement = controlsDiv;
    this.#mainContainerElement = tripsSection;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#filter = new FilterPresenter({
      filterContainer: this.#headerElement,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel
    });

    this.addObserver(this.#handleModelEvent);

    Promise.all([
      this.#pointsModel.init(),
      this.#offersModel.init(),
      this.#destinationsModel.init(),
    ]).then(() => {
      this._notify(UpdateTypes.INIT);
    }).finally(() => {
      render(this.newPointButtonComponent, document.querySelector('.page-body__container'));
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #createPoint() {
    this.#currentSortType = SortTypes.DEFAULT;
    this.#filterModel.setFilter(UpdateTypes.MAJOR, FilterTypes.ALL);
    this.#newPointPresenter.init();
  }

  handleNewPointButtonClick = () => {
    this.#createPoint();
    this.newPointButtonComponent.element.disabled = true;
  };


  newPointButtonComponent = new NewPointButtonView({
    onClick: this.handleNewPointButtonClick
  });

  init() {
    this.#renderComponents();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortTypes.BY_TIME:
        return filteredPoints.sort(sortByTime);
      case SortTypes.BY_PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortTypes.DEFAULT:
        return filteredPoints.sort(sortByDefault);
    }
    return filteredPoints;
  }

  #onModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #initPoints(){
    this.#renderPointsContainer();

    if(this.#pointsModel.points.length === 0 && !this.#isLoading) {
      this.#renderEmptyPoints();
    }
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter (
      {
        offers: this.#offersModel.offers,
        destinations: this.#destinationsModel.destinations,
        pointsContainer: this.#pointsContainer.element,
        onPointChange: this.#handleViewAction,
        onModeChange: this.#onModeChange
      }
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderEmptyPoints(){
    this.#noPointsComponent = new EmptyPointsView ({
      filterType: this.#filterType
    });

    render(this.#noPointsComponent, this.#mainContainerElement);
  }

  #renderSort(){
    this.#sortElement = new SortView ({
      onSort: this.#onSort,
      currentSortType: this.#currentSortType
    });

    render(this.#sortElement, this.#mainContainerElement);
  }

  #renderPointsContainer(){
    render(this.#pointsContainer, this.#mainContainerElement);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderComponents() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort();
    this.#initPoints();
    this.#renderPoints(this.points);
  }

  #renderPoints() {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderLoading(){
    this.#loadingComponent = new LoadingView();

    render(this.#loadingComponent, this.#mainContainerElement);
  }

  #handleViewAction = (actionType, updateType, newPoint) => {
    switch (actionType) {
      case UserActions.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, newPoint);
        break;
      case UserActions.ADD_POINT:
        this.#pointsModel.newPoint(updateType, newPoint);
        break;
      case UserActions.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, newPoint);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateTypes.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateTypes.MINOR:
        this.#clearComponents();
        this.#renderComponents();
        break;
      case UpdateTypes.MAJOR:
        this.#clearComponents({resetSortType : true});
        this.#renderComponents();
        break;
      case UpdateTypes.INIT:
        this.#newPointPresenter = new NewPointPresenter({
          pointsContainer: this.#mainContainerElement,
          onDataChange: this.#handleViewAction,
          onDestroy: this.onAddTaskClose,
          allOffers: this.#offersModel.offers,
          allDestinations: this.#destinationsModel.destinations,
        });

        this.#isLoading = false;
        this.#clearComponents();
        this.#renderComponents();
        break;
    }
  };

  #onSort = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearComponents();
    this.#renderComponents();
  };

  #clearComponents({ resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    remove(this.#pointsContainer);
    this.#clearPoints();

    remove(this.#sortElement);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortTypes.DEFAULT;
    }
  }
}
