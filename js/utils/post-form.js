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

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function removeUnusedFields(formValues) {
  const payload = { ...formValues };
  if (payload.ImageSource === ImageSource.PICSUM) {
    delete payload.image;
  } else {
    delete payload.imageUrl;
  }
  if (!payload.id) delete payload.id;
  delete payload.ImageSource;
  return payload;
}

function getFormValues(form) {
  const values = [...form.querySelectorAll('[name]')];
  const newValue = values.reduce((init, input) => {
    switch (input.type) {
      case 'radio':
        if (input.checked) init[input.name] = input.value;
        return init;

      case 'file':
        init[input.name] = input.files[0];
        return init;
      case 'submit':
        return init;

      default:
        init[input.name] = input.value;
        return init;
    }
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
    ImageSource: yup
      .string()
      .required('please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'invalid image sourcce'),
    imageUrl: yup.string().when('ImageSource', {
      is: ImageSource.PICSUM,
      then: yup.string().required('please random a background image').url('invalid url image'),
    }),
    image: yup.mixed().when('ImageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .required('please select an image to upload')
        .test('max-3mb', 'the image is too large (max 3mb)', (file) => {
          const fileSize = file?.size || 0;
          const Max_Size = 3 * 1024 * 1024; //3mb
          return fileSize < Max_Size && fileSize > 0;
        }),
    }),
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
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));
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

function initValidationOnChange(form) {
  ['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.addEventListener('input', (e) => {
        const newValue = e.target.value;
        validateFormField(form, { [name]: newValue }, name);
      });
    }
  });
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

async function validateFormField(form, formValues, name) {
  try {
    setFieldError(form, name, '');
    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function initUploadImage(form) {
  const inputUpload = form.querySelector('[name="image"]');
  if (!inputUpload) return;
  inputUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const file1 = e.target;
    if (file) {
      const urlImage = URL.createObjectURL(file);
      const heroImg = document.querySelector('#postHeroImage');
      heroImg.style.backgroundImage = `url(${urlImage})`;

      validateFormField(form, { ImageSource: ImageSource.UPLOAD, image: file }, 'image');
    }
  });
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValue);
  let submiting = false;
  // init event
  initRandomImg(form);
  initChangeImage(form);
  initUploadImage(form);
  initValidationOnChange(form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submiting) return;
    // show loading / disabled button
    submiting = true;
    showLoading(form);
    const formValue = getFormValues(form);
    formValue.id = defaultValue.id;
    const isValid = await formValidate(form, formValue);
    const payload = removeUnusedFields(formValue);
    if (isValid) {
      await onSubmit?.(payload);
    }

    hideLoading(form);
    submiting = false;
  });
}
