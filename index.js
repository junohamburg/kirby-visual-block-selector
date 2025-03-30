const visualBlockStore = Vue.observable({
	blockTypes: [],
	images: {},
	isLoading: false,
	hasFetched: false,
	error: null,
});

function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => resolve(null); // Resolve with null on error
		image.src = url;
	});
}

async function fetchAndLoadVisualBlockData(api) {
	const store = visualBlockStore;

	if (!api) {
		store.error = "Internal error: API not available.";
		return;
	}
	if (store.hasFetched || store.isLoading) {
		return;
	}
	if (!window.panel || !window.panel.user || window.panel.user.id === null) {
		return;
	}

	store.isLoading = true;
	store.error = null;

	try {
		const apiResponse = await api.get("visual-block-selector");
		const blockTypes = Object.keys(apiResponse);
		const images = {};

		store.blockTypes = blockTypes;

		const loadImagePromises = Object.entries(apiResponse).map(
			async ([name, url]) => {
				const img = await loadImage(url);
				images[name] = img; // Store image object or null
			},
		);

		await Promise.all(loadImagePromises);

		store.images = images;
		store.hasFetched = true;
	} catch (error) {
		store.error = "Failed to load visual block data.";
	} finally {
		store.isLoading = false;
	}
}

panel.plugin("junohamburg/visual-block-selector", {
	created(VueInstance) {
		fetchAndLoadVisualBlockData(VueInstance.$api);
	},

	components: {
		"k-block-selector": {
			extends: "k-block-selector",
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
			created() {
				fetchAndLoadVisualBlockData(this.$api);
			},
			computed: {
				isLoading() {
					return visualBlockStore.isLoading;
				},
				fetchError() {
					return visualBlockStore.error;
				},
				previewImages() {
					return visualBlockStore.images;
				},
				showVisualBlockSelector() {
					const store = visualBlockStore;
					if (store.isLoading || !store.hasFetched || store.error) {
						return false;
					}

					const availableVisualTypes = store.blockTypes;
					if (!availableVisualTypes || availableVisualTypes.length === 0) {
						return false;
					}

					for (const group of Object.values(this.groups)) {
						for (const fieldset of group.fieldsets) {
							if (availableVisualTypes.includes(fieldset.type)) {
								return true;
							}
						}
					}

					return false;
				},
			},
			methods: {
				isDisabled(type) {
					return this.disabledFieldsets.includes(type);
				},
				submit(type) {
					this.$emit("submit", type);
				},
				getImageSrc(type) {
					const image = visualBlockStore.images[type];
					return image?.src ?? null;
				},
			},
		},
	},
});
