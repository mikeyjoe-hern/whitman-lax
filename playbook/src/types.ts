export type TokenType = 'attack' | 'midfield' | 'defense' | 'goalie' | 'lsm' | 'ball' | 'cone'

export type Mode = 'select' | 'arrow'

export interface Token {
  id: string
  type: TokenType
  label: string
  x: number
  y: number
  customColor?: string
}

export interface ArrowPath {
  id: string
  points: [number, number][]
  color: string
  dashed: boolean
}
