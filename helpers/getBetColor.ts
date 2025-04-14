export function getBetColor(value: number) {
  switch (true) {
    case value < 200:
      return "#F59451";
    case value < 300:
      return "#A1E4F9";
    case value < 500:
      return "#DECCFB";
    default:
      return "#FFE8A3";
  }
}
