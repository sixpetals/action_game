import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpCount = 0
  private maxJumps = 2
  private speed = 160
  private jumpVelocity = 330

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    
    this.setCollideWorldBounds(true)
    this.setBounce(0.2)
    this.setDragX(800)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.handleMovement(cursors)
    this.handleJump(cursors)
    this.resetJumpCount()
  }

  private handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors.left?.isDown) {
      this.setVelocityX(-this.speed)
      this.setFlipX(true)
    } else if (cursors.right?.isDown) {
      this.setVelocityX(this.speed)
      this.setFlipX(false)
    } else {
      this.setVelocityX(0)
    }
  }

  private handleJump(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (Phaser.Input.Keyboard.JustDown(cursors.up!) && this.jumpCount < this.maxJumps) {
      this.setVelocityY(-this.jumpVelocity)
      this.jumpCount++
    }
  }

  private resetJumpCount() {
    if (this.body!.touching.down) {
      this.jumpCount = 0
    }
  }
}