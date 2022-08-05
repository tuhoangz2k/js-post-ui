import debounce from 'lodash.debounce';

function initSearchTerm({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;
  if (defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like');
  } else {
    searchInput.value = '';
  }
  const debounceSearch = debounce((e) => onChange?.(e.target.value), 350);
  searchInput.addEventListener('input', debounceSearch);
}

export { initSearchTerm };
