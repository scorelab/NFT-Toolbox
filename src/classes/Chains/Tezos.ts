import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import fs from 'fs';
import path from 'path';

interface DraftOptions {
  // Tezos-specific options
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
}

interface DeployConfigs {
  rpc: string;
  signer: InMemorySigner;
}

interface ContractAttributes {
  dir: fs.PathLike;
  name: string;
  symbol: string;
  connection: DeployConfigs;
  deployed?: {
    address: string;
    contract: any;
  };
}

export class Contract {
  dir: fs.PathLike;
  name: string;
  symbol: string;

  rpc: string;
  signer: InMemorySigner;
  deployedInstance: any;

  constructor(attr: ContractAttributes) {
    this.dir = attr.dir;
    this.name = attr.name;
    this.symbol = attr.symbol;

    this.rpc = attr.connection.rpc;
    this.signer = attr.connection.signer;
    this.deployedInstance = attr.deployed?.contract;
  }

  print(contractCode: string): void {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }
    fs.writeFileSync(
      path.join(this.dir.toString(), `${this.name}.tz`),
      contractCode,
      { flag: "w" }
    );
  }



  draft(options: DraftOptions): void {
    const storage = 0;
    const parameter = "int";
    const code = [
      { prim: "parameter", args: [{ prim: parameter }] },
      { prim: "storage", args: [{ prim: "int" }] },
      {
        prim: "code",
        args: [
          [
            { prim: "CAR" },
            { prim: "ADD" },
            { prim: "NIL", args: [{ prim: "operation" }] },
            { prim: "PAIR" },
          ],
        ],
      },
    ];

    const contract = {
      code,
      storage,
    };

    const contractCode = JSON.stringify(contract, null, 2);
    this.print(contractCode);
    console.log(`Contract created: ${this.dir}`);
  }

    async deploy(): Promise<void> { 
        const rpc = "https://api.tez.ie/rpc/florencenet";
        const signer = new InMemorySigner("your_private_key_here");

        const Tezos = new TezosToolkit(rpc);
        Tezos.setProvider({ signer });

        const contractCode = fs.readFileSync(
            path.join(this.dir.toString(), `${this.name}.tz`),
            "utf-8"
        );

        Tezos.wallet
        .originate({
            code: contractCode,
            storage: 0,
        })
        .send()
        .then((operation) => {
            return operation.confirmation().then(() => operation.contract());
            })
        .then((contract) => {
            this.deployedInstance = {
                address: contract.address,
                contract,
            };
            console.log(`Contract deployed at ${this.deployedInstance.address}`);
        })
        .catch((error) => {
            console.error(`Error deploying contract: ${error}`);
        });
    }

  async write(value: number): Promise<string> {
    if (!this.deployedInstance) {
      throw new Error("Contract has not been deployed");
    }

    const Tezos = new TezosToolkit(this.rpc);
    Tezos.setProvider({ signer: this.signer });

    const operation = await this.deployedInstance.contract.methods.main(value).send();
    console.log(`Transaction ${operation.opHash} sent to ${this.deployedInstance.address}`);
    return operation.opHash;
  }

  async read(): Promise<number> {
    if (!this.deployedInstance) {
      throw new Error("Contract has not been deployed");
    }

    const Tezos = new TezosToolkit(this.rpc);
    Tezos.setProvider({ signer: this.signer });

    const storage = await this.deployedInstance.contract.storage();
    return storage.toNumber();
  }
}