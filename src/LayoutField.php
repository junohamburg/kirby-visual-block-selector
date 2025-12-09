<?php

namespace JunoHamburg\VisualBlockSelector;

use Kirby\Form\Field\LayoutField as KirbyLayoutField;

/**
 * Custom LayoutField that adds preview images to fieldsets
 * within layout columns
 */
class LayoutField extends KirbyLayoutField
{
	use BlocksFieldPreviewTrait;

	public function props(): array
	{
		$props = parent::props();
		$props['fieldsets'] = $this->addPreviewImagesToFieldsets($props['fieldsets']);
		return $props;
	}
}
