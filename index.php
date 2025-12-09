<?php

use Kirby\Cms\App as Kirby;
use Composer\Semver\Semver;

// Validate Kirby version
if (Semver::satisfies(Kirby::version() ?? '0.0.0', '~5.0') === false) {
	throw new Exception('The visual block selector plugin requires Kirby 5');
}

// Auto-load custom field classes
load([
	'JunoHamburg\VisualBlockSelector\BlocksFieldPreviewTrait' => __DIR__ . '/src/BlocksFieldPreviewTrait.php',
	'JunoHamburg\VisualBlockSelector\BlocksField' => __DIR__ . '/src/BlocksField.php',
	'JunoHamburg\VisualBlockSelector\LayoutField' => __DIR__ . '/src/LayoutField.php',
]);

Kirby::plugin('junohamburg/visual-block-selector', [
	'fields' => [
		'blocks' => 'JunoHamburg\VisualBlockSelector\BlocksField',
		'layout' => 'JunoHamburg\VisualBlockSelector\LayoutField',
	],
]);
