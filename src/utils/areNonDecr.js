function isNonDecreasing(arr) {
  if (!arr.length) return false;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}

export function areBothArraysNonDecreasing(arr1, arr2) {
  return isNonDecreasing(arr1) && isNonDecreasing(arr2);
}
