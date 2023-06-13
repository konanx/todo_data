import { client } from "../mongo";

export const GetTaskLists = async (id: string) => {
  let lists = await client
    .db()
    .collection("tasklists")
    .find({ user_id: id })
    .toArray();
  return lists;
};
