import requestDataHandler from '@/functions/requestDataHandlerWithAxios';
import axios from 'axios';
import router from '@/routers';

import profile from '@/models/user';
import rules from '@/models/rules_default';

const rulesParse = {
  ...rules
};
for (const rule in rulesParse) {
  rulesParse[rule] = rulesParse[rule].value;
}

export default {
  namespaced: true,

  state: {
    profile: {
      ...profile
    },
    resources: [],
    rules: {
      ...rulesParse
    }
  },

  mutations: {
    set(state, payload) {
      state.profile = payload;
    },

    setRules(state, payload) {
      const rules = JSON.parse(payload);
      for (const rule in rules) {
        rules[rule] = rules[rule].value;
      }
      state.rules = rules;
    },

    setResources(state, payload) {
      state.resources = payload;
    }
  },

  actions: {
    async findByAccessToken({
      commit
    }) {
      this.dispatch('preloader/fetch', true);
      const data = requestDataHandler('GET', '/profile');

      const response = await axios(data).catch(err => {
        this.dispatch('preloader/fetch', false);
        this.dispatch("notification/fetch", {
          type: "error",
          message: `${err}`,
          isActive: true
        });
        router.push('/');
      });

      if (response !== undefined && response.status === 200) {
        commit('setRules', response.data.role.rules);
        this.dispatch('preloader/fetch', false);
        localStorage.setItem('x-api-key', response.data.token);

        const dataSystemSetting = requestDataHandler('GET', '/system-settings/findone', 'systemSetting/findAll', {
          filter: {
            where: {
              slug: 'main_lang'
            }
          }
        });

        const responseSystemSetting = await axios(dataSystemSetting).catch(err => {
          this.dispatch('preloader/fetch', true);
          this.dispatch("notification/fetch", {
            type: "error",
            message: `${err}`,
            isActive: true
          });
        });

        if (responseSystemSetting !== undefined && responseSystemSetting.status === 200) {
          this.dispatch('base/setMainLang', responseSystemSetting.data.value);
          if (!localStorage.getItem('admin-panel-lang')) {
            localStorage.setItem('admin-panel-lang', responseSystemSetting.data.value);
          }

          await this.dispatch("dictionary/findOne", {
            query: {
              filter: {
                where: {
                  lang: localStorage.getItem("admin-panel-lang") || responseSystemSetting.data.value
                }
              }
            }
          });

          const dataResources = requestDataHandler('GET', '/resources', undefined, {
            filter: {
              where: {
                level: 1,
                userId: response.data.id,
                lang: responseSystemSetting.data.value
              }
            }
          });

          const responseResources = await axios(dataResources).catch(err => {
            this.dispatch('preloader/fetch', true);
            this.dispatch("notification/fetch", {
              type: "error",
              message: `${err}`,
              isActive: true
            });
          });

          commit('set', response.data);

          if (responseResources !== undefined && responseResources.status === 200) {
            this.dispatch('preloader/fetch', false);
            commit('setResources', responseResources.data);
          }
        }

      }
    },

    async createByEmail({
      commit
    }, payload) {
      this.dispatch('preloader/fetch', true);
      const data = requestDataHandler('POST', '/profile/create-by-email', payload.body);

      const response = await axios(data).catch(err => {
        this.dispatch('preloader/fetch', false);
        this.dispatch("notification/fetch", {
          type: "error",
          message: `${err}`,
          isActive: true
        });
      });

      if (response !== undefined && response.status === 200) {
        this.dispatch('preloader/fetch', false);
        this.dispatch('user/set', response.data);
        router.push(`/users/${response.data.id}`)
        this.dispatch("notification/fetch", {
          type: "success",
          message: 'Успешно сохранено!',
          isActive: true
        });
      }
    },

    async update({
      commit
    }, payload) {
      this.dispatch('preloader/fetch', true);
      const data = requestDataHandler('PUT', '/profile/update', payload.body);

      const response = await axios(data).catch(err => {
        this.dispatch('preloader/fetch', false);
        this.dispatch("notification/fetch", {
          type: "error",
          message: `${err}`,
          isActive: true
        });
      });

      if (response !== undefined && response.status === 200) {
        this.dispatch('preloader/fetch', false);
        this.dispatch('profile/set', response.data);
        this.dispatch("notification/fetch", {
          type: "success",
          message: 'Успешно сохранено!',
          isActive: true
        });
      }
    },

    async changePassword({
      commit
    }, payload) {
      this.dispatch('preloader/fetch', true);
      const data = requestDataHandler('PUT', '/profile/password-change', payload.body);

      const response = await axios(data).catch(err => {
        this.dispatch('preloader/fetch', false);
        this.dispatch("notification/fetch", {
          type: "error",
          message: `${err}`,
          isActive: true
        });
      });

      if (response !== undefined && response.status === 200) {
        this.dispatch('preloader/fetch', false);
        this.dispatch("notification/fetch", {
          type: "success",
          message: 'Успешно сохранено!',
          isActive: true
        });
      }
    },

    async remove({
      commit
    }) {
      this.dispatch('preloader/fetch', true);
      const data = requestDataHandler('DELETE', '/profile/remove');

      const response = await axios(data).catch(err => {
        this.dispatch('preloader/fetch', false);
        this.dispatch("notification/fetch", {
          type: "error",
          message: `${err}`,
          isActive: true
        });
      });

      if (response !== undefined && response.status === 200) {
        this.dispatch('preloader/fetch', false);
        this.dispatch('authenticate/logout');
      }
    },

    set({
      commit
    }, payload) {
      commit('set', payload);
    },

    setResources({
      commit
    }, payload) {
      commit('setResources', payload);
    },

    clear({
      commit
    }) {
      commit('set', {
        ...profile
      })
    },

    clearRules({
      commit
    }) {
      commit('setRules', JSON.stringify({
        ...rulesParse
      }));
    },

    clearResources({
      commit
    }) {
      commit('setResources', []);
    },
  },

  getters: {
    get(state) {
      return state.profile;
    },
    getRules(state) {
      return state.rules;
    },
    getResources(state) {
      return state.resources;
    }
  }
};
