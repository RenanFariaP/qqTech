export interface ModuleInfos {
        id: number;
        name: string;
        description: string;
        TAG: string;
        methods: {
          id: number;
          name: string;
          description: string;
          TAG: string;
        };
        transactions: {
          id: number;
          name: string;
          description: string;
          TAG: string;
        };
      };