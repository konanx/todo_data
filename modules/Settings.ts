import { updateListSettingsIE } from "../interfaces";
import { client } from "../mongo";
import { generateId } from "./Utility";

export const GetListSettings = async (id: string) => {
  const _id = generateId(id);
  let { displayCompleted = false } = await client
    .db()
    .collection("tasklists")
    .findOne({ _id });
  return { displayCompleted };
};
export const UpdateListSettings = async (data: updateListSettingsIE) => {
  const { _id, newName, displayCompleted } = data;
  const idObject = generateId(_id);
  if (!idObject) return null;
  let result = await client
    .db()
    .collection("tasklists")
    .updateOne(
      { _id: idObject },
      { $set: { name: newName, displayCompleted } }
    );
  return result;
};
