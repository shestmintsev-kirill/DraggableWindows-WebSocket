<template>
    <section>
        <nav class="app-nav">
            <router-link class="link" to="/desk">Desk</router-link>
            <router-link class="link" to="/blockchain">Websocket</router-link>
        </nav>
        <router-view />
    </section>
</template>

<style lang="scss">
@import '@/style/Reset.scss';

.app-nav {
    position: absolute;
    top: 10px;
    left: 50%;
    width: 150px;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: rgb(179, 179, 179);
    box-shadow: 0 0 12px 1px rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    transform: translate(-50%, -50%);
    z-index: 100;

    .link {
        color: black;
        transition: 0.2s;

        &:hover {
            color: #fff;
        }
    }
}
</style>
