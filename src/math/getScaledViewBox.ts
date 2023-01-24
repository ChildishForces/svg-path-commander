import { BasicPathBBox } from '../interface';

const getResizedViewBoxForLargerWidth = (
  aspectRatio: number,
  originalViewBox: BasicPathBBox,
  min: number,
  max: number,
  length: number,
): BasicPathBBox => {
  const newWidth = aspectRatio * length;
  const centerPoint = (originalViewBox.x + originalViewBox.x2) / 2;
  const newXMin = centerPoint - newWidth / 2;
  const newXMax = centerPoint + newWidth / 2;
  return { x: newXMin, y: min, x2: newXMax, y2: max };
};

const getResizedViewBoxForLargerHeight = (
  aspectRatio: number,
  originalViewBox: BasicPathBBox,
  min: number,
  max: number,
  length: number,
): BasicPathBBox => {
  const newHeight = length / aspectRatio;
  const centerPoint = (originalViewBox.y + originalViewBox.y2) / 2;
  const newYMin = centerPoint - newHeight / 2;
  const newYMax = centerPoint + newHeight / 2;
  return { x: min, y: newYMin, x2: max, y2: newYMax };
};

/**
 * Utility to uniformly scale a viewBox given a single larger dimension
 *
 * @param originalViewBox
 * @param min
 * @param max
 */
const getScaledViewBox = (originalViewBox: BasicPathBBox, min: number, max: number): BasicPathBBox => {
  const originalWidth = originalViewBox.x2 - originalViewBox.x;
  const originalHeight = originalViewBox.y2 - originalViewBox.y;
  const aspectRatio = originalWidth / originalHeight;
  const length = max - min;
  const scale = originalHeight > originalWidth ? getResizedViewBoxForLargerWidth : getResizedViewBoxForLargerHeight;
  return scale(aspectRatio, originalViewBox, min, max, length);
};

export default getScaledViewBox;
