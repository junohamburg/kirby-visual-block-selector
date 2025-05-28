panel.plugin('junohamburg/visual-block-selector', {
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
									<img v-if="fieldset.preview" :src="fieldset.preview" alt="" />
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
				showVisualBlockSelector() {
					for (const group of Object.values(this.groups)) {
						for (const fieldset of group.fieldsets) {
							if (fieldset.preview !== null) {
								return true;
							}
						}
					}

					return false;
				}
			}
		}
	}
});