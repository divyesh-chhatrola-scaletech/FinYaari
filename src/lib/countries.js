import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

let regionNames;
try {
  regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
} catch {
  regionNames = null;
}

const PRIORITY = ['IN', 'US', 'GB', 'AE', 'CA', 'AU', 'SG'];

export const COUNTRIES = getCountries()
  .map((code) => ({
    code,
    dialCode: getCountryCallingCode(code),
    name: regionNames ? regionNames.of(code) : code,
  }))
  .sort((a, b) => {
    const pa = PRIORITY.indexOf(a.code);
    const pb = PRIORITY.indexOf(b.code);
    if (pa !== -1 || pb !== -1) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    return a.name.localeCompare(b.name);
  });

export const DEFAULT_COUNTRY = 'IN';
