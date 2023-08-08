import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("transactions", (table) => {
        table.dropPrimary();                    
    });

    await knex.schema.alterTable("transactions", (table) => {        
        table.text("payment_id").nullable().alter();

        table.increments("id").notNullable().primary();            
        table.jsonb('txndetails');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('transactions', (table) => {
        table.dropPrimary();        
        table.dropColumn("id");
        table.dropColumn('txndetails');
        table.text("payment_id").notNullable().primary().alter();        
    })
}