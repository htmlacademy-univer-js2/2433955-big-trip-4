import {getRandomPoint} from '../mock/point.js';

const POINT_COUNT = 3;

export default class TasksModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);

  getPoints() {
    return this.points;
  }
}
