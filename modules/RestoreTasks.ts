import { client } from "../mongo";
import { generateId } from "./Utility";

export const GetDeletedTask = async (id: string) => {
  let lista = await client
    .db()
    .collection("tasks-trash")
    .find({ user_id: id })
    .toArray();
  return lista;
};
export const RestoreSingleTask = async (id: string) => {
  let _id = generateId(id);
  if (!_id) return null;
  const task = await client.db().collection("tasks-trash").findOne({ _id });
  if (!task) return null;
  delete task._id;
  delete task.deletedAt;
  task.restoreAt = new Date();
  await client.db().collection("tasks-trash").deleteOne({ _id });
  let insert = await client.db().collection("tasks").insertOne(task);
  return insert;
};
