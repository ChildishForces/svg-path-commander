import pathToAbsolute from '../convert/pathToAbsolute';
import interpolate from '../math/interpolate';
import type { PathBBox, BasicPathBBox } from '../interface';
import type { ASegment, HSegment, PathArray, VSegment } from '../types';

/**
 * Interpolate path values to apply to a new bounding box
 *
 * @param inputPath
 * @param inputBBox
 * @param outputBBox
 */
const interpolatePath = (inputPath: PathArray, inputBBox: PathBBox, outputBBox: BasicPathBBox): PathArray => {
  const absolutePath = pathToAbsolute(inputPath);
  const interpolateX = interpolate([inputBBox.x, inputBBox.x2], [outputBBox.x, outputBBox.x2]);
  const interpolateY = interpolate([inputBBox.y, inputBBox.y2], [outputBBox.y, outputBBox.y2]);

  return absolutePath.map(command => {
    const [instruction] = command;
    switch (instruction) {
      case 'A': {
        const [, rx, ry, xRot, largeArc, sweep, x, y] = command as ASegment;
        return ['A', interpolateX(rx), interpolateY(ry), xRot, largeArc, sweep, interpolateX(x), interpolateY(y)];
      }
      case 'H': {
        const [, value] = command as HSegment;
        return ['H', interpolateX(value)];
      }
      case 'V': {
        const [, value] = command as VSegment;
        return ['V', interpolateY(value)];
      }
      default:
        return [
          instruction,
          ...(command.slice(1) as number[]).map((value: number, i) => {
            if (!(i % 2)) return interpolateX(value);
            return interpolateY(value);
          }),
        ];
    }
  }) as PathArray;
};

export default interpolatePath;
