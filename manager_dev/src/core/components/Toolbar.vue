<template lang="pug">
  v-app-bar.primary(app dark flat)
    v-toolbar-title
      // v-img.mr-4.mobile-logo(
      //   src="/static/logo.svg"
      //   max-width="40px"
      //   aspect-ratio="1"
      // )
    v-toolbar-items.hidden-xs-and-down
      v-btn(text to="/users" v-if="r.is_user_read && isAuth") {{d.users || 'Users'}}
      applications-menu(
        v-if="isAuth"
      )
    v-spacer
    v-toolbar-items.hidden-xs-and-down
      v-btn(text v-if="!isAuth" @click="$emit('openLoginDialog')") {{d.login || 'Login'}}
    v-toolbar-items.hidden-xs-and-down
      v-menu(offset-y)
        template(v-slot:activator="{ on }")
          v-btn(
            text
            v-on="on"
          )
            v-img(
              :src="`/images/flags/${dictionary.lang || mainLang}.svg`"
              width="30"
            )
        v-list
          v-list-item(
            v-for="dictionary in dictionaries"
            :key="dictionary.lang"
            @click="changeLang(dictionary.lang)"
          )
            v-img.mr-2(:src="`/images/flags/${dictionary.lang || mainLang}.svg`", width="30")
            v-list-item-title {{dictionary.lang}}
      v-btn(text slot="activator" to="/profile" v-if="isAuth")
        div.body-1.mr-3 {{ firstname }} {{lastname}}
        v-avatar.mr-3(size="40" color="grey lighten-4")
          img(:src="`${imgFolderBasePath}/${image}`")
      v-menu(offset-y v-if="isAuth")
        template(v-slot:activator="{ on }")
          v-btn(
            text
            icon
            v-on="on"
          )
            v-icon settings
        v-list
          v-list-item(to="/roles" v-if="r.is_role_read")
            v-list-item-title {{d.roles || 'Roles'}}
          v-list-item(to="/system-settings" v-if="r.is_system_setting_read")
            v-list-item-title {{d.system_settings || 'System settings'}}
          v-list-item(to="/contexts" v-if="r.is_context_read")
            v-list-item-title {{d.contexts || 'Contexts'}}
          v-list-item(to="/dictionaries")
            v-list-item-title {{d.dictionaries || 'Dictionaries'}}
          v-list-item(@click="logout")
            v-list-item-title {{d.logout || 'Logout'}}
</template>

<script>
import { imgFolderBasePath } from "@/core/config";

// Components
import ApplicationsMenu from "./ApplicationsMenu";

export default {
  name: "Toolbar",

  components: {
    ApplicationsMenu
  },

  props: {
    profileId: {
      type: String,
      default: ""
    },
    firstname: {
      type: String,
      default: ""
    },
    lastname: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      imgFolderBasePath,
      isLogo: true
    };
  },

  computed: {
    profile() {
      return this.$store.getters["profile/getProfile"];
    },

    dictionary() {
      return this.$store.getters["dictionary/get"];
    },

    dictionaries() {
      return this.$store.getters["dictionary/getAll"];
    },

    logo() {
      return this.isLogo ? "/static/logo.svg" : "/static/dev-logo.svg";
    }
  },

  methods: {
    async changeLang(lang) {
      localStorage.setItem("admin-panel-lang", lang);
      await this.$store.dispatch("dictionary/findOne", {
        query: {
          filter: {
            where: {
              lang
            }
          }
        }
      });
    },

    async logout() {
      this.$router.push("/");
      await this.$store.dispatch("authenticate/logout");
      // this.$store.dispatch("field/clear");
      // this.$store.dispatch("field/clearAll");
      // this.$store.dispatch("field/clearLayouts");
      // this.$store.dispatch("layout/clear");
      // this.$store.dispatch("layout/clearAll");
      // this.$store.dispatch("profile/clear");
      // this.$store.dispatch("profile/clearResources");
      // this.$store.dispatch("profile/clearRules");
      // this.$store.dispatch("role/clear");
      // this.$store.dispatch("role/clearAll");
      // this.$store.dispatch("user/clear");
      // this.$store.dispatch("user/clearAll");
    }
  }
};
</script>

<style lang="sass">
  .mobile-logo
    display: none
</style>
