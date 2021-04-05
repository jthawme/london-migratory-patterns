type Color = {
  r: number;
  g: number;
  b: number;
};

export const interpolate = (t, n1, n2) => {
  return (n2 - n1) * t + n1;
};

export const colorInterpolate = (t: number, color1: Color, color2: Color) => {
  return {
    r: interpolate(t, color1.r, color2.r),
    g: interpolate(t, color1.g, color2.g),
    b: interpolate(t, color1.b, color2.b),
  };
};

/**
 * Finds what would be the most relevant color
 * in a color array most likely created by
 * getInterpolatedColors
 *
 * @param {number} t
 * @param {Color[]} colorArr
 *
 * @returns Color
 */
export const getClosestColor = (t: number, colorArr: Color[]) => {
  return colorArr[Math.round((colorArr.length - 1) * t)];
};

/**
 * Creates an array of stepped colors through an array of colors
 *
 * @param {Color[]} colors
 * @param {number} granularity
 *
 * @returns {Color[]}
 */
export const getInterpolatedColors = (
  colors: Color[] = [],
  granularity = 100
): Color[] => {
  let colorStop = 1 / (colors.length - 1);
  let granularityStop = 1 / granularity;

  let colorArr = [];

  for (let i = 0; i <= 1; i += granularityStop) {
    let t = (i % colorStop) / colorStop;
    let currColorIdx = Math.floor(i / colorStop);
    colorArr.push(
      colorInterpolate(t, colors[currColorIdx], colors[currColorIdx + 1])
    );
  }

  return colorArr;
};
