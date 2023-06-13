import { client } from "../mongo";
import { generateId } from "./Utility";

export const DeleteList = async (id: string) => {
  const _id = generateId(id);
  if (!_id) return null;
  let r1 = await client.db().collection("tasklists").deleteMany({ _id });
  let r2 = await client
    .db()
    .collection("tasks-trash")
    .deleteMany({ list_id: id });
  let r3 = await client.db().collection("tasks").deleteMany({ list_id: id });
  return r1 && r2 && r3 ? "success" : null;
};
