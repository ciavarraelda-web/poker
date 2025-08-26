import { Express, Request, Response } from "express";
import { createTable, joinTable, playHand, getTableStatus } from "../poker/table";
import { verifyPayment } from "../fee/verify";
import { verifySubscription } from "../fee/subscription";

// API: abbonamento
export function setupPokerRoutes(app: Express) {
  app.post("/subscribe", async (req: Request, res: Response) => {
    const { wallet, signature, reference } = req.body;
    const ok = await verifySubscription(wallet, signature, reference);
    res.json({ success: ok });
  });

  // crea tavolo
  app.post("/table", (req, res) => {
    const { owner, minBuyIn, maxPlayers } = req.body;
    const table = createTable(owner, minBuyIn, maxPlayers);
    res.json(table);
  });

  // join tavolo (con verifica pagamento buyin)
  app.post("/table/:id/join", async (req, res) => {
    const { id } = req.params;
    const { player, buyIn, signature, reference } = req.body;
    const ok = await verifyPayment(player, buyIn, reference, signature);
    if (!ok) return res.status(400).json({ error: "Payment not found or invalid" });
    const joined = joinTable(id, player, buyIn);
    res.json({ success: joined });
  });

  // gioca mano
  app.post("/table/:id/play", async (req, res) => {
    const { id } = req.params;
    const { moves, feeSignature, feeReference } = req.body;
    // verifica fee pagata
    const feeOk = await verifyPayment("any", 0, feeReference, feeSignature, "fee");
    if (!feeOk) return res.status(400).json({ error: "Fee payment missing" });
    const result = await playHand(id, moves);
    res.json(result);
  });

  app.get("/table/:id", (req, res) => {
    const { id } = req.params;
    const status = getTableStatus(id);
    res.json(status);
  });
}
