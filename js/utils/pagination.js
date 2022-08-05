import { getUlPagination } from './index';

function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
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

function initPagination({ elementId, defaultParams, onChange }) {
  // bind click event for prev/next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;
  const prevLink = ulPagination?.firstElementChild.firstElementChild;
  const nextLink = ulPagination?.lastElementChild.firstElementChild;

  // add event click for prev link
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // fetch Api
      const page = ulPagination.dataset.page;
      if (page <= 1) return;
      onChange(page - 1);
    });
  }

  // add event click for next link
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPages = Number.parseInt(ulPagination.dataset.totalPages);
      if (page >= totalPages) return;
      onChange(page + 1);
    });
  }
}

export { renderPagination, initPagination };
