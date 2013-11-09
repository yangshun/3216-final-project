MapConfig = {};
MapConfig.limits = {
  healthtile : 5,
  speedtile : 2,
  guntile : 5
};

MapConfig.tiles = {
  terrain: '/images/terrain/jungle/',
  powerup: '/images/powerups/',
  image: '/images/',
  1: {image:'rock.png', w: 360, h: 180, tileW: 1, tileH: 1},
  2: {image:'rock-3.png', w: 360, h: 360, tileW: 1, tileH: 1},
  3: {image:'rock-4.png', w: 360, h: 360, tileW: 1, tileH: 1},
  4: {image:'tree-2.png', w: 360, h: 345, tileW: 2, tileH: 2},
  5: {image:'hut.png', w: 600, h: 600, tileW: 2, tileH: 2},
  6: {image:'hut-2.png', w: 600, h: 600, tileW: 2, tileH: 2},
  // 8: {image:'tree.png', w: 360, h: 360},
  // 2: {image:'rock-2.png', w: 240, h: 240},
  health: {image:'first-aid-kit.png', w: 300, h: 256},
  speed: {image:'haste-boots.png', w: 300, h: 300}
};

MapConfig.maps = [
  {id: 'iceworld', src: '/js/arena/map/iceworld.txt', type: createjs.LoadQueue.TEXT}
];

MapConfig.ascii = {
  'blank' : ['0'],
  'iceworld' : ['0000000',
                '0101010',
                '0000000',
                '0101010',
                '0000000',
                '0101010',
                '0000000'
                ],
  'dota' : ['0000000000',
            '0111110010',
            '0100100110',
            '0101001010',
            '0110010010',
            '0100111110',
            '0000000000'],

  'bomberman' : ['000',
                 '010',
                 '000'],
  'spiral' : ['111111111111100',
              '000000000000100',
              '000000000000100',
              '001111111100100',
              '001000000100100',
              '001000000100100',
              '001001100100100',
              '001001000100100',
              '001001000100100',
              '001001001100100',
              '001001000000100',
              '001001000000100',
              '001001111111100',
              '001000000000000',
              '001000000000000',
              '001111111111111'
              ]
};
