import { TextField } from "@mui/material";

const DegreeInput = ({ handleChange, label, value, isBez }) => {
  return (
    <TextField
      disabled={isBez}
      value={value !== -1 ? value : ""}
      type="number"
      label={label}
      variant="standard"
      inputProps={{ min: 1 }}
      onChange={handleChange}
      autoComplete="off"
      onKeyPress={(event) => {
        if (event.key === "-" || event.key === "+") {
          event.preventDefault();
        }
        if (event.key === "Enter") {
          event.target.blur();
        }
      }}
      sx={{
        width: 80,
        m: "0 20px",
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
};

export default DegreeInput;
