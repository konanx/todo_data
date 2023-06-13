const { ObjectId } = require("mongodb");
export const getTimestamp = () => {
  return new Date().getTime();
};

export const generateId = (id: string) => {
  let _id;
  try {
    _id = ObjectId.createFromHexString(id);
  } catch (e) {
    return null;
  }
  return _id;
};

export const withoutHour = (date: Date) => {
  let r: Date = new Date(date);
  r.setHours(0, 0, 0, 0);
  return r;
};
