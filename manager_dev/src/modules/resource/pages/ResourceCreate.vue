<template lang="pug">
  v-flex(v-if="r.is_resource_create")
    .body-2.mt-2.mb-12 {{d.resource_creation || 'Resource creation'}}
    v-layout.wrap
      v-flex.xs12.md7.pr-2
        v-card.mb-3(outlined)
          v-card-text {{d.common_data || 'Common data'}}
          v-card-text
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-text-field(
                  v-model="resource.slug"
                  :label="`${d.slug || 'Slug'}:`"
                  v-on="on"
                  @input="$v.resource.slug.$touch()"
                  @blur="$v.resource.slug.$touch()"
                  :error-messages="slugErrors"
                )
              span slug
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-text-field(
                  v-model="resource.title"
                  :label="`${d.name || 'Name'}:`"
                  v-on="on"
                  @input="$v.resource.title.$touch()"
                  @blur="$v.resource.title.$touch()"
                  :error-messages="titleErrors"
                )
              span title
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-textarea(
                  v-model="resource.description"
                  :label="`${d.description || 'Description'}:`"
                  v-on="on"
                  no-resize
                )
              span description
          v-card-actions.px-4.pb-4
            v-btn(
              color="primary"
              depressed
              @click="create"
            ) {{d.create || 'Create'}}

      v-flex.xs12.md5.pl-2
        resource-secondary-data
</template>

<script>
import { validationMixin } from "vuelidate";

// Libs
import { required, minLength, helpers } from "vuelidate/lib/validators";
import cyrillicToTranslit from "cyrillic-to-translit-js";

const alpha = helpers.regex("alpha", /^[a-zA-Z0-9_-]*$/);

// Components
import ResourceSecondaryData from "../components/ResourceSecondaryData";

export default {
  name: "ResourceCreatePage",

  components: {
    ResourceSecondaryData
  },

  mixins: [validationMixin],

  validations: {
    resource: {
      slug: { required, alpha, minLength: minLength(3) },
      title: { required, minLength: minLength(3) }
    }
  },

  metaInfo() {
    return {
      title: `${this.d.resource_create || "Resource creation"}`
    };
  },

  computed: {
    resource() {
      return this.$store.getters["resource/get"];
    },
    slugErrors() {
      const errors = [];
      if (!this.$v.resource.slug.$dirty) return errors;
      !this.$v.resource.slug.minLength &&
        errors.push(
          `${this.d.field_must_be_have_more_three_sumbols ||
            "The field must be at least 3 characters"}`
        );
      !this.$v.resource.slug.alpha &&
        errors.push(
          `${this.d.only_en_symbols || "Only latin characters allowed"}`
        );
      !this.$v.resource.slug.required &&
        errors.push(`${this.d.required_field || "Required field"}`);
      return errors;
    },
    titleErrors() {
      const errors = [];
      if (!this.$v.resource.title.$dirty) return errors;
      !this.$v.resource.title.minLength &&
        errors.push(
          `${this.d.field_must_be_have_more_three_sumbols ||
            "The field must be at least 3 characters"}`
        );
      !this.$v.resource.title.required &&
        errors.push(`${this.d.required_field || "Required field"}`);
      return errors;
    }
  },

  async mounted() {
    this.$store.dispatch("resource/clear");
    this.resource.contextId = this.$store.getters["profile/get"].context.id;
  },

  methods: {
    async createResource() {
      this.translitSlug();
      this.$v.$touch();
      if (this.r.is_resource_create && !this.$v.$error) {
        if (this.$route.query.level) {
          this.resource.level = Number(this.$route.query.level) + 1;
        } else {
          this.resource.level = 1;
        }

        if (this.$route.query.parentId) {
          this.resource.parentId = this.$route.query.parentId;
        }

        if (this.$route.query.contextId) {
          this.resource.contextId = this.$route.query.contextId;
        }

        this.resource.lang = this.mainLang;

        if (!this.resource.contextId && this.resource.contextId === "") {
          this.resource.contextId = this.$store.getters[
            "profile/get"
          ].context.id;
        }

        const bool = await this.$store.dispatch("resource/create", {
          body: this.resource
        });

        if (bool) {
          this.$router.push(
            `/resources/${this.$store.getters["resource/get"].id}`
          );
        }
      }
    },

    async createTranslation() {
      this.translitSlug();
      this.$v.$touch();
      if (this.r.is_resource_create && !this.$v.$error) {
        this.resource.level = this.$route.query.level;

        if (Number(this.$route.query.parentId)) {
          this.resource.parentId = this.$route.query.parentId;
        }

        this.resource.lang = this.$route.query.lang;

        this.resource.contextId = this.$route.query.contextId;

        await this.$store.dispatch("resource/create", {
          body: this.resource
        });

        const body = [];
        this.$store.getters["resource/getTranslations"].forEach(el => {
          body.push([el.id, this.$store.getters["resource/get"].id]);
          body.push([this.$store.getters["resource/get"].id, el.id]);
        });

        const bool = await this.$store.dispatch("resource/addTranslation", {
          body
        });

        if (bool) {
          this.$router.push(
            `/resources/${this.$store.getters["resource/get"].id}`
          );
        }
      }
    },

    async create() {
      if (this.$route.query.translationId) {
        await this.createTranslation();
      } else {
        await this.createResource();
      }
    },

    translitSlug() {
      if (this.resource.slug === "") {
        this.resource.slug = cyrillicToTranslit({ preset: "uk" })
          .transform(this.resource.title, "-")
          .toLowerCase();
      }
    }
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("resource/clear");
    next();
  }
};
</script>
