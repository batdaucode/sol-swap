import { BorshCoder } from "@coral-xyz/anchor";
import { Whirlpool } from "../idl/orca/whirlpool";

export class DecodeTxDataDex {
  coder: BorshCoder<string, string>;
  constructor(IDL: Whirlpool) {
    this.coder = new BorshCoder(IDL);
  }

  decodeData(dataEncode: string, encoding: "hex" | "base58") {
    return this.coder.instruction.decode(dataEncode, encoding);
  }
}
