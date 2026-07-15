const isProduction = process.env.NODE_ENV === 'production';

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge?: number;
};

export const getCookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge,
});

export const getCookie = (
  name: string,
  value: string,
  expires: number,
): string => {
  const currentDay = Date.now();
  const expiresDay = new Date(currentDay + expires);
  const expiresStr = expiresDay.toUTCString();

  const { httpOnly, secure, sameSite } = getCookieOptions(expires);
  const secureFlag = secure ? 'Secure;' : '';

  return `${name}=${value}; ${httpOnly ? 'HttpOnly;' : ''} ${secureFlag} SameSite=${sameSite}; Expires=${expiresStr};`;
};
