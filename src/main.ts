import Phaser from 'phaser'
import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#E6F3FF', // パステルブルー（薄い空色）
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    keyboard: {
      capture: ['W', 'A', 'S', 'D', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE']
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800, x: 0 },
      debug: false
    }
  },
  scene: [GameScene]
}

new Phaser.Game(config)