# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Changed
- Improved tile drawing by drawing a line of points instead of single points. Avoids holes when drawing fast. [#189](https://github.com/CCDirectLink/crosscode-map-editor/pull/189)
- Added keyboard controls to list search overlay (add new entity / add new event)
- Changed Continuous Integration to Github Actions
- added random comment to .gitignore  asdasdrgert

## [0.8.0] - 2020-09-21

### Added
- 3d view for all maps

### Fixed
- Unnecessary files in binary
- Updated dependencies
- Generate unique mapId's for every new entity
- Initialize tiles with 0 instead of -1 in new layers, #165
- Resize and offset should now work properly again
- Fixed changing layer tileset causes previously made changes to be lost

## [0.7.1] - 2020-07-17

### Fixed
- Level heights being stored as strings instead of numbers
- Freeze when loading another map while editing entities
- Placements of npcs not working
- Wrong size when changing scalable prop definition 

## [0.7.0] - 2020-06-02

### Added
- Basic mod support

## [0.6.0] - 2020-04-08

### Added
- Entity filter
- Support for destructibles
- New maps saved inside the assets folder by default
- Map folders that only contain one subfolder displayed as one entry
- Tileset selector

### Fixed
- Map not rendered properly when resizing the window
- Map download not being a proper `.json` extension
- Some item-destructs not showing correctly

## [0.5.1] - 2019-10-02

### Added
- Action step widget [Image](https://user-images.githubusercontent.com/9483499/65177671-74513600-da57-11e9-8423-7aef12bb53ab.png)
- more autotile definitions for jungle

### Fixed
- Bug where events would sometimes not show
- delete in event editor sometimes deleting the whole entity
- SET_MSG_EXPRESSION should work now, #118

## [0.5.0] - 2019-09-18

### Added
- New map selector
- Support for Autotiles (Autotiles are automatically used if a tile from the autotile sheet is selected. When holding shift autotiles are ignored)
- Proper save for maps. Overrides the map at the original location.
- Properties to all events [Image](https://user-images.githubusercontent.com/9483499/64129460-66938380-cdbc-11e9-8584-0c24fab66aae.png)
- Properties to all entities [Image](https://user-images.githubusercontent.com/9483499/64252754-0c113900-cf1c-11e9-8d13-0e8a37dad361.png)
- History for Entity create/delete/edit, #88

### Changed
- Upgrade from Phaser 2 CE to Phaser 3
- Height Map generation now supports autotiles and different terrain
- Hide menu in release build, because most settings don't work. fixes #93
- Removed preloading of assets. Improves initial loading time

### Fixed
- Opening multiple instances of the Map editor now works as intended
- Keep editor mode (layer/entities) after map reload #89
- Prop entities with animated/multiple sheets now display properly

## [0.4.0] - 2019-06-28
- ?
