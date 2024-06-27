# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Fixed
- Keep filtered entities inactive when changing tabs [#301](https://github.com/CCDirectLink/crosscode-map-editor/issues/301)
- Increased special level layers to render at level 100 instead of 10 [#309](https://github.com/CCDirectLink/crosscode-map-editor/issues/309)
- Snap size inputs to defined range only after input loses focus, enabling smoother manual entry [#295](https://github.com/CCDirectLink/crosscode-map-editor/issues/295)

### Changed
- Layers on same level are rendered based on their position in the list 
- Show exact match at first position in search [#296](https://github.com/CCDirectLink/crosscode-map-editor/issues/296)

## [1.5.0] 2024-03-20
### Added
- Added UI for Entity Grid (hotkey G) with additional settings [#292](https://github.com/CCDirectLink/crosscode-map-editor/issues/292)

## [1.4.0] 2024-02-23
### Added
- Added proper support for the event steps `SHOW_MODAL_CHOICE` and `SET_MSG_EXPRESSION`.
- Added rendering of text colors in relevant events (such as `SHOW_MSG`).

### Changed
- `VarConditions` now use the string editor, as opposed to the JSON editor.
- Improved support for event/action step property previews - specifically for `Vec2`, `Vec3`, `Offset`, `Entity`, `EnemyType`, `NumberExpression`, `StringExpression`, `BooleanExpression`, `VarName`, `Effect`, and `Animation`.

### Fixed
- Events with children/branching steps (such as `IF`, `SHOW_CHOICE`, `SHOW_MODAL_CHOICE`, etc.) will no longer fully refresh upon any edits, causing focus to be reset.

## [1.3.1] 2024-02-09
### Changed
- Updated Angular and Electron versions.  
Should include some performance improvements when running the electron build
## [1.3.0] 2024-01-31
### Added
- Render dimensions when selecting multiple tiles [#310](https://github.com/CCDirectLink/crosscode-map-editor/issues/310)

### Changed
- Increased font resolution for entity names

## [1.2.0] 2024-01-30
### Added
- Toggle in settings that also shows the vanilla maps in the map selection menu

## [1.1.5] 2023-11-16

### Fixed
- Fix map "heat/special/cursed-temple" not loading


## [1.1.4] 2023-09-17
### Fixed 
- Fix WallHorizontal/WallVertical having the wrong default size

## [1.1.3] 2023-09-17
### Fixed
- The editor won't freeze if a mod's package.json is invalid.

## [1.1.2] 2023-09-02

### Fixed
- The confirm dialog now no longer shows up after discarding changes

## [1.1.1] 2023-09-02
### Added
- Added confirm dialog if there are any unsaved changes when closing a map

## [1.1.0] 2023-08-25
### Added
- Layer level selector now also supports selecting all the named layer levels: `first`, `last`, `light`, `postlight`, `object1`, `object2`, and `object3`.
- Added support for parallax layers (`distance != 1`)
- The size of every individual layer can now be changed instead of using the map size
- Added preview to see how the parallax effect would look ingame
- added graphical selection widget to `person-expression`
- Added checkbox to "Offset Map" to optionally include entities [#279](https://github.com/CCDirectLink/crosscode-map-editor/issues/279)

### Changed
- Named layer levels will now appear in the layer selector as opposed to a layer appearing on level 0 or 10.
- Added manual input field to graphical selection widget for `Prop`, `Enemy`, `NPC`, `ItemDestruct`
- event `person-expression` now only shows characters that have a face [#284](https://github.com/CCDirectLink/crosscode-map-editor/issues/284)

### Fixed
- Layers on the `first` level should now properly render as though they are below level 0.
- Layers with different sizes are now saved properly [#272](https://github.com/CCDirectLink/crosscode-map-editor/issues/272)

## [1.0.1] 2023-08-20

### Fixed
- Fixed the langlabel widget not updating its size when resizing the detail panel.

## [1.0.0] 2023-08-04

### Added
- New graphical selection widget for some entities: `Prop`, `ScalableProp`, `Enemy`, `ItemDestruct`, `NPC`

### Changed
- Made panning more smooth
- Keep Layer visibility when using history undo/redo [#273](https://github.com/CCDirectLink/crosscode-map-editor/issues/273)
- Updated Phaser to 3.60.0
- Entity copy/paste now uses the clipboard to make it easier working with multiple editor instances [#267](https://github.com/CCDirectLink/crosscode-map-editor/issues/267)
- Changed default Vec2 values to 0 instead of 1 [#257](https://github.com/CCDirectLink/crosscode-map-editor/issues/257)
- New Entities are now generated with a default size of 16x16

### Fixed
- All `Prop` Entities should now be rendered correctly
- Improved `ScalableProp` rendering. `ends` are now rendering correctly.
- Improved `NPC` rendering.
- Releasing mouse button outside the canvas now properly triggers. Avoids having issues like continue dragging entities even if the mouse button was released


## [0.18.0] 2023-07-19
### Added
- Made Event `SHOW_SIDE_MSG` prettier. [image](https://github.com/CCDirectLink/crosscode-map-editor/assets/9483499/7aa7dce2-f678-4b93-a026-fbbc5873ebd0)
- Double clicking an event now opens the event editor
- Double clicking an npc now opens the npc state editor

## [0.17.4] 2023-06-10

### Fixed
- Fixed `enemyInfo` properties not saving properly when created through the map editor.

## [0.17.3] 2023-06-09

### Fixed
- Fixed `lighter` property in layers not rendering properly

## [0.17.2] 2023-06-07

### Changed
- Updated all dependencies. This has lead to minor style changes.

## [0.17.1] 2022-11-13
- Fixed a bug where pasting an entity would insert those entities twice.

### Changed
- Changed the internal filestructure of the project.

## [0.17.0] 2022-10-18

### Fixed
- Replaced `hide` property of NPCs with `hidden`, which is now saved correctly as a boolean value.
- Fixed buggy behaviour when two checkboxes that refer to properties with the same name are visible at the same time ([#240](https://github.com/CCDirectLink/crosscode-map-editor/issues/240)).

### Changed
- Clicking the label of a property now no longer selects the input for that property.

## [0.16.0] 2022-10-03

### Added
- New editor for `langlabel` properties.

## [0.15.1] 2022-09-28

### Fixed
- `WallHorizontal` and `WallVertical` are now created with the correct default size on their non-resizable axis.

## [0.15.0] 2022-09-27

### Fixed
- Typo in settings panel.
- Fixed compatibility with the newer Electron versions.
- Enemy editing popup no longer bugs out when editing enemies inside event steps.
- Fixed copy-pasting of `IF` steps and other steps with branches.
- Fixed inability to edit certain `String` properties of various event and action steps.

### Changed
- `String` inputs for event steps, action steps, and entity properties, as well as the map creation dialog now also allow values different from the suggested ones.

## [0.14.0] 2022-05-28
- Add coordinate display for the cursor in entity view

## [0.13.0] 2021-11-23

### Added
- Full event editor support for `quest`, `shop`, `arena` and `trade` events
- Ability to view and edit `OPEN_QUEST_DIALOG` event branches
- Ability to view and edit `START_NPC_TRADE_MENU` event branches

### Fixed
- Changes in the number of choices of `SHOW_CHOICE` events now update the branches visible in the event editor immediately

## [0.12.0] 2021-10-05

### Added
- Setting to wrap long lines in the event editor over multiple lines

## [0.11.0] 2021-05-26

### Changed
- Angular update (10.2 -> 12.0)
- reset camera position on map load (centers map)
- moved button "New Map" to "File/New Map"
- increase max zoom for high res displays 
- remember event detail width after closing/opening the event editor

### Fixed
- Fixed wrong click area in string widgets: [#211](https://github.com/CCDirectLink/crosscode-map-editor/issues/211)

## [0.10.2] 2021-04-09

### Fixed
- Fixed crashes on startup when upgrading Electron.

## [0.10.1] 2021-04-04

### Changed
- Updated event step and action step definitions.

## [0.10.0] 2021-03-28

### Added
- Support for enemies.

## [0.9.2] 2021-03-02

### Added
- Add CTRL as a control to pan the camera

## [0.9.1] 2021-02-21

### Changed
- Moved directories to the top of the map load dialogue.

## [0.9.0] 2021-01-01

### Added
- Reworked event editor. It now features drag and drop, edit history, live updates and more.

## [0.8.1] 2020-12-28

### Changed
- Improved tile drawing by drawing a line of points instead of single points. Avoids holes when drawing fast. [#189](https://github.com/CCDirectLink/crosscode-map-editor/pull/189)
- Added keyboard controls to list search overlay (add new entity / add new event)
- Changed Continuous Integration to Github Actions
- Automated release build. Should result in more frequent releases.

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
