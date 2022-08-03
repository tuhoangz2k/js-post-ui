import postApi from './API/postApi';

(async () => {
  try {
    const reponse = await postApi.getAll({ _limit: 5, _page: 1 });
    console.log(reponse);
  } catch (error) {
    console.log(error);
  }
})();
