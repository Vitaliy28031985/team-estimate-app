export const ErrorsApp = {
  ERROR_FORBIDDEN: 'Доступ до цієї функції Вам забороно',
  EMPTY_NAME: 'Поле ім`я повинне бути заповнене!',
  NOT_VALID_EMAIL:
    'Ви ввели не валідний формат email адреси. Ввведіть email адресу в форматі user@example.com!',
  NOT_VALID_PHONE:
    'Введіть будь ласка Ваш номер телефону у форматі +380XXXXXXXXX!',
  NOT_VALID_PASSWORD:
    'Пароль має містити принаймні 6 символів та в його складі має бути принаймні одна літера та один спеціальний символ (*, #, & тощо)!',
  EMPTY_USER: 'Такого користувача не існує!',
  EXIST_USER: 'Email вже використовується іншим користувачем',
  BAD_PASSWORD: 'Невірний пароль! Спробуйте ще!',
  NOT_PRICE: 'Таккї позиції прайсу не існує!',
  NOT_PROJECT: 'Такого кошторису не існує!',
  NOT_ESTIMATE: 'Такої таблиці не існує!',
  NOT_DISCOUNT: 'discount має бути числом!',
  NOT_LOW_ESTIMATES: 'Нижчий кошторис не було створено!',
  NOT_POSITION: 'Такої позиції в кошторисі не існує!',
  NOT_ADVANCE: 'Такої позиції авансу не існує',
  NOT_AUTHORIZED: 'Ви не авторизовані. Будь ласка авторизуйтеся!',

  NOT_VERIFICATION(emailVer: string): string {
    return `Користувач з email ${emailVer} не підтвердив своєї реєстрації! Перейдіть будь ласка на свою електронну скриньку для підтвердження реєстрації!`;
  },

  NOT_USER(email: string): string {
    return `Юзера з email ${email} не існує!`;
  },

  EMPTY_ALLOW(email: string): string {
    return `Користувачу з email: ${email} дозвіз не надавався!`;
  },

  EXISTS_ALLOW(email: string): string {
    return `Юзеру з email ${email} вже надано доступ до цього кошторису!`;
  },
  NOT_MATERIAL(title: string): string {
    return `Чеку ${title} не існує!`;
  },
};
