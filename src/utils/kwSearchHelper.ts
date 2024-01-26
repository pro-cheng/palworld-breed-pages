import { LocaleEnum } from "../i18n";

export function keywordMatch(
  keyword: string,
  matchText: string,
  locale: LocaleEnum,
) {
  switch (locale) {
    case LocaleEnum.en:
      return matchText.toLowerCase().includes(keyword.toLowerCase());
    case LocaleEnum.zhHans:
      return matchText.includes(keyword);
    case LocaleEnum.zhHant:
      return matchText.includes(keyword);
  }
}
