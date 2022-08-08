import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/posts';

    return axiosClient.post(url, data);
  },

  formUpdate(data) {
    const url = `/with-thumbnail/posts/${data.id}`;
    return axiosClient.patch(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  formAdd(data) {
    const url = `/with-thumbnail/posts`;
    return axiosClient.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },
  remove(id) {
    const url = `/posts/${id}`;

    return axiosClient.delete(url);
  },
};
export default postApi;
