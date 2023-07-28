import axios from 'axios';

const API__KEY = "38479410-4fdece6f7b350d5238491f06f"
const BASE__URL = "https://pixabay.com/api/"


const searchForm = document.querySelector(".search-form")
const gallery = document.querySelector(".gallery")
const loadMore = document.querySelector(".load-more")
let page = 1

searchForm.addEventListener("submit", onsearchFormSubmit)
loadMore.addEventListener("click", onLoadMoreClick)



async function getUser(searchEl, page) {

// return response = await axios.get(`${BASE__URL}?key=${API__KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true`);
        const response = await fetch(`${BASE__URL}?key=${API__KEY}&q=${searchEl}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
    if (!response.ok) {
    throw new Error(response.statusText);
    }
    return response.json()
};



function onsearchFormSubmit(e) {
  e.preventDefault()
  const searchEl = e.currentTarget.elements.searchQuery.value
  localStorage.setItem("keyEl", searchEl)
  
 getUser(searchEl,1).then(resp => gallery.insertAdjacentHTML("beforeend", markup(resp.hits))).catch(err => console.log(err));
  // e.currentTarget.reset()
gallery.innerHTML = ""
page = 1
};



function markup(arr) {
  return arr.map(({ largeImageURL, webformatURL, likes, views, comments, downloads }) =>
  `<div class="photo-card">
  <img src="${webformatURL}" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>views: ${views}</b>
    </p>
    <p class="info-item">
      <b>comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>downloads: ${downloads}</b>
    </p>
  </div>
</div>`
).join("");
    
}

function onLoadMoreClick() {
  const local = localStorage.getItem("keyEl")
  page += 1
  getUser(local,page).then(resp => gallery.insertAdjacentHTML("beforeend", markup(resp.hits))).catch(err => console.log(err));
}




// class ApiService {
//   constructor() {
//     this.searchQuery = "";
//      this.page = 1;
//   }

// async  getUser() {
//  page += 1
// // return response = await axios.get(`${BASE__URL}?key=${API__KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true`);
//         const response = await fetch(`${BASE__URL}?key=${API__KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=4`);
//     if (!response.ok) {
//     throw new Error(response.statusText);
//     }
//     return response.json()
// };



//   get query() {
//   return this.searchQuery
//   }
//   set query(newQuery) {
//     this.searchQuery = newQuery
//   }

// }









// webformatURL,largeImageURL,tags,

// ({hits: {likes,views,comments,downloads}})