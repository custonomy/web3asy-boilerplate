import { ethers } from "ethers";
// import Web3 from "web3";

export class SelectedProvider {
  public _selectedProvider: any = null;

  constructor() {
    // this._selectedProvider = new Web3(window.ethereum);
    if (window.ethereum) this._selectedProvider = new ethers.providers.Web3Provider(window.ethereum);
    // else this._selectedProvider = ethers.getDefaultProvider('goerli');
  }

  public get selectedProvider() {
    return this._selectedProvider;
  }

  public set selectedProvider(provider: any) {
    // this._selectedProvider = new Web3(provider);
    this._selectedProvider = new ethers.providers.Web3Provider(provider);
  }
}
