import axios from 'axios';

const API__KEY = "38479410-4fdece6f7b350d5238491f06f"
const BASE__URL = "https://pixabay.com/api/"


const searchForm = document.querySelector(".search-form")
const gallery = document.querySelector(".gallery")

searchForm.addEventListener("submit", onsearchFormSubmit)

async function getUser() {
// return response = await axios.get(`${BASE__URL}?key=${API__KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true`);
        const response = await fetch(`${BASE__URL}?key=${API__KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true`);
    if (!response.ok) {
    throw new Error(response.statusText);
    }
    return response.json()
};



function onsearchFormSubmit(e) {
    e.preventDefault()
    const searchEl = e.currentTarget.elements.searchQuery.value
    getUser().then(resp => gallery.insertAdjacentHTML("beforeend",
    markup(resp.hits))).catch(err => console.log(err));
};

   
function markup(arr) {
  console.log(arr)

  return arr.map(({ likes, views, comments, downloads }) =>

        `<div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>`
    ).join("");
    
}
// webformatURL,largeImageURL,tags,

// ({hits: {likes,views,comments,downloads}})