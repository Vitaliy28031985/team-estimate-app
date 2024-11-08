export const MessageApp = {
  DELETE_POSITION: 'Позицію кошторису успішно видалено!',
  DELETE_ADVANCE: 'Позицію авансу успішно видалено!',
  DELETE_MATERIAL: 'Чек успішно видалено!',
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
    return `Позицію кошторису ${title} успішно додано!`;
  },
  UPDATE_POSITION(title: string): string {
    return `Позицію кошторису ${title} успішно оновлено!`;
  },
  ADD_ADVANCE(comment: string): string {
    return `Позицію авансу ${comment} успішно додано!`;
  },
  UPDATE_ADVANCE(comment: string): string {
    return `Позицію авансу ${comment} успішно оновлено!`;
  },
  CREATE_MATERIALS(title: string): string {
    return `Чек на матеріали ${title} успішно додано!`;
  },
  UPDATE_MATERIAL(title: string): string {
    return `Чек на матеріали ${title} успішно оновлено!`;
  },
  ADD_DISCOUNT(discount: number): string {
    return `Знижку в розмірі ${discount}% встановлено!`;
  },
  ADD_LOW_PROJECT(discount: number): string {
    return `Кошторис на ${discount}% створено!`;
  },
};
