import { BorshCoder } from "@coral-xyz/anchor";
import { IDL, Whirlpool } from "../../idl/orca/whirlpool";
import { DecodeTxDataDex } from "../../utils/decode";

export class OrcaDecode extends DecodeTxDataDex {
  constructor(IDL: Whirlpool) {
    super(IDL);
  }
}
