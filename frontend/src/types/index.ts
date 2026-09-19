export interface SignalData {
  i: number[]
  q: number[]
  sampleRate: number
  centerFreq: number
}

export interface SpectrumData {
  frequencies: number[]
  magnitudes: number[]
}

export interface WaterfallRow {
  time: number
  values: number[]
}

export interface ConstellationPoint {
  i: number
  q: number
}

export interface ModulationResult {
  type: string
  confidence: number
  candidates: { type: string; score: number }[]
  symbolRate: number | null
  frequencyOffset: number | null
}

export interface FreqMarker {
  id: string
  /** 标记所吸附的频率点 (Hz)，取自频谱曲线 */
  frequency: number
  /** 打标记时该点的幅度 (dB)，数据缺失时作为回退显示 */
  magnitude: number
  /** 是否在曲线上显示，关闭后标记从曲线上消失 */
  enabled: boolean
  createdAt: number
}

export interface AnalysisResult {
  spectrum: SpectrumData
  waterfall: WaterfallRow[]
  constellation: ConstellationPoint[]
  modulation: ModulationResult
}

export const MODULATION_TYPES = ['AM', 'FM', 'BPSK', 'QPSK', '16QAM']