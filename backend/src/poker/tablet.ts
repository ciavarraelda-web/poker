import { v4 as uuid } from "uuid";
import { Player } from "./player";
import { playPokerHand } from "./logic";

export interface Table {
  id: string;
  owner: string;
  minBuyIn: number;
  maxPlayers: number;
  players: Player[];
  hands: any[];
  pot: number;
}

const tables: Record<string, Table> = {};

export function createTable(owner: string, minBuyIn: number, maxPlayers: number): Table {
  const id = uuid();
  tables[id] = {
    id,
    owner,
    minBuyIn,
    maxPlayers,
    players: [],
    hands: [],
    pot: 0,
  };
  return tables[id];
}

export function joinTable(id: string, playerWallet: string, buyIn: number): boolean {
  const table = tables[id];
  if (!table || table.players.length >= table.maxPlayers || buyIn < table.minBuyIn) return false;
  table.players.push({ id: playerWallet, buyIn, stack: buyIn });
  table.pot += buyIn;
  return true;
}

export async function playHand(id: string, moves: any[]): Promise<any> {
  const table = tables[id];
  if (!table) return { error: "Table not found" };
  const result = playPokerHand(table.players, moves);
  table.hands.push(result);
  return { ...result, pot: table.pot, tableId: id, losers: table.players.filter(p => p.id !== result.winner).map(p => p.id) };
}

export function getTableStatus(id: string) {
  return tables[id] || null;
}
