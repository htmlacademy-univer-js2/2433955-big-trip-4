import {createElement} from '../render.js';

function createTripsContainer() {
  return (
    `
    <ul class="trip-events__list"></ul>
    `
  );
}

export default class TripsContainer {
  getTemplate() {
    return createTripsContainer();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
