import { createSingleTaskIE } from "../interfaces";
import { client } from "../mongo";
import { getTimestamp } from "./Utility";

export const CreateSingleTask = async (data: createSingleTaskIE) => {
  const { user_id, id, newTaskName } = data;
  let result = await client.db().collection("tasks").insertOne({
    user_id,
    list_id: id,
    name: newTaskName,
    createdAt: new Date(),
    done: false,
    fav: false,
  });
  return result;
};
