import React, { useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { FEE_WALLET, SUBSCRIPTION_COST_SOL } from "../config";

export default function Subscription() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const paySubscription = useCallback(async () => {
    if (!publicKey) return;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(FEE_WALLET),
        lamports: Math.floor(SUBSCRIPTION_COST_SOL * 1_000_000_000),
      })
    );
    const signature = await sendTransaction(tx, connection);
    // manda signature al backend per verifica
    await fetch("/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: publicKey.toBase58(), signature, reference: "sub_" + publicKey.toBase58() }),
    });
    alert("Abbonamento pagato!");
  }, [connection, publicKey, sendTransaction]);

  return <button onClick={paySubscription}>Paga abbonamento</button>;
}
