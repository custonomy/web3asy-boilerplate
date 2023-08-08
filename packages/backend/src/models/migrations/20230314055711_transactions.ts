import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable('transactions') == false) {
        await knex.schema.createTable("transactions", (table) => {
            table.text("payment_id").primary();
            table.text("payment_status").notNullable();
            table.boolean("nft_minted").defaultTo(false);
            table.text("txn_hash").nullable();
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions')
}