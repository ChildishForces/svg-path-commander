type RangeTuple = [number, number];

/**
 * Scale a value in range [oldMin, oldMax] to the scale [newMin, newMax].
 *
 * @param inputRange {RangeTuple}
 * @param outputRange {RangeTuple}
 * @return {(value: number) => number}
 */
const interpolate = (inputRange: RangeTuple, outputRange: RangeTuple) => {
  const [minInput, maxInput] = inputRange;
  const [minOutput, maxOutput] = outputRange;
  const slope = (maxOutput - minOutput) / (maxInput - minInput);
  return (x: number): number => minOutput + slope * (x - minInput);
};

export default interpolate;
