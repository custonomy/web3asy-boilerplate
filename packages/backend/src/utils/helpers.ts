import { CONTRACT_ABI, CONTRACT, CHAIN_ID, SECRET_KEY, INFURA_LINK, USER_TYPE, SECRET, FACEBOOK_APP_ACCESS_TOKEN, DEFAULT_OPTIONS } from "./constants";
import fetch from "node-fetch";
import crypto from "crypto";
import UserModel from "../models/UserModel";
import { IExternalProfile } from "./types";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import Model from "../models/Model";
import Web3 from "web3";

export const getExternalTokenInfo = async (type: string, token: string) => {
  let result = null;
  let invalidToken = false;

  switch (type) {
    case USER_TYPE.GOOGLE:
      result = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`).then((response: any) => response.json());
      // result = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`).then((response: any) => response.json());
      invalidToken = Boolean(result.error);
      if (result.sub) {
        result = { ...result, id: result.sub };
      }
      break;
    case USER_TYPE.FACEBOOK:
      result = await fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${FACEBOOK_APP_ACCESS_TOKEN}`).then((response: any) => response.json());
      invalidToken = Boolean(result.data.error);
      if (result.data.user_id) {
        result = await fetch(`https://graph.facebook.com/v14.0/${result.data.user_id}?fields=id,name,email&access_token=${token}`).then((response: any) => response.json());
      }
      break;
    // TODO: TWITTER
    // case USER_TYPE.TWITTER:
    //   result = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`).then((response: any) => response.json());
    //   break;
    default:
      break;
  }

  if (invalidToken) {
    return { error: "Invalid token" };
  } else {
    return result;
  }
};

export const httpErrorHandler = (res: any, statusCode: number, error: string) => {
  res.status(statusCode).send({ error });
};

export const validateUser = async (req: any, res: any) => {
  let sessionUser = null;
  const token = req.session.user ? req.session.user.session : req.headers["authorization"];
  const prefix = token.substring(0, token.indexOf(":"));
  const jwt = token.substring(token.indexOf(":") + 1);
  let externalProfile = null;

  // NOTE: error from getExternalTokenInfo is not compatible with error for rollback -> need to seaprate the try catch
  try {
    externalProfile = await getExternalTokenInfo(prefix, jwt);
    if (externalProfile?.error) {
      throw externalProfile.error;
    }
  } catch (error) {
    // console.log({error})
    throw error;
  }

  const trx = await Model.lock();
  try {
    if (req.session.user) sessionUser = req.session.user;
    else if (externalProfile?.id) {
      const user = await UserModel.getByPrimaryKey(
        {
          id: null,
          email: externalProfile.email,
          type: prefix,
        },
        false,
        trx
      );
      // const user = await UserModel.getByPrimaryKey({ id: null, email: externalProfile.email, externalId: externalProfile.id, type: prefix });
      if (user) {
        const { password, ...rest } = user;
        sessionUser = { ...rest, session: req.headers["authorization"] };
      }
    }
    await Model.commit(trx);
    if (sessionUser) req.session.user = sessionUser;
    else throw "Invalid User";
    return sessionUser;
  } catch (error) {
    // console.log({error})
    Model.rollback(trx, error);
    throw error;
  }
};

export const generatePassword = (length = 10, wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$") =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("");

export const getHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const generateToken = (user: any) => {
  return jwt.sign(user, SECRET, {
    expiresIn: 604800, // in seconds (7 days for now)
  });
};

export const handleExternalProfile = async (profile: IExternalProfile, session: string, done: Function) => {
  const trx = await Model.lock();
  try {
    const user = await UserModel.getByPrimaryKey(profile, false, trx);
    let result: any = { session };
    if (user) {
      result = { ...result, ...user, isNewUser: false };
      // result = { ...result, ...user, firstTimeLogin: user.firstTimeLogin };
    } else {
      const newUser = await UserModel.create(profile, trx);
      if (newUser) {
        result = { ...result, ...newUser, isNewUser: true };
        // result = { ...result, ...newUser, firstTimeLogin: newUser.firstTimeLogin };
      }
    }
    await Model.commit(trx);
    return done(null, result);
  } catch (error) {
    await Model.rollback(trx, error);
    return done(null, false, error);
  }
};

export const passwordStrength = (password: string, options = DEFAULT_OPTIONS, allowedSymbols = "!@#$%^&*") => {
  let passwordCopy = password || "";

  (options[0].minDiversity = 0), (options[0].minLength = 0);

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


// this function is for testing purpose for minting an NFT
export const mint = async (address: string, asset: string): Promise<string> => {
  const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_LINK));
  const key1 = web3.eth.accounts.privateKeyToAccount("0x" + SECRET_KEY);
  const abi = CONTRACT_ABI;

  if (CONTRACT[asset] == null) throw new Error("Asset not supported");

  const contractAddress: string = CONTRACT[asset] as any;
  const mintTxn = {
    type: 0,
    from: address,
    to: contractAddress,
    nonce: 0,
    gasPrice: "",
    gasLimit: "",
    data: "0x",
    value: "0x38D7EA4C68000",
    chainId: 0,
  };

  const nonce = await web3.eth.getTransactionCount(key1.address);

  // console.log(abi);
  const contract = new web3.eth.Contract(abi as any, contractAddress);
  let func = contract.methods["mint"](address, 1);
  mintTxn.data = func.encodeABI();
  mintTxn.nonce = nonce;

  const gasPrice = await web3.eth.getGasPrice();
  mintTxn.gasPrice = web3.utils.toHex(gasPrice);
  // const nonce = await web3.eth.getTransactionCount(key1.address);

  const gas = await new Promise((resolve, reject) => {
    web3.eth.estimateGas(
      {
        from: key1.address,
        to: contractAddress,
        nonce: nonce,
        data: mintTxn.data,
        value: "0x38D7EA4C68000",
      },
      function (err: any, gas: number) {
        if (err) {
          //done(null)
          reject(err.message);
        } else {
          resolve(gas.toString());
        }
      }
    );
  });

  mintTxn.gasLimit = web3.utils.toHex(parseInt(gas as string));
  // console.log({mintTxn});
  mintTxn.chainId = parseInt(CHAIN_ID);
  const sTx = await key1.signTransaction(mintTxn);
  // var txx = new Tx(mintTxn);
  // txx.sign(key1);

  // var sTx =txx.serialize();

  return await new Promise((resolve, reject) => {
    web3.eth
      .sendSignedTransaction(sTx.rawTransaction as string)
      .once("receipt", function (receipt) {
        resolve(receipt.transactionHash);
      })
      // .on('confirmation', function(confNumber, receipt){
      //     if (confNumber == 1)  {
      //         // console.log({confNumber, receipt});
      //         // callback(receipt);
      //     }
      // })
      .on("error", function (error) {
        reject(error.message);
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};
