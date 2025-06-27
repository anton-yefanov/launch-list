export function formatNumber(num: number) {
  if (num >= 1000000) {
    return Math.floor(num / 1000000) + "M";
  } else if (num >= 1000) {
    return Math.floor(num / 1000) + "k";
  } else {
    return num.toString();
  }
}
