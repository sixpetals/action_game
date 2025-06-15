import Phaser from 'phaser'

export interface PlatformData {
  x: number
  y: number
  scaleX: number
  scaleY: number
}

export interface StageConfig {
  id: number
  name: string
  backgroundColor: string
  platformColor: number
  platforms: PlatformData[]
}

export abstract class BaseStage {
  protected scene: Phaser.Scene
  protected config: StageConfig

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.config = this.getStageConfig()
  }

  abstract getStageConfig(): StageConfig
  abstract createGimmicks(): void
  abstract updateGimmicks(): void
  abstract destroyGimmicks(): void

  getConfig(): StageConfig {
    return this.config
  }

  createPlatforms(platforms: Phaser.Physics.Arcade.StaticGroup) {
    const textureName = `ground_stage${this.config.id}`
    this.config.platforms.forEach(platformData => {
      const platform = platforms.create(platformData.x, platformData.y, textureName)
      platform.setScale(platformData.scaleX, platformData.scaleY).refreshBody()
    })
  }
}