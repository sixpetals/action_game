import { STAGES, StageData } from './StageData'

export class StageManager {
  private currentStageId: number = 1

  getCurrentStage(): StageData {
    return STAGES.find(stage => stage.id === this.currentStageId) || STAGES[0]
  }

  nextStage(): StageData | null {
    const nextId = this.currentStageId + 1
    const nextStage = STAGES.find(stage => stage.id === nextId)
    
    if (nextStage) {
      this.currentStageId = nextId
      return nextStage
    }
    
    return null // 次のステージがない場合
  }

  previousStage(): StageData | null {
    const prevId = this.currentStageId - 1
    const prevStage = STAGES.find(stage => stage.id === prevId)
    
    if (prevStage) {
      this.currentStageId = prevId
      return prevStage
    }
    
    return null // 前のステージがない場合
  }

  setStage(stageId: number): StageData | null {
    const stage = STAGES.find(stage => stage.id === stageId)
    
    if (stage) {
      this.currentStageId = stageId
      return stage
    }
    
    return null // 指定されたステージが存在しない場合
  }

  getCurrentStageId(): number {
    return this.currentStageId
  }

  getTotalStages(): number {
    return STAGES.length
  }
}