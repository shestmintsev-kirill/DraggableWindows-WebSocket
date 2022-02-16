<template>
    <div @mousemove="moveAt">
        <div
            v-for="(item, key) in items"
            :key="item.id"
            class="desk-item"
            @mouseup.self="setSize($event, key)"
            :style="{
                'z-index': item['z-index'],
                left: draggableIndex !== key ? item.left + 'px' : leftPositionByKey(key),
                top: draggableIndex !== key ? item.top + 'px' : topPositionByKey(key),
                width: item.width,
                height: item.height
            }">
            <div class="desk-item__wrapper" @mouseup="stopDrag" @mousedown="startDrag(key, $event)">
                <div class="desk-item__item">
                    <button @click="removeItem(item.id)" class="desk-item__close">-</button>
                    <p class="desk-item__item_title">{{ item.id }}</p>
                </div>
                <hr />
            </div>
        </div>
        <div v-if="showReturnItem" class="return-block" ref="returnWrapper">
            <p class="return-block__text" @click="returnLastRemoveItem()">+ Return last item to trading desk</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import deskItems from '@/utils/initDeskItemsConfig';
import { DeskDataType, DeskItemType } from '@/types/types';

export default defineComponent({
    name: 'Desk',
    data: () =>
        ({
            shiftX: null,
            shiftY: null,
            showReturnItem: false,
            draggableIndex: -1,
            dragLeft: 0,
            dragTop: 0,
            items: deskItems
        } as DeskDataType),

    mounted() {
        this.initDeskData();
    },
    methods: {
        startDrag(key: number, event: MouseEvent) {
            const el = event.target as HTMLElement;
            if (el.localName !== 'div') return;
            this.draggableIndex = key;
            this.setMainItem(key);
            this.shiftX = event.clientX - el.getBoundingClientRect().left + 1;
            this.shiftY = event.clientY - el.getBoundingClientRect().top + 1;

            this.moveAt(event);
        },
        moveAt(event: MouseEvent) {
            if (this.draggableIndex !== -1) {
                this.dragLeft = event.clientX - (this.shiftX || 0);
                this.dragTop = event.clientY - (this.shiftY || 0);
            }
        },
        stopDrag() {
            if (this.draggableIndex !== -1) {
                this.items[this.draggableIndex].left = this.dragLeft;
                this.items[this.draggableIndex].top = this.dragTop;
                this.saveItemsPosition();
                this.shiftX = null;
                this.shiftY = null;
                this.draggableIndex = -1;
                this.dragLeft = 0;
                this.dragTop = 0;
            }
        },
        isDragging(key: number): boolean {
            return this.draggableIndex === key;
        },
        leftPositionByKey(key: number): string {
            return this.isDragging(key) ? this.dragLeft + 'px' : '0';
        },
        topPositionByKey(key: number): string {
            return this.isDragging(key) ? this.dragTop + 'px' : '0';
        },
        setSize(event: MouseEvent, key: number) {
            const el = event.target as HTMLElement;
            this.items[key].width = Number(el.style.width);
            this.items[key].height = Number(el.style.height);
            this.saveItemsPosition();
        },
        setMainItem(key: number) {
            const maxZIndex = Math.max(...this.items.map((i: DeskItemType) => i['z-index']));
            this.items[key]['z-index'] = maxZIndex + 1;
            if (maxZIndex > 90) {
                this.items.forEach((item: DeskItemType) => {
                    item['z-index'] = Math.ceil(item['z-index'] / 5);
                });
            }
        },
        saveItemsPosition() {
            localStorage.items = JSON.stringify(this.items);
        },
        removeItem(id: number) {
            localStorage.removeLastItem = JSON.stringify(this.items.find((i: DeskItemType) => i.id === id));
            this.items = this.items.filter((item: DeskItemType) => item.id !== id);
            this.showReturnItem = true;
            localStorage.showReturn = 'true';
        },
        returnLastRemoveItem() {
            const { top, left } = (this.$refs.returnWrapper as HTMLElement).getBoundingClientRect();

            const returnItem = {
                ...JSON.parse(localStorage.removeLastItem),
                top: top,
                left: left,
                height: '100px',
                width: '300px',
                'z-index': 90
            };

            this.items.push(returnItem);
            this.showReturnItem = false;
            localStorage.removeItem('showReturn');
            localStorage.removeItem('removeLastItem');
        },
        initDeskData() {
            if (localStorage.items) this.items = JSON.parse(localStorage.items);
            if (localStorage.showReturn) this.showReturnItem = true;
        }
    }
});
</script>

<style lang="scss" scoped>
.desk-item {
    position: absolute;
    background: #fff;
    border: 1px solid black;
    height: 100px;
    width: 300px;
    resize: both;
    overflow: scroll;
    user-select: none;
    transition: background 0.2s;
    cursor: pointer;

    &:active {
        background: rgb(229, 246, 255);
        cursor: move;
    }

    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        opacity: 0;
    }

    &__wrapper {
        height: 100%;
    }

    &__item {
        display: flex;
        justify-content: center;
        height: 30px;

        &_title {
            margin-top: 5px;
        }
    }

    &__close {
        position: absolute;
        left: 5px;
        top: 10px;
        width: 20px;
        height: 20px;
    }
}

.return-block {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    width: 300px;
    height: 100px;
    background: #fff;
    z-index: 99;

    &__text {
        text-decoration: underline;
        cursor: pointer;
    }
}
</style>
