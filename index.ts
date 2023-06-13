require("dotenv").config();
import { Server } from "socket.io";
import {
  changeAvatarIE,
  changeSingleTaskStatusIE,
  createNewListIE,
  createSingleTaskIE,
  getSingleListIE,
  modifySingleTaskFavIE,
  updateListSettingsIE,
} from "./interfaces";
import { ChangeAvatar } from "./modules/ChangeAvatar";
import { GetAvatar } from "./modules/GetAvatar";
import { CreateNewList } from "./modules/CreateNewList";
import { GetTaskLists } from "./modules/GetTaskLists";
import { GetSingleList } from "./modules/GetSingleList";
import { CreateSingleTask } from "./modules/CreateSingleTask";
import {
  ChangeSingleTaskStatus,
  DeleteSingleTask,
  ModifySingleTaskFav,
} from "./modules/ModifyTask";
import { GetDeletedTask, RestoreSingleTask } from "./modules/RestoreTasks";
import { GetStats } from "./modules/Statystyki";
import { DeleteList } from "./modules/DeleteList";
import { GetListSettings, UpdateListSettings } from "./modules/Settings";

const io = new Server(3011, {
  cors: {},
});

io.on("connection", (socket) => {
  const alert = (data: {
    type: string;
    message: string | undefined;
    anchor?: "left" | "center" | "right";
  }) => {
    socket.emit("alert", {
      type: data.type,
      message: data.message ?? "",
      anchor: data.anchor ?? "left",
    });
  };
  socket.on("changeAvatar", async (data: changeAvatarIE) => {
    let result = await ChangeAvatar(data);
    if (result?.insertedId) {
      alert({ type: "success", message: "Zmieniono avatar" });
    } else {
      alert({ type: "danger", message: "Wystąpił błąd" });
    }
    let buffer = await GetAvatar(data.id);
    socket.emit("getAvatarResponse", buffer);
  });
  socket.on("getAvatar", async (id: string) => {
    let buffer = await GetAvatar(id);
    socket.emit("getAvatarResponse", buffer);
  });
  socket.on("createNewList", async (data: createNewListIE) => {
    let result = await CreateNewList(data);
    if (!result?.insertedId) {
      alert({
        type: "danger",
        message: "Coś poszło nie tak, skontaktuj się z administratorem",
        anchor: "right",
      });
      return;
    }
    alert({
      type: "success",
      message: `Dodano listę ${data.name}`,
      anchor: "right",
    });
    socket.emit("createNewListResponse");
  });
  socket.on("getTaskLists", async (id: string) => {
    if (!id) {
      alert({
        message:
          "Nie udało się pobrać list zadań, skontaktuj się z administratorem",
        type: "error",
        anchor: "right",
      });
      return;
    }
    let lists = await GetTaskLists(id);
    socket.emit("getTaskListsResponse", lists);
  });
  socket.on("getSingleList", async (data: getSingleListIE) => {
    let result = await GetSingleList(data);
    if (result?.error) {
      socket.emit("getSingleListErrorResponse");
      alert({
        message: result.message ?? "Brak uprawnień",
        type: "error",
        anchor: "right",
      });
      return;
    }
    socket.emit("getSingleListResponse", result);
  });
  socket.on("createSingleTask", async (data: createSingleTaskIE) => {
    let result = await CreateSingleTask(data);
    socket.emit("modifySingleTaskResponse");
    if (result?.insertedId) {
      socket.emit("createSingleTaskResponse");
      alert({
        message: "Dodano nowe zadanie",
        type: "success",
        anchor: "right",
      });
      return;
    }
    alert({
      message: "Wystąpił błąd podczas dodawania nowego zadania",
      type: "error",
      anchor: "right",
    });
  });
  socket.on("modifySingleTaskFav", async (data: modifySingleTaskFavIE) => {
    let result = await ModifySingleTaskFav(data);
    socket.emit("modifySingleTaskResponse");
    if (result) return;
    alert({
      message: "Wystąpił błąd zmiany priorytetu",
      type: "error",
      anchor: "right",
    });
  });
  socket.on("deleteSingleTask", async (data: { id: string }) => {
    const { id } = data;
    await DeleteSingleTask(id);
    socket.emit("modifySingleTaskResponse");
  });
  socket.on(
    "changeSingleTaskStatus",
    async (data: changeSingleTaskStatusIE) => {
      let result = await ChangeSingleTaskStatus(data);
      socket.emit("modifySingleTaskResponse");
      if (result) {
        if (data.done) {
          alert({
            message: "Brawo, Tak trzymaj!!!",
            type: "success",
            anchor: "right",
          });
        }
        return;
      }
      alert({
        message: "Wystąpił błąd zmiany statusu",
        type: "error",
        anchor: "right",
      });
    }
  );
  socket.on("getDeletedTask", async (id: string) => {
    let list = await GetDeletedTask(id);
    socket.emit("getDeletedTaskResponse", list);
  });
  socket.on("restoreSingleTask", async (id: string) => {
    let result = await RestoreSingleTask(id);
    socket.emit("restoreSingleTaskResponse");
    if (!result) {
      alert({
        message: "Wystąpił błąd zmiany statusu",
        type: "error",
        anchor: "right",
      });
      return;
    }
    alert({
      message: "Przywrócono zadanie",
      type: "success",
      anchor: "right",
    });
  });
  socket.on("getStats", async (id: string) => {
    let stats = await GetStats(id);
    socket.emit("getStatsResponse", { ...stats });
  });
  socket.on("deleteList", async (id: string) => {
    let result = await DeleteList(id);
    socket.emit("deleteListResponse", id);
    if (!result) {
      alert({
        message: "Wystąpił błąd",
        type: "error",
        anchor: "right",
      });
      return;
    }
    alert({
      message: "Lista zadań usunięta",
      type: "success",
      anchor: "right",
    });
  });
  socket.on("getListSettings", async (id: string) => {
    let settings = await GetListSettings(id);
    socket.emit("getListSettingsResponse", settings);
  });
  socket.on("getListSettingsModal", async (id: string) => {
    let settings = await GetListSettings(id);
    socket.emit("getListSettingsModalResponse", settings);
  });
  socket.on("updateListSettings", async (data: updateListSettingsIE) => {
    let result = await UpdateListSettings(data);
    socket.emit("updateListSettingsResponse");
    if (!result) {
      alert({
        message: "Wystąpił błąd, skontaktuj się z administratorem",
        type: "error",
        anchor: "right",
      });
      return;
    }
    alert({
      message: `Zapisano ustawienia dla listy: ${data.newName}`,
      type: "success",
      anchor: "right",
    });
    return;
  });
});
