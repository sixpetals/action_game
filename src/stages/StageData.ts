export interface PlatformData {
  x: number
  y: number
  scaleX: number
  scaleY: number
}

export interface StageData {
  id: number
  name: string
  backgroundColor: string
  platformColor: number
  platforms: PlatformData[]
}

export const STAGES: StageData[] = [
  // ステージ1: 現在のパステル調
  {
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
  },
  
  // ステージ2: 火山ステージ
  {
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
  },
  
  // ステージ3: 海底ステージ
  {
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
]