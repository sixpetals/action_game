import Phaser from 'phaser'
import { StageManager } from '../stages/StageManager'
import { BaseStage } from '../stages/BaseStage'
import { Stage001 } from '../stages/Stage001/Stage001'

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
    W: false,
    Q: false, // ステージ切り替え用
    E: false  // ステージ切り替え用
  }
  private deceleration = 300  // 減速度
  private acceleration = 600  // 加速度
  private stageManager!: StageManager
  private currentStage!: BaseStage
  private stageText!: Phaser.GameObjects.Text
  private platformCollider?: Phaser.Physics.Arcade.Collider
  private stageColliders: Phaser.Physics.Arcade.Collider[] = []

  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    this.stageManager = new StageManager(this)
    this.currentStage = this.stageManager.getCurrentStage()
    this.updateBackgroundColor()
    this.createPlayerSprite()
    this.createPlatformSprite()
  }

  create() {
    this.createPlatforms()
    this.createPlayer()
    this.setupControls()
    this.setupCollisions()
    this.createUI()
    this.currentStage.createGimmicks()
    this.setupStageSpecificCollisions()
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
        case 'q':
          this.keyStates.Q = true
          break
        case 'e':
          this.keyStates.E = true
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
        case 'q':
          this.keyStates.Q = false
          break
        case 'e':
          this.keyStates.E = false
          break
      }
    })
  }

  update() {
    this.handleInput()
    this.stageManager.updateCurrentStage()
    
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

    // ステージ切り替え
    if (this.keyStates.Q) {
      this.changeStage(-1) // 前のステージ
      this.keyStates.Q = false
    }
    
    if (this.keyStates.E) {
      this.changeStage(1) // 次のステージ
      this.keyStates.E = false
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
    graphics.fillStyle(this.currentStage.getConfig().platformColor)
    graphics.fillRect(0, 0, 400, 32)
    graphics.generateTexture('ground', 400, 32)
    graphics.destroy()
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup()
    this.currentStage.createPlatforms(this.platforms)
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(100, 450, 'player')
    this.player.setCollideWorldBounds(true)
    this.player.setBounce(0.2)
  }

  private setupCollisions() {
    // 既存のコライダーを削除
    if (this.platformCollider) {
      this.platformCollider.destroy()
    }
    
    // 新しいコライダーを作成
    this.platformCollider = this.physics.add.collider(this.player, this.platforms)
  }

  private createUI() {
    const config = this.currentStage.getConfig()
    this.stageText = this.add.text(16, 16, 
      `Stage ${config.id}: ${config.name}`, 
      {
        fontSize: '18px',
        color: '#333333',
        backgroundColor: '#ffffff',
        padding: { x: 8, y: 4 }
      }
    )
    
    // 操作説明
    this.add.text(16, 50, 
      'WASD: Move/Jump  Q/E: Change Stage', 
      {
        fontSize: '14px',
        color: '#333333',
        backgroundColor: '#ffffff',
        padding: { x: 8, y: 4 }
      }
    )
  }

  private updateBackgroundColor() {
    this.cameras.main.setBackgroundColor(this.currentStage.getConfig().backgroundColor)
  }

  private changeStage(direction: number) {
    let newStage: BaseStage | null = null
    
    if (direction > 0) {
      newStage = this.stageManager.nextStage()
    } else {
      newStage = this.stageManager.previousStage()
    }
    
    if (newStage) {
      this.currentStage = newStage
      this.reloadStage()
    }
  }

  private reloadStage() {
    // 既存のプラットフォームを削除
    this.platforms.clear(true, true)
    
    // 新しいステージの背景色に更新
    this.updateBackgroundColor()
    
    // 新しいプラットフォームテクスチャを作成
    this.createPlatformSprite()
    
    // 新しいプラットフォームを作成
    this.createPlatforms()
    
    // 衝突判定を再設定
    this.setupCollisions()
    
    // プレイヤーを初期位置に戻す
    this.player.setPosition(100, 450)
    this.player.setVelocity(0, 0)
    
    // 新しいステージのギミックを作成
    this.currentStage.createGimmicks()
    
    // ステージ固有の衝突判定を設定
    this.setupStageSpecificCollisions()
    
    // UIを更新
    const config = this.currentStage.getConfig()
    this.stageText.setText(`Stage ${config.id}: ${config.name}`)
  }

  private setupStageSpecificCollisions() {
    // 既存のステージ固有コライダーを削除
    this.stageColliders.forEach(collider => collider.destroy())
    this.stageColliders = []
    
    // Stage001の動くプラットフォームとの衝突判定
    if (this.currentStage instanceof Stage001) {
      const movingPlatform = this.currentStage.getMovingPlatform()
      if (movingPlatform) {
        const collider = this.physics.add.collider(this.player, movingPlatform)
        this.stageColliders.push(collider)
      }
    }
  }
}