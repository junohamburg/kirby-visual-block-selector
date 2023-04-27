<?php

Kirby::plugin('junohamburg/kirby-visual-block-selector', [
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
