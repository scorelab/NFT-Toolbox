import fs from "fs";
import path from "path";
import { SystemProgram, Keypair, Connection, Transaction, TransactionInstruction,
   PublicKey, sendAndConfirmTransaction, Commitment} from "@solana/web3.js";
import { Program, Idl, Provider } from '@project-serum/anchor';

type networks = "devnet" | "testnet" | "mainnet-beta";

export interface DraftOptions {
  // Solana-specific options
  payer: Keypair;
  programId: string;
  programData: Buffer;
}

export interface DeployConfigs {
  rpc: string;
  network: networks;
  connection: Connection;
  payer: Keypair;
  idl: Idl;
}

interface DeployedInstance {
  address: string;
}

export interface ContractAttributes {
  dir: fs.PathLike;
  name: string;
  symbol: string;
  connection: DeployConfigs;
  deployed?: {
    address: string;
    programId: string;
    programData?: Buffer;
  };
}

export class Contract {
  dir: fs.PathLike;
  name: string;
  symbol: string;

  payer: Keypair;
  programId: string;
  programData: Buffer;
  connection: Connection;
  idl: Idl;

  deployedInstance: string | undefined = undefined;
  rpc: string;

  constructor(attr: ContractAttributes) {
    this.dir = attr.dir;
    this.name = attr.name;
    this.symbol = attr.symbol;

    this.connection = attr.connection.connection;
    this.payer = attr.connection.payer;
    this.programId = attr.deployed?.programId || "";
    this.programData = attr.deployed?.programData || Buffer.alloc(0);
    this.deployedInstance = attr.deployed?.address;
    this.rpc = attr.connection.rpc;
    this.idl = attr.connection.idl;
  }

  print(contractCode: string): void {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }
    fs.writeFileSync(
      path.join(this.dir.toString(), `${this.name}.sol`),
      contractCode,
      { flag: "w" }
    );
  }

  draft(options: DraftOptions): void {
    // const contractCode = ""; // TODO: Implement contract code generation for Solana
    const contractCode = `
      // Simple Solana smart contract
      program {
        // Define the state struct
        struct State {
          u64 count;
        }

        // Define the program's entrypoint
        entrypoint (ctx: Context, instructionData: Buffer) -> ProgramResult {
          // Parse the instruction data
          let instruction = parseInstruction(instructionData);

          // Initialize the state
          let state = State { count: 0 };

          // Perform the requested action
          if (instruction.method == "increment") {
            state.count += instruction.args[0];
          } else if (instruction.method == "decrement") {
            state.count -= instruction.args[0];
          }

          // Serialize and save the state
          let stateData = serialize(state);
          let stateAccount = &mut ctx.accounts.state;
          stateAccount.data = stateData;

          // Return the updated state
          return ProgramResult::Ok(stateData);
        }

        // Parse the instruction data
        fn parseInstruction(instructionData: &[u8]) -> Instruction {
          let instruction = deserialize(instructionData).unwrap();
          return instruction;
        }

        // Serialize the state
        fn serialize(state: State) -> Vec<u8> {
          let stateData = borsh::BorshSerialize::try_to_vec(&state).unwrap();
          return stateData;
        }

        // Deserialize the state
        fn deserialize(stateData: &[u8]) -> Option<Instruction> {
          let instruction = borsh::BorshDeserialize::try_from_slice(stateData).unwrap();
          return instruction;
        }

        // Define the instruction struct
        #[derive(BorshSerialize, BorshDeserialize)]
        struct Instruction {
          method: String,
          args: Vec<u64>,
        }
      }
    `;
    this.print(contractCode);
    console.log(`Contract created : ${this.dir}`);
  }

  async deploy(): Promise<void> {
    if (this.deployedInstance) {
      console.log(`Contract already deployed at ${this.deployedInstance}`);
      return;
    }

    const programAccount = new Keypair();
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: this.payer.publicKey,
        newAccountPubkey: programAccount.publicKey,
        lamports: await this.connection.getMinimumBalanceForRentExemption(
          this.programData.length
        ),
        space: this.programData.length,
        programId: new PublicKey(this.programId),
      })
    );

    const instruction = new TransactionInstruction({
      keys: [{ pubkey: programAccount.publicKey, isSigner: true, isWritable: true }],
      programId: new PublicKey(this.programId),
      data: this.programData,
    });
    transaction.add(instruction);

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.payer, programAccount],
      { commitment: "singleGossip", preflightCommitment: "singleGossip" }
    );

    this.deployedInstance = programAccount.publicKey.toBase58();
    console.log(`Contract deployed at ${this.deployedInstance} with signature ${signature}`);
  }

  async write(method: string, args: any[]): Promise<string> {
    if (!this.deployedInstance) {
      throw new Error("Contract has not been deployed");
    }

    const programId = new PublicKey(this.programId);
    const programAccount = new PublicKey(this.deployedInstance);
    const instruction = new TransactionInstruction({
      keys: [{ pubkey: programAccount, isSigner: false, isWritable: true }],
      programId,
      data: Buffer.from(JSON.stringify({ method, args })),
    });

    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.payer],
      { commitment: "singleGossip", preflightCommitment: "singleGossip" }
    );

    console.log(`Transaction ${signature} sent to ${this.deployedInstance}`);
    return signature;
  }

  async read(method: string, args: any[]): Promise<any> {
    if (!this.deployedInstance) {
      throw new Error("Contract has not been deployed");
    }

    const programId = new PublicKey(this.programId);
    const programAccount = new PublicKey(this.deployedInstance);
    const instruction = new TransactionInstruction({
      keys: [{ pubkey: programAccount, isSigner: false, isWritable: true }],
      programId,
      data: Buffer.from(JSON.stringify({ method, args })),
    });

    const sendOptions = {
      skipPreflight: false,
      preflightCommitment: 'singleGossip' as Commitment,
      commitment: 'singleGossip' as Commitment,
      signers: [this.payer],
    };

    const transaction = new Transaction().add(instruction);
    const result = await this.connection.sendEncodedTransaction(
      transaction.serialize().toString(),
      sendOptions,// Create SendOptions object with signers property
    );
    console.log(`Result of ${method} call: ${result}`);
    return result;
  }
}