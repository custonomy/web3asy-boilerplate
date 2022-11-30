import { httpErrorHandler } from "../utils/helpers";
import { Request, Response } from "express";
import { mint } from "../utils/helpers";

// NOTE: THIS APPROACH OF MINTING IS FOR DEMO ONLY, NOT A RECOMMENDED WAY
export const mintNFT = async (req: Request, res: Response) => {
  const { address, asset } = req.body;

  try {
    const hash = await mint(address, asset);
    res.status(200).send({ hash });
  } catch (error: unknown) {
    return httpErrorHandler(res, 401, (error as Error).message);
  }
};
