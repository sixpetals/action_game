import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private jumpCount = 0
  private maxJumps = 2
  private speed = 160
  private jumpVelocity = 330
  private keyStates = {
    A: false,
    D: false,
    W: false
  }
  private deceleration = 300  // 減速度
  private acceleration = 600  // 加速度

  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    this.createPlayerSprite()
    this.createPlatformSprite()
  }

  create() {
    this.createPlatforms()
    this.createPlayer()
    this.setupControls()
    this.setupCollisions()
  }

  private setupControls() {
    // ネイティブのキーボードイベントを使用
    window.addEventListener('keydown', (event) => {
      switch(event.key.toLowerCase()) {
        case 'a':
          this.keyStates.A = true
          break
        case 'd':
          this.keyStates.D = true
          break
        case 'w':
          this.keyStates.W = true
          break
      }
    })

    window.addEventListener('keyup', (event) => {
      switch(event.key.toLowerCase()) {
        case 'a':
          this.keyStates.A = false
          break
        case 'd':
          this.keyStates.D = false
          break
        case 'w':
          this.keyStates.W = false
          break
      }
    })
  }

  update() {
    this.handleInput()
    
    // 地面に触れたらジャンプカウントリセット
    if (this.player.body!.touching.down) {
      this.jumpCount = 0
    }
  }

  private handleInput() {
    const currentVelocityX = this.player.body!.velocity.x
    const deltaTime = this.game.loop.delta / 1000 // ミリ秒を秒に変換

    // 左右移動（慣性付き）
    if (this.keyStates.A && !this.keyStates.D) {
      // 左に加速
      const newVelocityX = Math.max(currentVelocityX - this.acceleration * deltaTime, -this.speed)
      this.player.setVelocityX(newVelocityX)
      this.player.setFlipX(true)
    } else if (this.keyStates.D && !this.keyStates.A) {
      // 右に加速
      const newVelocityX = Math.min(currentVelocityX + this.acceleration * deltaTime, this.speed)
      this.player.setVelocityX(newVelocityX)
      this.player.setFlipX(false)
    } else {
      // キーが押されていない場合は減速
      if (Math.abs(currentVelocityX) > 0) {
        const decelAmount = this.deceleration * deltaTime
        if (currentVelocityX > 0) {
          const newVelocityX = Math.max(currentVelocityX - decelAmount, 0)
          this.player.setVelocityX(newVelocityX)
        } else {
          const newVelocityX = Math.min(currentVelocityX + decelAmount, 0)
          this.player.setVelocityX(newVelocityX)
        }
      }
    }

    // ジャンプ（シンプルな実装）
    if (this.keyStates.W && this.jumpCount < this.maxJumps) {
      this.player.setVelocityY(-this.jumpVelocity)
      this.jumpCount++
      this.keyStates.W = false // 一回だけジャンプ
    }
  }

  private createPlayerSprite() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0xFFB3E6) // パステルピンク
    graphics.fillRect(0, 0, 32, 48)
    graphics.generateTexture('player', 32, 48)
    graphics.destroy()
  }

  private createPlatformSprite() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0xD4C4FB) // パステルパープル
    graphics.fillRect(0, 0, 400, 32)
    graphics.generateTexture('ground', 400, 32)
    graphics.destroy()
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup()
    
    this.platforms.create(400, 568, 'ground').setScale(2, 1).refreshBody()
    
    this.platforms.create(600, 400, 'ground').setScale(0.5, 1).refreshBody()
    this.platforms.create(50, 250, 'ground').setScale(0.5, 1).refreshBody()
    this.platforms.create(750, 220, 'ground').setScale(0.5, 1).refreshBody()
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(100, 450, 'player')
    this.player.setCollideWorldBounds(true)
    this.player.setBounce(0.2)
  }

  private setupCollisions() {
    this.physics.add.collider(this.player, this.platforms)
  }
}