# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- New map selector
- Support for Autotiles (Autotiles are automatically used if a tile from the autotile sheet is selected. When holding shift autotiles are ignored)
- Proper save for maps. Overrides the map at the original location.
- Added properties to all events [Image](https://user-images.githubusercontent.com/9483499/64129460-66938380-cdbc-11e9-8584-0c24fab66aae.png)
- Added properties to all Entities [Image](https://user-images.githubusercontent.com/9483499/64252754-0c113900-cf1c-11e9-8d13-0e8a37dad361.png)
- History for Entity create/delete/edit, #88

### Changed
- Upgrade from Phaser 2 CE to Phaser 3
- Height Map generation now supports autotiles and different terrain
- hide menu in release build, because most settings don't work. fixes #93
- removed preloading of assets. Improves initial loading time

### Fixed
- Opening multiple instances of the Map editor now works as intended
- keep editor mode (layer/entities) after map reload #89

## [0.4.0] - 2019-06-28
- ?
