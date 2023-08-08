import { Grid, TextField, Button, Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import React, { useState } from "react";
import Card from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { formatCreditCardNumber, formatExpirationDate, formatCVC, formatName, isCardNumValid, isCVCValid, isExpiryValid } from "../utils/helpers";

interface CreditCardFormProps {
  onSubmit: () => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = (props) => {
  const [credentials, setCredentials] = useState<any>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
    formData: null,
    agree: false,
  });
  const [errors, setErrors] = useState<any>({});

  const handleCallback = ({ issuer }: any, isValid: boolean) => {
    if (isValid) {
      setCredentials({ ...credentials, issuer });
    }
  };

  const handleInputFocus = ({ target }: any) => {
    setCredentials({ ...credentials, focused: target.name });
  };

  const handleInputChange = ({ target }: any) => {
    switch (target.name) {
      case "number":
        target.value = formatCreditCardNumber(target.value);
        break;
      case "expiry":
        target.value = formatExpirationDate(target.value);
        break;
      case "cvc":
        target.value = formatCVC(target.value);
        break;
      case "name":
        target.value = formatName(target.value);
        break;
      default:
        break;
    }
    const newValue = { ...credentials, [target.name]: target.value };
    setCredentials(newValue);
  };

  const handleCheckboxOnClick = () => {
    setCredentials({ ...credentials, agree: !credentials.agree });
  };

  const handleSubmit = () => {
    let newErrors: any = {};
    // if (!isCardNumValid(credentials.number)) {
    //   newErrors = { number: "Invalid card number" };
    // }
    if (!isCVCValid(credentials.cvc)) {
      newErrors = { ...newErrors, cvc: "Invalid CVC" };
    }
    if (!isExpiryValid(credentials.expiry)) {
      newErrors = { ...newErrors, expiry: "Invalid expiry" };
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      props.onSubmit();
    }
  };

  return (
    <Grid container alignContent="center" flexDirection="column" justifyContent="space-between" height="100%">
      <Grid item>
        <br />
        <Card number={credentials.number} name={credentials.name} expiry={credentials.expiry} cvc={credentials.cvc} focused={credentials.focused} callback={handleCallback} />
        <TextField
          color="secondary"
          type="tel"
          name="number"
          fullWidth
          placeholder="Card Number"
          // inputProps={{ pattern: "[\\d| ]{16}" }}
          required
          sx={{ mb: 2, mt: 4 }}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          value={credentials.number}
          error={Boolean(errors.number)}
          helperText={errors.number}
        />
        <TextField
          fullWidth
          sx={{ mb: 2 }}
          type="text"
          color="secondary"
          name="name"
          value={credentials.name}
          placeholder="Name"
          required
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              color="secondary"
              type="tel"
              name="cvc"
              fullWidth
              placeholder="CVC"
              value={credentials.cvc}
              // inputProps={{ pattern: "\\d{3,4}" }}
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={Boolean(errors.cvc)}
              helperText={errors.cvc}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              color="secondary"
              type="tel"
              name="expiry"
              fullWidth
              placeholder="Expiration"
              value={credentials.expiry}
              // inputProps={{ pattern: "\\d\\d/\\d\\d" }}
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={Boolean(errors.expiry)}
              helperText={errors.expiry}
            />
          </Grid>
        </Grid>
        <input type="hidden" name="issuer" value={credentials.issuer} />
      </Grid>
      <Grid item>
        <Box component="div" textAlign="center">
          <FormControlLabel
            control={<Checkbox color="secondary" checked={credentials.agree} onClick={handleCheckboxOnClick} />}
            label={<Typography variant="body2">I understand that my NFT purchase is non-refundable.</Typography>}
          />
          <Button
            fullWidth
            disabled={!credentials.expiry || !credentials.name || !credentials.number || !credentials.cvc || !credentials.agree}
            variant="contained"
            color="secondary"
            size="large"
            type="submit"
            sx={{ borderRadius: 3, mt: 1, mb: 5, py: 1, fontSize: 18 }}
            onClick={handleSubmit}
          >
            Submit Order
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CreditCardForm;
