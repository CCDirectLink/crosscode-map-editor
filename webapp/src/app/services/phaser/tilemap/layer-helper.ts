// new phaser update sets tileWidth from the tileset. This crashes when the layer has no tileset
// TODO: open phaser issue
import IsInLayerBounds = Phaser.Tilemaps.Components.IsInLayerBounds;
import Tile = Phaser.Tilemaps.Tile;

export function customPutTilesAt(tiles: (number | null | undefined)[][] | Tile[][], layer: Phaser.Tilemaps.TilemapLayer) {
	
	const height = tiles.length;
	const width = tiles[0].length;
	
	for (let ty = 0; ty < height; ty++) {
		for (let tx = 0; tx < width; tx++) {
			const tile = tiles[ty][tx] ?? 0;
			const index = typeof tile === 'number' ? tile : tile.index;
			customPutTileAt(index, tx, ty, layer.layer);
		}
	}
}

export function customPutTileAt(tile: number, tileX: number, tileY: number, layer: Phaser.Tilemaps.LayerData) {
	
	if (!IsInLayerBounds(tileX, tileY, layer)) {
		return null;
	}
	
	if (layer.data[tileY][tileX] === null) {
		layer.data[tileY][tileX] = new Tile(
			layer,
			tile,
			tileX,
			tileY,
			layer.tileWidth,
			layer.tileHeight,
			layer.baseTileWidth,
			layer.baseTileHeight
		);
	} else {
		layer.data[tileY][tileX].index = tile;
	}
	
	const newTile = layer.data[tileY][tileX];
	
	newTile.width = layer.tileWidth;
	newTile.height = layer.tileHeight;
	
	return newTile;
}
