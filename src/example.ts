import SVGPathCommander from '.';
import { BasicPathBBox } from './interface';

const examplePath =
  'M12 7.26C12 8.02083 11.7165 9.05437 11.1496 10.3606C11.1362 10.3927 11.1127 10.4477 11.0792 10.5256C11.0458 10.6035 11.0156 10.6723 10.9888 10.7319C10.9621 10.7915 10.933 10.8419 10.9018 10.8831C10.8482 10.961 10.7857 11 10.7143 11C10.6473 11 10.5949 10.9771 10.5569 10.9313C10.519 10.8854 10.5 10.8281 10.5 10.7594C10.5 10.7181 10.5056 10.6574 10.5167 10.5772C10.5279 10.497 10.5335 10.4431 10.5335 10.4156C10.5558 10.104 10.567 9.82208 10.567 9.57C10.567 9.10708 10.5279 8.69229 10.4498 8.32562C10.3717 7.95896 10.2634 7.64156 10.125 7.37344C9.98661 7.10531 9.80804 6.87385 9.58929 6.67906C9.37054 6.48427 9.13505 6.325 8.88281 6.20125C8.63058 6.0775 8.33371 5.9801 7.99219 5.90906C7.65067 5.83802 7.30692 5.78875 6.96094 5.76125C6.61496 5.73375 6.22321 5.72 5.78571 5.72H4.28571V7.48C4.28571 7.59917 4.2433 7.70229 4.15848 7.78938C4.07366 7.87646 3.97321 7.92 3.85714 7.92C3.74107 7.92 3.64063 7.87646 3.5558 7.78938L0.127232 4.26937C0.0424107 4.18229 0 4.07917 0 3.96C0 3.84083 0.0424107 3.73771 0.127232 3.65062L3.5558 0.130625C3.64063 0.0435417 3.74107 0 3.85714 0C3.97321 0 4.07366 0.0435417 4.15848 0.130625C4.2433 0.217708 4.28571 0.320833 4.28571 0.44V2.2H5.78571C8.96875 2.2 10.9219 3.12354 11.6451 4.97062C11.8817 5.58479 12 6.34792 12 7.26Z';

const getResizedViewBox = (originalViewBox: BasicPathBBox, min: number, max: number): BasicPathBBox => {
  const originalWidth = originalViewBox.x2 - originalViewBox.x;
  const originalHeight = originalViewBox.y2 - originalViewBox.y;
  const aspectRatio = originalWidth / originalHeight;
  const newLength = max - min;
  if (originalHeight > originalWidth) {
    const newWidth = aspectRatio * newLength;
    const centerPoint = (originalViewBox.x + originalViewBox.x2) / 2;
    const newXMin = centerPoint - newWidth / 2;
    const newXMax = centerPoint + newWidth / 2;
    return { x: newXMin, y: min, x2: newXMax, y2: max };
  }
  const newHeight = newLength / aspectRatio;
  const centerPoint = (originalViewBox.y + originalViewBox.y2) / 2;
  const newYMin = centerPoint - newHeight / 2;
  const newYMax = centerPoint + newHeight / 2;
  return { x: min, y: newYMin, x2: max, y2: newYMax };
};

const bbox = new SVGPathCommander(examplePath).getBBox();

const { x, y, x2, y2 } = getResizedViewBox(bbox, 3, 29);

console.log(
  new SVGPathCommander(examplePath).interpolate({ x, y, x2, y2 }).centerIn({ x: 3, y: 3, x2: 29, y2: 29 }).toString(),
);
