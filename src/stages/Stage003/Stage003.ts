import Phaser from 'phaser'
import { BaseStage, StageConfig } from '../BaseStage'

export class Stage003 extends BaseStage {
  private bubbles: Phaser.GameObjects.Ellipse[] = []
  private waterCurrentZones: Phaser.GameObjects.Rectangle[] = []

  getStageConfig(): StageConfig {
    return {
      id: 3,
      name: "Ocean Depths",
      backgroundColor: "#E6FFFF",
      platformColor: 0x87CEEB,
      platforms: [
        { x: 400, y: 568, scaleX: 2, scaleY: 1 },      // メイン地面
        { x: 100, y: 480, scaleX: 0.4, scaleY: 1 },   // 左の珊瑚
        { x: 350, y: 380, scaleX: 0.3, scaleY: 1 },   // 中央の岩
        { x: 600, y: 300, scaleX: 0.5, scaleY: 1 },   // 大きな岩場
        { x: 700, y: 450, scaleX: 0.2, scaleY: 1 }    // 小さな突起
      ]
    }
  }

  createGimmicks(): void {
    // Stage003の特別なギミック: 泡と水流
    this.createBubbles()
    this.createWaterCurrents()
  }

  updateGimmicks(): void {
    // 泡をゆっくり上昇させる
    this.bubbles.forEach(bubble => {
      bubble.y -= 0.5
      if (bubble.y < -20) {
        bubble.y = 620
        bubble.x = Phaser.Math.Between(50, 750)
      }
    })

    // 水流エフェクトのアニメーション
    this.waterCurrentZones.forEach((zone, index) => {
      const wave = Math.sin(this.scene.time.now * 0.01 + index * 2) * 0.1 + 0.3
      zone.setAlpha(wave)
    })
  }

  destroyGimmicks(): void {
    this.bubbles.forEach(bubble => bubble.destroy())
    this.bubbles = []
    
    this.waterCurrentZones.forEach(zone => zone.destroy())
    this.waterCurrentZones = []
  }

  private createBubbles(): void {
    // 水中の泡エフェクト
    for (let i = 0; i < 15; i++) {
      const bubble = this.scene.add.ellipse(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(100, 600),
        Phaser.Math.Between(3, 8),
        Phaser.Math.Between(3, 8),
        0xAADDFF,
        0.6
      )
      this.bubbles.push(bubble)
    }
  }

  private createWaterCurrents(): void {
    // 水流エリア（プレイヤーの移動に影響する可能性）
    const currents = [
      { x: 250, y: 400, width: 30, height: 200 },
      { x: 550, y: 350, width: 30, height: 250 }
    ]

    currents.forEach(currentData => {
      const current = this.scene.add.rectangle(
        currentData.x, currentData.y,
        currentData.width, currentData.height,
        0x66CCFF, 0.3
      )
      this.waterCurrentZones.push(current)
    })
  }

  getWaterCurrentZones(): Phaser.GameObjects.Rectangle[] {
    return this.waterCurrentZones
  }
}