<template lang="pug">
  v-card.mb-3(outlined)
    v-card-text.pb-0(v-if="!r.is_user_update") {{d.role || 'Role'}}: {{profile.role.title}}
    v-card-text(v-if="!r.is_user_update") {{d.role_slug || 'Role slug'}}: {{profile.role.slug}}
    v-card-text(v-if="r.is_user_update")
      v-select(
        :items="roles"
        item-text="title"
        item-value="id"
        v-model="profile.roleId"
        :label="`${d.role || 'Role'}:`"
      )
    v-card-actions(v-if="r.is_user_update")
      v-btn.ml-2.mb-2(
        color="primary"
        depressed
        @click="update"
      ) {{d.save || 'Save'}}
</template>

<script>
export default {
  name: "ProfileRoleData",

  props: {
    profile: {
      type: Object,
      default: () => {}
    },

    roles: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    async update() {
      if (this.r.is_user_update) {
        const data = {
          params: {
            id: this.profile.id,
          },
          body: {
            roleId: Number(this.profile.roleId)
          },
          query: {
            filter: {
              include: ["role", "context"]
            }
          }
        };
        await this.$store.dispatch("user/update", data);
      }
    }
  }
};
</script>
