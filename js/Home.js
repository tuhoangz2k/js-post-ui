import postApi from './API/postApi';
import { renderPostList, initSearchTerm, renderPagination, initPagination, toast } from './utils';

async function handleFilterChange(filterName, filterValue) {
  // update query params
  try {
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);

    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postsList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

function registerPostListEvent() {
  document.addEventListener('post-delete', async (e) => {
    try {
      const post = e.detail;
      if (window.confirm('do you sure want to remove this post?')) {
        await postApi.remove(post.id);
        await handleFilterChange();
      }
    } catch (error) {
      console.log('faild to remove post', error.message);
      toast.error(error.message);
    }
  });
}

(async () => {
  try {
    const url = new URL(window.location);
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;
    registerPostListEvent();
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });
    initSearchTerm({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postsList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log(error);
  }
})();
