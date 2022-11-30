# Custonomy DApp Boilerplate

This DApp boilerplate demonstrates how to integrate **Custonomy Widget** and [Custonomy Wallet Provider](https://www.npmjs.com/package/@custonomy/custonomy-wallet-provider) into a NFT marketplace. 

## Docs

See our docs [here](https://custonomy.gitbook.io/custonomy-widget)

## Installation

Clone the repo and install dependencies:

```
git clone https://github.com/custonomy-dapp-boilerplate/custonomy-dapp-boilerplate.git your-project-name
cd your-project-name
yarn install
```

## Development

Setup the environment variables by copying the .env.example to .env in backend/ and react-app/ respectively, and providing the values for the variables.

To start the backend:
```
yarn backend:start
```


To start the frontend:
```
yarn react-app:start
```

## Note
As our widget and provider rely on external or local authentication, you will need to setup your own database for local authentication or your own Google/ Facebook OAuth configuration if you want to test the end-to-end flow of this boilerplate.



