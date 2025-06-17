"use client";
import {
  CartControllerService,
  CartDetailsResponse,
  CartItemDetails,
  CurrentUserDetails,
} from "@/gen";
import { logger } from "@/util/logger";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./use-auth";

type CartContextType = {
  cart: CartDetailsResponse;
  totalItems: number;
  fetchCart: () => void;
  addToCart: (item: CartItemDetails) => void;
  removeFromCart: (item: CartItemDetails) => void;
  updateItemQuantity: (updatedItem: CartItemDetails) => void;
  handleCheckItem: (item: CartItemDetails) => void;
  handleUncheckItem: (item: CartItemDetails) => void;
  selectedItems: CartItemDetails[];
  deliveryDetails: DeliverDetailsType;
  setDeliveryDetails: (info: DeliverDetailsType) => void;
  isEmptyCart: boolean;
  subtotal: number;
  shippingPrice: number;
  totalPrice: number;
};
const CartContext = createContext<CartContextType | null>(null);

// TODO
export type DeliverDetailsType = CurrentUserDetails;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartDetailsResponse>({});
  const { isAuthenticated } = useAuth();
  const [selectedProductId, setSelectedProductId] = useState<number[]>([]);

  const [deliveryDetails, setDeliveryDetails] = useState<DeliverDetailsType>(
    {},
  );

  const selectedItems = useMemo(() => {
    const updatedSelectedItems = cart.items?.filter((item) => {
      return (
        item.productId !== undefined &&
        selectedProductId.includes(item.productId)
      );
    });
    return updatedSelectedItems || [];
  }, [selectedProductId, cart]);
  function handleUncheckItem(item: CartItemDetails): void {
    setSelectedProductId((previous) =>
      previous.filter((i) => i !== item.productId),
    );
  }

  function handleCheckItem(item: CartItemDetails): void {
    setSelectedProductId((previous) => [...previous, Number(item.productId)]);
  }

  /**
   * Fetch user cart information for server
   * Require to run after user login
   */
  const fetchCart = async () => {
    try {
      const resp = await CartControllerService.getAllItems();
      setCart(resp);
    } catch (e) {
      setCart({});
      logger.error(e);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  /**
   * Not include discount and shipping fee
   */
  const subtotal = useMemo(() => {
    let sum = 0;
    selectedItems.forEach((item) => {
      sum += Number(item.price) * Number(item.quantity);
    });
    return sum;
  }, [selectedItems]);

  const shippingPrice = 0;
  const totalPrice = useMemo(
    () => subtotal + shippingPrice,
    [subtotal, shippingPrice],
  );

  const addToCart = (item: CartItemDetails) => {
    try {
      // If update item value in server success => Update in context without refresh
      CartControllerService.addItem({
        quantity: item.quantity,
        productId: item.productId,
      });
      const defaultQuanitty = 1;

      setCart((previous) => {
        const existsItemIndex = (previous.items || []).findIndex(
          (i) => i.productId === item.productId,
        );
        // Update previous item if exist in cart
        if (existsItemIndex >= 0) {
          return {
            // Add new item in cart
            ...previous,
            items: previous.items?.map((i) => {
              // Update prevous product by increase the quantity
              if (i.productId === item.productId) {
                return {
                  ...i,
                  quantity: (i.quantity || 0) + (item.quantity || 1),
                };
              } else {
                return i;
              }
            }),
          };
        }
        return {
          // Add new item in cart
          ...previous,
          items: [
            ...(previous.items || []),
            { ...item, quantity: item.quantity || defaultQuanitty },
          ],
        };
      });
    } catch (e) {
      logger.error(e);
      fetchCart();
    }
  };

  const removeFromCart = (item: CartItemDetails) => {
    if (!item.productId) {
      logger.warn("Unable to remove item from cart without product id");
      return;
    }
    try {
      CartControllerService.removeItem(item.productId);
      setCart((previous) => {
        return {
          ...previous,
          items: previous.items?.filter((i) => i.productId !== item.productId),
        };
      });
    } catch (e) {
      logger.error(e);
      fetchCart();
    }
  };

  const updateItemQuantity = (updatedItem: CartItemDetails) => {
    if (Number(updatedItem.quantity) < 1) {
      removeFromCart(updatedItem);
      return;
    }

    try {
      CartControllerService.updateItem({
        quantity: updatedItem.quantity,
        productId: updatedItem.productId,
      });

      setCart((previous) => {
        return {
          ...previous,
          items: previous.items?.map((oldItem) => {
            return oldItem.productId === updatedItem.productId
              ? updatedItem
              : oldItem;
          }),
        };
      });
    } catch (e) {
      logger.error(e);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems: cart.items?.length || 0,
        fetchCart,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        handleCheckItem,
        handleUncheckItem,
        selectedItems,
        deliveryDetails,
        setDeliveryDetails,
        isEmptyCart: cart.items?.length == 0,
        subtotal,
        shippingPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
