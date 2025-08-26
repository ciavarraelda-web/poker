import React, { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { FEE_WALLET, TABLE_FEE_PERCENT } from "../config";

export default function PokerTable() {
  const [tableId, setTableId] = useState<string | null>(null);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // crea tavolo
  const createTable = useCallback(async () => {
    const res = await fetch("/table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: publicKey?.toBase58(), minBuyIn: 1000000, maxPlayers: 5 }),
    });
    const table = await res.json();
    setTableId(table.id);
  }, [publicKey]);

  // entra al tavolo (buy-in pagato dal proprio wallet)
  const joinTable = useCallback(async () => {
    if (!publicKey || !tableId) return;
    const buyIn = 1000000;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(FEE_WALLET),
        lamports: buyIn,
      })
    );
    const signature = await sendTransaction(tx, connection);
    await fetch(`/table/${tableId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: publicKey.toBase58(), buyIn, signature, reference: "buyin_" + publicKey.toBase58() }),
    });
    alert("Entrato al tavolo!");
  }, [connection, publicKey, sendTransaction, tableId]);

  // gioca mano: paga fee per mano
  const playHand = useCallback(async () => {
    if (!publicKey || !tableId) return;
    const fee = 30000; // esempio fee 3%
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(FEE_WALLET),
        lamports: fee,
      })
    );
    const signature = await sendTransaction(tx, connection);
    await fetch(`/table/${tableId}/play`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moves: [], feeSignature: signature, feeReference: "fee_" + publicKey.toBase58() }),
    });
    alert("Mano giocata!");
  }, [connection, publicKey, sendTransaction, tableId]);

  return (
    <div>
      <button onClick={createTable}>Crea tavolo</button>
      {tableId && (
        <>
          <div>ID Tavolo: {tableId}</div>
          <button onClick={joinTable}>Entra al tavolo</button>
          <button onClick={playHand}>Gioca mano</button>
        </>
      )}
    </div>
  );
}
