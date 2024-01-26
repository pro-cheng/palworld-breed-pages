import { Show, createSignal, createMemo, For } from "solid-js";
import { LocaleEnum, i18nMap, useLocaleContext } from "../i18n";
import { DropdownIcon } from "./DropdownIcon";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";
export function LocaleSwitch() {
  const { locale, setLocale } = useLocaleContext();
  const [isShow, setIsShow] = createSignal(false);

  const i18nList = createMemo(() =>
    Object.entries(i18nMap).map(([key, value]) => {
      return {
        key: key as LocaleEnum,
        value,
      };
    }),
  );
  function changeLocale(locale: LocaleEnum) {
    setLocale(locale);
    setIsShow(false);
  }
  const { setEl } = useClickOutside(() => setIsShow(false));
  const currentLocaleLabel = createMemo(() => {
    const _locale = locale();
    if (!_locale) {
      return "";
    }
    return i18nMap[_locale].label;
  });
  return (
    <div ref={setEl} class="relative inline-block text-left">
      <div
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
        onClick={() => setIsShow(true)}
        aria-expanded={isShow()}
        aria-haspopup={isShow()}
      >
        <span>{currentLocaleLabel()}</span>
        <DropdownIcon />
      </div>
      <Show when={isShow()}>
        <div
          class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <ul class="py-1" role="none">
            <For each={i18nList()}>
              {(i18nItem) => {
                return (
                  <SwitchDropDownItem
                    i18nItem={i18nItem}
                    locale={locale}
                    changeLocale={changeLocale}
                  />
                );
              }}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  );
}

function SwitchDropDownItem(props: {
  i18nItem: { key: LocaleEnum; value: { label: string } };
  locale: () => LocaleEnum;
  changeLocale: (locale: LocaleEnum) => void;
}) {
  const bgColor = createMemo(() =>
    props.i18nItem.key === props.locale() ? "bg-gray-100 text-gray-900" : "",
  );
  const [hoverBgClass, setHoverBgClass] = createSignal("");
  async function onMouseEnter() {
    setHoverBgClass("bg-gray-100 text-gray-900");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  async function onMouseLeave() {
    setHoverBgClass("");
  }
  return (
    <li
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => props.changeLocale(props.i18nItem.key)}
      class={clsx(
        "text-gray-700 block px-4 py-2 text-sm cursor-pointer transition ease-out duration-100 transform",
        bgColor(),
        hoverBgClass(),
      )}
      role="menuitem"
      tabindex="-1"
    >
      {props.i18nItem.value.label}
    </li>
  );
}
