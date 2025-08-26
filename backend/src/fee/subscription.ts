import { verifyPayment } from "./verify";
import { SUBSCRIPTION_COST_SOL } from "../config";

// Verifica che il pagamento abbonamento sia stato effettuato
export async function verifySubscription(wallet: string, signature: string, reference: string): Promise<boolean> {
  // L'abbonamento è pagato verso il fee wallet con importo uguale a SUBSCRIPTION_COST_SOL
  return await verifyPayment(wallet, Math.floor(SUBSCRIPTION_COST_SOL * 1_000_000_000), reference, signature, "fee");
}
