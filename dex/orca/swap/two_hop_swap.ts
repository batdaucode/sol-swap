import {
  Connection,
  ParsedInstruction,
  ParsedTransactionWithMeta,
  PublicKey,
} from "@solana/web3.js";
import { OrcaDecode } from "../decode";
import { IDL } from "../../../idl/orca/whirlpool";
import {
  getInstructionsByProgramId,
  getSPLTokenAddress,
} from "../../../utils/common";
import { ORCA_PROGRAM_ID } from "../../../utils/const";

export async function findNewSwapFromTxInOrcaDex(
  tx: ParsedTransactionWithMeta,
  connection: Connection
) {
  // find instruction with program id = ORCA_PROGRAM_ID and data existed
  // decode data with instruction Data
  // find instruction with data.name = "twoHopSwap" and get index of this instruction
  // find innerInstructions with index = index of instruction above and type in instructions = transfer. Get index 0 and 1 of this innerInstructions

  const decode = new OrcaDecode(IDL);
  const instructionsByProgram = getInstructionsByProgramId(tx, ORCA_PROGRAM_ID);

  if (instructionsByProgram.length > 0) {
    for (const parsedInstructions of instructionsByProgram) {
      const { index, instruction } = parsedInstructions;
      if (!("data" in instruction)) continue;
      const decodedData = decode.decodeData(instruction.data, "base58");
      const nameProgram = decodedData?.name;

      if (nameProgram && nameProgram === "twoHopSwap") {
        const innerInstructions = tx.meta?.innerInstructions || [];
        for (const innerInstruction of innerInstructions) {
          if (index === innerInstruction.index) {
            const instructions = innerInstruction.instructions;
            const instructionTransfer: any[] = [];
            for (const instruction of instructions) {
              const parsed = (instruction as ParsedInstruction).parsed;
              if (parsed?.type === "transfer") {
                instructionTransfer.push(parsed?.info);
              }
            }
            if (instructionTransfer.length > 1) {
              const tokenIn = instructionTransfer[0];
              const tokenOut =
                instructionTransfer[instructionTransfer.length - 1];
              const tokenInAddress = await getSPLTokenAddress(
                new PublicKey(tokenIn.destination),
                connection
              );
              const tokenInAmount = tokenIn.amount;
              const tokenOutAddress = await getSPLTokenAddress(
                new PublicKey(tokenOut.destination),
                connection
              );
              const tokenOutAmount = tokenOut.amount;
              return {
                tokenInAddress,
                tokenInAmount,
                tokenOutAddress,
                tokenOutAmount,
              };
            }
          }
        }
      }
    }
  }
  return {};
}
