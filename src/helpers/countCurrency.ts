export const currency: Record<string, number> = {
  USD: 1,
  EUR: 1.14,
  UAH: 0.022,
  PLZ: 0.26,
  GBP: 1.35,
};

export const convertCurrency = (amount: number, from: string, to: string) => {
  const usd = amount * currency[from];
  const target = usd / currency[to];
  return target;
};
