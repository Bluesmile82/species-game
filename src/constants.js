const TILE_TYPES = { straight: 'straight', turn: 'turn' };
export const TILE_ROTATIONS = { straight: 2, turn: 4 };
const TILES_KINDS = {
  '1010' : {
    type: TILE_TYPES.straight,
    rotation: 0,
    id: '1010'
  },
  '0101' : {
    type: TILE_TYPES.straight,
    rotation: 1,
    id: '0101'
  },
  '1100' : {
    type: TILE_TYPES.turn,
    rotation: 0,
    id: '1100'
  },
  '0110' : {
    type: TILE_TYPES.turn,
    rotation: 1,
    id: '0110'
  },
  '0011' : {
    type: TILE_TYPES.turn,
    rotation: 2,
    id: '0011'
  },
  '1001' : {
    type: TILE_TYPES.turn,
    rotation: 3,
    id: '1001'
  }
};

export const TILES = [
  TILES_KINDS['1010'],
  TILES_KINDS['1010'],
  TILES_KINDS['1010'],
  TILES_KINDS['1010'],
  TILES_KINDS['1100'],
  TILES_KINDS['0101'],
  TILES_KINDS['0110'],
  TILES_KINDS['0011'],
  TILES_KINDS['1001'],
]