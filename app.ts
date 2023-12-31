import { Connection } from "@solana/web3.js";
import _ from "lodash";
import { findNewPairFromTxInOrcaDex } from "./dex/orca/pool";
import { findNewSwapFromTxInOrcaDex } from "./dex/orca/swap/two_hop_swap";

const connection = new Connection(
  "https://go.getblock.io/9cfcc26d77eb4b9f87d5dcb2dcecb5f5",
  "confirmed"
);

async function getTransactions(txs: string[]) {
  try {
    return await connection.getParsedTransactions(txs, {
      maxSupportedTransactionVersion: 0,
    });
  } catch (error) {
    console.log(error);
    return await getTransactions(txs);
  }
}

async function main() {
  // const slot = await connection.getSlot();
  // let block = await connection.getBlock(slot, {
  //   maxSupportedTransactionVersion: 0,
  // });
  // const transactions = block?.transactions || [];
  // let sigsUnique: string[] = [];
  // const signatures = transactions.map((tx) => {
  //   const sigs = tx.transaction.signatures;
  //   sigs.map((sig) => sigsUnique.push(sig));
  // });
  // sigsUnique = [...new Set(sigsUnique)];
  // const chunks = _.chunk(sigsUnique, 50);
  // for (const chunk of chunks) {
  //   const txs = await getTransactions([
  //     "vjPWFCMq4rU5qbh6BL78ogK1DGui11JL4Eqfit4b1Jpq2LpE1opHUiE1dfyRXr9kVWnJM6AxwS5C9QYWSPZuV7N",
  //   ]);
  //   console.log(txs.length);
  //   for (const tx of txs) {
  //     if (!tx) continue;
  //     // const poolInfo = await findNewPairFromTxInOrcaDex(tx);
  //     // if (poolInfo) {
  //     //   console.log(poolInfo);
  //     // }
  //     const swapInfo = await findNewSwapFromTxInOrcaDex(tx);
  //     // if (swapInfo) {
  //     //   console.log(swapInfo);
  //     // }
  //   }
  // }
  // main();

  // const poolInfo = await findNewPairFromTxInOrcaDex(tx);
  // if (poolInfo) {
  //   console.log(poolInfo);
  // }

  const tx = await connection.getParsedTransaction(
    "vjPWFCMq4rU5qbh6BL78ogK1DGui11JL4Eqfit4b1Jpq2LpE1opHUiE1dfyRXr9kVWnJM6AxwS5C9QYWSPZuV7N",
    {
      maxSupportedTransactionVersion: 0,
    }
  );
  if (!tx) return;
  const swapInfo = await findNewSwapFromTxInOrcaDex(tx, connection);
  if (swapInfo) {
    console.log(swapInfo);
  }
}

main();
