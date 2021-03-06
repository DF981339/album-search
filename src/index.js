let globalAlbumArray;

// invoke when render
setStartSearching();
enterToAddNewItem();

// fetch data
async function getAlbumData(input) {
  // const data = await fetch(
  //   `https://itunes.apple.com/search?term=${input}&media=music&entity=album&attribute=artistTerm&limit=200`
  // )
  //   .then((res) => res.json())
  //   .catch((err) => console.log(err));

  const data = await fetchJsonp(
    `https://itunes.apple.com/search?term=${input}&media=music&entity=album&attribute=artistTerm&limit=200`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  return data;
}

// parse fetched data
async function parseAlbumData() {
  // clear gird hide show-more button
  clearGrid();
  showMoreButton(false);

  // get user input
  let searchInput = document.querySelector("#searchInput").value;

  setLoading();
  globalAlbumArray = await getAlbumData(searchInput);

  let count = globalAlbumArray.resultCount;

  if (count > 50) {
    // get only first 50 results
    let shortResults = globalAlbumArray.results.splice(0, 50);

    shortResults.forEach((album) => {
      createAlbumCard(
        album.artworkUrl100,
        album.artistName,
        album.collectionName
      );
    });

    // showing show-more button
    showMoreButton(true);
  } else {
    globalAlbumArray.results.forEach((album) => {
      createAlbumCard(
        album.artworkUrl100,
        album.artistName,
        album.collectionName
      );
    });

    // don't show show-more button
    showMoreButton(false);
  }

  renderResultCount(count, searchInput);

  // reset text field
  document.querySelector("#searchInput").value = "";
  shrinkSearchBar();
}

// show more results
function showMoreResults() {
  // get next 50 results
  let nextFiftyResults = globalAlbumArray.results.splice(0, 50);

  // createAlbumCard with the 50 results
  nextFiftyResults.forEach((album) => {
    createAlbumCard(
      album.artworkUrl100,
      album.artistName,
      album.collectionName
    );
  });

  if (globalAlbumArray.results.length === 0) {
    showMoreButton(false);
  }
}

// show or hide show-more button
function showMoreButton(bool) {
  let showMoreButton = document.querySelector("button.main__showmore-button");

  if (bool) {
    showMoreButton.style.display = "inline-block";
  } else {
    showMoreButton.style.display = "none";
  }
}

// create album card
function createAlbumCard(url, name, album) {
  // create article tag as card wrapper
  let cardWrapper = document.createElement("article");
  cardWrapper.className = "main__album-card";

  // create img tag for album cover
  let albumCover = document.createElement("img");
  albumCover.setAttribute("src", url);
  albumCover.setAttribute("alt", album);

  // create div tag for artist name
  let artistName = document.createElement("div");
  artistName.className = "album-card__artist-name";
  artistName.innerHTML = name;

  // create div tag for album name
  let albumName = document.createElement("div");
  albumName.className = "album-card__album-name";
  albumName.innerHTML = album;

  // assemble elements
  cardWrapper.appendChild(albumCover);
  cardWrapper.appendChild(artistName);
  cardWrapper.appendChild(albumName);

  // target the grid section
  let grid = document.querySelector("section");

  // add album card into the grid
  grid.appendChild(cardWrapper);
}

// render result count
function renderResultCount(count, searchInput) {
  // target the counter div
  let counter = document.querySelector("div.main__counter");

  // result(s)
  const resultString = count === 1 ? "Result" : "Results";

  // text to be rendered
  const renderText = `${count} ${resultString} Found For "${searchInput}"`;

  counter.innerHTML = renderText;
}

// set result count to start your search
function setStartSearching() {
  // target the counter div
  let counter = document.querySelector("div.main__counter");

  // target the grid section
  let grid = document.querySelector("section");

  if (grid.childNodes.length === 0) {
    counter.innerHTML = "Start Your Search";
  }
}

// clear grid for next search
function clearGrid() {
  // target the grid section
  let grid = document.querySelector("section");

  // clear grid
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
}

// Using ENTER to search
function enterToAddNewItem() {
  let searchInput = document.querySelector("#searchInput");

  searchInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
      parseAlbumData();
    }
  });
}

// expand search bar when clicked
function expandSearchBar() {
  // target search bar container
  let searchBar = document.querySelector("div.search-bar__container");

  searchBar.style.width = "50%";
}

// shrink search bar
function shrinkSearchBar() {
  // target search bar container
  let searchBar = document.querySelector("div.search-bar__container");

  searchBar.style.width = "30%";
}

// set loading
function setLoading() {
  // target the counter div
  let counter = document.querySelector("div.main__counter");

  counter.innerHTML = "Loading...";
}
