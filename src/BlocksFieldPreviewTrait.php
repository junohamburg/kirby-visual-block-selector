<?php

namespace JunoHamburg\VisualBlockSelector;

use Kirby\Filesystem\Dir;

/**
 * Trait that adds preview images to block fieldsets
 */
trait BlocksFieldPreviewTrait
{
	/**
	 * Collects all block preview images
	 * in the assets directory
	 *
	 * @return array<string, string>
	 */
	protected function previewImages(): array
	{
		$kirby    = $this->kirby();
		$previews = [];
		$dir      = 'block-previews';
		$path     = $kirby->root('assets') . '/' . $dir;
		
		if (!is_dir($path)) {
			return [];
		}
		
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
	 */
	protected function addPreviewImagesToFieldsets(array $fieldsets): array
	{
		$previewImages = $this->previewImages();
		
		return array_map(fn (array $fieldset) => [
			...$fieldset,
			'previewImage' => $previewImages[$fieldset['type']] ?? null
		], $fieldsets);
	}
}
