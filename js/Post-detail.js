import postApi from './API/postApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { registerLightBox } from './utils/lightBox';
dayjs.extend(relativeTime);

function initPostDetail(post) {
  const postHero = document.getElementById('postHeroImage');
  const postDetailTitle = document.getElementById('postDetailTitle');
  const author = document.getElementById('postDetailAuthor');
  const timeSpan = document.getElementById('postDetailTimeSpan');
  const now = dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm');

  postHero.style.backgroundImage = `url(${post.imageUrl})`;
  postDetailTitle.textContent = post.title;
  author.textContent = post.author;
  timeSpan.textContent = `- ${now}`;
  postHero.addEventListener('error', () => {
    postHero.src =
      'https://i0.wp.com/phocode.com/wp-content/uploads/2020/10/placeholder-1-1.png?fit=800%2C800&ssl=1';
  });

  //   render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  }
}

(async () => {
  registerLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });

  try {
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');
    const postDetail = await postApi.getById(postId);

    initPostDetail(postDetail);
  } catch (error) {
    const { status, statusText } = error.response;
    if (status === 404 && statusText === 'Not Found') {
      window.location.assign('/not-found.html');
    } else {
      alert(error.message);
    }
  }
})();
