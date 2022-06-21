<template>
    <section>
        <div class="transaction-wrapper">
            <div class="transaction">
                <p>From</p>
            </div>
            <div class="transaction border">
                <p>To</p>
            </div>
            <div class="transaction">
                <p>Value</p>
            </div>
        </div>
        <div v-for="(transaction, index) in transactions" :key="index" class="transaction-wrapper">
            <div class="transaction">
                <p class="transaction-hash" v-for="(addrFrom, index) in transaction.fromAddr" :key="index">
                    {{ addrFrom }}
                </p>
            </div>
            <div class="transaction border">
                <p class="transaction-hash" v-for="(addrTo, index) in transaction.toAddr" :key="index">
                    {{ addrTo }}
                </p>
            </div>
            <div class="transaction">
                <p>{{ transaction.value }} BTC</p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'BlockchainTable',
    props: {
        transactions: {
            type: Array,
            required: true,
            default: () => [],
            validator: transactions => {
                if (!transactions.length) return true;
                return transactions.includes((t) => typeof t === 'object');
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.transaction-wrapper {
    display: flex;
    justify-content: space-around;
    border: 1px solid black;
    min-height: 50px;

    & + & {
        border-top: none;
    }

    .transaction {
        width: calc(100% / 3);
        padding: 10px 0 10px 0;
        text-align: center;
        word-wrap: break-word;

        &-hash {
            text-decoration: underline;
            font-size: 14px;
        }

        p + p {
            margin-top: 15px;
        }
    }

    .border {
        border-left: 1px solid black;
        border-right: 1px solid black;
    }
}
</style>