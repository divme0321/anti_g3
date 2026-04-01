# ハコトオル (HakoTooru) | 3D 家具搬入シミュレーター

「この家具、新居の玄関を通るかな？」
「廊下の曲がり角でつっかえないかな？」

ハコトオルは、引越しや家具購入時のそんな不安を解決する、ブラウザ完結の3D搬入経路シミュレーターです。

## 主な機能
- **2D 下書きモード**: 玄関、廊下、部屋のレイアウトを自由に作成
- **3D シミュレーション**: 家具の3Dモデルをマウス操作で動かし、実際に通るかチェック
- **寸法入力**: 家具の幅・高さ・奥行きをセンチメートル単位で調整可能
- **リアルタイム検知**: 壁にぶつかると色が変わる衝突検知機能（開発中）

## Monetization (収益化モデル)
このツールは、主に以下の経路で収益化を目指します：
1. **引越し見積もりアフィリエイト**: 搬入不可を検知した際や、シミュレーション完了後に提携先の引越し見積もりサービスへ誘導
2. **家具物販アフィリエイト**: シミュレーションしたサイズに合う家具を楽天・Amazon等で紹介
3. **Google AdSense**: SEO集客を活かした広告配信

## テクノロジー
- **Framework**: React + Vite (TypeScript)
- **3D Engine**: Three.js + @react-three/fiber
- **UI Components**: Framer Motion, Lucide-React
- **Styling**: Vanilla CSS (Premium Dark/Glass Theme)

## 開発・実行方法
```bash
npm install
npm run dev
```

## 今後の展望
- [ ] AIによる間取り図画像からの自動レイアウト変換
- [ ] 定型家具（ソファ、ベッド、冷蔵庫）のプリセット追加
- [ ] スマートフォンでのAR表示対応
- [ ] 搬入可否レポートのPDF出力

---
Built by Antigravity - Advanced Agentic Coding Assistant
