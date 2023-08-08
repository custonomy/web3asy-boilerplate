
import { OneClickIntent } from "src/types";
import { knex } from "../utils/constants";
const RETURN_FIELDS = ['id', "payment_id", "payment_status", "nft_minted", "txn_hash", 'txndetails']

const getByTxID = async (paymentIntent: string, db?: any): Promise<any | null> => {
    const _knex = db ?? knex;

    // console.log('getByTxID', 'paymentIntent', paymentIntent)
    let query = _knex("transactions").select(RETURN_FIELDS);
    if (paymentIntent) query = query.where("payment_id", paymentIntent);

    const tx = await query
    return tx[0]
};

const getByID = async (orderId: string, db?: any): Promise<any | null> => {
  const _knex = db ?? knex;

  let query = _knex("transactions").select(RETURN_FIELDS);
  if (orderId) query = query.where("id", orderId);

  const tx = await query
  return tx[0]
};

const createTx = async (paymentIntent: any, db?: any) => {
  const _knex = db ?? knex;
  let newTx = null;
  newTx = await _knex("transactions")
    .insert({
        payment_id: paymentIntent.id,
        payment_status: "success",
        nft_minted: false,
        txn_hash: null
    })
    .returning(RETURN_FIELDS);

  return newTx[0];
};

const createIntent = async (orderIntent: OneClickIntent, db?: any) => {
  const _knex = db ?? knex;
  let newTx = null;
  newTx = await _knex("transactions")
    .insert({
        payment_status: "pending",
        nft_minted: false,
        txn_hash: null,
        txndetails: orderIntent
    })
    .returning(RETURN_FIELDS);
    

  return newTx[0];
};

const updateTx = async (newStatus: any, db?: any) => {
  const _knex = db ?? knex;

  let query = _knex("transactions")
  if (newStatus.payment_id) query = query.where("payment_id", newStatus.payment_id)
  else if (newStatus.id) query = query.where("id", newStatus.id)
  else throw new Error('No payment_id or id provided')
    
  const newTx = await query.update(newStatus).returning(RETURN_FIELDS);
  return newTx[0];
};



const getByCustonomyTxnID = async (txnId: string, db?: any): Promise<any | null> => {
  const _knex = db ?? knex;

  // console.log('getByTxID', 'paymentIntent', paymentIntent)
  let query = _knex("transactions").select(RETURN_FIELDS);
  if (txnId) query = query.where("txn_id", txnId);

  const tx = await query
  return tx[0]
};
export default { getByCustonomyTxnID, getByTxID, createTx, updateTx, createIntent, getByID };
