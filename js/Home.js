import postApi from './API/postApi';
import { setTextContent, truncateText, getUlPagination } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import debounce from 'lodash.debounce';
dayjs.extend(relativeTime);

function createElement(post) {
  if (!post) return;
  // find and close template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;
  const liElement = postTemplate.content.firstElementChild.cloneNode(true);

  if (!liElement) return;
  // thumbnail, title , description, author,day update

  setTextContent(liElement, '[data-id="title"]', truncateText(post.title, 80));
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description));
  setTextContent(liElement, '[data-id="author"]', truncateText(post.author));
  const updateTime = dayjs(post.updatedAt).fromNow();
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${updateTime}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://phocode.com/wp-content/uploads/2020/10/placeholder-1-1.png';
    });
  }

  // attach

  return liElement;
}

function renderPostList(posts) {
  console.log(posts);
  if (!Array.isArray(posts) || posts.length === 0) return;
  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;
  ulElement.textContent = '';
  posts.forEach((post) => {
    const liElement = createElement(post);
    ulElement.appendChild(liElement);
  });
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination();
  if (!pagination || !ulPagination) return;
  // calc totalPages
  console.log(pagination);
  const { _limit, _page, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if disable or enable for next and prev link
  if (_page <= 1) {
    ulPagination.firstElementChild?.classList.add('disabled');
  } else {
    ulPagination.firstElementChild?.classList.remove('disabled');
  }

  if (_page >= totalPages) {
    ulPagination.lastElementChild?.classList.add('disabled');
  } else {
    ulPagination.lastElementChild?.classList.remove('disabled');
  }
}

async function handleFilterChange(filterName, filterValue) {
  // update query params
  try {
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

function handlePrevLink(e) {
  e.preventDefault();
  e.stopPropagation();

  // fetch Api
  const ulPagination = getUlPagination();
  if (!ulPagination) return;
  const page = ulPagination.dataset.page;
  if (page <= 1) return;
  handleFilterChange('_page', page - 1);
}

function handleNextLink(e) {
  e.preventDefault();
  e.stopPropagation();

  const ulPagination = getUlPagination();
  if (!ulPagination) return;
  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalPages = Number.parseInt(ulPagination.dataset.totalPages);
  if (page >= totalPages) return;
  handleFilterChange('_page', page + 1);
}

function initPagination() {
  // bind click event for prev/next link
  const ulPagination = document.querySelector('#pagination');
  if (!ulPagination) return;
  const prevLink = ulPagination?.firstElementChild.firstElementChild;
  const nextLink = ulPagination?.lastElementChild.firstElementChild;

  // add event click for prev link
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevLink);
  }

  // add event click for next link
  if (nextLink) {
    nextLink.addEventListener('click', handleNextLink);
  }
}

function initSearchTerm() {
  const searchInput = document.querySelector('#searchInput');
  if (!searchInput) return;
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  } else {
    searchInput.value = '';
  }
  const debounceSearch = debounce((e) => handleFilterChange('title_like', e.target.value), 350);
  searchInput.oninput = debounceSearch;
}

(async () => {
  try {
    const url = new URL(window.location);
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);

    history.pushState({}, '', url);
    initPagination();
    initSearchTerm();
    const queryParams = url.searchParams;

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log(error);
  }
})();
