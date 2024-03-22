import SortView from '../view/sort-view.js';
import FiltersView from '../view/filters-view.js';
import TripsContainer from '../view/tripsContainer-view.js';
import EditorView from '../view/editor-view.js';
import TripsView from '../view/trips-view.js';


import {render} from '../render.js';

export default class Presenter {
  taskListComponent = new TripsContainer();
  constructor({headerElement, tripsElement, controlElement, pointsModel}) {
    this.headerElement = headerElement;
    this.tripsElement = tripsElement;
    this.controlElement = controlElement;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(new FiltersView(), this.headerElement);
    render(new SortView(), this.tripsElement);
    render(this.taskListComponent, this.tripsElement);
    render(new EditorView(this.points[0]), this.taskListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripsView(this.points[i]), this.taskListComponent.getElement());
    }

  }
}
