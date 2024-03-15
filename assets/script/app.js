// Define current page number and an array of movie titles
let curentP = 1;
const rand = [
  "cds",
  "3 Idiots",
  "Baahubali: The Beginning",
  "Sholay",
  "gdsf",
  "Inception",
  "The Godfather",
  "Titanic",
  "Avatar",
  "Jurassic Park"
];
// Randomly select a movie title from the array
let title = rand[Math.floor(Math.random() * rand.length)];

// Clone the template card for movies
const liDom = document.getElementById("clone").cloneNode(true);
// Loading spinner element
const loading = document.getElementById("loading");
// Loading messages
let loadingStrint = ["Loading...", "So Sorry no match found🙇‍♂️"];

// set display flex to clone
liDom.style.display = "flex";

// DOM elements for movie list and favorite movies
const movieList = document.querySelector("#movi-list");
const favouriteUl = document.getElementById("favouriteUl");

// Initialize local storage for storing liked movies
if (!localStorage.getItem("Data")) {
  localStorage.setItem("Data", "{}");
}

// Search input element
const search = document.querySelector("#search");
// Retrieve liked movie data from local storage
let likeData = JSON.parse(localStorage.getItem("Data"));

// Function to set liked movie data in local storage
function setLocal(moviObj) {
  likeData[moviObj.imdbID] = moviObj;
  localStorage.setItem("Data", JSON.stringify(likeData));
}

// Function to remove a movie from liked movies
function remove(imdbID) {
  delete likeData[imdbID];
  localStorage.setItem("Data", JSON.stringify(likeData));
}

// Function to create new favorite movie list item
function newfav(key) {
  let tempElement = document.createElement('li');
  tempElement.innerHTML = `<a class="dropdown-item border-bottom cursor-pointer">
      <i class="fa fa-close ms-auto" style="position: absolute;margin-left: auto;color: red;">
      </i>
      <div class="row">
        <img class="col" style="height: 100px;aspect-ratio: 1/1;object-fit: contain;"
          src="${likeData[key].Poster}"
          alt="" srcset="">
        <div style="max-width: 342px"  class="col">
          <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="fs-3">${likeData[key].Title}</p>
          <h5> ${likeData[key].Type} - ${likeData[key].Year}</h5>
        </div>
      </div>
    </a>`;
  tempElement.setAttribute("data-id", likeData[key].imdbID);
  // Event listener to remove movie from favorites
  tempElement.querySelector("i").addEventListener("click", function () {
    let t = document.querySelector(`[data-card-id=${likeData[key].imdbID}]`);
    remove(likeData[key].imdbID);
    if (t) {
      t.querySelector(".add").classList.remove("d-none");
      t.querySelector(".remove").classList.add("d-none");
    }
    tempElement.remove();
  });
  // Event listener to view movie details
  tempElement.querySelector("div").addEventListener("click", function () {
    window.location.href = `/movie.html?m=${likeData[key].imdbID}`;
  });
  return tempElement;
}

// Function to update favorite movie list in the UI
function favouriteUlUpdate() {
  Object.keys(likeData).reverse().forEach(key => {
    let tempElement = newfav(key);
    favouriteUl.appendChild(tempElement);
  });
}

// Update favorite movie list
favouriteUlUpdate();

// Show loading spinner initially
loading.style.display = "block";
let obj = null;

// Function to fetch movie data from API
function fetchData(url) {
  fetch(url)
    .then(x => x.json())
    .then(y => {
      obj = y;
      setList(obj);
      pagination();
      if (obj.Response != true) {
        loading.querySelector("span").innerHTML = loadingStrint[1];
      }
    })
    .catch(error => {
      loading.querySelector("span").innerHTML = loadingStrint[1];
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      return null;
    });
}

// Fetch initial movie data
fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=1`);

// Function to populate movie list
function setList(obj) {
  obj.Search.map(element => {
    const tempElement = liDom.cloneNode(true);
    tempElement.setAttribute("data-card-id", element.imdbID);
    tempElement.querySelector("img").setAttribute("src", element.Poster);
    tempElement.querySelector("h4").innerText = element.Title;
    tempElement.querySelector("samp").innerText = `${element.Year} - ${element.Type}`;

    // Event listener for 'More' button to view movie details
    tempElement.querySelector(".more").addEventListener("click", function () {
      window.location.href = `/movie.html?m=${element.imdbID}`;
    });

    // Event listener for 'Add to favorite' button
    tempElement.querySelector(".add").addEventListener("click", function () {
      setLocal(element);
      let elementLi = newfav(element.imdbID);
      favouriteUl.firstElementChild.before(elementLi);
      stBtn();
    });

    // Event listener for 'Remove from favorite' button
    tempElement.querySelector(".remove").addEventListener("click", function () {
      remove(element.imdbID);
      document.querySelector(`[data-id=${element.imdbID}]`).remove();
      stBtn();
    });

    // Check if movie is in liked data and update button display
    function stBtn() {
      if (likeData[element.imdbID]) {
        tempElement.querySelector(".add").classList.add("d-none");
        tempElement.querySelector(".remove").classList.remove("d-none");
      } else {
        tempElement.querySelector(".add").classList.remove("d-none");
        tempElement.querySelector(".remove").classList.add("d-none");
      }
    }
    stBtn();
    movieList.appendChild(tempElement);
  });

  // Hide loading spinner after data is loaded
  loading.style.display = "none";
  loading.querySelector("span").innerHTML = loadingStrint[0];
}

// Function to update pagination
function pagination() {
  document.querySelectorAll("[data-curent-page=true]").forEach(element => {
    element.remove();
  });
  const pagrli = document.getElementById("page").cloneNode(true);
  const nextPage = document.getElementById("nextPage");
  const previousPage = document.getElementById("previousPage");
  pagrli.removeAttribute("style");
  pagrli.removeAttribute("id");

  totalPage = obj.totalResults % 10 == 0 ? obj.totalResults / 10 : Math.floor((obj.totalResults / 10) + 1);
  for (let i = 0; i < totalPage; i++) {
    const tamElement = pagrli.cloneNode(true);
    tamElement.querySelector("a").innerText = (i + 1);
    if (curentP == i + 1) {
      tamElement.querySelector("a").style.border = "none";
      tamElement.querySelector("a").style.setProperty("background-color", "#0a0a47", "important");
    }

    tamElement.setAttribute("data-curent-page", true);
    tamElement.addEventListener("click", function () {
      movieList.innerHTML = "";
      movieList.appendChild(loading);
      loading.style.display = "block";
      loading.querySelector("span").innerHTML = loadingStrint[0];
      curentP = i + 1;
      fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=${i + 1}`);
    });

    nextPage.before(tamElement);
  }
}

// Event listener for next page button
nextPage.addEventListener("click", function () {
  if (totalPage > curentP) {
    ++curentP;
    movieList.innerHTML = "";
    movieList.appendChild(loading);
    loading.style.display = "block";
    loading.querySelector("span").innerHTML = loadingStrint[0];
    fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=${curentP}`);
  }
});

// Event listener for previous page button
previousPage.addEventListener("click", function () {
  if (1 < curentP) {
    --curentP;
    movieList.innerHTML = "";
    movieList.appendChild(loading);
    loading.style.display = "block";
    loading.querySelector("span").innerHTML = loadingStrint[0];
    fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=${curentP}`);
  }
});

// Timeout ID for delaying search input
let timeoutId;
// Event listener for search input
search.addEventListener("input", function () {
  if (search.value == "") {
    title = "Avatra";
  } else {
    title = search.value;
  }

  clearTimeout(timeoutId);
  movieList.innerHTML = "";
  movieList.appendChild(loading);
  loading.style.display = "block";
  loading.querySelector("span").innerHTML = loadingStrint[0];
  curentP = 1;
  timeoutId = setTimeout(function () {
    fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=1`);
  }, 500);
});

// Event listener for favorite dropdown
document.getElementById("navbarDropdown").addEventListener("click", function () {
  favouriteUl.classList.toggle("d-block");
});
