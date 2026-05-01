import { useEffect, useState } from "react";
import { getOrderById, listenToOrders } from "@/services/firestore";

export const useRealtimeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = listenToOrders((nextOrders) => {
      if (!active) return;
      setOrders(nextOrders);
      setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { orders, loading, error };
};

export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      return undefined;
    }

    let mounted = true;

    const loadOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getOrderById(orderId);
        if (mounted) {
          setOrder(response);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load order.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  return { order, loading, error };
};
