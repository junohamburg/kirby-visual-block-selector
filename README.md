# Kirby Visual Block Selector

This plugin for **Kirby 4** replaces the block selector with a customized version that displays a preview image for each block.

![Visual block selector](https://github.com/junohamburg/kirby-visual-block-selector/assets/77532479/5f742752-85ac-44f0-8fd2-7c9031df1387)

Please note: If you are using **Kirby 3**, please install [v1.1.2](https://github.com/junohamburg/kirby-visual-block-selector/releases/tag/1.1.2).

## Installation

### Download

Download and copy this repository to `/site/plugins/kirby-visual-block-selector`.

### Composer

```
composer require junohamburg/kirby-visual-block-selector
```

### Git submodule

```
git submodule add https://github.com/junohamburg/kirby-visual-block-selector.git site/plugins/kirby-visual-block-selector
```

## Setup

1. Create the block preview images in 480&times;270 pixel. The images are displayed in a fixed aspect ratio of 16/9.
2. Create the folder `assets/block-previews`.
3. Save the images in the `assets/block-previews` folder with the same name as the block. For example, the preview image of `heading.yml` is `heading.png`. Any image format (png, jpg, gif, svg) should work.

Tip: You can define fieldset groups for the `blocks` field: [Kirby docs](https://getkirby.com/docs/reference/panel/fields/blocks#defining-fieldsets__groups)

**:warning: Please note:** If there are no preview images for a `blocks` field, the default Kirby block selector will be displayed.

## License

MIT

## Credits

- [JUNO](https://juno-hamburg.com)
