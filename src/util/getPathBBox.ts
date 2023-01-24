import { PathBBox } from 'src/interface';
import { PathArray } from 'src/types';
import pathLengthFactory from './pathLengthFactory';

/**
 * Returns the bounding box of a shape.
 *
 * @param path the shape `pathArray`
 * @returns the length of the cubic-bezier segment
 */
const getPathBBox = (path?: PathArray | string): PathBBox => {
  if (!path) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      x2: 0,
      y2: 0,
      cx: 0,
      cy: 0,
      cz: 0,
    };
  }

  const {
    min: { x: xMin, y: yMin },
    max: { x: xMax, y: yMax },
  } = pathLengthFactory(path);

  const width = xMax - xMin;
  const height = yMax - yMin;

  return {
    width,
    height,
    x: xMin,
    y: yMin,
    x2: xMax,
    y2: yMax,
    cx: xMin + width / 2,
    cy: yMin + height / 2,
    // an estimate
    cz: Math.max(width, height) + Math.min(width, height) / 2,
  };
};
export default getPathBBox;
