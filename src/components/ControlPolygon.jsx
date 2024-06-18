import React, { useMemo } from "react";
import * as THREE from "three";

const ControlLine = ({ pointA, pointB }) => {
  const length = useMemo(() => {
    const vecA = new THREE.Vector3(...pointA);
    const vecB = new THREE.Vector3(...pointB);
    return vecA.distanceTo(vecB);
  }, [pointA, pointB]);
  const midPoint = useMemo(() => {
    const vecA = new THREE.Vector3(...pointA);
    const vecB = new THREE.Vector3(...pointB);
    return vecA.add(vecB).multiplyScalar(0.5);
  }, [pointA, pointB]);

  const orientation = useMemo(() => {
    const vecA = new THREE.Vector3(...pointA);
    const vecB = new THREE.Vector3(...pointB);
    const direction = vecB.clone().sub(vecA).normalize();
    const axis = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    const angle = Math.acos(new THREE.Vector3(0, 1, 0).dot(direction));
    const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    return quaternion;
  }, [pointA, pointB]);

  return (
    <mesh
      position={[midPoint.x, midPoint.y, midPoint.z]}
      quaternion={orientation}
      castShadow
    >
      <cylinderGeometry args={[0.01, 0.01, length, 8]} />
      <meshBasicMaterial color="#ff8800" />
    </mesh>
  );
};

const ControlPolygon = ({ points, n, m }) => {
  const len = (n + 1) * (m + 1);
  return (
    <>
      {Array.from(
        points,
        (_, index) =>
          index + m + 1 < len && (
            <ControlLine
              key={index}
              pointA={points[index]}
              pointB={points[index + m + 1]}
            />
          )
      )}

      {Array.from(
        points,
        (_, index) =>
          (index + 1) % (m + 1) !== 0 && (
            <ControlLine
              key={index + len}
              pointA={points[index]}
              pointB={points[index + 1]}
            />
          )
      )}
    </>
  );
};

export default ControlPolygon;
