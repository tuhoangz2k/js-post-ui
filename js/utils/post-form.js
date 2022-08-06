import { setValueInput } from './common';

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

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValue);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formValue = getFormValues(form);
    console.log(formValue);
  });
}
