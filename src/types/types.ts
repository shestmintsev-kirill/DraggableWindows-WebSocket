export type transactionType = {
  fromAddr: string[];
  toAddr: string[];
  value: number;
};

export type dataType = {
  transactions: transactionType[];
  sumValue: number;
};

export type DeskDataType = {
  shiftX: null | number;
  shiftY: null | number;
  showReturnItem: boolean;
  draggableIndex: number;
  dragLeft: number;
  dragTop: number;
  items: DeskItemType[];
};

export type DeskItemType = {
  id: number;
  left: number;
  top: number;
  'z-index': number;
  width: number;
  height: number;
};