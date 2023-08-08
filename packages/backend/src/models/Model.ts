import assert from "assert";
import { knex } from "../utils/constants";

const lock = (db: any = null) => {
  const _db = db ?? knex;
  return new Promise((resolve) => _db.transaction((trx: any) => resolve(trx)));
};

const commit = (db: any) => {
  assert(db);
  return db.commit();
};

const rollback = (db: any, error: any) => {
  assert(db);
  try {
    db.rollback(error);
  } catch (err) {
    console.error(err);
  }

  return;
};

export default { lock, commit, rollback };
