import { Resolved } from "@solid-primitives/i18n";
import { For, createMemo, createSignal, useContext, Show } from "solid-js";
import { LocaleContext } from "../i18n";
import { keywordMatch } from "../utils";
import { paldata, PaluIds } from "../datas";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";

export function PaluSelect(props: {
  palId: PaluIds;
  onPaluChange: (palId: PaluIds) => void;
}) {
  // locale context
  const { chain, locale, useT } = useContext(LocaleContext);
  const t = useT();
  function buildPluDataWithLabel() {
    const palChained = chain().pal;
    return paldata.map((pal) => {
      const label = palChained[pal.id] as () => Resolved<string>;
      return {
        ...pal,
        label,
      };
    });
  }
  // kw search
  const [keyWord, setKeyWord] = createSignal("");
  function filterPaluData() {
    const _locale = locale();
    return buildPluDataWithLabel().filter((pal) => {
      return keywordMatch(keyWord(), pal.label(), _locale);
    });
  }
  const palList = createMemo(() => filterPaluData());
  function onInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    setKeyWord(value);
  }
  // 键盘高亮
  const [currentActiveSelect, setCurrentActiveSelect] = createSignal<
    number | null
  >(null);
  let scroll: HTMLUListElement | null = null;
  const onKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": {
        const nextIndex = Math.min(
          currentActiveSelect() + 1,
          palList().length - 1,
        );
        setCurrentActiveSelect(nextIndex);
        break;
      }
      case "ArrowUp": {
        const nextIndex = Math.max(currentActiveSelect() - 1, 0);
        setCurrentActiveSelect(nextIndex);
        break;
      }
      case "Enter": {
        if (currentActiveSelect() !== null) {
          choosePalu(palList()[currentActiveSelect()].id);
        }

        break;
      }
    }
    scroll.querySelector("[data-active-li='true']")?.scrollIntoView();
  };
  // pal select
  let input: HTMLInputElement | null = null;
  const currentPalu = () => props.palId;
  const setCurrentPalu = (id: PaluIds) => {
    props.onPaluChange?.(id);
  };
  const currentPaluLabel = createMemo(() => {
    const palChained = chain().pal;
    if (!currentPalu()) {
      return t("pal-select-placeholder");
    }
    return palChained[currentPalu()]();
  });

  // show popover
  const [isShow, setIsShow] = createSignal(false);
  function showPopover() {
    setIsShow(true);
    // reset
    setCurrentActiveSelect(null);
    setTimeout(() => {
      input?.focus();
    });
  }

  function choosePalu(id: PaluIds) {
    setCurrentPalu(id);
    setIsShow(false);
  }
  const { setEl } = useClickOutside(() => {
    if (isShow()) {
      setIsShow(false);
    }
  });
  return (
    <div ref={setEl}>
      <div class="relative">
        <button
          onClick={showPopover}
          type="button"
          class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
        >
          <span class="flex items-center">
            <span class="ml-3 block truncate">{currentPaluLabel()}</span>
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>
        <Show when={isShow()}>
          <div
            class="absolute z-10 mt-1 max-h-56 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm overflow-hidden flex flex-col"
            tabindex="-1"
          >
            <div class="m-1">
              <input
                class="sticky top-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex-shrink-0"
                ref={(el) => (input = el)}
                type="text"
                onInput={onInput}
                onKeyDown={onKeydown}
              />
            </div>
            <ul
              class="overflow-auto flex-1"
              role="listbox"
              aria-labelledby="listbox-label"
              ref={(el) => (scroll = el)}
            >
              <For
                each={palList()}
                fallback={
                  <div class="flex items-center">
                    <div class="text-gray-900 relative select-none py-2 pl-3 pr-9">
                      {t("pal-list-empty")}
                    </div>
                  </div>
                }
              >
                {(pal, index) => (
                  <li
                    class={clsx(
                      "cursor-pointer text-gray-900 relative select-none py-2 pl-3 pr-9",
                      currentActiveSelect() === index()
                        ? "bg-indigo-500 text-white"
                        : "",
                      currentPalu() === pal.id
                        ? "bg-indigo-600 text-white"
                        : "",
                    )}
                    data-active-li={currentActiveSelect() === index()}
                    aria-selected={currentActiveSelect() === index()}
                    role="option"
                    onClick={() => choosePalu(pal.id)}
                  >
                    <div class="flex items-center">
                      <span class="font-normal ml-3 block truncate">
                        {pal.label()}
                      </span>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>
      </div>
    </div>
  );
}
