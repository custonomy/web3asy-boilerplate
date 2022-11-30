import { ethers } from "ethers";
export class SelectedProvider {
  public _selectedProvider: any = null;

  constructor() {
    if (window.ethereum) this._selectedProvider = new ethers.providers.Web3Provider(window.ethereum);
  }

  public get selectedProvider() {
    return this._selectedProvider;
  }

  public set selectedProvider(provider) {
    this._selectedProvider = new ethers.providers.Web3Provider(provider);
  }
}
