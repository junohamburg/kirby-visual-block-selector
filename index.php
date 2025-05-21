<?php

use Kirby\Cms\App as Kirby;
use Composer\Semver\Semver;

// Validate Kirby version
if (Semver::satisfies(Kirby::version() ?? '0.0.0', '~4.0 || ~5.0') === false) {
	throw new Exception('The visual block selector plugin requires Kirby 4 or Kirby 5');
}

// Auto-load the custom BlocksField class
load([
	'JunoHamburg\VisualBlockSelector\BlocksField' => __DIR__ . '/src/BlocksField.php',
]);

Kirby::plugin('junohamburg/visual-block-selector', [
	'fields' => [
		'blocks' => 'JunoHamburg\VisualBlockSelector\BlocksField'
	],
]);
