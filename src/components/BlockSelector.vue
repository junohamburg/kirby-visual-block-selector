<template>
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
      <k-navigate v-if="showVisualBlockSelector" class="k-block-types">
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
            <img
              v-if="fieldset.previewImage"
              :src="fieldset.previewImage"
              alt=""
            />
            <k-icon v-else :type="fieldset.icon || 'box'" />
          </span>
          <span class="k-block-selector-button-text">{{ fieldset.name }}</span>
        </button>
      </k-navigate>

      <k-navigate v-else class="k-block-types">
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
</template>

<script>
export default {
  name: 'BlockSelector',
  extends: 'k-block-selector',
  computed: {
    showVisualBlockSelector() {
      for (const group of Object.values(this.groups)) {
        for (const fieldset of group.fieldsets) {
          if (fieldset.previewImage !== null) {
            return true;
          }
        }
      }

      return false;
    }
  }
};
</script>

<style>
/* Dialog layout */
.k-block-selector[data-size='visual'] {
  max-width: 70rem;
  width: 100%;
}

.k-block-selector[data-size='visual'] .k-block-types {
  grid-template-columns: repeat(auto-fill, minmax(7.375rem, 1fr));
  grid-gap: 1rem 0.75rem;
}

@media (min-width: 30em) {
  .k-block-selector[data-size='visual'] .k-block-types {
    grid-template-columns: repeat(auto-fill, minmax(11.25rem, 1fr));
  }
}

/* Button */
.k-block-selector-button {
  --icon-color: var(--color-text);
  background: var(--item-color-back);
  border-radius: var(--button-rounded);
  font-variant-numeric: tabular-nums;
  box-shadow: var(--shadow);
  align-self: start;
}

@media (max-width: 29.9375em) {
  .k-block-selector-button {
    font-size: var(--text-xs);
  }
}

/* Disabled button */
.k-block-selector-button:where([aria-disabled]) {
  cursor: not-allowed;
}
.k-block-selector-button:where([aria-disabled]) > * {
  opacity: var(--opacity-disabled);
}

/* Image */
.k-block-selector-button-preview {
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  padding: 0.5em;
}

.k-block-selector-button-preview img {
  object-fit: cover;
  aspect-ratio: 16 / 9;
  border-radius: var(--rounded-sm);
}

/* Fallback icon */
.k-block-selector-button-preview .k-icon {
  height: calc(var(--icon-size) * 1.25);
  width: calc(var(--icon-size) * 1.25);
}

@media (min-width: 30em) {
  .k-block-selector-button-preview .k-icon {
    height: calc(var(--icon-size) * 2);
    width: calc(var(--icon-size) * 2);
  }
}

/* Text */
.k-block-selector-button-text {
  display: block;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  padding: 0.625em 0.625em 0.6875em;
  border-top: 1px solid var(--color-border);
}
</style>
