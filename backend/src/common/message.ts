export const MessageApp = {
  DELETE_POSITION: 'Позицію кошторису успішно видалено!',
  ADD_ALLOW(email: string): string {
    return `Юзеру з email ${email} доступ успішно надано!`;
  },
  UPDATE_ALLOW(email: string): string {
    return `Юзеру з email ${email} дані доступ успішно оновлено!`;
  },

  DELETE_ALLOW(email: string): string {
    return `Юзеру з email ${email} доступ успішно забрано!`;
  },
  DELETE_ESTIMATE() {
    return `Таблицю  успішно видалено!`;
  },
  CREATE_POSITION(title: string): string {
    return `Позицію ${title} успішно додано!`;
  },
  UPDATE_POSITION(title: string): string {
    return `Позицію кошторису ${title} успішно оновлено!`;
  },
};
