import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

function LatexBox({ tex }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const renderMathJax = async () => {
      if (!containerRef.current) return;

      // Configure MathJax
      window.MathJax = {
        tex: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
          ],
          processEscapes: true,
          processEnvironments: true,
          packages: { "[+]": ["ams"] },
        },
        svg: {
          fontCache: "global",
        },
      };

      // Load MathJax
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      script.async = true;
      script.onload = () => {
        window.MathJax.typesetPromise([containerRef.current]);
      };
      document.head.appendChild(script);

      // Clean up script
      return () => {
        document.head.removeChild(script);
      };
    };

    renderMathJax();
  }, [tex]);

  // Replace \n with LaTeX syntax for line breaks
  const formattedTex = tex.replace(/\n/g, ` \\\\ `);

  return (
    <Box
      ref={containerRef}
      sx={{
        padding: 2,
        borderRadius: 1,
        display: "flex",
      }}
    >
      <div>{formattedTex}</div>
    </Box>
  );
}

export default LatexBox;
