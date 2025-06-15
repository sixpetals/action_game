import Phaser from 'phaser'
import { BaseStage, StageConfig } from '../BaseStage'

export class Stage001 extends BaseStage {
  private movingPlatform?: Phaser.Physics.Arcade.Sprite

  getStageConfig(): StageConfig {
    return {
      id: 1,
      name: "Pastel Garden",
      backgroundColor: "#E6F3FF",
      platformColor: 0xD4C4FB,
      platforms: [
        { x: 400, y: 568, scaleX: 2, scaleY: 1 },      // メイン地面
        { x: 600, y: 400, scaleX: 0.5, scaleY: 1 },   // 右上プラットフォーム
        { x: 50, y: 250, scaleX: 0.5, scaleY: 1 },    // 左上プラットフォーム
        { x: 750, y: 220, scaleX: 0.5, scaleY: 1 }    // 右端プラットフォーム
      ]
    }
  }

  createGimmicks(): void {
    // Stage001の特別なギミック: 動くプラットフォーム
    this.movingPlatform = this.scene.physics.add.sprite(300, 300, 'ground')
    this.movingPlatform.setScale(0.4, 1)
    
    // 物理設定：重力を無効化し、固定オブジェクトに設定
    this.movingPlatform.body!.setImmovable(true)
    this.movingPlatform.body!.setGravity(0, -800) // 重力を打ち消す
    this.movingPlatform.body!.setVelocity(0, 0)   // 初期速度をゼロに
    
    this.movingPlatform.setTint(0xFFE6CC) // 少し違う色にして区別
    
    // 左右に動くアニメーション
    this.scene.tweens.add({
      targets: this.movingPlatform,
      x: 500,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    })
  }

  updateGimmicks(): void {
    // 必要に応じて動的な更新処理
  }

  destroyGimmicks(): void {
    if (this.movingPlatform) {
      this.movingPlatform.destroy()
      this.movingPlatform = undefined
    }
  }

  getMovingPlatform(): Phaser.Physics.Arcade.Sprite | undefined {
    return this.movingPlatform
  }
}