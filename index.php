<?php

use Kirby\Cms\App as Kirby;
use Composer\Semver\Semver;

// Validate Kirby version
if (Semver::satisfies(Kirby::version() ?? '0.0.0', '~4.0') === false) {
  throw new Exception('The visual block selector plugin requires Kirby 4');
}

Kirby::plugin('junohamburg/visual-block-selector', [
  'api' => [
    'routes' => [
      [
        'pattern' => 'visual-block-selector',
        'action'  => function () {
          $previewImages = [];
          $dir = 'block-previews';
          $path = kirby()->root('assets') . '/' . $dir;
          $imageFiles = Dir::files($path);

          $relativePath = str_replace(kirby()->root('index') . '/', '', kirby()->root('assets'));

          foreach ($imageFiles as $image) {
            $imageAsset = asset($relativePath . '/' . $dir . '/' . $image);
            $previewImages[$imageAsset->name()] = $imageAsset->url();
          }

          return $previewImages;
        }
      ]
    ]
  ]
]);
