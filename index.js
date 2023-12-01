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
      if (Vue.$user === undefined || Vue.$user === null) return;

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
  use: [
    function (Vue) {
      // https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Blocks/BlockSelector.vue
      const original = Vue.component('k-block-selector');

      Vue.component('k-block-selector', {
        template: `
          <k-dialog
            ref="dialog"
            :cancel-button="false"
            :submit-button="false"
            class="k-block-selector"
            :size="showVisualBlockSelector ? 'visual' : 'medium'"
            @open="onOpen"
            @close="onClose"
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

              <div class="k-block-types" v-if="showVisualBlockSelector">
                <k-button
                  v-for="fieldset in group.fieldsets"
                  :ref="'fieldset-' + fieldset.index"
                  :key="fieldset.name"
                  :disabled="disabled.includes(fieldset.type)"
                  @keydown.up="navigate(fieldset.index - 1)"
                  @keydown.down="navigate(fieldset.index + 1)"
                  @click="add(fieldset.type)"
                >
                  <img v-if="previewImages[fieldset.type]" :src="previewImages[fieldset.type].src" alt="" />
                  <k-icon v-else :type="fieldset.icon || 'box'" />
                  <span>{{ fieldset.name }}</span>
                </k-button>
              </div>

              <div class="k-block-types" v-else>
                <k-button
                  v-for="fieldset in group.fieldsets"
                  :ref="'fieldset-' + fieldset.index"
                  :key="fieldset.name"
                  :disabled="disabled.includes(fieldset.type)"
                  :icon="fieldset.icon || 'box'"
                  :text="fieldset.name"
                  @keydown.up="navigate(fieldset.index - 1)"
                  @keydown.down="navigate(fieldset.index + 1)"
                  @click="add(fieldset.type)"
                />
              </div>
            </details>
            <!-- eslint-disable vue/no-v-html -->
            <p
              class="k-clipboard-hint"
              v-html="$t('field.blocks.fieldsets.paste', { shortcut })"
            />
            <!-- eslint-enable -->
          </k-dialog>
        `,
        inheritAttrs: original.options.inheritAttrs,
        props: original.options.props,
        data() {
          return {
            ...original.options.data.call(this)
          };
        },
        computed: {
          ...original.options.computed,
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
        },
        methods: original.options.methods
      });
    }
  ]
});
