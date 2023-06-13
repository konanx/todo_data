import { client } from "../mongo";
import { generateId, withoutHour } from "./Utility";
import moment from "moment";
export const GetStats = async (id: string) => {
  let object_id = generateId(id);

  let lista1 = await client
    .db()
    .collection("tasks")
    .find({ user_id: id })
    .toArray();
  let lista2 = await client
    .db()
    .collection("tasks-trash")
    .find({ user_id: id })
    .toArray();
  let razem = lista1.concat(lista2);

  let created_tasks = 0;
  let completed_tasks = 0;
  let deleted_tasks = 0;
  let created_lists = await client
    .db()
    .collection("tasklists")
    .countDocuments({ user_id: id });

  let current_tasks = 0;
  let fav_current_tasks = 0;

  let today_done_tasks = 0;
  let today_created_tasks = 0;
  let completed_tasks_percent = 0;
  let deleted_tasks_percent = 0;
  let account = await client
    .db()
    .collection("users")
    .findOne({ _id: object_id });
  let created_time = account.createdAt;
  let account_createdAt = moment().diff(created_time, "days");
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  razem.forEach((task: any) => {
    created_tasks++;
    let createdAt = withoutHour(task.createdAt);
    if (createdAt.getTime() == today.getTime()) {
      today_created_tasks++;
    }
    let doneAt = withoutHour(task.doneAt);
    if (doneAt.getTime() == today.getTime()) {
      today_done_tasks++;
    }

    if (task.done) {
      completed_tasks++;
    } else {
      current_tasks++;
      if (task.fav) fav_current_tasks++;
    }
  });
  lista2.forEach((deleted_task: any) => {
    deleted_tasks++;
  });

  completed_tasks_percent = parseFloat(
    (completed_tasks / created_tasks).toFixed(2)
  );
  deleted_tasks_percent = parseFloat(
    (deleted_tasks / created_tasks).toFixed(2)
  );
  completed_tasks_percent *= 100;
  deleted_tasks_percent *= 100;

  completed_tasks_percent = parseFloat(completed_tasks_percent.toFixed(2));
  deleted_tasks_percent = parseFloat(deleted_tasks_percent.toFixed(2));

  return {
    created_tasks,
    completed_tasks,
    deleted_tasks,
    account_createdAt,
    fav_current_tasks,
    current_tasks,
    completed_tasks_percent,
    deleted_tasks_percent,
    created_lists,
    today_created_tasks,
    today_done_tasks,
  };
};
