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
    // .catch(error => updatePokemonInfo(1));
    .catch(error => missingNo());

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
    "ghost": "#9a8c98",
    "???": "#edede9"

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

// easter egg
function missingNo(){
  changeImg("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAADhCAMAAABV52FsAAAADFBMVEX///91ZY7uqH4SCwuO57XwAAADnUlEQVR4nO2c0ZLaMAxFbfb//7lkEEiKZAMtWHfde16cxEnmnp0VckK3rZEJP1d0r9+QzdORsIcFTdDpih4xE/4gMjTBYy+TNi/sX1L0NMFkVCdmjiaLoQkC3RHm4gALTbC4XAkHvVccIIVosjrnc/YxOZ5+rzLpYBLPPhRAoAkeR7DLAF8ZNFkFTfBI+4mQmizM9h40wUNax+XWRfxgTpNqSudAoElZ4CH7mLxXxx34IZgmX4z0lxx1ojZ+aG3w5q4o6xya4LGPySy0tA4PdD/RTT/QpJRYJ34d70sJtVQOaILHJiahsGWZf8xJ8DBfnTmHJlj0Pnhzp63DL2jkotLQKTQpDZ2yj4lU9rN+0sAbSaMJIqE4fvyeLxc9pTp3hCbVuSP7mBzBdG/YM9LPACxogocsRY7N0Dpid6nL+Rya4LGPSVzAazOJZyM70WR90hfx+dK0fn5luLegCR4bmBzF7etY98KLR/O5UJ07QpPq3M8QG+/VWlJHVQlfhSZ4oJv0CX4+Zg8HaxQEmuCZpJiYflWv+NPMgCVEE5p8hHSdJIniikrfYpvEIIVPEzyTFImZLtllkyaLoYkZQJByN3tpvrSfLIz5AjQpNfHvT1J8aAGvTmhCk++RrrsO+mNVb3qKthUxic5l0ATPxKRV4neJs1oYlVIBNAlzNPkIseJ9mmApyJmx4kefIF+HJnImmIm+MbkXiT4X9ts/rVe9WAuzGloITQw0WYEomO7iLS/u77T8dVWZc2hS3uPDL7okis3CZ8eqDJr4CyqSn9nHpGdMJyZzx1C27qIJnsnwzV17/HVTahLv1B9fTK7Mr9Ak3okmnySs6s2gpMsvT3yUpsl/bSIrdNMQ/NDPz4ztNiHB/dB7cT9JFRpNaPKvzEyMgpa0bImQH8o7I02wTNJEZmjJg+K9eFLSlcwqaEKT9ZhlVOgnQ0orfgRNKrK+SyiZ4YAOTfDYwCQUthw0wy+BJguZtYYYenSdfzaogSY0qcGbyKYM+jh8Z+SMAE0qM+cYk5ZVhr6yG67/QaBJVd4xv9nEp/UHZ2fGi6qhCYJJjNHPfSGdG37dWPb9CU1o8j3SkjVD8PIXpbco0Mhi0KTcJMWbpHvmzPATAIImNPkIPSOd8NfFp99L8f9XTxN0E3MkPbOdayi92YLYCTShyffoAZ0Ynu22zFK/TqPRBNHEE2ROhq/Jrsk6hyb+FmuyEkIIIYQQQgghhBBCCCFQ/AEm2THYLKtPiwAAAABJRU5ErkJggg==");
  let newInfo = [];
  newInfo.unshift(`NO ${0}:\t` + "missingno");
  newInfo.push("The glitch pokemon",`HT: ???`, `WT: ???`);
  addArrToDoc(newInfo, infoDiv)
  addToDoc("???", typesDiv);
  addToDoc("The only pokemon that can defeat ultra instinct Shaggy", descriptionDiv);
  changeChildBg(typesDiv);
}

randomPokemon();
