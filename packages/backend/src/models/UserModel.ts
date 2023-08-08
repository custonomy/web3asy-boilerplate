import { knex, USER_TYPE } from "../utils/constants";
import { INewUser, IUpdateUser, IUser, IUserPrimaryKey } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import { getHashedPassword } from "../utils/helpers";

const RETURN_FIELDS = ["id", "external_id AS externalId", "email", "type", "first_time_login AS firstTimeLogin"];

const getByPrimaryKey = async (values: IUserPrimaryKey, needPassword: boolean = false, db?: any): Promise<IUser | null> => {
  const _knex = db ?? knex;
  const returnFields = needPassword ? [...RETURN_FIELDS, "password"] : RETURN_FIELDS;

  let query = _knex("users").select(returnFields);
  if (values.id) query = query.where("id", values.id);
  else query.where("email", values.email).andWhere("type", values.type);
  const user = await query;

  return user[0];

  // const beginning = `SELECT id, external_id AS externalId, email, ${needPassword ? "password, " : ""} type, first_time_login AS firstTimeLogin FROM users WHERE`;
  // // const query = values.id ? `${beginning} id = ?` : `${beginning} email = ? AND external_id ${values.externalId ? "= ?" : "IS NULL"} AND type = ?`;
  // // const val = values.id ? [values.id] : values.externalId ? [values.email, values.externalId, values.type] : [values.email, values.type];
  // const query = values.id ? `${beginning} id = ?` : `${beginning} email = ? AND type = ?`;
  // const val = values.id ? [values.id] : [values.email, values.type];
  // return new Promise((resolve, reject) =>
  //   db.get(query, val, (err: any, data: any) => {
  //     if (err) {
  //       reject(err);
  //       return;
  //     }
  //     if (!data) {
  //       resolve(null);
  //       return;
  //     }
  //     resolve({ ...data, firstTimeLogin: Boolean(data.firstTimeLogin) });
  //   })
  // );
};

const create = async (userInfo: INewUser, db?: any) => {
  let query: string = "";
  let params: any[] = [];
  const uuid = uuidv4();
  const hashedPassword = await getHashedPassword(userInfo.password ?? "");

  const _knex = db ?? knex;
  let newUser = null;
  if (userInfo.type === "INTERNAL") {
    newUser = await _knex("users")
      .insert({
        id: uuid,
        email: userInfo.email,
        password: hashedPassword,
        type: userInfo.type,
      })
      .returning(RETURN_FIELDS);
  } else if (Object.keys(USER_TYPE).find((key) => USER_TYPE[key] === userInfo.type)) {
    newUser = await _knex("users")
      .insert({
        id: uuid,
        external_id: userInfo.externalId,
        email: userInfo.email,
        type: userInfo.type,
      })
      .returning(RETURN_FIELDS);
  }
  return newUser[0];

  // if (userInfo.type === "INTERNAL") {
  //   query = "INSERT INTO users (id, email, password, type) VALUES (?, ?, ?, ?)";
  //   params = [uuid, userInfo.email, hashedPassword, userInfo.type];
  // } else if (Object.keys(USER_TYPE).find((key) => USER_TYPE[key] === userInfo.type)) {
  //   query = "INSERT INTO users (id, external_id, email, type) VALUES (?, ?, ?, ?)";
  //   params = [uuid, userInfo.externalId ?? null, userInfo.email, userInfo.type];
  // }

  // await new Promise((resolve, reject) =>
  //   db.run(query, params, (err: any, data: any) => {
  //     if (err) {
  //       reject(err);
  //       return;
  //     }
  //     resolve(data);
  //   })
  // );

  // // get user after insert
  // // const user = await getByPrimaryKey({ id: null, email: userInfo.email, externalId: userInfo.externalId ?? null, type: userInfo.type });
  // const user = await getByPrimaryKey({ id: null, email: userInfo.email, type: userInfo.type });
  // return user ?? null;
};

// NOTE; assume only internal users' password and first time login can be updated
const update = async (userInfo: IUpdateUser, db?: any) => {
  const _knex = db ?? knex;
  let obj: any = {};

  if (userInfo.password) obj.password = await getHashedPassword(userInfo.password);
  if (userInfo.firstTimeLogin !== undefined) obj.first_time_login = userInfo.firstTimeLogin;

  const newUser = await _knex("users").where("id", userInfo.id).update(obj).returning(RETURN_FIELDS);
  return newUser[0];

  // const query: string = "UPDATE users SET password = ?, first_time_login = ? WHERE id = ?";
  // const params = [userInfo.password, userInfo.firstTimeLogin, userInfo.id];

  // await new Promise((resolve, reject) =>
  //   db.run(query, params, (err: any, data: any) => {
  //     if (err) {
  //       reject(err);
  //       return;
  //     }
  //     resolve(data);
  //   })
  // );

  // // get user after insert
  // // const user = await getByPrimaryKey({ id: userInfo.id, email: null, externalId: null, type: USER_TYPE.INTERNAL });
  // const user = await getByPrimaryKey({ id: userInfo.id, email: null, type: USER_TYPE.INTERNAL });
  // return user ?? null;
};

export default { getByPrimaryKey, create, update };
