import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Wvector({ endPoint }) {
  const cylinderRef = useRef();
  const coneRef = useRef();

  useEffect(() => {
    const origin = new THREE.Vector3(0, 0, 0);
    const endPointVector = new THREE.Vector3(...endPoint);
    const dir = new THREE.Vector3().subVectors(endPointVector, origin);
    const length = dir.length();
    const midPoint = dir.clone().multiplyScalar(0.5);

    const axis = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
    const angle = Math.acos(
      new THREE.Vector3(0, 1, 0).dot(dir.clone().normalize())
    );

    if (cylinderRef.current) {
      cylinderRef.current.position.set(midPoint.x, midPoint.y, midPoint.z);
      if (!axis.equals(new THREE.Vector3(0, 0, 0))) {
        cylinderRef.current.setRotationFromAxisAngle(axis, angle);
      }
    }
    if (coneRef.current) {
      coneRef.current.position.set(
        endPointVector.x,
        endPointVector.y,
        endPointVector.z
      );
      if (!axis.equals(new THREE.Vector3(0, 0, 0))) {
        coneRef.current.setRotationFromAxisAngle(axis, angle);
      }
    }
  }, [endPoint]);

  return (
    <>
      <mesh ref={cylinderRef}>
        <cylinderGeometry
          args={[0.04, 0.04, new THREE.Vector3(...endPoint).length(), 32]}
        />
        <meshStandardMaterial color="#691e06" />
      </mesh>
      <mesh ref={coneRef}>
        <coneGeometry args={[0.1, 0.2, 32]} />
        <meshStandardMaterial color="#691e06" />
      </mesh>
    </>
  );
}
