import Phaser from 'phaser'

export default class TitleScene extends Phaser.Scene {
  private enterKey!: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'TitleScene' })
  }

  create() {
    // 背景色を設定
    this.cameras.main.setBackgroundColor('#E6F3FF')

    // タイトルテキスト
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Nazaction Game', {
      fontSize: '48px',
      color: '#333333',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // サブタイトル
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 40, 'Platform Action Game', {
      fontSize: '20px',
      color: '#666666'
    }).setOrigin(0.5)

    // 操作説明
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, 'Press ENTER to Start', {
      fontSize: '24px',
      color: '#444444'
    }).setOrigin(0.5)

    // 点滅効果
    this.tweens.add({
      targets: this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, 'Press ENTER to Start', {
        fontSize: '24px',
        color: '#444444'
      }).setOrigin(0.5),
      alpha: 0.3,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    })

    // キー入力設定
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.scene.start('StageSelectScene')
    }
  }
}