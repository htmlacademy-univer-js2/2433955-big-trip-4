import { render, replace, remove } from '../framework/render';
import EditorView from '../view/editor-view';
import PointsView from '../view/points-view';
import {UserActions, UpdateTypes, PresenterModes } from '../const';
import { isEscKey } from '../util';


export default class PointPresenter {
  #pointComponent = null;
  #editComponent = null;
  #point = null;
  #pointsContainer = null;
  #onPointChange = null;
  #onModeChange = null;
  #mode = PresenterModes.DEFAULT;
  #offers;
  #destinations;

  constructor({pointsContainer, onPointChange, onModeChange, offers, destinations}){
    this.#pointsContainer = pointsContainer;
    this.#onPointChange = onPointChange;
    this.#offers = offers;
    this.#onModeChange = onModeChange;
    this.#destinations = destinations;
  }

  #onDocumentKeyDown = (evt) => {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this.#editComponent.reset(this.#point);
      this.#replaceEditToPoint();
      document.removeEventListener('keydown', this.#onDocumentKeyDown);
    }
  };

  init(point) {
    const prevPoint = this.#pointComponent;
    const prevEdit = this.#editComponent;
    const currentTypeOffers = this.#offers[point.type];
    const currentTypeDestination = this.#destinations.find(({ id }) => id === point.destination);

    this.#point = {
      ...point,
    };

    this.#pointComponent = new PointsView ({
      point: this.#point,
      offersObject: currentTypeOffers,
      curTypeDestination: currentTypeDestination,
      onTripClick: () => {
        this.#replacePointToEdit();
        document.addEventListener('keydown', this.#onDocumentKeyDown);
      },
      onFavoriteClick: this.#onFavoriteClick,
      onSubmit: this.#onFormSubmit
    });

    this.#editComponent = new EditorView (
      {
        point: this.#point,
        allOffers: this.#offers,
        allDestinations: this.#destinations,
        curTypeDestination: currentTypeDestination,
        onSubmit: this.#onFormSubmit,
        deletePoint: this.#onPointDelete
      }
    );

    if(prevPoint === null || prevEdit === null){
      render(this.#pointComponent, this.#pointsContainer);
      return;
    }

    if(this.#mode === PresenterModes.DEFAULT){
      replace(this.#pointComponent, prevPoint);
    }

    if(this.#mode === PresenterModes.EDITING){
      replace(this.#editComponent, prevEdit);
    }

    remove(prevPoint);
    remove(prevEdit);
  }

  resetView(){
    if (this.#mode !== PresenterModes.DEFAULT){
      this.#editComponent.reset(this.#point);
      this.#replaceEditToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editComponent);
  }

  #replacePointToEdit () {
    replace(this.#editComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onDocumentKeyDown);
    this.#onModeChange();
    this.#mode = PresenterModes.EDITING;
  }

  #replaceEditToPoint () {
    replace(this.#pointComponent, this.#editComponent);
    document.removeEventListener('keydown', this.#onDocumentKeyDown);
    this.#mode = PresenterModes.DEFAULT;
  }

  #onFavoriteClick = ( ) => {
    this.#onPointChange(
      UserActions.UPDATE_POINT,
      UpdateTypes.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #onFormSubmit = (update) => {
    if(update === undefined){
      this.#editComponent.reset(this.#point);
      this.#replaceEditToPoint();
      return;
    }

    const isMajor = () =>
      update.cost !== this.#point.cost ||
        update.date.start !== this.#point.date.start ||
        update.type !== this.#point.type;

    this.#onPointChange(
      UserActions.UPDATE_POINT,
      isMajor() ? UpdateTypes.MAJOR : UpdateTypes.MINOR,
      update
    );
  };

  #onPointDelete = (point) => {
    this.#onPointChange(
      UserActions.DELETE_POINT,
      UpdateTypes.MAJOR,
      point,
    );
  };
}
