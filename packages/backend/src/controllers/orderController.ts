import { httpErrorHandler} from "../utils/helpers";
import { Request, Response } from "express";
import OrderModel from "../models/OrderModel";
import { OneClickIntent } from "../types";
import { oneclickMintNFT, updateTxn } from "../services/orders";

  
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



export const webhookHandler =  async (req: Request, res: Response) => {
    const webhookContent = req.body;

    try {
      switch (webhookContent.type)  {
        case 'rejected':            
        case 'sent_error':
        case 'completed':
          await updateTxn(req, res);
          break;
        case 'oneclickcheckout':
          await oneclickMintNFT(req, res);
          break;
        default:
          res.status(200).send({result: 'success'})
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  
      