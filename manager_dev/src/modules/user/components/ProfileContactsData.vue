<template lang="pug">
  v-card.mb-3(outlined)
    v-card-text.pb-0 {{d.contacts || 'Contacts'}}
    v-card-text
      v-layout.wrap
        v-flex.md6.pr-3
          v-text-field(
            v-model="profile.email"
            label="E-mail:"
            :error-messages="emailErrors"
            @input="$v.profile.email.$touch()"
            @blur="$v.profile.email.$touch()"
          )
        v-flex.md6
          v-text-field(
            v-model="profile.phone"
            v-mask="'+7(###)###-##-##'"
            :value="profile.phone"
            :label="`${d.phone || 'Phone'}:`"
          )
        v-flex.md6.pr-3
          v-text-field(
            v-model="profile.vkontakte"
            :value="profile.vkontakte"
            label="Vkontakte"
          )
        v-flex.md6
          v-text-field(
            v-model="profile.facebook"
            :value="profile.facebook"
            label="Facebook:"
          )
        v-flex.md6.pr-3
          v-text-field(
            v-model="profile.instagram"
            :value="profile.instagram"
            label="Instagram:"
          )
    v-card-actions.px-4.pb-4.pt-0
      v-btn(
        @click="update"
        color="primary"
        depressed
      ) {{d.save || 'Save'}}
</template>


<script>
// Mixins
import { validationMixin } from "vuelidate";

// Libs
import { required, email } from "vuelidate/lib/validators";

import { mask } from "vue-the-mask";

export default {
  name: "ProfileContactsData",

  directives: {
    mask
  },

  mixins: [validationMixin],

  props: {
    profile: {
      type: Object,
      default: () => {}
    }
  },

  validations: {
    profile: {
      email: { required, email }
    }
  },

  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.profile.email.$dirty) return errors;
      !this.$v.profile.email.email &&
        errors.push(
          `${this.d.email_is_not_valid || "E-mail не E-mail is not valid"}`
        );
      !this.$v.profile.email.required &&
        errors.push(`${this.d.required_field || "Required field"}`);
      return errors;
    }
  },

  methods: {
    async update() {
      if (this.r.is_user_update) {
        this.$v.profile.$touch();
        const data = {
          params: {
            id: this.profile.id,
          },
          body: {
            email: this.profile.email,
            phone: this.profile.phone,
            facebook: this.profile.facebook,
            vkontakte: this.profile.vkontakte,
            instagram: this.profile.instagram
          },
          query: {
            filter: {
              include: ["role", "context"]
            }
          }
        };
        if (!this.$v.profile.$error) {
          await this.$store.dispatch("user/update", data);
        }
      }
    }
  }
};
</script>
