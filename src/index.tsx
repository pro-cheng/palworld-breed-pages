import "./index.css";
import { render } from "solid-js/web";
import { LocaleContext, createLocaleContext } from "./i18n";
import { LocaleSwitch, PaluSelect } from "./components";
import { createSignal, For, Show } from "solid-js";
import {
  PaluIds,
  formatPaluParentKey,
  oneParentFindRecipes,
  palChildFindMap,
  palRecipesMap,
} from "./datas";
type PalRecipes = [PaluIds, PaluIds, PaluIds];
function App() {
  const localeContext = createLocaleContext();
  const { useT } = localeContext;
  const t = useT();
  const [palId1, setPaluId1] = createSignal<PaluIds | null>(null);
  const [palId2, setPaluId2] = createSignal<PaluIds | null>(null);
  const [palChild, setPaluChild] = createSignal<PaluIds | null>(null);
  const [results, setResults] = createSignal<PalRecipes[]>([]);
  function translatePalRecipe(p1: PaluIds, p2: PaluIds, child: PaluIds) {
    return `${t(`pal.${p1}`)} + ${t(`pal.${p2}`)} => ${t(`pal.${child}`)}`;
  }
  function search() {
    const _palId1 = palId1();
    const _palId2 = palId2();
    if (_palId1 && _palId2) {
      const key = formatPaluParentKey(_palId1, _palId2);
      const child = palRecipesMap.get(key);
      if (child) {
        const recipe = [palId1(), palId2(), child] as [
          PaluIds,
          PaluIds,
          PaluIds,
        ];
        if (palChild()) {
          setResults(palChild() === child ? [recipe] : []);
        } else {
          setResults([recipe]);
        }
      } else {
        setResults([]);
      }
      return;
    }
    const childPal = palChild();
    //
    if (_palId1 || _palId2) {
      const palKey = (_palId1 || _palId2) as PaluIds;
      const recipes = [] as PalRecipes[];
      oneParentFindRecipes.get(palKey)?.forEach(([p1, p2, child]) => {
        if (!childPal || child === childPal) {
          recipes.push([p1, p2, child]);
        }
      });
      setResults(recipes);
      return;
    }
    if (childPal) {
      const recipes = [] as PalRecipes[];
      palChildFindMap.get(childPal)?.forEach(([p1, p2]) => {
        recipes.push([p1, p2, childPal]);
      });
      setResults(recipes);
    }
  }
  function reset() {
    setPaluId1(null);
    setPaluId2(null);
    setPaluChild(null);
    setResults([]);
  }
  return (
    <LocaleContext.Provider value={localeContext}>
      <div class="flex justify-end w-full">
        <LocaleSwitch />
      </div>
      <div class="flex justify-center items-center p-8 text-xl"><h1><a href="https://www.palworldbreed.com/">Palworld Breeding Calculator</a></h1></div>
      <div class="p-4">
        <div class="flex gap-10 items-center flex-wrap md:flex-nowrap">
          <div class="flex-1 flex items-center gap-2 sm:w-full">
            <span>1</span>
            <div class="flex-1">
              <PaluSelect palId={palId1()} onPaluChange={setPaluId1} />
            </div>
          </div>
          <div class="w-full md:w-auto">+</div>
          <div class="flex-1 flex items-center gap-2 w-full md:w-auto">
            <span>2</span>
            <div class="flex-1">
              <PaluSelect palId={palId2()} onPaluChange={setPaluId2} />
            </div>
          </div>
          <div class="w-full md:w-auto">=</div>
          <div class="flex-1 flex items-center gap-2 w-full md:w-auto">
            <div class="flex-1">
              <PaluSelect palId={palChild()} onPaluChange={setPaluChild} />
            </div>
          </div>
          <button class="btn btn-primary" onClick={search}>
            {t("search-button")}
          </button>
          <button class="btn btn-primary" onClick={reset}>
            {t("reset-button")}
          </button>
        </div>
        <div class="p-4">
          <Show
            when={results().length > 0}
            fallback={<span>{t("not-found")}</span>}
          >
            <For each={results()}>
              {([p1, p2, child]) => (
                <div>{translatePalRecipe(p1, p2, child)}</div>
              )}
            </For>
          </Show>
        </div>
      </div>
    </LocaleContext.Provider>
  );
}

render(() => <App />, document.getElementById("app")!);
