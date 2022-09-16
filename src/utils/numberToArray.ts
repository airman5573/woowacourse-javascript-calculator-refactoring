export default function numberToArray(num: number) {
  return `${num}`.split("").map(Number);
}
