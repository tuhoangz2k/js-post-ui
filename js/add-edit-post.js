import postApi from './API/postApi';
import { initPostForm, toast } from './utils';

async function handleFormSubmit(formValue) {
  try {
    const formData = jsonToFormData(formValue);
    const savedPost = formValue.id
      ? await postApi.formUpdate(formValue)
      : await postApi.formAdd(formValue);
    toast.success('success');
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {}
}

function jsonToFormData(json) {
  const formData = new FormData();
  for (const key in json) {
    formData.set(key, json[key]);
  }

  return formData;
}

(async () => {
  try {
    const queryParams = new URLSearchParams(window.location.search);
    const editId = queryParams.get('id');
    const defaultValue = editId
      ? await postApi.getById(editId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: handleFormSubmit,
    });
  } catch (error) {
    console.log(error.message);
  }
})();
