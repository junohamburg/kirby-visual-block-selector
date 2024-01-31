panel.plugin('junohamburg/visual-block-selector', {
  created(Vue) {
    function loadImage(url) {
      return new Promise(resolve => {
        const image = new Image();
        image.onload = resolve.bind(null, image);
        image.onerror = resolve;
        image.src = url;
      });
    }

    const unsubscribe = Vue.$store.subscribeAction(async (action, state) => {
      // Fetch preview images once, but only if user is logged in
      if (window.panel.user.id === null) return;

      unsubscribe();

      // Create custom store for block selector
      Vue.$store.registerModule('visualBlockSelector', {
        state: () => ({
          blockTypes: [],
          images: {}
        }),
        mutations: {
          updateBlockTypes(state, blockTypes) {
            state.blockTypes = blockTypes;
          },
          updateImages(state, images) {
            state.images = images;
          }
        },
        actions: {
          updateBlockTypes({ commit }, { blockTypes }) {
            commit('updateBlockTypes', blockTypes);
          },
          updateImages({ commit }, { images }) {
            commit('updateImages', images);
          }
        }
      });

      const apiResponse = await Vue.$api.get('visual-block-selector');
      const blockTypes = [];
      const images = {};

      // Get block types
      for (const name of Object.keys(apiResponse)) {
        blockTypes.push(name);
      }

      // Update store
      Vue.$store.dispatch({
        type: 'updateBlockTypes',
        blockTypes: blockTypes
      });

      // Load images
      for (const [name, img] of Object.entries(apiResponse)) {
        images[name] = await loadImage(img);
      }

      // Update store
      Vue.$store.dispatch({
        type: 'updateImages',
        images: images
      });
    });
  },
  components: {
    'k-block-selector': {
      extends: 'k-block-selector',
      template: `
        <k-dialog
          :cancel-button="false"
          :size="showVisualBlockSelector ? 'visual' : 'medium'"
          :submit-button="false"
          :visible="true"
          class="k-block-selector"
          @cancel="$emit('cancel')"
          @submit="$emit('submit', value)"
        >
          <k-headline v-if="headline">
            {{ headline }}
          </k-headline>

          <details
            v-for="(group, groupName) in groups"
            :key="groupName"
            :open="group.open"
          >
            <summary>{{ group.label }}</summary>
            <k-navigate
              v-if="showVisualBlockSelector"
              class="k-block-types"
            >
              <button
                class="k-block-selector-button"
                v-for="fieldset in group.fieldsets"
                :key="fieldset.name"
                :disabled="disabledFieldsets.includes(fieldset.type)"
                :aria-disabled="disabledFieldsets.includes(fieldset.type)"
                @click="$emit('submit', fieldset.type)"
                @focus.native="$emit('input', fieldset.type)"
              >
                <span class="k-block-selector-button-preview">
                  <img v-if="previewImages[fieldset.type]" :src="previewImages[fieldset.type].src" alt="" />
                  <k-icon v-else :type="fieldset.icon || 'box'" />
                </span>
                <span class="k-block-selector-button-text">{{ fieldset.name }}</span>
              </button>
            </k-navigate>

            <k-navigate
              v-else
              class="k-block-types"
            >
              <k-button
                v-for="fieldset in group.fieldsets"
                :key="fieldset.name"
                :disabled="disabledFieldsets.includes(fieldset.type)"
                :icon="fieldset.icon ?? 'box'"
                :text="fieldset.name"
                size="lg"
                @click="$emit('submit', fieldset.type)"
                @focus.native="$emit('input', fieldset.type)"
              />
            </k-navigate>
          </details>
          <!-- eslint-disable vue/no-v-html -->
          <p
            class="k-clipboard-hint"
            v-html="$t('field.blocks.fieldsets.paste', { shortcut })"
          />
          <!-- eslint-enable -->
        </k-dialog>
      `,
      computed: {
        previewImages() {
          return this.$store.state.visualBlockSelector.images;
        },
        showVisualBlockSelector() {
          let showVisualBlockSelector = false;

          for (const group of Object.values(this.groups)) {
            for (const fieldset of group.fieldsets) {
              if (
                this.$store.state.visualBlockSelector.blockTypes.includes(
                  fieldset.type
                )
              ) {
                showVisualBlockSelector = true;
              }
            }
          }

          return showVisualBlockSelector;
        }
      }
    }
  }
});
