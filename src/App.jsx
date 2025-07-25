import { Canvas } from "@react-three/fiber";
import NURBS from "./components/NURBS";
import DegreeInput from "./components/DegreeInput";
import "./App.css";
import { Box, Tab, Tabs, Typography, TextField, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { degreesToRadians } from "./utils/convertAngle";
import { getRandomNumber } from "./utils/getRandomNumber";
import { areBothArraysNonDecreasing } from "./utils/areNonDecr";
import { createMatrix } from "./utils/createMatrix";
import { Button } from "@mui/material";
import NumberedAxes from "./components/NumberedAxes ";
import ControlPolygon from "./components/ControlPolygon";
import ControlPoints from "./components/ControlPoints";
import ShowLabel from "./components/ShowLabel";
import Wvector from "./components/Wvector";
import LatexBox from "./components/LatexBox";
import circleImg from "./assets/circle.png";
import "normalize.css";

const App = () => {
  const [n, setN] = useState(-1);
  const [m, setM] = useState(-1);
  const [p, setP] = useState(-1);
  const [q, setQ] = useState(-1);
  const [U, setU] = useState([]);
  const [V, setV] = useState([]);
  const [points, setPoints] = useState([]);
  const [pointsMatrix, setPointsMatrix] = useState(null);
  const [d, setD] = useState(2);
  const [w, setW] = useState([1, 1.5, 0.5]);
  const [visiblePoint, setVisiblePoint] = useState(null);
  const [showW, setShowW] = useState(false);
  const [value, setValue] = useState(0);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#284b63",
      },
    },
    typography: {
      fontFamily: "Pacifico, cursive",
    },
  });

  
  const switchTabs = (event, newValue) => {
    if (n !== -1 && !newValue) {
      setP(n);
    }
    if (m !== -1 && !newValue) {
      setQ(m);
    }
    setValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
      sx: {
        textTransform: "none",
        fontSize: "1.8rem",
        fontFamily: "Georgia, sans-serif",
      },
    };
  }

  const handleNChange = (event) => {
    const newValue = event.target.value;
    if (Number(newValue) >= 1) {
      if (value === 0 || (p === -1 && value === 0) || p > newValue)
        setP(parseInt(Number(newValue)));
      setN(parseInt(Number(newValue)));
    } else if (newValue == "") {
      setN(-1);
      setP(-1);
    } else {
      if (value === 0 || p === -1) setP(1);
      setN(1);
    }
  };
  const handleMChange = (event) => {
    const newValue = event.target.value;
    if (Number(newValue) >= 1) {
      if (value === 0 || (q === -1 && value === 0) || q > newValue)
        setQ(parseInt(Number(newValue)));
      setM(parseInt(Number(newValue)));
    } else if (newValue == "") {
      setM(-1);
      setQ(-1);
    } else {
      if (value === 0 || q === -1) setQ(1);
      setM(1);
    }
  };
  const handlePChange = (event) => {
    const newValue = event.target.value;
    if (Number(newValue) >= n) {
      setP(parseInt(Number(n)));
    } else if (Number(newValue) >= 1) {
      setP(parseInt(Number(newValue)));
    } else if (newValue == "") {
      setP(-1);
    } else {
      setP(1);
    }
  };
  const handleQChange = (event) => {
    const newValue = event.target.value;
    if (Number(newValue) >= m) {
      setQ(parseInt(Number(m)));
    } else if (Number(newValue) >= 1) {
      setQ(parseInt(Number(newValue)));
    } else if (newValue == "") {
      setQ(-1);
    } else {
      setQ(1);
    }
  };
  const handleDChange = (event) => {
    const newValue = event.target.value;
    event.target.value = "";
    setD(Number(newValue));
  };
  const handleWChange = (event, i) => {
    const newValue = event.target.value;
    event.target.value = "";
    const newW = [...w];
    newW[i] = Number(newValue);
    setW(newW);
  };
  const changePoint = (event, i, j, coord) => {
    const pos = i * (m + 1) + j,
      newValue = event.target.value;
    event.target.value = "";
    const newVisiblePoint = [...visiblePoint];
    newVisiblePoint[coord] = Number(newValue);
    setVisiblePoint(newVisiblePoint);
    const newPoints = [...points];
    newPoints[pos][coord] = Number(newValue);
    if (value === 4) {
      if (coord < 3)
        newPoints[pos + 1][coord] = Number(newValue) + d * w[coord];
      else newPoints[pos + 1][coord] = Number(newValue);
    }
    if (value === 6) {
      if (coord == 0) {
        const d = newPoints[pos][coord];
        newPoints[pos + m + 1][0] = d;
        newPoints[pos + m + 1][1] = d;

        newPoints[pos + 2 * (m + 1)][1] = d;

        newPoints[pos + 3 * (m + 1)][0] = -d;
        newPoints[pos + 3 * (m + 1)][1] = d;

        newPoints[pos + 4 * (m + 1)][0] = -d;

        newPoints[pos + 5 * (m + 1)][0] = -d;
        newPoints[pos + 5 * (m + 1)][1] = -d;

        newPoints[pos + 6 * (m + 1)][1] = -d;

        newPoints[pos + 7 * (m + 1)][0] = d;
        newPoints[pos + 7 * (m + 1)][1] = -d;

        newPoints[pos + 8 * (m + 1)][0] = d;
      } else if (coord === 2) {
        const h = newPoints[pos][coord];
        for (let t = 1; t <= 8; t++) {
          newPoints[pos + t * (m + 1)][2] = h;
        }
      } else if (coord === 3) {
        const w = newPoints[pos][coord];
        for (let t = 1; t <= 8; t++) {
          newPoints[pos + t * (m + 1)][3] = w * (t % 2 == 1 ? 0.7 : 1);
        }
      }
    }
    setPoints(newPoints);
  };
  const changeKnotU = (event, ind) => {
    const newKnot = Number(event.target.value);
    event.target.value = "";
    const newU = [...U];
    newU[ind] = newKnot;
    setU(newU);
  };
  const changeKnotV = (event, ind) => {
    const newKnot = Number(event.target.value);
    event.target.value = "";
    const newV = [...V];
    newV[ind] = newKnot;
    setV(newV);
  };

  useEffect(() => {
    const calculateControlPoints = () => {
      const factor = value === 3 ? 4 : 2;
      const factorY = value === 5 ? 4 : 1;
      const newPoints = [];
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
          let c0, c1, c2, c3;
          const halfN = n / 2;
          const halfM = m / 2;
          if (value === 4) {
            if (j === 0) {
              c0 = parseFloat(
                (factor * (-halfN + i + getRandomNumber(-0.45, 0.45))).toFixed(
                  2
                )
              );
              c1 = parseFloat(
                (8 * (-halfM + j + getRandomNumber(-0.45, 0.45))).toFixed(2)
              );
              c2 = parseFloat(getRandomNumber(-0.5, 3.5).toFixed(2));
              c3 = 1;
            } else if (j === 1) {
              const lastPoint = newPoints[i * (m + 1) + j - 1];
              c0 = lastPoint[0] + d * w[0];
              c1 = lastPoint[1] + d * w[1];
              c2 = lastPoint[2] + d * w[2];
              c3 = lastPoint[3];
            }
          } else if (value === 6) {
            if (i === 0) {
              c0 = parseFloat(getRandomNumber(0, 3.5)).toFixed(2);
              c1 = 0;
              c2 = parseFloat(j * getRandomNumber(0.85, 1.15)).toFixed(2);
              c3 = 1;
            } else if (i === 1) {
              const d = parseFloat(Math.abs(newPoints[j][0])).toFixed(2);
              c0 = c1 = d;
              c2 = newPoints[j][2];
              c3 = parseFloat(newPoints[j][3] * 0.7).toFixed(2);
            } else if (i === 2) {
              const d = parseFloat(Math.abs(newPoints[j][0])).toFixed(2);
              c0 = 0;
              c1 = d;
              c2 = newPoints[j][2];
              c3 = newPoints[j][3];
            } else if (i === 3) {
              const d = parseFloat(Math.abs(newPoints[j][0])).toFixed(2);
              c0 = -d;
              c1 = d;
              c2 = newPoints[j][2];
              c3 = parseFloat(newPoints[j][3] * 0.7).toFixed(2);
            } else if (i === 4) {
              const d = parseFloat(Math.abs(newPoints[j][0])).toFixed(2);
              c0 = -d;
              c1 = 0;
              c2 = newPoints[j][2];
              c3 = newPoints[j][3];
            } else if (i === 5) {
              const d = parseFloat(Math.abs(newPoints[j][0])).toFixed(2);
              c0 = -d;
              c1 = -d;
              c2 = newPoints[j][2];
              c3 = parseFloat(newPoints[j][3] * 0.7).toFixed(2);
            } else if (i === 6) {
              const d = parseFloat(Math.abs(newPoints[j][0])).toFixed(2);
              c0 = 0;
              c1 = -d;
              c2 = newPoints[j][2];
              c3 = newPoints[j][3];
            } else if (i === 7) {
              const d = parseFloat(Math.abs(newPoints[j][0])).toFixed(2);
              c0 = d;
              c1 = -d;
              c2 = newPoints[j][2];
              c3 = parseFloat(newPoints[j][3] * 0.7).toFixed(2);
            } else if (i === 8) {
              const d = parseFloat(Math.abs(newPoints[j][0])).toFixed(2);
              c0 = d;
              c1 = 0;
              c2 = newPoints[j][2];
              c3 = newPoints[j][3];
            }
          } else {
            c0 = parseFloat(
              (factor * (-halfN + i + getRandomNumber(-0.45, 0.45))).toFixed(2)
            );
            c1 = parseFloat(
              (
                factor *
                factorY *
                (-halfM + j + getRandomNumber(-0.45, 0.45))
              ).toFixed(2)
            );
            c2 = parseFloat(getRandomNumber(-0.5, 3.5).toFixed(2));
            c3 = 1;
          }
          newPoints.push([Number(c0), Number(c1), Number(c2), Number(c3)]);
        }
      }
      setPoints(newPoints);
      if (value === 6)
        setU([0, 0, 0, 0.25, 0.25, 0.5, 0.5, 0.75, 0.75, 1, 1, 1]);
    };

    calculateControlPoints();
  }, [n, m]);

  (value === 0 || value === 1) && points.forEach((point) => (point[3] = 1));

  useEffect(() => {
    setPointsMatrix(createMatrix(points, n, m));
  }, [points]);

  useEffect(() => {
    if (value !== 6) {
      if (n !== -1 && p !== -1) {
        const vectorU = [];
        for (let i = 0; i <= n + p + 1; i++) {
          if (i <= p) vectorU.push(0);
          else if (i >= n + 1) vectorU.push(1);
          else vectorU.push(parseFloat((i - p) * (1 / (n - p + 1)).toFixed(2)));
        }
        setU(vectorU);
      }
    }
  }, [p, n]);
  useEffect(() => {
    if (m !== -1 && q !== -1) {
      const vectorV = [];
      for (let i = 0; i <= m + q + 1; i++) {
        if (i <= q) vectorV.push(0);
        else if (i >= m + 1) vectorV.push(1);
        else vectorV.push(parseFloat((i - q) * (1 / (m - q + 1)).toFixed(2)));
      }
      setV(vectorV);
    }
  }, [q, m]);
  const pointsToRender = points.map((point) => [
      Number(point[0]),
      Number(point[1]),
      Number(point[2]),
    ]),
    weightsToRender = points.map((point) => Number(point[3]));
  useEffect(() => {
    if (value === 3) {
      setN(1);
      setM(1);
      setP(1);
      setQ(1);
    } else if (value === 4) {
      if (m === 1) setN((prev) => prev + 1);
      setM(1);
      setQ(1);
    } else if (value === 5) {
      setM(1);
      setQ(1);
      if (m === 1) setN((prev) => prev + 1);
    } else if (value === 6) {
      setU([0, 0, 0, 0.25, 0.25, 0.5, 0.5, 0.75, 0.75, 1, 1, 1]);
      setN(8);
      setP(2);
      m === -1
        ? (() => {
            setM(1);
            setQ(1);
          })()
        : setM((prev) => prev + 1);
    }
    if (value !== 4) setShowW(false);
  }, [value]);
  useEffect(() => {
    const newPoints = [];
    for (let i = 0; i < (n + 1) * (m + 1); i++) {
      if (i % 2 === 0) {
        newPoints.push(points[i]);
      } else {
        newPoints.push([
          points[i - 1][0] + d * w[0],
          points[i - 1][1] + d * w[1],
          points[i - 1][2] + d * w[2],
          points[i - 1][3],
        ]);
      }
    }
    setPoints(newPoints);
  }, [d, w]);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: "30px",
          }}
        >
          <Typography
            sx={{
              fontSize: "3rem",
              color: "primary.main",
              fontWeight: "bold",
              textShadow: "2px 1px 1px #13505b",
            }}
          >
            NURBS Surface Visualizer
          </Typography>
        </Box>
        <Box sx={{ width: "100%", mb: "20px" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={switchTabs}
              aria-label="surfaces"
              sx={{
                "& .MuiTabs-flexContainer": {
                  justifyContent: "space-around",
                },
              }}
            >
              <Tab label="Bézier" {...a11yProps(0)} />
              <Tab label="B-spline" {...a11yProps(1)} />
              <Tab label="NURBS" {...a11yProps(2)} />
              <Tab label="Bilinear" {...a11yProps(3)} />
              <Tab label="Extruded" {...a11yProps(4)} />
              <Tab label="Ruled" {...a11yProps(5)} />
              <Tab label="Revolution" {...a11yProps(6)} />
            </Tabs>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            height: "calc(100vh - 200px)",
          }}
        >
          <Box sx={{ width: "50%", border: "3px solid black" }}>
            <Canvas>
              <PerspectiveCamera makeDefault position={[15, 8, 13]} />
              <OrbitControls />
              <NumberedAxes lengthX={8} lengthY={8} lengthZ={4} />
              <gridHelper args={[20, 20, 0x888888]} rotation-x={Math.PI / 2} />
              {p !== -1 && q !== -1 && (
                <>
                  <ControlPolygon points={pointsToRender} n={n} m={m} />
                  <ControlPoints
                    points={pointsToRender}
                    m={m}
                    showLabel={setVisiblePoint}
                  />
                </>
              )}
              <ShowLabel point={visiblePoint} />
              {showW && <Wvector endPoint={w} />}
              {n !== -1 &&
                m !== -1 &&
                p !== -1 &&
                q !== -1 &&
                areBothArraysNonDecreasing(U, V) &&
                pointsToRender.length &&
                weightsToRender.length && (
                  <NURBS
                    n={n}
                    m={m}
                    p={p}
                    q={q}
                    U={U}
                    V={V}
                    points={pointsToRender}
                    weights={weightsToRender}
                  />
                )}
              <ambientLight intensity={0.7} castShadow />
              <spotLight
                args={["#fff", 1.5, 8, degreesToRadians(120), 0.4]}
                intensity={60}
                position={[0, 0, 6]}
              />
            </Canvas>
            <Box sx={{ mt: "50px", fontSize: "2.4rem", color: "#284b63" }}>
              {value === 0 && (
                <>
                  <LatexBox
                    tex={
                      "$\\text{Definition of a Bézier surface of degree }(n,m)$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$S(u,v)=\\displaystyle\\sum_{i=0}^{n}\\displaystyle\\sum_{j=0}^{m}B^i_n(u)B^j_m(v)P_{i,j}\\hspace{2cm}u,v \\in [0,1]$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$B_n^i(u) = C_n^i u^i (1 - u)^{n - i} \\rightarrow \\text{the Bernstein polynomial}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{which acts as a weighting function for the control points}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$P_{i,j} \\rightarrow \\text{the control points forming the control polygon}$"
                    }
                  />
                  <hr color="#284b63" />
                  <LatexBox
                    tex={"It is the special case of the NURBS surface where"}
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow$ the degree is determined by the number of points"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow$ consequently, the knot vector has 2 knots of multiplicity $n+1$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow$ if rational, all the weights have the same value"
                    }
                  />
                </>
              )}
              {value === 1 && (
                <>
                  <LatexBox
                    tex={
                      "$\\text{Definition of a B-spline surface of degree }(p,q)$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$S(u,v)=\\displaystyle\\sum_{i=0}^n\\displaystyle\\sum_{j=0}^mN^i_p(u)N^j_q(v)P_{i,j}\\hspace{2cm}u \\text{ and } v \\text{ traverse } U \\text{ and } V \\text{, respectively}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$N_p^i(u) \\rightarrow \\text{the B-spline basis function in the $u-$direction}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{defined recursively on its corresponding non-decresing knot vector $U$}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$N_q^j(v)\\rightarrow \\text{ has an analogous definition}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$P_{i,j} \\rightarrow \\text{the control points forming the control polygon}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{The degrees in each direction, }p \\text{ and } q \\text{, are chosen as needed}$"
                    }
                  />
                  <hr color="#284b63" />
                  <LatexBox
                    tex={"It is the polynomial form of the NURBS surface"}
                  />
                  <LatexBox tex={"having the same value for all the weights"} />
                </>
              )}
              {value === 2 && (
                <>
                  <LatexBox
                    tex={
                      "$\\text{Definition of a NURBS surface of degree }(p,q)$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$S(u,v)=\\frac{\\displaystyle\\sum_{i=0}^n\\sum_{j=0}^mN^i_p(u)N^j_q(v)w_{i,j}P_{i,j}}{\\displaystyle\\sum_{i=0}^n\\sum_{j=0}^mN^i_p(u)N^j_q(v)w_{i,j}}\\hspace{2cm}u \\text{ and } v \\text{ traverse } U \\text{ and } V \\text{, respectively}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$N_p^i(u) \\rightarrow \\text{the B-spline basis function in the $u-$direction}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{defined recursively on its corresponding non-decresing knot vector $U$}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$N_q^j(v)\\rightarrow \\text{ has an analogous definition}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$P_{i,j} \\rightarrow \\text{the control points forming the control polygon}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{The degrees in each direction, }p \\text{ and } q \\text{, are chosen as needed}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{The weight $w_{i,j}$ defines the relative influence of its associated control point $P_{i,j}$}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{with higher weights indicating stronger influence}$"
                    }
                  />
                </>
              )}
              {value === 3 && (
                <>
                  <LatexBox
                    tex={
                      "$\\text{Definition of a Bilinear surface using NURBS}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{It is represented by 4 points $P_{0,0},P_{1,0},P_{0,1},P_{1,1}$ not all necessarily coplanar}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{We create a bilinear interpolation between $P_{0,0}P_{1,0}$, $P_{0,1}P_{1,1}$, $P_{0,0}P_{0,1}$, $P_{1,0}P_{1,1}$}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{with the help of the following NURBS interpretation of our (non-rational) surface}$"
                    }
                  />

                  <LatexBox
                    tex={
                      "$S(u,v)=\\displaystyle\\sum_{i=0}^1\\sum_{j=0}^1N^i_1(u)N^j_1(v)P_{i,j}$"
                    }
                  />
                </>
              )}
              {value === 4 && (
                <>
                  <LatexBox
                    tex={
                      "$\\text{Definition of an Extruded surface using NURBS}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{We form this general cylinder representation using the NURBS curve $C(u)$}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{defined by $P_{i,0}$ control points, $w_{i,0}$ weights, degree $p$ and knot vector $U$ by}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{sweeping it a distance $d$ along the vector $W$}$"
                    }
                  />

                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{We represent the Extruded surface with a NURBS surface by setting}$"
                    }
                  />
                  <LatexBox
                    tex={"$\\bullet\\text{ $P_{i,0}=P_i$, $P_{i,1}=P_i+dW$}$"}
                  />
                  <LatexBox tex={"$\\bullet\\text{ $w_{i,0}=w_{i,1}=w_i$}$"} />
                  <LatexBox tex={"$\\bullet\\text{ $m=q=1$}$"} />
                </>
              )}
              {value === 5 && (
                <>
                  <LatexBox
                    tex={"$\\text{Definition of a Ruled surface using NURBS}$"}
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{It is represented by a linear interpolation between two NURBS curves $C_1(u)$ and $C_2(u)$}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{which share the same knot vector $U$, same degree $p$ and the same number of control points }$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{We use the control points of these 2 curve to form the corresponding NURBS surface}$"
                    }
                  />
                  <LatexBox tex={"$\\text{and set $m=q=1$ }$"} />
                </>
              )}
              {value === 6 && (
                <>
                  <LatexBox
                    tex={
                      "$\\text{Definition of a Revolution surface using NURBS}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{We first choose our generatrix NURBS curve $C(v)$ in the $v-$direction}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\text{that is located in $xOz$ plane and perform a rotation about the $z-$axis}$"
                    }
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{Then for each point of our curve we form the corresponding circle}$"
                    }
                  />
                  <LatexBox
                    tex={"$\\text{around $z-$axis in the following way}$"}
                  />
                  <img
                    style={{
                      height: "250px",
                      borderRadius: "10px",
                    }}
                    src={circleImg}
                    alt="Example"
                  />
                  <LatexBox
                    tex={
                      "$\\rightarrow\\text{Also, we need to set $n=8,p=2,U={0, 0, 0, \\frac{1}{4}, \\frac{1}{4}, \\frac{1}{2}, \\frac{1}{2}, \\frac{3}{4}, \\frac{3}{4}, 1, 1, 1}$}$"
                    }
                  />
                  <LatexBox
                    tex={"$\\text{for the circle to be constructed correctly}$"}
                  />
                </>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "0 20px",
              width: "50%",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <Box>
                <DegreeInput
                  isBez={false || value === 3 || value === 6}
                  value={n}
                  label="Set n"
                  handleChange={handleNChange}
                />
                <DegreeInput
                  isBez={false || value === 3 || value === 4 || value === 5}
                  value={m}
                  label="Set m"
                  handleChange={handleMChange}
                />
              </Box>
              <Box>
                <DegreeInput
                  isBez={value === 0 || value === 3 || value === 6}
                  value={p}
                  label="Set p"
                  handleChange={handlePChange}
                />
                <DegreeInput
                  isBez={
                    value === 0 || value === 3 || value === 4 || value === 5
                  }
                  value={q}
                  label="Set q"
                  handleChange={handleQChange}
                />
                {value === 4 && (
                  <>
                    <TextField
                      value={d}
                      type="number"
                      label="Set d"
                      variant="standard"
                      inputProps={{ min: 0, step: 0.5 }}
                      onChange={handleDChange}
                      onKeyPress={(event) => {
                        if (event.key === "-" || event.key === "+") {
                          event.preventDefault();
                        }
                        if (event.key === "Enter") {
                          event.target.blur();
                        }
                      }}
                      sx={{
                        width: 45,
                        m: "0 12px",
                        "& .MuiInputBase-input": {
                          fontSize: "2rem",
                          textAlign: "center",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "1.7rem",
                        },
                      }}
                    />
                    {w.map((val, i) => {
                      const labels = ["x", "y", "z"];
                      return (
                        <TextField
                          key={i}
                          value={val}
                          type="number"
                          label={`Set W${labels[i]}`}
                          variant="standard"
                          inputProps={{ step: 0.2 }}
                          onKeyDown={(event) => {
                            if (event.key === "-") {
                              event.preventDefault();
                              const newValue = -val;
                              handleWChange({ target: { value: newValue } }, i);
                            }
                          }}
                          onMouseLeave={() => document.activeElement.blur()}
                          onChange={(event) => handleWChange(event, i)}
                          sx={{
                            width: 47,
                            m: "0 12px",
                            "& .MuiInputBase-input": {
                              fontSize: "2rem",
                              textAlign: "center",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "1.7rem",
                            },
                          }}
                        />
                      );
                    })}
                  </>
                )}
                {value === 4 && (
                  <Button
                    sx={{ height: 70, weight: 40 }}
                    onClick={() => setShowW(!showW)}
                  >
                    <Typography
                      sx={{ fontWeight: "bold", textTransform: "none" }}
                    >
                      {showW ? "Don't show W" : "Show W"}
                    </Typography>
                  </Button>
                )}
              </Box>
            </Box>
            <Box>
              {pointsMatrix &&
                pointsMatrix.map((row, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                        mt: "20px",
                      }}
                    >
                      <>
                        {row.map((point, j) => (
                          <Box
                            key={j}
                            sx={{
                              display:
                                (value === 4 && j === 1) ||
                                (value === 6 && i !== 0)
                                  ? "none"
                                  : "flex",
                              flexDirection: "column",
                            }}
                            onMouseEnter={() => {
                              setVisiblePoint([
                                pointsMatrix[i][j][0],
                                pointsMatrix[i][j][1],
                                pointsMatrix[i][j][2],
                                null,
                                i,
                                j,
                              ]);
                            }}
                            onMouseLeave={() => setVisiblePoint(null)}
                          >
                            <Paper
                              sx={{
                                textAlign: "center",
                                backgroundColor: "#55917f",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold" }}
                              >
                                P
                                <sub>
                                  {i},{j}
                                </sub>
                              </Typography>
                            </Paper>
                            {point.map((coord, index) => {
                              const labels = ["x", "y", "z", "w"];
                              return (
                                <TextField
                                  label={labels[index]}
                                  type="number"
                                  key={index}
                                  value={Number(coord)}
                                  disabled={
                                    (index == 3 &&
                                      (value === 0 ||
                                        value === 1 ||
                                        value === 3)) ||
                                    (value === 6 && index === 1)
                                  }
                                  onChange={(event) =>
                                    changePoint(event, i, j, index)
                                  }
                                  inputProps={{ step: index === 3 ? 1 : 0.1 }}
                                  onKeyDown={(event) => {
                                    if (event.key === "-") {
                                      event.preventDefault();
                                      const newValue = -Number(coord);
                                      changePoint(
                                        { target: { value: newValue } },
                                        i,
                                        j,
                                        index
                                      );
                                    }
                                  }}
                                  onMouseLeave={() =>
                                    document.activeElement.blur()
                                  }
                                  sx={{
                                    width: 50,
                                    "& .MuiInputBase-input": {
                                      fontSize: "1.3rem",
                                      textAlign: "center",
                                      padding: "1px",
                                    },
                                    "& .MuiInputLabel-root": {
                                      fontSize: "1.2rem",
                                      mb: "2px",
                                      pl: "3px",
                                    },
                                    "& .MuiInputLabel-shrink": {
                                      transform:
                                        "translate(38px, 5px) scale(0.75)",
                                    },
                                    "&:hover .MuiInputLabel-root": {
                                      display: "none",
                                    },
                                  }}
                                />
                              );
                            })}
                          </Box>
                        ))}
                      </>
                    </Box>
                  </Box>
                ))}
            </Box>
            <Box
              sx={{
                mt: "30px",
                display: U.length && V.length ? "flex" : "none",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h6">U=</Typography>
              {U.length &&
                U.map((knot, index) => {
                  return (
                    <TextField
                      type="number"
                      key={index}
                      value={knot}
                      disabled={value === 0 || value === 3 || value === 6}
                      onChange={(event) => changeKnotU(event, index)}
                      onBlur={() => {
                        const newKnot = knot;
                        if (index + 1 < U.length && U[index + 1] < newKnot)
                          changeKnotU(
                            { target: { value: U[index + 1] } },
                            index
                          );
                        else if (index - 1 >= 0 && U[index - 1] > newKnot)
                          changeKnotU(
                            { target: { value: U[index - 1] } },
                            index
                          );
                      }}
                      inputProps={{ step: 0.01 }}
                      onMouseLeave={() => document.activeElement.blur()}
                      sx={{
                        width: 45,
                        "& .MuiInputBase-input": {
                          fontSize: "1.3rem",
                          textAlign: "center",
                          padding: "1px",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "1.2rem",
                          mb: "2px",
                        },
                        "& .MuiInputLabel-shrink": {
                          transform: "translate(60px, 5px) scale(0.75)",
                        },
                        "&:hover .MuiInputLabel-root": {
                          display: "none",
                        },
                      }}
                    />
                  );
                })}
            </Box>
            <Box
              sx={{
                mt: "20px",
                display: V.length && U.length ? "flex" : "none",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h6">V=</Typography>
              {V.length &&
                V.map((knot, index) => {
                  return (
                    <TextField
                      type="number"
                      key={index}
                      value={knot}
                      disabled={
                        value === 0 || value === 3 || value === 4 || value === 5
                      }
                      onChange={(event) => changeKnotV(event, index)}
                      onBlur={() => {
                        const newKnot = knot;
                        if (index + 1 < V.length && V[index + 1] < newKnot)
                          changeKnotV(
                            { target: { value: V[index + 1] } },
                            index
                          );
                        else if (index - 1 >= 0 && V[index - 1] > newKnot)
                          changeKnotV(
                            { target: { value: V[index - 1] } },
                            index
                          );
                      }}
                      inputProps={{ step: 0.01 }}
                      onMouseLeave={() => document.activeElement.blur()}
                      sx={{
                        width: 45,
                        "& .MuiInputBase-input": {
                          fontSize: "1.3rem",
                          textAlign: "center",
                          padding: "1px",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "1.2rem",
                          mb: "2px",
                        },
                        "& .MuiInputLabel-shrink": {
                          transform: "translate(60px, 5px) scale(0.75)",
                        },
                        "&:hover .MuiInputLabel-root": {
                          display: "none",
                        },
                      }}
                    />
                  );
                })}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
