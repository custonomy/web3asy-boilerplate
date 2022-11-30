import { knex } from "../utils/constants";
import { EUserType, INewUser, IUpdateUser, IUser, IUserPrimaryKey } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import { getHashedPassword } from "../utils/helpers";
import { Knex } from "knex";

const RETURN_FIELDS = ["id", "external_id AS externalId", "email", "type", "first_time_login AS firstTimeLogin"];

const getByPrimaryKey = async (values: IUserPrimaryKey, needPassword: boolean = false, db?: Knex.Transaction): Promise<IUser | null> => {
  const _knex = db ?? knex;
  const returnFields = needPassword ? [...RETURN_FIELDS, "password"] : RETURN_FIELDS;

  let query = _knex("users").select(returnFields);
  if (values.id) query = query.where("id", values.id);
  else query.where("email", values.email).andWhere("type", values.type);
  const user = await query;

  return user[0];
};

const create = async (userInfo: INewUser, db?: Knex.Transaction) => {
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
  } else if (Object.keys(EUserType).find((key) => EUserType[key as EUserType] === userInfo.type)) {
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
};

// NOTE: assume only internal users' password and firstTimeLogin can be updated
const update = async (userInfo: IUpdateUser, db?: Knex.Transaction) => {
  const _knex = db ?? knex;
  let obj: any = {};

  if (userInfo.password) obj.password = await getHashedPassword(userInfo.password);
  if (userInfo.firstTimeLogin !== undefined) obj.first_time_login = userInfo.firstTimeLogin;

  const newUser = await _knex("users").where("id", userInfo.id).update(obj).returning(RETURN_FIELDS);
  return newUser[0];
};

export default { getByPrimaryKey, create, update };
