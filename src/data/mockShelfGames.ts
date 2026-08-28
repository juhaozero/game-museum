/** Level 1 盒墙骨架用 mock（无封面时显示首字） */
export type MockShelfGame = {
  id: string
  name: string
  shotCount: number
  coverUrl?: string
}

export const MOCK_SHELF_GAMES: MockShelfGame[] = [
  { id: 'mock-hollow-knight', name: 'Hollow Knight', shotCount: 24 },
  { id: 'mock-celeste', name: 'Celeste', shotCount: 18 },
  { id: 'mock-hades', name: 'Hades', shotCount: 32 },
  { id: 'mock-ori', name: 'Ori and the Blind Forest', shotCount: 15 },
  { id: 'mock-outer-wilds', name: 'Outer Wilds', shotCount: 21 },
  { id: 'mock-slay-the-spire', name: 'Slay the Spire', shotCount: 12 },
]
