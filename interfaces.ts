export interface changeAvatarIE {
  id: string;
  buffer: string;
}
export interface createNewListIE {
  name: string;
  id: string;
}
export interface getSingleListIE {
  list_id: string;
  user_id: string;
  displayEnded: boolean;
}
export interface createSingleTaskIE {
  user_id: string;
  id: string;
  newTaskName: string;
}
export interface modifySingleTaskFavIE {
  id: string;
  fav: "boolean";
}
export interface changeSingleTaskStatusIE {
  id: string;
  done: "boolean";
}
export interface updateListSettingsIE {
  _id: string;
  newName: string;
  displayCompleted: boolean;
}
