import postApi from './API/postApi';
import { initPostForm } from './utils';
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
      onSubmit: (formValue) => {
        console.log(formValue);
      },
    });
  } catch (error) {
    console.log(error.message);
  }
})();
