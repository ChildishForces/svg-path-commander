import { ASegment, HSegment, PathArray, VSegment } from '../types';
import { BasicPathBBox } from '../interface';
import getPathBBox from '../util/getPathBBox';

/**
 * Center a path in a viewBox provided
 *
 * @param instructions
 * @param viewBox
 */
const centerPathInViewBox = (instructions: PathArray, viewBox: BasicPathBBox): PathArray => {
  const { x, y, x2, y2 } = getPathBBox(instructions);
  const pathCenter = { x: (x + x2) / 2, y: (y + y2) / 2 };
  const viewBoxWidth = viewBox.x2 - viewBox.x;
  const viewBoxHeight = viewBox.y2 - viewBox.y;
  const viewBoxCenter = { x: viewBoxWidth / 2, y: viewBoxHeight / 2 };
  const offset = { x: viewBoxCenter.x - pathCenter.x + viewBox.x, y: viewBoxCenter.y - pathCenter.y + viewBox.y };

  return instructions.map(command => {
    const [instruction] = command;
    switch (instruction) {
      case 'A': {
        const [, rx, ry, xRot, largeArc, sweep, xp, yp] = command as ASegment;
        return ['A', rx + offset.x, ry + offset.y, xRot, largeArc, sweep, xp + offset.x, yp + offset.y];
      }
      case 'H': {
        const [, value] = command as HSegment;
        return ['H', value + offset.x];
      }
      case 'V': {
        const [, value] = command as VSegment;
        return ['V', value + offset.y];
      }
      default:
        return [
          instruction,
          ...(command.slice(1) as number[]).map((value: number, i) => {
            if (!(i % 2)) return value + offset.x;
            return value + offset.y;
          }),
        ];
    }
  }) as PathArray;
};

export default centerPathInViewBox;
