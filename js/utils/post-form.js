import { setTextContent, setValueInput } from './common';
import * as yup from 'yup';
function setFormValues(form, values) {
  const heroImg = document.querySelector('#postHeroImage');
  heroImg.style.backgroundImage = `url(${values?.imageUrl})`;
  setValueInput(form, '[name="title"]', values?.title);
  setValueInput(form, '[name="author"]', values?.author);
  setValueInput(form, '[name="description"]', values?.description);
  setValueInput(form, '[name="imageUrl"]', values?.imageUrl);
}

function getFormValues(form) {
  const values = [...form.querySelectorAll('[name]')];
  const newValue = values.reduce((init, input) => {
    init[input.name] = input.value;
    return init;
  }, {});
  return newValue;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('please enter your title'),
    author: yup
      .string()
      .required('please enter author')
      .test(
        'at-least-two-words',
        'please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup.string().required('please random your image').url('please enter valid image URL'),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function formValidate(form, formValue) {
  // get errors

  try {
    // reset previous error
    ['title', 'author'].forEach((name) => setFieldError(form, name, ''));
    const schema = getPostSchema();
    await schema.validate(formValue, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    for (const validationError of error.inner) {
      const name = validationError.path;
      if (errorLog[name]) continue;
      setFieldError(form, name, validationError.message);
      errorLog[name] = true;
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading(form) {
  const btn = form.querySelector('[name="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const btn = form.querySelector('[name="submit"]');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Save';
  }
}

function initRandomImg(form) {
  const randomBtn = form.querySelector('#postChangeImage');
  if (!randomBtn) return;
  randomBtn.addEventListener('click', () => {
    const random = Math.ceil(Math.random() * 1000);
    const randomImgUrl = `https://picsum.photos/id/${random}/1368/400`;
    const heroImg = document.querySelector('#postHeroImage');
    heroImg.style.backgroundImage = `url(${randomImgUrl})`;
    setValueInput(form, '[name="imageUrl"]', randomImgUrl);
  });
}

function renderUploadFile(form) {
  const checked = form.querySelector('[name="ImageSource"]:checked');
  const choise = form.querySelectorAll('[data-image-source]');
  for (const value of choise) {
    if (value.dataset.imageSource === checked.value) {
      value.hidden = false;
    } else {
      value.hidden = true;
    }
  }
}

function initChangeImage(form) {
  const formChoose = form.querySelectorAll('[name="ImageSource"]');
  for (let index = 0; index < formChoose.length; index++) {
    const element = formChoose[index];
    element.addEventListener('change', (e) => {
      renderUploadFile(form);
    });
  }
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValue);
  let submiting = false;
  // init event
  initRandomImg(form);
  initChangeImage(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submiting) return;
    // show loading / disabled button
    submiting = true;
    showLoading(form);
    const formValue = getFormValues(form);
    formValue.id = defaultValue.id;
    const isValid = await formValidate(form, formValue);
    if (!isValid) {
      submiting = false;
      hideLoading(form);

      return;
    }

    await onSubmit?.(formValue);
    hideLoading(form);
    submiting = false;
  });
}
