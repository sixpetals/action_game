import Phaser from 'phaser'
import { StageManager } from '../stages/StageManager'

export default class StageSelectScene extends Phaser.Scene {
  private stageManager!: StageManager
  private selectedIndex = 0
  private stageItems: { id: number, name: string }[] = []
  private menuTexts: Phaser.GameObjects.Text[] = []
  private selector!: Phaser.GameObjects.Rectangle
  private keyStates = {
    UP: false,
    DOWN: false,
    ENTER: false
  }

  constructor() {
    super({ key: 'StageSelectScene' })
  }

  create() {
    // 既存のデータをクリア
    this.selectedIndex = 0
    this.stageItems = []
    this.menuTexts = []

    // 背景色を設定
    this.cameras.main.setBackgroundColor('#F0F8FF')

    // タイトル
    this.add.text(this.cameras.main.centerX, 80, 'Stage Select', {
      fontSize: '36px',
      color: '#333333',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // StageManagerを初期化してステージリストを取得
    this.stageManager = new StageManager(this)
    this.loadStageList()
    this.createMenu()

    // キー入力設定（ネイティブJavaScriptイベント）
    this.setupControls()

    // 操作説明
    this.add.text(this.cameras.main.centerX, this.cameras.main.height - 80, 'UP/DOWN: Select  ENTER: Start Stage', {
      fontSize: '16px',
      color: '#666666'
    }).setOrigin(0.5)

    this.updateSelection()
  }

  update() {
    this.handleInput()
  }

  private setupControls() {
    // ネイティブのキーボードイベントを使用
    window.addEventListener('keydown', (event) => {
      switch(event.key) {
        case 'ArrowUp':
          this.keyStates.UP = true
          break
        case 'ArrowDown':
          this.keyStates.DOWN = true
          break
        case 'Enter':
          this.keyStates.ENTER = true
          break
      }
    })

    window.addEventListener('keyup', (event) => {
      switch(event.key) {
        case 'ArrowUp':
          this.keyStates.UP = false
          break
        case 'ArrowDown':
          this.keyStates.DOWN = false
          break
        case 'Enter':
          this.keyStates.ENTER = false
          break
      }
    })
  }

  private handleInput() {
    // 上キー（一回だけ処理）
    if (this.keyStates.UP) {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1)
      this.updateSelection()
      this.keyStates.UP = false // 一回だけ処理
    }

    // 下キー（一回だけ処理）
    if (this.keyStates.DOWN) {
      this.selectedIndex = Math.min(this.stageItems.length - 1, this.selectedIndex + 1)
      this.updateSelection()
      this.keyStates.DOWN = false // 一回だけ処理
    }

    // エンターキー（一回だけ処理）
    if (this.keyStates.ENTER) {
      this.startSelectedStage()
      this.keyStates.ENTER = false // 一回だけ処理
    }
  }

  private loadStageList() {
    // StageManagerから全ステージの情報を取得
    const totalStages = this.stageManager.getTotalStages()
    
    for (let i = 1; i <= totalStages; i++) {
      const stage = this.stageManager.setStage(i)
      if (stage) {
        const config = stage.getConfig()
        this.stageItems.push({
          id: config.id,
          name: config.name
        })
      }
    }
  }

  private createMenu() {
    const startY = 180
    const spacing = 50

    this.stageItems.forEach((item, index) => {
      const y = startY + index * spacing
      const text = this.add.text(
        this.cameras.main.centerX, 
        y, 
        `Stage ${item.id.toString().padStart(3, '0')}: ${item.name}`,
        {
          fontSize: '24px',
          color: '#444444'
        }
      ).setOrigin(0.5)

      this.menuTexts.push(text)
    })

    // 選択インジケーターを作成
    this.selector = this.add.rectangle(
      this.cameras.main.centerX,
      180,
      400,
      40,
      0xFF6B6B,
      0.3
    )
  }

  private updateSelection() {
    const startY = 180
    const spacing = 50
    
    // 選択インジケーターの位置を更新
    this.selector.y = startY + this.selectedIndex * spacing

    // テキストの色を更新
    this.menuTexts.forEach((text, index) => {
      if (text && text.active && !text.destroyed) {
        if (index === this.selectedIndex) {
          text.setColor('#FFFFFF')
        } else {
          text.setColor('#444444')
        }
      }
    })
  }

  private startSelectedStage() {
    const selectedStage = this.stageItems[this.selectedIndex]
    
    // オブジェクトのクリーンアップ
    this.menuTexts = []
    
    // GameSceneに選択されたステージIDを渡す
    this.scene.start('GameScene', { selectedStageId: selectedStage.id })
  }
}