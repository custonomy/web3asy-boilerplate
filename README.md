# Custonomy DApp Boilerplate

This example dApp demonstrates how you may use Custonomy Web3asy Solutions to work together with Custonomy's API to execute an NFT mint.

### Features

✅ Custonomy Widget Integration
<br />
✅ Custonomy Mint API
<br />
✅ Mint NFT using Crypto
<br />
✅ Mint NFT using Custonomy One Click Checkout Solutions
<br />
✅ View NFT Collection
<br />
✅ Transfer NFT
<br />

### Setup

Clone the repository and install the dependencies.

```
yarn install
```

Once installed, enter your secrets to the `.env` files, one for the frontend, at path `packages/react-app` and one for the backend, at path `packages/backend`.

To run the app, start both the frontend and the backend.

```
yarn react-app:start
```

```
yarn backend:dev
```

### DB Schema Migration

To setup a PostgreSQL DB. Please find the necessary DB model and Knex migration files in `packages/backend/models`

Please check out [this guide](https://www.heady.io/blog/knex-migration-for-schema-and-seeds-with-postgresql) on Knex migration.
