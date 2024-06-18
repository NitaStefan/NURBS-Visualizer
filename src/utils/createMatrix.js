export function createMatrix(points, n, m) {
  if ((n + 1) * (m + 1) !== points.length) {
    throw new Error(
      "Invalid array length. Expected elements matching (n+1)*(m+1)"
    );
  }
  const matrix = [];
  for (let i = 0; i <= n; i++) {
    matrix[i] = [];
  }
  let index = 0;
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      matrix[i][j] = points[index];
      index++;
    }
  }

  return matrix;
}
