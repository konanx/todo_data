import { changeAvatarIE } from "../interfaces";
import { client } from "../mongo";

export const ChangeAvatar = async (data: changeAvatarIE) => {
  const { id, buffer } = data;
  await client.db().collection("avatars").deleteMany({ id });
  let insert = await client
    .db()
    .collection("avatars")
    .insertOne({ id, buffer });
  return insert;
};
