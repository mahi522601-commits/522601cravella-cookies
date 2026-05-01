import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const defaultSiteSettings = {
  whatsappNumber: "91986697748",
  upiId: "8096697748-3@ybl",
  upiName: "Cravella Cookies",
  freeShippingMessage: "Free shipping across India on every Cravella order.",
  chatbotEnabled: true,
  maintenanceMode: false,
};

const withErrorBoundary = async (callback, fallbackMessage) => {
  try {
    return await callback();
  } catch (error) {
    throw new Error(error?.message || fallbackMessage);
  }
};

const productsCollection = collection(db, "products");
const ordersCollection = collection(db, "orders");
const heroCollection = collection(db, "heroImages");
const reviewsCollection = collection(db, "reviews");
const inquiriesCollection = collection(db, "inquiries");

export const getSiteSettings = async () =>
  withErrorBoundary(async () => {
    const settingsRef = doc(db, "settings", "siteSettings");
    const snapshot = await getDoc(settingsRef);
    return snapshot.exists()
      ? { ...defaultSiteSettings, ...snapshot.data() }
      : defaultSiteSettings;
  }, "Unable to load site settings.");

export const listenToSiteSettings = (callback) => {
  const settingsRef = doc(db, "settings", "siteSettings");

  return onSnapshot(settingsRef, (snapshot) => {
    callback(
      snapshot.exists()
        ? { ...defaultSiteSettings, ...snapshot.data() }
        : defaultSiteSettings,
    );
  });
};

export const saveSiteSettings = async (payload) =>
  withErrorBoundary(async () => {
    const settingsRef = doc(db, "settings", "siteSettings");

    await setDoc(
      settingsRef,
      {
        ...payload,
        maintenanceMode: Boolean(payload.maintenanceMode),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return true;
  }, "Unable to save settings.");

export const fetchProducts = async () =>
  withErrorBoundary(async () => {
    const snapshot = await getDocs(query(productsCollection, orderBy("createdAt", "desc")));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }, "Unable to load products.");

export const fetchProductsPage = async ({ pageSize = 12, lastDoc = null } = {}) =>
  withErrorBoundary(async () => {
    const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const snapshot = await getDocs(query(productsCollection, ...constraints));
    return {
      items: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
      lastDoc: snapshot.docs.at(-1) || null,
      hasMore: snapshot.docs.length === pageSize,
    };
  }, "Unable to load products.");

export const fetchFeaturedProducts = async (pageSize = 8) =>
  withErrorBoundary(async () => {
    const snapshot = await getDocs(
      query(productsCollection, orderBy("createdAt", "desc"), limit(pageSize * 2)),
    );

    const featured = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .filter((item) => item.isActive !== false)
      .sort((left, right) => {
        const leftScore = left.badge ? 1 : 0;
        const rightScore = right.badge ? 1 : 0;
        return rightScore - leftScore;
      })
      .slice(0, pageSize);

    return featured;
  }, "Unable to load featured products.");

export const getProductById = async (id) =>
  withErrorBoundary(async () => {
    const snapshot = await getDoc(doc(db, "products", id));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }, "Unable to load product details.");

export const saveProduct = async (payload, existingId = null) =>
  withErrorBoundary(async () => {
    const ref = existingId ? doc(db, "products", existingId) : doc(productsCollection);
    const current = existingId ? await getDoc(ref) : null;

    await setDoc(
      ref,
      {
        ...payload,
        id: ref.id,
        createdAt: current?.exists() ? current.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return ref.id;
  }, "Unable to save product.");

export const deleteProduct = async (id) =>
  withErrorBoundary(async () => {
    await deleteDoc(doc(db, "products", id));
    return true;
  }, "Unable to delete product.");

export const listenToProducts = (callback) =>
  onSnapshot(query(productsCollection, orderBy("createdAt", "desc")), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });

export const fetchHeroSlides = async () =>
  withErrorBoundary(async () => {
    const snapshot = await getDocs(query(heroCollection, orderBy("order", "asc")));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }, "Unable to load hero slides.");

export const listenToHeroSlides = (callback) =>
  onSnapshot(query(heroCollection, orderBy("order", "asc")), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });

export const saveHeroSlide = async (payload, existingId = null) =>
  withErrorBoundary(async () => {
    const ref = existingId ? doc(db, "heroImages", existingId) : doc(heroCollection);
    const current = existingId ? await getDoc(ref) : null;

    await setDoc(
      ref,
      {
        ...payload,
        id: ref.id,
        createdAt: current?.exists() ? current.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return ref.id;
  }, "Unable to save hero slide.");

export const deleteHeroSlide = async (id) =>
  withErrorBoundary(async () => {
    await deleteDoc(doc(db, "heroImages", id));
    return true;
  }, "Unable to delete hero slide.");

export const createOrder = async (payload) =>
  withErrorBoundary(async () => {
    const orderRef = doc(db, "orders", payload.id);
    await setDoc(orderRef, {
      ...payload,
      placedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return payload.id;
  }, "Unable to place order.");

export const getOrderById = async (id) =>
  withErrorBoundary(async () => {
    const snapshot = await getDoc(doc(db, "orders", id));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }, "Unable to load order.");

export const updateOrder = async (id, payload) =>
  withErrorBoundary(async () => {
    await updateDoc(doc(db, "orders", id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
    return true;
  }, "Unable to update order.");

export const deleteOrder = async (id) =>
  withErrorBoundary(async () => {
    await deleteDoc(doc(db, "orders", id));
    return true;
  }, "Unable to delete order.");

export const listenToOrders = (callback) =>
  onSnapshot(query(ordersCollection, orderBy("placedAt", "desc")), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });

export const fetchApprovedReviews = async () =>
  withErrorBoundary(async () => {
    const snapshot = await getDocs(
      query(reviewsCollection, where("isApproved", "==", true), orderBy("createdAt", "desc")),
    );
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  }, "Unable to load reviews.");

export const createInquiry = async (payload) =>
  withErrorBoundary(async () => {
    await addDoc(inquiriesCollection, {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return true;
  }, "Unable to send inquiry.");

export const fetchDashboardOverview = async () =>
  withErrorBoundary(async () => {
    const [ordersSnapshot, productsSnapshot] = await Promise.all([
      getDocs(query(ordersCollection, orderBy("placedAt", "desc"))),
      getDocs(query(productsCollection, orderBy("createdAt", "desc"))),
    ]);

    const orders = ordersSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    const products = productsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "verified")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const pendingOrders = orders.filter((order) => order.orderStatus !== "delivered").length;
    const recentOrders = orders.slice(0, 5);

    const lastSevenDays = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      });
      const dayOrders = orders.filter((order) => {
        const orderDate = order.placedAt?.toDate?.();
        if (!orderDate) return false;
        return (
          orderDate.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) ===
          date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })
        );
      });
      return {
        name: key,
        orders: dayOrders.length,
        revenue: dayOrders
          .filter((order) => order.paymentStatus === "verified")
          .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
      };
    });

    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      totalProducts: products.length,
      recentOrders,
      charts: lastSevenDays,
    };
  }, "Unable to load dashboard data.");

export const formatTimestampIST = (timestamp) => {
  if (!timestamp?.toDate) {
    return "Just now";
  }

  return timestamp.toDate().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
