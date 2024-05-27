import SortView from '../view/sort-view.js';
import TripsContainer from '../view/tripsContainer-view.js';
import {render, remove} from '../framework/render.js';
import EmptyPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import { sortByTime, sortByEvent, sortByPrice, sortByOffers, sortByDefault, filter } from '../util.js';
import { SortTypes, UserActions, FilterTypes, UpdateTypes} from '../const.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class Presenter {
  #pointsContainer = new TripsContainer();
  #headerElement;
  #onAddTaskClose;
  #mainContainerElement;
  #filtersElement;
  #pointsModel;
  #filterModel;
  #noPointsComponent = null;
  #sortElement = null;
  #currentSort = SortTypes.DEFAULT;
  #filterType = FilterTypes.ALL;
  #pointPresenters = new Map();
  #newPointButton;
  #newPointPresenter;

  constructor(
    {
      controlsDiv,
      tripsSection,
      pointsModel,
      filterModel,
      newPointButton,
      onAddTaskClose
    }){
    this.#headerElement = controlsDiv;
    this.#mainContainerElement = tripsSection;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointButton = newPointButton;
    this.#onAddTaskClose = onAddTaskClose;

    this.#newPointPresenter = new NewPointPresenter({
      pointsContainer: this.#mainContainerElement,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onAddTaskClose
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  createPoint() {
    this.#currentSort = SortTypes.DEFAULT;
    this.#filterModel.setFilter(UpdateTypes.MAJOR, FilterTypes.ALL);
    this.#newPointPresenter.init();
  }

  init() {
    this.#renderFilters();
    this.#renderComponents();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSort) {
      case SortTypes.BY_TIME:
        return filteredPoints.sort(sortByTime);
      case SortTypes.BY_NAME:
        return filteredPoints.sort(sortByEvent);
      case SortTypes.BY_PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortTypes.BY_OFFERS:
        return filteredPoints.sort(sortByOffers);
      case SortTypes.DEFAULT:
        return filteredPoints.sort(sortByDefault);
    }
    return filteredPoints;
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(
      {
        pointsContainer: this.#pointsContainer.element,
        onPointChange: this.#handleViewAction,
        onModeChange: this.#onModeChange
      }
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #onModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEmptyPoints(){
    this.#noPointsComponent = new EmptyPointsView({
      filterType: this.#filterType
    });

    render(new EmptyPointsView(), this.#mainContainerElement);
  }

  #renderFilters(){
    this.#filtersElement = new FilterPresenter({
      filterContainer: this.#headerElement,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel
    });
  }

  #renderSort(){
    this.#sortElement = new SortView({
      onSort: this.#onSort,
      currentSort: this.#currentSort
    });

    render(this.#sortElement, this.#mainContainerElement);
  }

  #renderPointsContainer(){
    render(this.#pointsContainer, this.#mainContainerElement);
  }

  #initPoints(){
    this.#renderPointsContainer();

    if(this.#pointsModel.points.length === 0){
      this.#renderEmptyPoints();
    }
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderComponents() {
    this.#renderSort();
    this.#initPoints();
    this.#renderPoints(this.points);
  }

  #renderPoints() {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #handleViewAction = (actionType, updateType, newPoint) => {
    switch (actionType) {
      case UserActions.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, newPoint);
        break;
      case UserActions.ADD_POINT:
        this.#pointsModel.addPoint(updateType, newPoint);
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
    }
  };

  #onSort = (sortType) => {
    if (this.#currentSort === sortType) {
      return;
    }
    this.#currentSort = sortType;

    this.#clearComponents();
    this.#renderComponents();
  };

  #clearComponents({ resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    remove(this.#pointsContainer);
    this.#clearPoints();
    remove(this.#sortElement);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSort = SortTypes.DEFAULT;
    }
  }
}
