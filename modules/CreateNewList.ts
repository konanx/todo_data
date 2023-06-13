import { createNewListIE } from "../interfaces";
import { client } from "../mongo";
export const CreateNewList = async (data: createNewListIE) => {
  const { id, name } = data;
  let result = await client
    .db()
    .collection("tasklists")
    .insertOne({
      user_id: id,
      name,
      createdAt: new Date(),
      displayCompleted: false,
    });
  return result;
};
