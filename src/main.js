// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 600,
    backgroundColor: '0xFF6A00',
    scene: [title, level1, end],
    fps: { forceSetTimeOut: true, target: 30 }
}

const game = new Phaser.Game(config);