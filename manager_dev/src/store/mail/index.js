import requestDataHandler from '@/functions/requestDataHandlerWithAxios';
import axios from 'axios';

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async send({
      commit
    }, payload) {
      const data = requestDataHandler('POST', '/mail', payload);

      const response = await axios(data).catch(err => {
        this.dispatch('notification/fetch', {
          type: 'error',
          message: `${err}`,
          isActive: true
        });
      });

      if (response !== undefined && response.status === 200) {
        this.dispatch('notification/fetch', {
          type: 'success',
          message: 'Сообщение успешно отправлено!',
          isActive: true
        });
      }
    },

  },
  getters: {}
};