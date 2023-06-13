import { client } from "../mongo";

export const GetAvatar = async (id: string) => {
  let data = await client.db().collection("avatars").findOne({ id });
  return data?.buffer ?? null;
};
