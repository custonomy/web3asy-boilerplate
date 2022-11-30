import assert from "assert";
import { Knex } from "knex";
import { knex } from "../utils/constants";

const lock = (db: Knex.Transaction | null = null): Promise<Knex.Transaction> => {
  const _db: Knex.Transaction = db ?? knex;
  return new Promise((resolve) => _db.transaction((trx) => resolve(trx)));
};

const commit = (db: Knex.Transaction) => {
  assert(db);
  return db.commit();
};

const rollback = (db: Knex.Transaction, error: any) => {
  assert(db);
  try {
    db.rollback(error);
  } catch (err) {
    console.error(err);
  }

  return;
};

export default { lock, commit, rollback };
