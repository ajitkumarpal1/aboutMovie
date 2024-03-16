const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movieID = urlParams.get('m')
const favouriteUl = document.getElementById("favouriteUl")
let movieMetaData = {}
/* set the Local storeg */
if (!localStorage.getItem("Data")) {
  localStorage.setItem("Data", "{}")
}
/* get the Local storeg in likeData to use later */
let likeData = JSON.parse(localStorage.getItem("Data"))
/* bind event with navbarDropdown for Favourite list add d-block and remove d-block */
document.getElementById("navbarDropdown").addEventListener("click", function () {
  document.getElementById("favouriteUl");
  favouriteUl.classList.toggle("d-block");
})
/* updet the local storeg object of object(likeData) */
function remove(imdbID) {
  delete likeData[imdbID]
  console.log(likeData)
  localStorage.setItem("Data", JSON.stringify(likeData));
}

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
  tempElement.setAttribute("data-id", likeData[key].imdbID)
  tempElement.querySelector("i").addEventListener("click", function () {
    remove(likeData[key].imdbID)
    tempElement.remove()
  })
  tempElement.querySelector("div").addEventListener("click", function () {
    window.location.href = `movie.html?m=${likeData[key].imdbID}`;
  })
  return tempElement;
}
/* ganret and add and remove favourit li fron ul(favouriteUl) */
(function favouriteUlUpdate() {
  Object.keys(likeData).reverse().forEach(key => {
    let tempElement = newfav(key)
    console.log(key, tempElement)
    favouriteUl.appendChild(tempElement)
  });

})()
/* update the Dom */
function setMetaData(data) {
  document.getElementById("poster").setAttribute("src", movieMetaData.Poster)
  document.getElementById('title').innerText = data.Title;
  document.getElementById('plot').innerText = data.Plot;
  document.getElementById('released').innerText = data.Released;
  document.getElementById('director').innerText = data.Director;
  document.getElementById('runtime').innerText = data.Runtime;
  document.getElementById('genre').innerText = data.Genre;
  document.getElementById('actors').innerText = data.Actors;
  document.getElementById('language').innerText = data.Language;
  document.getElementById('country').innerText = data.Country;
  document.getElementById('awards').innerText = data.Awards;
  document.getElementById('votes').innerText = data.imdbVotes;
  document.getElementById('imdbId').innerText = data.imdbID;
  document.getElementById('boxOffice').innerText = data.BoxOffice;

  const ratingStars = document.getElementById('rating');
  const rating = parseFloat(data.imdbRating);
  for (let i = 1; i <= 10; i++) {
    if (i <= Math.floor(rating)) {
      ratingStars.innerHTML += '<i class="fa fa-star"></i>';
    } else if (i - rating <= 0.5) {
      ratingStars.innerHTML += '<i class="fa fa-star-half-o"></i>';
    } else {
      ratingStars.innerHTML += '<i class="fa fa-star-o"></i>';
    }
  }
}
/* fatch movie data */
function fetchMoviData() {
  console.log(`http://www.omdbapi.com/?apikey=cd36c6f4&i=${movieID}&type=movie`)
  fetch(`http://www.omdbapi.com/?apikey=cd36c6f4&i=${movieID}&type=movie`)
    .then(x => x.json())
    .then((response) => {
      movieMetaData = response
      console.log("ajit", movieMetaData)
      setMetaData(movieMetaData)
      stBtn()
    })
}
fetchMoviData()

/* local storeg */
function setLocal(moviObj) {
  likeData[moviObj.imdbID] = moviObj
  console.log(likeData)
  localStorage.setItem("Data", JSON.stringify(likeData));
}
function remove(imdbID) {
  delete likeData[imdbID]
  console.log(likeData)
  localStorage.setItem("Data", JSON.stringify(likeData));
}

let tempElement = document.getElementById("like")
function stBtn() {
  if (likeData[movieMetaData.imdbID]) {
    tempElement.querySelector(".add").classList.add("d-none");
    tempElement.querySelector(".remove").classList.remove("d-none");
  } else {
    tempElement.querySelector(".add").classList.remove("d-none");
    tempElement.querySelector(".remove").classList.add("d-none");
  }
};
tempElement.querySelector(".add").addEventListener("click", function () {
  setLocal(movieMetaData) 
  let elementLi = newfav(movieMetaData.imdbID)

  favouriteUl.firstElementChild.before(elementLi)
  stBtn()
})
tempElement.querySelector(".remove").addEventListener("click", function () {
  remove(movieMetaData.imdbID)
  document.querySelector(`[data-id=${movieMetaData.imdbID}]`).remove();
  stBtn()
})