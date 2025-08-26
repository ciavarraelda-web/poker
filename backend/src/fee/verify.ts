import { Connection, PublicKey } from "@solana/web3.js";
import { FEE_WALLET, SOLANA_RPC } from "../config";

// Verifica che la transazione sia stata inviata al tuo wallet
export async function verifyPayment(
  wallet: string,
  amount: number,
  reference: string,
  signature: string,
  type: "fee" | "buyin" = "buyin"
): Promise<boolean> {
  const connection = new Connection(SOLANA_RPC, "confirmed");
  try {
    const tx = await connection.getTransaction(signature, { commitment: "confirmed" });
    if (!tx) return false;
    // Trova istruzioni SystemProgram.transfer verso FEE_WALLET
    const transfers = tx.transaction.message.instructions.filter((ix: any) => {
      try {
        return (
          ix.programId.toBase58() === "11111111111111111111111111111111" &&
          tx.meta.postTokenBalances.length === 0
        );
      } catch {
        return false;
      }
    });
    // Cerca la destinazione (fee wallet) e importo
    for (const ix of transfers) {
      const to = ix.keys[ix.keys.length - 1].pubkey.toBase58();
      if (to === FEE_WALLET) {
        if (type === "fee" || amount === 0) return true;
        // Per buyin verifica amount
        if (ix.data) {
          const lamports = parseInt(ix.data, 16);
          if (lamports >= amount) return true;
        }
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}
