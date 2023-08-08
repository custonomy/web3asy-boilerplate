import { DEFAULT_OPTIONS } from "./constants";
import Payment from "payment";

export const isEmailValid = (email: string) => {
  const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regx.test(email.toLowerCase());
};

export const passwordStrength = (password: string, options = DEFAULT_OPTIONS, allowedSymbols = "!@#$%^&*") => {
  let passwordCopy = password || "";

  options[0].minDiversity = 0;
  options[0].minLength = 0;

  const rules = [
    {
      regex: "[a-z]",
      message: "lowercase",
    },
    {
      regex: "[A-Z]",
      message: "uppercase",
    },
    {
      regex: "[0-9]",
      message: "number",
    },
  ];

  if (allowedSymbols) {
    rules.push({
      regex: `[${allowedSymbols}]`,
      message: "symbol",
    });
  }

  let strength: any = {};

  strength.contains = rules.filter((rule) => new RegExp(`${rule.regex}`).test(passwordCopy)).map((rule) => rule.message);

  strength.length = passwordCopy.length;

  let fulfilledOptions = options
    .filter((option) => strength.contains.length >= option.minDiversity)
    .filter((option) => strength.length >= option.minLength)
    .sort((o1, o2) => o2.id - o1.id)
    .map((option) => ({ id: option.id, value: option.value, type: option.type }));

  Object.assign(strength, fulfilledOptions[0]);

  return strength;
};

function clearNumber(value = "") {
  return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value: any) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`;
      break;
    case "dinersclub":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;
      break;
  }

  return nextValue.trim();
}

export function formatCVC(value: string, allValues: any = {}) {
  const clearValue = clearNumber(value);
  let maxLength = 3;

  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "amex" ? 4 : 3;
  }

  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value: string) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}

export function formatFormData(data: any) {
  return Object.keys(data).map((d) => `${d}: ${data[d]}`);
}

export const formatName = (value: string) => {
  return value.replace(/\d+/g, "");
};

export const isCardNumValid = (number: string) => {
  return number.trim().length === 16;
};

export const isCVCValid = (cvc: string) => {
  return cvc.length === 3 || cvc.length === 4;
};

export const isExpiryValid = (expiry: string) => {
  const currentDate = new Date();
  const month = Number(expiry.substring(0, expiry.indexOf("/")));
  const year = 2000 + Number(expiry.substring(expiry.indexOf("/") + 1));

  if (year < currentDate.getFullYear() || (year === currentDate.getFullYear() && month < currentDate.getMonth() + 1) || !(month >= 1 && month <= 12)) {
    return false;
  } else {
    return true;
  }
};

export const getJWT = (token: string) => {
  return token.substring(token.indexOf(":") + 1);
};
