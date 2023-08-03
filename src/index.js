import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API__KEY = '38479410-4fdece6f7b350d5238491f06f';
const BASE__URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let gallerySimple = document.querySelector('.gallery');
let page = 1;

searchForm.addEventListener('submit', onsearchFormSubmit);
loadMore.addEventListener('click', onLoadMoreClick);
document.addEventListener('scroll', scroll);

if (localStorage.getItem('keyEl') !== null) {
  localStorage.removeItem('keyEl');
}

async function getUser(searchEl, page = 1) {
  const searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });

  const response = await axios.get(
    `${BASE__URL}?key=${API__KEY}&q=${searchEl}&page=${page}&${searchParams}`
  );
  return response;
}

async function onsearchFormSubmit(e) {
  e.preventDefault();
  const searchEl = e.currentTarget.elements.searchQuery.value;

  if (searchEl === '') {
    gallery.innerHTML = '';
    Notiflix.Notify.info('Enter the data');
    return;
  }
  localStorage.setItem('keyEl', searchEl);

  try {
    const res = await getUser(searchEl);
    gallery.insertAdjacentHTML('beforeend', markup(res.data));
    loadMore.hidden = false;

    if (!res.data.total) {
      loadMore.hidden = true;
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${res.data.totalHits} images.`);

    isTotalHits(res.data.totalHits);

    gallerySimple = new SimpleLightbox('.gallery a', {});

    return gallery;
  } catch (err) {
    Notiflix.Notify.failure('Error');
  }

  gallery.innerHTML = '';
  loadMore.hidden = true;
}

function markup(arr) {
  const hits = arr.hits;
  return hits
    .map(
      ({ largeImageURL, webformatURL, likes, views, comments, downloads }) =>
        `<div class="photo-card">
 <a href="${largeImageURL}"> <img src="${webformatURL}" alt="img" loading="lazy"  /></a>
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
    )
    .join('');
}

async function onLoadMoreClick() {
  const local = localStorage.getItem('keyEl');
  page += 1;

  try {
    const res = await getUser(local, page);

    gallery.insertAdjacentHTML('beforeend', markup(res.data));
    isTotalHits(res.data.totalHits);
    gallerySimple = new SimpleLightbox('.gallery a', {});
  } catch (error) {
    Notiflix.Notify.failure('Error');
  }
}

function isTotalHits(num) {
  const totalHits = num;
  const sumTotalHits = page * 40;
  if (totalHits < sumTotalHits) {
    loadMore.hidden = true;
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}