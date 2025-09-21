export interface OrderItem {
  order_item_id: number;
  product_id: number;
  quantity: number;
}

export interface Order {
  order_id: number;
  items: OrderItem[];
}

// Đây là mock đúng từ dữ liệu bảng bạn chụp
export const mockDetailOrderItems: Order[] = [
  {
    order_id: 1,
    items: [{ order_item_id: 1, product_id: 1, quantity: 1 }],
  },
  {
    order_id: 2,
    items: [{ order_item_id: 2, product_id: 2, quantity: 2 }],
  },
  {
    order_id: 3,
    items: [
      { order_item_id: 3, product_id: 3, quantity: 3 },
      { order_item_id: 11, product_id: 11, quantity: 2 },
    ],
  },
  {
    order_id: 4,
    items: [{ order_item_id: 4, product_id: 4, quantity: 1 }],
  },
  {
    order_id: 5,
    items: [
      { order_item_id: 5, product_id: 5, quantity: 2 },
      { order_item_id: 12, product_id: 12, quantity: 1 },
    ],
  },
  {
    order_id: 6,
    items: [{ order_item_id: 6, product_id: 6, quantity: 4 }],
  },
  {
    order_id: 7,
    items: [{ order_item_id: 7, product_id: 7, quantity: 1 }],
  },
  {
    order_id: 8,
    items: [{ order_item_id: 8, product_id: 8, quantity: 2 }],
  },
  {
    order_id: 9,
    items: [{ order_item_id: 9, product_id: 9, quantity: 3 }],
  },
  {
    order_id: 10,
    items: [{ order_item_id: 10, product_id: 10, quantity: 1 }],
  },
];
