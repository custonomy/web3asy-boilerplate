import { OutlinedInput } from "@mui/material";
import { styled } from "@mui/system";

const RoundedTextField = styled(OutlinedInput)({
  [`& fieldset`]: {
    borderRadius: 30,
  },
});

export default RoundedTextField;
