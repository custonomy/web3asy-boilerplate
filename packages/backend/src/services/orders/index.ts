import { httpErrorHandler } from "../../utils/helpers";
import { Request, Response } from "express";
import Web3 from "web3";

import OrderModel from "../../models/OrderModel";
import Model from "../../models/Model";

import { CONTRACT_ABI, CONTRACT, INFURA_LINK, CHAIN_ID } from "../../utils/constants";

// imports for custonomy
import { Web3asyAPI } from "@custonomy/oneclickcheckout";
import {PROJECT_API_SECRET,  API_KEY, API_SECRET, DEFAULT_ENDPOINT, GAS_ENDPOINT, EC_KEY } from "../../config/custonomy";

import jwt from "jsonwebtoken";

const submitTransaction = async (mintTxn: any) => {
  // Initialize Custonomy
  const custonomy = new Web3asyAPI(API_KEY, API_SECRET, DEFAULT_ENDPOINT);

  let ecPrivateKey: string;

  // Load EC key
  ecPrivateKey = EC_KEY;

  try {
    if (ecPrivateKey.length === 0) {
      console.error("Missing EC key! Run 'yarn custonomy:register'");
      throw "Missing key";
    }
  } catch (ex) {
    console.log({ ex });
    throw ex;
  }

  // Submit Transaction to Custonomy
  return await custonomy
    .submitTransaction(mintTxn, ecPrivateKey)
    .then((res) => {
      return res.id;
    })
    .catch((ex) => {
      console.log({ ex });
      throw ex;
    });
};

export const oneclickMintNFT = async (req: Request, res: Response) => {
  const body = jwt.verify(req.body.data, PROJECT_API_SECRET) as any;
  let tx;
  try {
    // for testnet, since the order completed usually returned after 10 mins.
    // we will process the mint even the event is ORDER_PROCESSING for demo purpose
    if (!(!body.isProduction &&
            body.status == "PROCESSING" &&
            body.eventID == "ORDER_PROCESSING" || 
              body.isProduction &&
              body.status == "COMPLETED" &&
              body.eventID == "ORDER_COMPLETED")) {
      console.error("Not a valid event", body);
      res.status(200).send({ status: "success" });
      return null;
    }

    tx = await OrderModel.getByID(body.customOrderId);

    if (tx == null) return httpErrorHandler(res, 404, "Order not found");
    if (tx.nft_minted) {
      console.log("NFT associated with the tx has already been minted");
      return httpErrorHandler(res, 400, "NFT has already been minted");
    } else {
      try {
        let address = body.walletAddress;
        let transactionId: string = "";

        if (!address) {
          console.log("No minter address has been specified");
          return httpErrorHandler(res, 400, "An error has occured");
        }

        const contractAddress = tx.txndetails.contractAddress;

        let gasStationUrl = GAS_ENDPOINT; // CHAIN_ID == "80001" ? TESTNET_GAS : MAINNET_GAS;
        // Retrieve live gas price
        let gas = await fetch(gasStationUrl)
          .then((response) => response.json())
          .then((data) => {
            const stdFees = data.standard;
            return {
              txnFee: parseFloat(parseFloat(stdFees.maxFee).toFixed(6)),
              maxPriorityFeePerGas: parseFloat(parseFloat(stdFees.maxPriorityFee).toFixed(6)),
              maxFeePerGas: parseFloat(parseFloat(stdFees.maxFee).toFixed(6)),
            };
          });

        const abi = CONTRACT_ABI;
        const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_LINK));
        const contract = new web3.eth.Contract(abi as any, contractAddress);
        let func = contract.methods[tx.txndetails.method](...tx.txndetails.params);

        // Form Transaction
        const mintTxn = {
          type: 2,
          chainId: CHAIN_ID,
          fromAddress: address,
          txnOuts: [{ to: contractAddress, amt: 0 }],
          data: func.encodeABI(),
          gasLimit: 1000000, // manually set gas limit
          txnFee: gas.txnFee,
          maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
          maxFeePerGas: gas.maxFeePerGas,
        };

        transactionId = await submitTransaction(mintTxn);
        const newStatus = {
          id: body.customOrderId,
          txn_id: transactionId,
          payment_status: "minting",
        };

        const newTransaction = await OrderModel.updateTx(newStatus);

        res.status(200).send({ result: "success" });
      } catch (error: any) {
        // await Model.rollback(trx, error);
        await OrderModel.updateTx({
          id: body.customOrderId,
          payment_status: "error",
        });

        console.error(error);
        return httpErrorHandler(res, 400, error.message);
      }
    }
  } catch (error: any) {
    // await Model.rollback(trx, error);
    await OrderModel.updateTx({
      id: body.customOrderId,
      payment_status: "error",
    });

    console.error(error);
    return httpErrorHandler(res, 400, error.message);
  }
};

export const updateTxn = async (req: Request, res: Response) => {
  const trx = await Model.lock();

  let tx;
  try {
    tx = await OrderModel.getByCustonomyTxnID(req.body.data.transactionId, trx);
  } catch (error) {
    await Model.rollback(trx, error);
    return httpErrorHandler(res, 400, "An error has occured");
  }

  if (tx == null) return httpErrorHandler(res, 400, "Transaction not found");

  if (tx.payment_status == "success") {
    console.log("Transaction has already been processed");
    return httpErrorHandler(res, 400, "Transaction has already been processed");
  } else {
    try {
      let newStatus = {};
      if (req.body.data?.txnId != null) {
        newStatus = {
          id: tx.id,
          txn_hash: req.body.data?.txnId,
          nft_minted: req.body.type == "completed" ? true : false,
          payment_status: _getStatus(req.body.type),
        };
      } else {
        const custonomy = new Web3asyAPI(API_KEY, API_SECRET, DEFAULT_ENDPOINT);

        const txn = await custonomy.getTransaction(req.body.data.transactionId);
        newStatus = {
          id: tx.id,
          txn_hash: txn.txnId ? txn.txnId : null,
          nft_minted: txn.status == "completed" ? true : false,
          payment_status: _getStatus(req.body.type),
        };
      }

      await OrderModel.updateTx(newStatus, trx);
      await Model.commit(trx);
      // console.log("Updated Transaction Data:", newTransaction);
    } catch (error: any) {
      await OrderModel.updateTx(
        {
          id: tx.id,
          payment_status: "failed",
        },
        trx
      );
      await Model.commit(trx);
      // await Model.rollback(trx, error);
      return httpErrorHandler(res, 400, error.message);
    }

    res.status(200).send({ result: "success" });
  }
};

const _getStatus = (type: string): string => {
  switch (type) {
    case "sent_error":
      return "failed";
    case "sent":
      return "sent";
    case "completed":
      return "success";
    case "rejected":
      return "failed";
    default:
      return "pending";
  }
};
