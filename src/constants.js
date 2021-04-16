const TILE_TYPES = { straight: 'straight', turn: 'turn' };
export const TILES = {
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
