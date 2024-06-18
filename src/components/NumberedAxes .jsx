import React from "react";
import { Billboard, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const Axis = ({ direction, label, length }) => {
  return (
    <>
      {/* Arrow */}
      <mesh
        position={[
          direction.x * length,
          direction.y * length,
          direction.z * length,
        ]}
        rotation={[
          (direction.z * Math.PI) / 2,
          0,
          -(direction.x * Math.PI) / 2,
        ]}
      >
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh
        rotation={[
          (direction.z * Math.PI) / 2,
          0,
          -(direction.x * Math.PI) / 2,
        ]}
        castShadow
      >
        <cylinderGeometry args={[0.01, 0.01, length * 2, 6]} />
        <meshBasicMaterial
          color={direction.x ? "#ffb703" : direction.y ? "#84a59d" : "#eaac8b"}
        />
      </mesh>
      {/* Label */}
      <Billboard
        position={[
          direction.x * (length + 0.5),
          direction.y * (length + 0.5),
          direction.z * (length + 1),
        ]}
      >
        <Html>
          <div style={{ color: "black", fontSize: "16px" }}>{label}</div>
        </Html>
      </Billboard>
    </>
  );
};

const NumberedAxes = ({ lengthX = 5, lengthY = 5, lengthZ = 5 }) => {
  const { camera } = useThree();
  camera.up.set(0, 0, 1);
  return (
    <>
      {/* X Axis */}
      <Axis direction={{ x: 1, y: 0, z: 0 }} label="x" length={lengthX} />
      {/* Y Axis */}
      <Axis direction={{ x: 0, y: 1, z: 0 }} label="y" length={lengthY} />
      {/* Z Axis */}
      <Axis direction={{ x: 0, y: 0, z: 1 }} label="z" length={lengthZ} />
    </>
  );
};

export default NumberedAxes;
