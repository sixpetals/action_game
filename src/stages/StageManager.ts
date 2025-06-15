import Phaser from 'phaser'
import { BaseStage } from './BaseStage'
import { Stage001 } from './Stage001/Stage001'
import { Stage002 } from './Stage002/Stage002'
import { Stage003 } from './Stage003/Stage003'

export class StageManager {
  private currentStageId: number = 1
  private currentStageInstance: BaseStage | null = null
  private scene: Phaser.Scene
  private readonly totalStages = 3

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  getCurrentStage(): BaseStage {
    if (!this.currentStageInstance) {
      this.currentStageInstance = this.createStageInstance(this.currentStageId)
    }
    return this.currentStageInstance
  }

  nextStage(): BaseStage | null {
    const nextId = this.currentStageId + 1
    
    if (nextId <= this.totalStages) {
      this.destroyCurrentStage()
      this.currentStageId = nextId
      this.currentStageInstance = this.createStageInstance(this.currentStageId)
      return this.currentStageInstance
    }
    
    return null // 次のステージがない場合
  }

  previousStage(): BaseStage | null {
    const prevId = this.currentStageId - 1
    
    if (prevId >= 1) {
      this.destroyCurrentStage()
      this.currentStageId = prevId
      this.currentStageInstance = this.createStageInstance(this.currentStageId)
      return this.currentStageInstance
    }
    
    return null // 前のステージがない場合
  }

  setStage(stageId: number): BaseStage | null {
    if (stageId >= 1 && stageId <= this.totalStages) {
      this.destroyCurrentStage()
      this.currentStageId = stageId
      this.currentStageInstance = this.createStageInstance(this.currentStageId)
      return this.currentStageInstance
    }
    
    return null // 指定されたステージが存在しない場合
  }

  getCurrentStageId(): number {
    return this.currentStageId
  }

  getTotalStages(): number {
    return this.totalStages
  }

  updateCurrentStage(): void {
    if (this.currentStageInstance) {
      this.currentStageInstance.updateGimmicks()
    }
  }

  destroyCurrentStage(): void {
    if (this.currentStageInstance) {
      this.currentStageInstance.destroyGimmicks()
      this.currentStageInstance = null
    }
  }

  private createStageInstance(stageId: number): BaseStage {
    const paddedId = stageId.toString().padStart(3, '0')
    
    switch (paddedId) {
      case '001':
        return new Stage001(this.scene)
      case '002':
        return new Stage002(this.scene)
      case '003':
        return new Stage003(this.scene)
      default:
        throw new Error(`Stage ${paddedId} not found`)
    }
  }
}