import { MethodInfos } from "./methodInfo";
import { TransactionInfos } from "./transactionInfo";

export interface ModuleInfos {
        id: number;
        name: string;
        description: string;
        TAG: string;
        methods: MethodInfos[];
        transactions: TransactionInfos[];
      };