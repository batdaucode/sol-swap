import {
  Connection,
  ParsedInstruction,
  ParsedTransactionWithMeta,
  PartiallyDecodedInstruction,
  PublicKey,
} from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";

interface IParsedInstructions {
  index: number;
  instruction: ParsedInstruction | PartiallyDecodedInstruction;
}

export function getInstructionsByProgramId(
  tx: ParsedTransactionWithMeta,
  programId: PublicKey
) {
  const parsedInstructions: IParsedInstructions[] = [];

  for (const [
    index,
    instruction,
  ] of tx.transaction.message.instructions.entries()) {
    if (instruction?.programId && instruction?.programId.equals(programId)) {
      parsedInstructions.push({
        index,
        instruction,
      });
    }
  }

  return parsedInstructions;
}

export async function getSPLTokenAddress(
  tokenAccountAddress: PublicKey,
  connection: Connection
) {
  const tokenAccount = await getAccount(connection, tokenAccountAddress);
  return tokenAccount.mint?.toBase58();
}
