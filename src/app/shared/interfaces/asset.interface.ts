export interface Asset {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: {
    'active-tick': Mapping;
    oanda: Mapping;
    simulation: Mapping;
  };
}

interface Mapping {
  symbol: string;
  exchange: string;
  defaultOrderSize: number;
}
