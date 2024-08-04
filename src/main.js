import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { searchGalleryQuery } from './js/pixabay-api';
import { createImages, clearImages } from './js/render-functions';

const form = document.querySelector('.form-gallery');
const input = document.querySelector('.form-gallery-input');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');
const scrollToTopBtn = document.querySelector('.scroll-to-top');

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', handleSubmitBtn);
loadMoreBtn.addEventListener('click', handleLoadMore);
scrollToTopBtn.addEventListener('click', scrollToTop);

async function handleSubmitBtn(event) {
  event.preventDefault();
  clearImages();
  loader.classList.remove('hidden');

  currentQuery = input.value.trim();
  currentPage = 1;

  await fetchImages();

  form.reset();
}

async function handleLoadMore() {
  currentPage += 1;
  await fetchImages();
}

async function fetchImages() {
  try {
    const data = await searchGalleryQuery(currentQuery, currentPage);
    loader.classList.add('hidden');
    if (data.total === 0 || currentQuery === '') {
      iziToast.error({
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
    createImages(data);
    if (data.hits.length === 0 || currentPage * 15 >= data.totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
    smoothScroll();
    showScrollToTopBtn();
  } catch (error) {
    console.error(error);
    loader.classList.add('hidden');
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery-list')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showScrollToTopBtn() {
  if (window.scrollY > 1000) {
    scrollToTopBtn.classList.remove('hidden');
  } else {
    scrollToTopBtn.classList.add('hidden');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'auto',
  });
}

window.addEventListener('scroll', scrollToTopBtn);
