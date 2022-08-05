function showModal(element) {
  const modal = new bootstrap.Modal(element);
  if (modal) modal.show();
}
function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;
  if (modalElement.dataset.registered) return;
  // selectors
  const imgElement = document.querySelector(imgSelector);
  const prevButton = document.querySelector(prevSelector);
  const nextButton = document.querySelector(nextSelector);
  if (!nextButton || !prevButton || !imgElement) return;
  // lightbox vars
  let imgList = [];
  let currentIndex = 0;
  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src;
  }
  // handle click for all images => use event delegation
  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    imgList = document.querySelectorAll(`[data-album=${target.dataset.album}]`);
    currentIndex = [...imgList].findIndex((img) => img === target);
    showImageAtIndex(currentIndex);
    //  show modal
    showModal(modalElement);

    prevButton.addEventListener('click', () => {
      if (currentIndex <= 0) {
        currentIndex = imgList.length - 1;
        showImageAtIndex(currentIndex);
      } else {
        currentIndex = currentIndex - 1;
        showImageAtIndex(currentIndex);
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentIndex >= imgList.length - 1) {
        currentIndex = 0;

        showImageAtIndex(currentIndex);
      } else {
        currentIndex = currentIndex + 1;

        showImageAtIndex(currentIndex);
      }
    });
  });
  // img click --> find all images with the albums

  modalElement.dataset.registered = 'true';
}

export { registerLightBox };
