export const MessageApp = {
  ADD_ALLOW(email) {
    return `Юзеру з email ${email} доступ успішно надано!`;
  },
  UPDATE_ALLOW(email) {
    return `Юзеру з email ${email} дані доступ успішно оновлено!`;
  },

  DELETE_ALLOW(email) {
    return `Юзеру з email ${email} доступ успішно забрано!`;
  },
};
