const TILE_TYPES = { straight: 'straight', turn: 'turn' };
const TILES_KINDS = {
  '1010' : {
    type: TILE_TYPES.straight,
    rotation: 0
  },
  '0101' : {
    type: TILE_TYPES.straight,
    rotation: 1
  },
  '1100' : {
    type: TILE_TYPES.turn,
    rotation: 0
  },
  '0110' : {
    type: TILE_TYPES.turn,
    rotation: 1
  },
  '0011' : {
    type: TILE_TYPES.turn,
    rotation: 2
  },
  '1001' : {
    type: TILE_TYPES.turn,
    rotation: 3
  }
};

export const TILES = [
  TILES_KINDS['1010'],
  TILES_KINDS['1010'],
  TILES_KINDS['1010'],
  TILES_KINDS['1010'],
  TILES_KINDS['1100'],
  TILES_KINDS['0110'],
]