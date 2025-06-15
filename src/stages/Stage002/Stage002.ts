import Phaser from 'phaser'
import { BaseStage, StageConfig } from '../BaseStage'

export class Stage002 extends BaseStage {
  private lavaParticles?: Phaser.GameObjects.Particles.ParticleEmitter
  private hazardZones: Phaser.GameObjects.Rectangle[] = []

  getStageConfig(): StageConfig {
    return {
      id: 2,
      name: "Volcano Cave",
      backgroundColor: "#FFE6E6",
      platformColor: 0xFF6B6B,
      platforms: [
        { x: 400, y: 568, scaleX: 2, scaleY: 1 },      // メイン地面
        { x: 200, y: 450, scaleX: 0.3, scaleY: 1 },   // 小さな足場
        { x: 500, y: 350, scaleX: 0.4, scaleY: 1 },   // 中間足場
        { x: 150, y: 200, scaleX: 0.3, scaleY: 1 },   // 高い足場
        { x: 650, y: 250, scaleX: 0.3, scaleY: 1 }    // 右側高台
      ]
    }
  }

  createGimmicks(): void {
    // Stage002の特別なギミック: 溶岩の危険地帯
    this.createHazardZones()
    this.createLavaParticles()
  }

  updateGimmicks(): void {
    // 危険地帯の色をアニメーション
    this.hazardZones.forEach((zone, index) => {
      const intensity = Math.sin(this.scene.time.now * 0.005 + index) * 0.3 + 0.7
      zone.setAlpha(intensity)
    })
  }

  destroyGimmicks(): void {
    if (this.lavaParticles) {
      this.lavaParticles.destroy()
      this.lavaParticles = undefined
    }
    
    this.hazardZones.forEach(zone => zone.destroy())
    this.hazardZones = []
  }

  private createHazardZones(): void {
    // 溶岩の危険地帯を作成
    const zones = [
      { x: 300, y: 580, width: 80, height: 20 },
      { x: 450, y: 580, width: 60, height: 20 },
      { x: 600, y: 580, width: 100, height: 20 }
    ]

    zones.forEach(zoneData => {
      const zone = this.scene.add.rectangle(
        zoneData.x, zoneData.y, 
        zoneData.width, zoneData.height, 
        0xFF4444, 0.6
      )
      this.hazardZones.push(zone)
    })
  }

  private createLavaParticles(): void {
    // パーティクルエフェクト（シンプルな実装）
    // 実際のパーティクルシステムの代わりに点滅する小さな四角形を使用
    for (let i = 0; i < 10; i++) {
      const particle = this.scene.add.rectangle(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(500, 590),
        2, 2,
        0xFFAA00
      )
      
      this.scene.tweens.add({
        targets: particle,
        alpha: 0,
        y: particle.y - 50,
        duration: Phaser.Math.Between(1000, 2000),
        ease: 'Power2',
        repeat: -1,
        yoyo: true
      })
    }
  }

  getHazardZones(): Phaser.GameObjects.Rectangle[] {
    return this.hazardZones
  }
}