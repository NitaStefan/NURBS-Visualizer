import * as THREE from "three";
import React, { useMemo } from "react";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

function findSpan(n, p, u, U) {
  if (u >= U[n + 1]) {
    return n;
  }
  if (u <= U[p]) {
    return p;
  }
  let low = p;
  let high = n + 1;
  let mid = Math.floor((low + high) / 2);
  while (u < U[mid] || u >= U[mid + 1]) {
    if (u < U[mid]) {
      high = mid;
    } else {
      low = mid;
    }
    mid = Math.floor((low + high) / 2);
  }
  return mid;
}

function basisFunctions(i, u, p, U) {
  const N = new Array(p + 1).fill(0);
  const left = new Array(p + 1).fill(0);
  const right = new Array(p + 1).fill(0);
  N[0] = 1.0;
  for (let j = 1; j <= p; j++) {
    left[j] = u - U[i + 1 - j];
    right[j] = U[i + j] - u;
    let saved = 0.0;
    for (let r = 0; r < j; r++) {
      const temp = N[r] / (right[r + 1] + left[j - r]);
      N[r] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }
    N[j] = saved;
  }
  return N;
}

export default function NURBS({ n, m, p, q, U, V, points, weights }) {
  const surfaceFunction = useMemo(() => {
    return (uu, vv, target) => {
      const u = U[0] + uu * (U[U.length - 1] - U[0]);
      const v = V[0] + vv * (V[V.length - 1] - V[0]);

      const spanU = findSpan(n, p, u, U);
      const spanV = findSpan(m, q, v, V);

      const Nu = basisFunctions(spanU, u, p, U);
      const Nv = basisFunctions(spanV, v, q, V);

      const temp = new Array(q + 1).fill([0, 0, 0, 0]);
      for (let l = 0; l <= q; l++) {
        for (let k = 0; k <= p; k++) {
          const index = (spanU - p + k) * (m + 1) + (spanV - q + l);
          const point = points[index];
          const weight = weights[index];
          temp[l] = [
            temp[l][0] + Nu[k] * point[0] * weight,
            temp[l][1] + Nu[k] * point[1] * weight,
            temp[l][2] + Nu[k] * point[2] * weight,
            temp[l][3] + Nu[k] * weight,
          ];
        }
      }

      let Sw = [0, 0, 0, 0];
      for (let l = 0; l <= q; l++) {
        Sw = [
          Sw[0] + Nv[l] * temp[l][0],
          Sw[1] + Nv[l] * temp[l][1],
          Sw[2] + Nv[l] * temp[l][2],
          Sw[3] + Nv[l] * temp[l][3],
        ];
      }

      const x = Sw[0] / Sw[3];
      const y = Sw[1] / Sw[3];
      const z = Sw[2] / Sw[3];

      target.set(x, y, z);
    };
  }, [n, m, p, q, U, V, points, weights]);

  const geometry = useMemo(() => {
    const divisions = 64;
    return new ParametricGeometry(surfaceFunction, divisions, divisions);
  }, [surfaceFunction]);

  return (
    <>
      <mesh geometry={geometry}>
        <meshPhongMaterial
          side={THREE.FrontSide}
          color="#0582ca"
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshPhongMaterial
          side={THREE.BackSide}
          color="#00296b"
          transparent
          opacity={0.7}
        />
      </mesh>
    </>
  );
}
