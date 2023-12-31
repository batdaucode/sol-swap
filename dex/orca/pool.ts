import { ParsedTransactionWithMeta } from "@solana/web3.js";
import { getInstructionsByProgramId } from "../../utils/common";
import { ORCA_PROGRAM_ID } from "../../utils/const";
import { OrcaDecode } from "./decode";
import { IDL } from "../../idl/orca/whirlpool";

export async function findNewPairFromTxInOrcaDex(
  tx: ParsedTransactionWithMeta
) {
  // find instruction use programId = whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc
  // parse data and check name = initializePool
  // get account. index 1 = Token In, 2 = Token Out, 4 = pair
  const decode = new OrcaDecode(IDL);
  const instructionsByProgram = getInstructionsByProgramId(tx, ORCA_PROGRAM_ID);
  if (instructionsByProgram.length > 0) {
    for (const parsedInstructions of instructionsByProgram) {
      const { instruction } = parsedInstructions;
      if (!("data" in instruction)) continue;
      const decodedData = decode.decodeData(instruction.data, "base58");
      const nameProgram = decodedData?.name;

      if (nameProgram && nameProgram === "initializePool") {
        return {
          tokenIn: instruction.accounts[1],
          tokenOut: instruction.accounts[2],
          pair: instruction.accounts[4],
        };
      }
    }
  }
  return null;
}
