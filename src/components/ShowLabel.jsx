import React from "react";
import { Html } from "@react-three/drei";
import { Typography } from "@mui/material";

const ShowLabel = ({ point }) => {
  if (point !== null) {
    const [x, y, z, n, i, j] = point;
    const labelPosition = [x, y, z + 0.3];

    return (
      <Html position={labelPosition} center>
        <Typography
          variant="h6"
          sx={{
            border: "1px solid black",
            p: "0 3px",
            backgroundColor: "#55917f",
            fontWeight: "bold",
            borderRadius: "10px",
          }}
        >
          P
          <sub>
            {i},{j}
          </sub>
        </Typography>
      </Html>
    );
  }
  return;
};

export default ShowLabel;
