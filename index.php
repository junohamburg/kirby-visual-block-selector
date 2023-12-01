<?php

use Kirby\Cms\App as Kirby;

// Validate Kirby version
if (
  version_compare(Kirby::version() ?? '0.0.0', '3.6.0', '<') === true ||
  version_compare(Kirby::version() ?? '0.0.0', '3.10.0', '>=') === true
) {
  throw new Exception('The block preview fields plugin supports Kirby 3.6.0 to 3.9.x');
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
