export type OneClickIntent = {
    from: string; // from address
    contractAddress: string; // contract address
    method: string; // method name
    params: any[];   // method params
}