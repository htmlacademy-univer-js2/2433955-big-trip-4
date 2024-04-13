import SortView from '../view/sort-view.js';
import FiltersView from '../view/filters-view.js';
import TripsContainer from '../view/tripsContainer-view.js';
import EditorView from '../view/editor-view.js';
import TripsView from '../view/trips-view.js';


import {render, replace} from '../framework/render.js';

export default class Presenter {
  #taskListComponent = new TripsContainer();
  #headerElement = null;
  #tripsElement = null;
  #pointsModel = null;

  #points = [];
  constructor({headerElement, tripsElement, pointsModel}) {
    this.#headerElement = headerElement;
    this.#tripsElement = tripsElement;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    render(new FiltersView(), this.#headerElement);
    render(new SortView(), this.#tripsElement);
    render(this.#taskListComponent, this.#tripsElement);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint = (point) => {
    const onDocumentKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onDocumentKeyDown);
      }
    };

    const tripComponent = new TripsView(
      {
        point,
        onTripClick: () => {
          replacePointToEdit();
          document.addEventListener('keydown', onDocumentKeyDown);
        }
      }
    );

    const editComponent = new EditorView(
      {
        point,
        onEditClick: () =>{
          replaceEditToPoint();
          document.removeEventListener('keydown', onDocumentKeyDown);
        }
      }
    );

    function replacePointToEdit() {
      replace(editComponent, tripComponent);
    }

    function replaceEditToPoint() {
      replace(tripComponent, editComponent);
    }

    render(tripComponent, this.#taskListComponent.element);
  };
}
