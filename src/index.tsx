import "./index.css";
import { render } from "solid-js/web";
import { LocaleContext, createLocaleContext } from "./i18n";
import { LocaleSwitch, PaluSelect } from "./components";
import { createSignal, For } from "solid-js";
import {
  PaluIds,
  decodePaluParentKey,
  formatPaluParentKey,
  oneParentFindRecipes,
  palChildFindMap,
  palRecipesMap,
} from "./datas";

function App() {
  const localeContext = createLocaleContext();
  const { useT } = localeContext;
  const t = useT();
  const [palId1, setPaluId1] = createSignal<PaluIds | null>(null);
  const [palId2, setPaluId2] = createSignal<PaluIds | null>(null);
  const [palChild, setPaluChild] = createSignal<PaluIds | null>(null);
  const [results, setResults] = createSignal<string[]>(null);
  function translatePalRecipe(p1: PaluIds, p2: PaluIds, child: PaluIds) {
    return `${t(`pal.${p1}`)} + ${t(`pal.${p2}`)} => ${t(`pal.${child}`)}`;
  }
  function search() {
    if (palId1() && palId2()) {
      const key = formatPaluParentKey(palId1(), palId2());
      const child = palRecipesMap.get(key);
      if (child) {
        const recipeString = translatePalRecipe(palId1(), palId2(), child);
        if (palChild()) {
          setResults([palChild() === child ? recipeString : "not found"]);
        } else {
          setResults([recipeString]);
        }
      } else {
        setResults(["not found"]);
      }
      return;
    }
    const childPal = palChild();
    //
    if (palId1() || palId2()) {
      const palKey = palId1() || palId2();
      const recipes = [];
      oneParentFindRecipes.get(palKey).forEach(([p1, p2, child]) => {
        if (!childPal || child === childPal) {
          recipes.push(translatePalRecipe(p1, p2, child));
        }
      });
      setResults(recipes);
      return;
    }
    if (childPal) {
      const recipes = [];
      palChildFindMap.get(childPal).forEach(([p1, p2]) => {
        recipes.push(translatePalRecipe(p1, p2, childPal));
      });
      setResults(recipes);
    }
  }
  function reset() {
    setPaluId1(null);
    setPaluId2(null);
    setPaluChild(null);
    setResults(null);
  }
  return (
    <LocaleContext.Provider value={localeContext}>
      <div class="flex justify-end w-full">
        <LocaleSwitch />
      </div>
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
          <For each={results()}>{(result) => <div>{result}</div>}</For>
          <div class="grid" />
        </div>
      </div>
    </LocaleContext.Provider>
  );
}

render(() => <App />, document.getElementById("app"));
