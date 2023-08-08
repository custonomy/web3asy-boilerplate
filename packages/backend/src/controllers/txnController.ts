import { httpErrorHandler} from "../utils/helpers";
import { Request, Response } from "express";
import { mint } from "../utils/helpers";
import OrderModel from "../models/OrderModel";
import { OneClickIntent } from "src/types";

export const mintNFT = async (req: Request, res: Response) => {
    const { address, asset } = req.body;
  
    try {
      const hash = await mint(address, asset);
      res.status(200).send({ hash });
    } catch (ex: any) {
      return httpErrorHandler(res, 401, ex.message);
    }
  };
  
  export const createOneClickIntent = async (req: Request, res: Response) => {
    const txn = req.body as OneClickIntent;
  
    try {
      const order = await OrderModel.createIntent(txn);
      res.status(200).send(order);
    } catch (ex: any) {
      return httpErrorHandler(res, 401, ex.message);
    }
  };
  


export const getOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const tx = await OrderModel.getByID(orderId);

    res.status(200).send(tx);
  } catch (ex) {
    console.error(ex);
    return httpErrorHandler(res, 401, "An error has occured");
  }
}