import { useStore, PRESETS } from './store/useStore';
import { 
  Box, 
  Map, 
  Play, 
  Monitor, 
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Move,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import Scene from './components/Scene';

const Sidebar = () => {
  const { 
    mode, setMode, 
    furniture, updateFurniture, 
    isColliding 
  } = useStore();

  return (
    <motion.aside 
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="sidebar glass"
    >
      <div className="logo">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="logo-icon"
        >
          <Box size={20} />
        </motion.div>
        <span className="font-heading">HakoTooru</span>
      </div>

      <div className="card glass">
        <div className="input-label">シミュレーション モード</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            className={mode === 'EDIT' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setMode('EDIT')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Map size={16} /> 下書き
          </button>
          <button 
            className={mode === 'SIMULATE' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setMode('SIMULATE')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Play size={16} /> 開始
          </button>
        </div>
      </div>

      <div className="card glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Layers size={18} color="var(--primary)" />
          <h3 className="font-heading">家具のプリセット</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {Object.entries(PRESETS).map(([key, item]) => (
            <button 
              key={key}
              className={furniture.name === item.name ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px', fontSize: '11px' }}
              onClick={() => updateFurniture({ ...item })}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Box size={18} color="var(--primary)" />
          <h3 className="font-heading">独自の寸法 (m)</h3>
        </div>
        
        <div className="input-group">
          <label className="input-label">幅 (W)</label>
          <input 
            type="number" step="0.1" 
            value={furniture.width} 
            onChange={(e) => updateFurniture({ width: parseFloat(e.target.value), name: 'カスタム' })} 
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">高さ (H)</label>
          <input 
            type="number" step="0.1" 
            value={furniture.height} 
            onChange={(e) => updateFurniture({ height: parseFloat(e.target.value), name: 'カスタム' })} 
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">奥行き (D)</label>
          <input 
            type="number" step="0.1" 
            value={furniture.depth} 
            onChange={(e) => updateFurniture({ depth: parseFloat(e.target.value), name: 'カスタム' })} 
          />
        </div>
      </div>

      {isColliding && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--error)', color: 'var(--error)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} />
            <strong>衝突を検知しました</strong>
          </div>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>家具が壁に接触しています。搬入できない可能性があります。</p>
        </motion.div>
      )}

      {/* Monetization / Affiliate Placeholder */}
      <div className="card glass" style={{ marginTop: 'auto', background: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.01))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingUp size={16} color="var(--success)" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>SPONSORED</span>
        </div>
        <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>格安引越し見積もり</h4>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px' }}>
          この家具の搬入も安心。3社以上の比較で最大50%オフ。
        </p>
        <button className="btn-primary" style={{ width: '100%', fontSize: '12px', padding: '8px' }}>
          無料で見積もりを取る <ArrowUpRight size={14} />
        </button>
      </div>
      {/* User Guide Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card glass" 
        style={{ marginTop: '24px', border: '1px dashed var(--glass-border)' }}
      >
        <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={14} />
            <strong>使い方ガイド</strong>
          </div>
          <ul style={{ paddingLeft: '20px', listStyle: 'disc' }}>
            <li>下書きモードで壁を配置</li>
            <li>開始ボタンでシミュ開始</li>
            <li>3D空間で家具をドラッグ</li>
          </ul>
        </div>
      </motion.div>
    </motion.aside>
  );
};

function App() {
  const { mode } = useStore();

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-viewport">
        {/* Editor Overlay Info */}
        <div className="editor-overlay glass" style={{ padding: '8px 16px', borderRadius: '40px' }}>
          {mode === 'EDIT' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Move size={14} color="var(--primary)" />
              <span>ドラッグで壁の位置を調整できます</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Play size={14} color="var(--success)" />
              <span>マウスで家具を操作して通り抜けを確認</span>
            </div>
          )}
        </div>

        <div className="canvas-container">
          <Scene />
        </div>
      </main>
    </div>
  );
}

export default App;
