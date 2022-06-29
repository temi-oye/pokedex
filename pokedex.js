let img = document.querySelector("img");
let typesDiv = document.getElementById("types");
let infoDiv = document.getElementById("info");
let descriptionDiv = document.getElementById("description");
let randomBtn = document.getElementById("random-btn");
let upBtn = document.getElementById("up-btn");
let downBtn = document.getElementById("down-btn");
let searchBox = document.getElementById("search-box");
const totalNumberOfPokemon = 898;
let newPokemonDexNumber = Math.floor(Math.random() * totalNumberOfPokemon); + 1

function randomPokemon() {
  newPokemonDexNumber = Math.floor(Math.random() * totalNumberOfPokemon) + 1;
  updatePokemonInfo(newPokemonDexNumber);
  console.log(newPokemonDexNumber);
}
randomBtn.onclick = randomPokemon;
upBtn.onclick = () => updatePokemonInfo(--newPokemonDexNumber);
downBtn.onclick = () => updatePokemonInfo(++newPokemonDexNumber);

function changeImg(source) {
  img.src = source;
}

function getTypes(arrayOfObjects) {
  let arrayOftypes = []
  for (let i = 0; i < arrayOfObjects.length; i++) {
    arrayOftypes.push(arrayOfObjects[i].type.name);
  }
  return arrayOftypes;
}

function addArrToDoc(arr, parent) {
  arr.forEach((attribute) => addToDoc(attribute, parent));
}

function addToDoc(content, parent) {
  let span = document.createElement("span");
  span.innerText = content.replaceAll("\n", " ");
  parent.append(span);
}

async function updatePokemonInfo(pokemonDexNumber) {
  infoDiv.innerHTML = "";
  descriptionDiv.innerHTML = "";
  typesDiv.innerHTML = "";

  let newInfo = [];
  let latestDescription;
  await fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokemonDexNumber)
    .then(response => response.json())
    .then((pokemon) => {

      let arrOfDescriptions = pokemon["flavor_text_entries"]
      arrOfDescriptions = arrOfDescriptions.filter(entry => entry.language.name == "en");
      latestDescription = arrOfDescriptions[arrOfDescriptions.length - 1]["flavor_text"];

      let arrOfGenera = pokemon["genera"]
      arrOfGenera = arrOfGenera.filter(entry => entry.language.name == "en");
      let latestGenera = arrOfGenera[arrOfGenera.length - 1]["genus"];


      newInfo.push(latestGenera);

    })
    .catch(error => updatePokemonInfo(1));

  await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonDexNumber)
    .then(response => response.json())
    .then((pokemon) => {
      changeImg(pokemon.sprites.front_default)

      let height = pokemon.height / 10;
      let weight = pokemon.weight / 10;

      newPokemonDexNumber = pokemon.id;
      newInfo.unshift(`NO ${pokemon.id}:\t` + pokemon.name);
      newInfo.push(`HT: ${height}m`, `WT: ${weight} kg`);
      addArrToDoc(getTypes(pokemon.types), typesDiv);
      addToDoc(latestDescription, descriptionDiv);
    });

  console.log(newInfo);

  if (newInfo != null && newInfo != [])
    addArrToDoc(newInfo, infoDiv)
  changeChildBg(typesDiv);
}

function runSearch() {
  let dexNum = searchBox.value;
  updatePokemonInfo(dexNum.toLowerCase());
  searchBox.value = "";
}

searchBox.addEventListener("keyup", function (event) {
  if ("Enter" === event.key) {
    event.preventDefault();
    runSearch();
  }
});


function getColor(type) {
  let color = "";

  const colorMap = {
    "water": "#a2d2ff",
    "fire": "#e76f51",
    "fighting": "#d62828",
    "grass": "#adc178",
    "poison": "#9d8189",
    "steel": "silver",
    "psychic": "#cdb4db",
    "fairy": "#ffafcc",
    "dragon": "#457b9d",
    "rock": "#a98467",
    "ground": "#dda15e",
    "bug": "#81b29a",
    "normal": "#bcb8b1",
    "flying": "#cbf3f0",
    "electric": "#fcf6bd",
    "dark": "#4a4e69",
    "ice": "#bde0fe",
    "ghost": "#9a8c98"

  }
  color = colorMap[type];
  return color;
}

function changeBackground(newColor, el) {
  el.style.backgroundColor = newColor;
}

function changeChildBg(parent) {
  if (parent.children.length > 0) {
    let children = parent.children;
    for(let i=0; i < children.length; i++){
      let child = children[i];
      let newColor = getColor(child.innerText);
      changeBackground(newColor, child);
    }
  }
}

randomPokemon();
