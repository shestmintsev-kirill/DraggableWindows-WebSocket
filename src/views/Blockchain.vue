<template>
    <section class="transactions-list">
        <div class="transactions-list__btns">
            <button class="btn" @click="sendws()" style="background: green">Запуск</button>
            <button class="btn" @click="stopws()" style="background: red">Остановка</button>
            <button class="btn" @click="clearTransactionsList()" style="background: orange">Сброс</button>
        </div>
        <div class="transactions-list__sum">
            <p class="sum-item">Сумма: {{ fixedSumValue }} BTC</p>
        </div>
        <BlockchainTable :transactions="transactions" />
    </section>
</template>

<script>
import BlockchainTable from '@/components/BlockchainTable.vue';
import { connectWS, socket, closeWS, subscribeToTransactionsOnWs, unsubscribeFromTransactionsOnWs } from '../api';

export default {
    name: 'Blockchain',
    components: {
        BlockchainTable
    },
    data: () => ({
        transactions: [],
        sumValue: 0
    }),
    computed: {
        fixedSumValue() {
            return this.transactions.length ? this.sumValue.toFixed(4) : 0;
        }
    },
    created() {
        connectWS();
        socket?.addEventListener('message', this.setTransactionsHandler);
    },
    beforeUnmount() {
        closeWS();
        socket?.removeEventListener('message', this.setTransactionsHandler);
    },
    methods: {
        sendws() {
            subscribeToTransactionsOnWs();
        },
        stopws() {
            unsubscribeFromTransactionsOnWs();
        },
        clearTransactionsList() {
            this.transactions = [];
            this.sumValue = 0;
        },
        setTransactionsHandler(event) {
            const { inputs, out, size } = JSON.parse(event.data).x;
            if (inputs) {
                const transaction = {
                    fromAddr: inputs.map(i => i.prev_out.addr),
                    toAddr: out.map(i => i.addr),
                    value: size / 10000
                };
                this.sumValue += size / 10000;
                this.transactions.push(transaction);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.transactions-list {
    padding: 70px;

    &__btns {
        display: flex;
        justify-content: space-evenly;

        .btn {
            border: none;
            padding: 10px;
            min-width: 100px;
            color: #fff;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;

            &:hover {
                box-shadow: 0 0 12px 1px rgba(0, 0, 0, 0.3);
            }
        }
    }

    &__sum {
        padding: 20px 0 20px 0;

        .sum-item {
            text-align: center;
            font-weight: bold;
            font-size: 24px;
        }
    }
}
</style>