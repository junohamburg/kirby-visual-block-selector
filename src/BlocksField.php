<?php

namespace JunoHamburg\VisualBlockSelector;

use Kirby\Filesystem\Dir;
use Kirby\Form\Field\BlocksField as KirbyBlocksField;

/**
 * Custom BlocksField class, which provides the
 * visual block selector component with preview images.
 */
class BlocksField extends KirbyBlocksField
{
	/**
	 * Collects all block preview images
	 * in the assets directory
	 *
	 * @return array<string, string>
	 */
	protected function previews(): array
	{
		$kirby    = $this->kirby();
		$previews = [];
		$dir      = 'block-previews';
		$path     = $kirby->root('assets') . '/' . $dir;
		$images   = Dir::files($path);

		$relativePath = str_replace($kirby->root('index') . '/', '', $kirby->root('assets'));

		foreach ($images as $image) {
			$asset = asset($relativePath . '/' . $dir . '/' . $image);
			$previews[$asset->name()] = $asset->url();
		}

		return $previews;
	}

	/**
	 * Adds the preview images to the fieldsets
	 * if they exist
	 */
	public function props(): array
	{
		$props    = parent::props();
		$previews = $this->previews();

		$props['fieldsets'] = array_map(function (array $fieldset) use ($previews) {
			$fieldset['preview'] = $previews[$fieldset['type']] ?? null;
			return $fieldset;
		}, $props['fieldsets']);

		return $props;
	}
}
