import { getSingleListIE } from "../interfaces";
import { client } from "../mongo";
import { generateId } from "./Utility";

export const GetSingleList = async (data: getSingleListIE) => {
  const { list_id, user_id, displayEnded } = data;
  //   SPRAWDZAMY CZY LISTA ISTNIEJE I UŻYTKOWNIK MA DO NIEJ DOSTĘP
  let _id = generateId(list_id);
  if (!_id) return { error: true, message: "Brak uprawnień" };
  let permission = await client
    .db()
    .collection("tasklists")
    .findOne({ _id, user_id });
  if (!permission) return { error: true, message: "Brak uprawnień" };

  //   POBIERANIE LISTY ZADAŃ
  let tasks_list: any = [];
  if (displayEnded) {
    tasks_list = await client
      .db()
      .collection("tasks")
      .find({ user_id, list_id })
      .toArray();
  } else {
    tasks_list = await client
      .db()
      .collection("tasks")
      .find({ user_id, list_id, done: false })
      .toArray();
  }
  return tasks_list;
};
