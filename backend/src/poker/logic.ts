import { Player } from "./player";

// Demo: il vincitore è scelto casualmente
export function playPokerHand(players: Player[], moves: any[]): any {
  // TODO: Implementa vera logica Texas Hold'em!
  const winner = players[Math.floor(Math.random() * players.length)];
  return {
    winner: winner.id,
    moves,
  };
}
