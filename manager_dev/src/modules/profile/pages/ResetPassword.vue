<template lang="pug">
  v-card(
    class="mx-auto"
    tag="form"
    max-width="500px"
  )
    v-card-title
      h1(class="title") {{d.reset_password || 'Reset password'}}
    v-card-text
      v-text-field(
        v-model="email"
        label="E-mail:"
        :error-messages="emailErrors"
        required
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
        v-if="!$route.query.token"
      )
      v-text-field(
        v-model="password"
        :label="`${d.password || 'Password'}:`"
        :error-messages="passErrors"
        type="password"
        required
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
        v-if="$route.query.token"
      )
      v-text-field(
        v-model="confirmPassword"
        :label="`${d.confirm_password || 'Confirm password'}:`"
        :error-messages="confirmPasswordErrors"
        type="password"
        required
        @input="$v.confirmPassword.$touch()"
        @blur="$v.confirmPassword.$touch()"
        v-if="$route.query.token"
      )
    v-card-actions
      v-btn(
        @click="request"
        color="primary"
        class="ml-auto mr-2 mb-2"
        v-if="!$route.query.token"
      ) {{d.send_request || 'Send request'}}
      v-btn(
        @click="changePassword"
        color="primary"
        class="ml-auto mr-2 mb-2"
        v-if="$route.query.token"
      ) {{d.change || 'Change'}}
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
export default {
  name: "ResetPassword",

  metaInfo() {
    return {
      title: `${this.d.reset_password || "Reset password"}`
    };
  },

  mixins: [validationMixin],

  validations: {
    password: { required, minLength: minLength(6) },
    confirmPassword: {
      required,
      minLength: minLength(6),
      sameAsPassword: sameAs("password")
    },
    email: { required, email }
  },

  data() {
    return {
      email: "",
      password: "",
      confirmPassword: ""
    };
  },

  computed: {
    passErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push(
          `${this.d.field_must_be_have_more_six_sumbols ||
            "The field must be at least 6 characters"}`
        );
      !this.$v.password.required &&
        errors.push(`${this.d.required_field || "Required field"}`);
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.required &&
        errors.push(`${this.d.required_field || "Required field"}`);
      !this.$v.confirmPassword.minLength &&
        errors.push(
          `${this.d.field_must_be_have_more_six_sumbols ||
            "The field must be at least 6 characters"}`
        );
      !this.$v.confirmPassword.sameAsPassword &&
        errors.push(
          `${this.d.password_not_confirm || "Passwords do not match!"}`
        );
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email &&
        errors.push(
          `${this.d.email_is_not_valid || "E-mail не E-mail is not valid"}`
        );
      !this.$v.email.required &&
        errors.push(`${this.d.required_field || "Required field"}`);
      return errors;
    }
  },

  methods: {
    async request() {
      this.$v.$touch();
      if (this.$v.email.$error) {
        return;
      }

      const data = {
        email: this.email
      };

      await this.$store.dispatch("profile/resetPasswordByEmailRequest", {
        body: data
      });

      this.email = "";

      this.$emit("closeLoginDialog");
    },

    async changePassword() {
      this.$v.$touch();
      if (this.$v.password.$error && this.$v.confirmPassword.$error) {
        return;
      }

      await this.$store.dispatch("profile/resetPasswordByEmail", {
        body: {
          password: this.password
        },
        headers: {
          "x-reset-token": this.$route.query.token
        }
      });
    }
  }
};
</script>
