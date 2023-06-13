import { changeSingleTaskStatusIE, modifySingleTaskFavIE } from "../interfaces";
import { client } from "../mongo";
import { generateId } from "./Utility";

export const ModifySingleTaskFav = async (data: modifySingleTaskFavIE) => {
  const { id, fav } = data;
  let _id = generateId(id);
  if (!_id) return null;
  let result = await client
    .db()
    .collection("tasks")
    .updateOne({ _id }, { $set: { fav: fav, favAt: new Date() } });
  return result;
};

export const DeleteSingleTask = async (id: string) => {
  let _id = generateId(id);
  if (!_id) return null;
  const task = await client.db().collection("tasks").findOne({ _id });
  if (!task) return null;
  delete task._id;
  task.deletedAt = new Date();
  await client.db().collection("tasks").deleteOne({ _id });
  let insert = await client.db().collection("tasks-trash").insertOne(task);
  return insert;
};
export const ChangeSingleTaskStatus = async (
  data: changeSingleTaskStatusIE
) => {
  const { id, done } = data;
  let _id = generateId(id);
  if (!_id) return null;
  let result = await client
    .db()
    .collection("tasks")
    .updateOne({ _id }, { $set: { done: done, doneAt: new Date() } });
  return result;
};
