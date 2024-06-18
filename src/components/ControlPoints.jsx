import React from "react";

const ControlPoints = ({ points, m, showLabel }) => {
  return (
    <>
      {points.map((point, index) => {
        const columns = m + 1;
        const i = Math.floor(index / columns);
        const j = index % columns;
        return (
          <mesh key={index} position={[point[0], point[1], point[2]]}>
            <mesh
              onPointerOver={(event) => {
                event.stopPropagation();
                showLabel([point[0], point[1], point[2], i, j]);
              }}
              onPointerOut={(event) => {
                event.stopPropagation();
                showLabel(null);
              }}
              visible={false}
            >
              <sphereGeometry args={[0.25, 12, 12]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#e4ff1a" />
            </mesh>
          </mesh>
        );
      })}
    </>
  );
};

export default ControlPoints;
