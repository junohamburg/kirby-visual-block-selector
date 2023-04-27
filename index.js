panel.plugin('junohamburg/kirby-visual-block-selector', {
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
      if (state.content.current !== null) {
        unsubscribe();

        // Create custom store for block selector
        Vue.$store.registerModule('visualBlockSelector', {
          state: () => ({
            images: {}
          }),
          mutations: {
            updateImages(state, images) {
              state.images = images;
            }
          },
          actions: {
            updateImages({ commit }, { images }) {
              commit('updateImages', images);
            }
          }
        });

        // Load images
        const images = await Vue.$api.get('visual-block-selector');
        const imagePromises = {};

        for (const [name, img] of Object.entries(images)) {
          imagePromises[name] = await loadImage(img);
        }

        // Update store
        Vue.$store.dispatch({
          type: 'updateImages',
          images: imagePromises
        });
      }
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
            size="medium"
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
              <div class="k-block-types">
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
          }
        },
        methods: original.options.methods
      });
    }
  ]
});
