import { setTextContent, truncateText } from './index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

function createElement(post) {
  if (!post) return;
  // find and close template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;
  const liElement = postTemplate.content.firstElementChild.cloneNode(true);

  if (!liElement) return;
  // thumbnail, title , description, author,day update
  const divElement = liElement.firstElementChild;
  divElement.addEventListener('click', (e) => {
    // if event is triggered from menu -->ignore
    const menu = liElement.querySelector('[data-id="menu"]');
    if (menu && menu.contains(e.target)) {
      return;
    }
    window.location.assign(`/post-detail.html?id=${post.id}`);
  });
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

  const editBtn = liElement.querySelector('[data-id="edit"]');
  if (!editBtn) return;
  editBtn.addEventListener('click', (e) => {
    // e.stopPropagation();
    window.location.assign(`/add-edit-post.html?id=${post.id}`);
    console.log('child');
  });
  // attach

  return liElement;
}

function renderPostList(elementId, posts) {
  console.log(posts);
  if (!Array.isArray(posts) || posts.length === 0) return;
  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;
  ulElement.textContent = '';
  posts.forEach((post) => {
    const liElement = createElement(post);
    ulElement.appendChild(liElement);
  });
}

export { renderPostList, createElement };
