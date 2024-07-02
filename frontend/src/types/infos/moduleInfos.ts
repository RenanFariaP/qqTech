import { MethodInfos } from "./methodInfos";
import { TransactionInfos } from "./transactionInfos";

export interface ModuleInfos {
        id: number;
        name: string;
        description: string;
        TAG: string;
        methods: MethodInfos[];
        transactions: TransactionInfos[];
      };