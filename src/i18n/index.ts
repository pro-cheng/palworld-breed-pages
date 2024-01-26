import { createContext, createMemo, createSignal, useContext } from "solid-js";
import en from "./en.json";
import zhHans from "./zh-Hans.json";
import zhHant from "./zh-Hant.json";
import * as i18n from "@solid-primitives/i18n";

export const enum LocaleEnum {
  en = "en",
  zhHans = "zh-Hans",
  zhHant = "zh-Hant",
}
export const i18nMap = {
  [LocaleEnum.zhHans]: {
    dict: zhHans,
    label: "简体中文",
  },
  [LocaleEnum.en]: {
    dict: en,
    label: "English",
  },
  [LocaleEnum.zhHant]: {
    dict: zhHant,
    label: "繁體中文",
  },
} as const;

export function createLocaleContext() {
  const [locale, setLocale] = createSignal<LocaleEnum>(LocaleEnum.zhHans);
  const dict = createMemo(() =>
    i18n.flatten(i18nMap[locale()].dict as typeof zhHans),
  );
  const useT = createMemo(() => i18n.translator(dict));
  const chain = createMemo(() => i18n.chainedTranslator(dict(), useT()));
  return {
    locale,
    setLocale,
    dict,
    useT,
    chain,
  };
}
export const LocaleContext =
  createContext<ReturnType<typeof createLocaleContext>>();
export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("LocaleContext not found");
  }
  return context;
}
