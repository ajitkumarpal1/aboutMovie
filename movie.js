/* function a(){ */
    let curentP = 1;
    let title ="Avtar"
    const liDom = document.getElementById("clone").cloneNode(true);
    const loading = document.getElementById("loading");
    liDom.removeAttribute("id");
    liDom.style.display = "flex";
    const movieList = document.querySelector("#movi-list");
    const favouriteUl = document.getElementById("favouriteUl");
    if (!localStorage.getItem("Data")) {
      localStorage.setItem("Data", "{}")
    }
    const search = document.querySelector("#search")
    let likeData = JSON.parse(localStorage.getItem("Data"))
    function setLocal(moviObj) {
      likeData[`${moviObj.imdbID}`] = moviObj
      console.log(likeData)
      localStorage.setItem("Data", JSON.stringify(likeData));
    }
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
        let t = document.querySelector(`[data-card-id=${likeData[key].imdbID}]`)
        remove(likeData[key].imdbID)
        if (t) {
          t.querySelector(".add").classList.remove("d-none");
          t.querySelector(".remove").classList.add("d-none");
        }
        tempElement.remove()
      })
      tempElement.querySelector("div").addEventListener("click", function () {
        alert("b")
      })
      return tempElement;
    }
    function favouriteUlUpdate() {
    
      Object.keys(likeData).reverse().forEach(key => {
        let tempElement = newfav(key)
        favouriteUl.appendChild(tempElement)
      });
    
    }
    favouriteUlUpdate();
    
    loading.style.display = "block";
    let obj = null;
    function fetchData(url) {
      console.log(url)
      fetch("data.json")
        .then(x => x.json())
        .then(y => {
          console.log(y);
          obj = y;
          setList(obj)
          if (url === `http://www.omdbapi.com/?apikey=cd36c6f4&s=avatar&type=movie&y=Spider&page=1`) { pagination() }
    
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=1`)
    function setList(obj) {
    
      obj.Search.map(element => {
        const tempElement = liDom.cloneNode(true)
        tempElement.setAttribute("data-card-id", element.imdbID)
        tempElement.querySelector("img").setAttribute("src", element.Poster);
        tempElement.querySelector("h4").innerText = element.Title
        tempElement.querySelector("samp").innerText = `${element.Year} - ${element.Type}`
        tempElement.querySelector(".add").addEventListener("click", function () {
          setLocal(element)
          let elementLi = newfav(element.imdbID)
          favouriteUl.firstElementChild.before(elementLi)
          stBtn()
        })
        tempElement.querySelector(".remove").addEventListener("click", function () {
          remove(element.imdbID)
          document.querySelector(`[data-id=${element.imdbID}]`).remove();
          stBtn()
        })
        /* likeData */
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
        movieList.appendChild(tempElement)
      });
      loading.style.display = "none";
    }
    /* setList() */
    function pagination() {
      document.querySelectorAll("[data-curent-page=true]").forEach(element => {
        element.remove()
      });
      const pagrli = document.getElementById("page").cloneNode(true);
      const nextPage = document.getElementById("nextPage");
      const previousPage = document.getElementById("previousPage");
      pagrli.removeAttribute("style")
      pagrli.removeAttribute("id")
    
      totalPage = obj.totalResults % 10 == 0 ? obj.totalResults / 10 : Math.floor((obj.totalResults / 10) + 1);
      for (let i = 0; i < totalPage; i++) {
    
        const tamElement = pagrli.cloneNode(true);
        tamElement.querySelector("a").innerText = (i + 1);
        if (curentP == i + 1) {
          tamElement.querySelector("a").style.border = "none";
          tamElement.querySelector("a").style.setProperty("background-color", "#0a0a47", "important");
    
    
        }
    
        tamElement.setAttribute("data-curent-page", true)
        tamElement.addEventListener("click", function () {
          movieList.innerHTML = ""
          movieList.appendChild(loading)
          loading.style.display = "block";
          curentP = i + 1;
          fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=${i + 1}`)
          /* pagination() */
        })
    
        nextPage.before(tamElement);
        console.log(tamElement)
    
      }
    
    
      pagrli.removeAttribute("style")
    
    }
    nextPage.addEventListener("click", function () {
      if (totalPage > curentP) {
        pagination(++curentP)
        fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=${++curentP}`)
        pagination()
      }
    }
    )
    previousPage.addEventListener("click", function () {
      
      if (1 < curentP) {
        pagination(--curentP)
        fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=${++curentP}`)
        pagination()
      }
    }
    )
    let timeoutId;
    search.addEventListener("input", function () {
      if(search.value != ""){
        title = "Avatra"
      }
      title = search.value
      clearTimeout(timeoutId);
      movieList.innerHTML = ""
      movieList.appendChild(loading)
      loading.style.display = "block";
      timeoutId = setTimeout(function () {
    
    
    
        console.log(search.value);
    
        fetchData(`http://www.omdbapi.com/?apikey=cd36c6f4&s=${title}&type=movie&y=Spider&page=1`)
      }, 500);
    });
    document.getElementById("navbarDropdown").addEventListener("click", function () {
      document.getElementById("favouriteUl");
      favouriteUl.classList.toggle("d-block");
    })
    /* }
    a(); */