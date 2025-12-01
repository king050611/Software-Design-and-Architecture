// Model layer: data structures and business rules (mock backend)

const AppModel = (() => {
  // ==== In-memory data (模拟后端数据) ====
  const products = [
    {
      id: 1,
      name: "Ethiopia Yirgacheffe",
      origin: "Africa",
      roast: "light",
      price: 18.5,
      rating: 4.8,
      stock: 20,
      notes: "Floral, citrus, jasmine, silky body.",
      featured: true,
    },
    {
      id: 2,
      name: "Colombia Supremo",
      origin: "Latin America",
      roast: "medium",
      price: 16.0,
      rating: 4.5,
      stock: 35,
      notes: "Balanced, caramel, red fruit, milk chocolate.",
      featured: true,
    },
    {
      id: 3,
      name: "Sumatra Mandheling",
      origin: "Asia",
      roast: "dark",
      price: 19.0,
      rating: 4.6,
      stock: 12,
      notes: "Earthy, spicy, syrupy body, low acidity.",
      featured: false,
    },
    {
      id: 4,
      name: "Kenya AA",
      origin: "Africa",
      roast: "medium",
      price: 20.0,
      rating: 4.9,
      stock: 10,
      notes: "Blackcurrant, citrus, wine-like acidity.",
      featured: true,
    },
    {
      id: 5,
      name: "Brazil Santos",
      origin: "Latin America",
      roast: "medium",
      price: 14.5,
      rating: 4.3,
      stock: 40,
      notes: "Nutty, chocolatey, smooth everyday cup.",
      featured: false,
    },
    {
      id: 6,
      name: "Guatemala Antigua",
      origin: "Latin America",
      roast: "medium",
      price: 17.5,
      rating: 4.7,
      stock: 25,
      notes: "Cocoa, brown sugar, orange zest, creamy body.",
      featured: true,
    },
    {
      id: 7,
      name: "Costa Rica Tarrazu",
      origin: "Latin America",
      roast: "light",
      price: 18.0,
      rating: 4.5,
      stock: 22,
      notes: "Bright acidity, honey sweetness, stone fruit.",
      featured: false,
    },
    {
      id: 8,
      name: "Honduras Honey Process",
      origin: "Latin America",
      roast: "medium",
      price: 17.0,
      rating: 4.4,
      stock: 30,
      notes: "Honey process, tropical fruit, caramel finish.",
      featured: false,
    },
    {
      id: 9,
      name: "Papua New Guinea Sigri",
      origin: "Asia",
      roast: "medium",
      price: 19.5,
      rating: 4.6,
      stock: 15,
      notes: "Sweet spice, milk chocolate, gentle floral notes.",
      featured: true,
    },
    {
      id: 10,
      name: "India Monsooned Malabar",
      origin: "Asia",
      roast: "dark",
      price: 17.8,
      rating: 4.2,
      stock: 18,
      notes: "Low acidity, heavy body, earthy and nutty.",
      featured: false,
    },
    {
      id: 11,
      name: "House Espresso Blend",
      origin: "Latin America",
      roast: "dark",
      price: 16.8,
      rating: 4.5,
      stock: 50,
      notes: "Chocolate-forward, dense crema, ideal for espresso.",
      featured: true,
    },
    {
      id: 12,
      name: "Decaf Colombia Sugarcane",
      origin: "Latin America",
      roast: "medium",
      price: 16.2,
      rating: 4.1,
      stock: 28,
      notes: "Natural sugarcane decaf, caramel and nuts, low bitterness.",
      featured: false,
    },
  ];

  const orders = [];
  const cart = [];
  const wishlist = [];

  // 简单本地持久化（localStorage）
  const STORAGE_KEYS = {
    USERS: "coffee_users",
    CURRENT_EMAIL: "coffee_current_email",
  };

  const DEFAULT_ADMIN = {
    email: "admin@coffee.com",
    name: "Admin",
    password: "admin123",
    role: "admin",
  };

  let users = []; // { email, name, password, role }
  let currentUser = null; // { id, name, email, role }

  // ==== Helpers ====
  const findProduct = (id) => products.find((p) => p.id === id);

  const loadUsersFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      users = raw ? JSON.parse(raw) : [];
    } catch {
      users = [];
    }

    // 保证默认管理员存在
    let adminExists = false;
    users = users.map((u) => {
      if (u.email === DEFAULT_ADMIN.email) {
        adminExists = true;
        return { ...DEFAULT_ADMIN, ...u, password: DEFAULT_ADMIN.password };
      }
      return { ...u, password: u.password || "" };
    });
    if (!adminExists) {
      users.push({ ...DEFAULT_ADMIN });
    }
    saveUsersToStorage();

    try {
      const email = localStorage.getItem(STORAGE_KEYS.CURRENT_EMAIL);
      if (!email) return;
      const u = users.find((u) => u.email === email);
      if (u) {
        currentUser = { id: u.role === "admin" ? 0 : 1, ...u };
      }
    } catch {
      currentUser = null;
    }
  };

  const saveUsersToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_EMAIL, currentUser ? currentUser.email : "");
    } catch {
      // ignore
    }
  };

  const getCartItem = (productId) => cart.find((c) => c.productId === productId);

  const calculateCartSummary = () => {
    let count = 0;
    let total = 0;
    cart.forEach((item) => {
      const product = findProduct(item.productId);
      if (!product) return;
      count += item.quantity;
      total += product.price * item.quantity;
    });
    return { count, total };
  };

  const addToCart = (productId) => {
    const product = findProduct(productId);
    if (!product) return;
    const existing = getCartItem(productId);
    if (existing) {
      if (existing.quantity < product.stock) existing.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
  };

  const updateCartQty = (productId, delta) => {
    const item = getCartItem(productId);
    if (!item) return;
    const product = findProduct(productId);
    if (!product) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      const idx = cart.indexOf(item);
      cart.splice(idx, 1);
    } else if (newQty <= product.stock) {
      item.quantity = newQty;
    }
  };

  const clearCart = () => {
    cart.splice(0, cart.length);
  };

  const toggleWishlist = (productId) => {
    const index = wishlist.indexOf(productId);
    if (index >= 0) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }
  };

  const createOrder = ({ name, address, paymentMethod, notes }) => {
    const { count, total } = calculateCartSummary();
    if (count === 0) return null;

    const lineItems = cart.map((item) => {
      const product = findProduct(item.productId);
      return {
        productId: item.productId,
        name: product && product.name,
        quantity: item.quantity,
        price: product && product.price,
      };
    });

    // reduce stock to simulate real-time inventory update
    cart.forEach((item) => {
      const product = findProduct(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });

    const order = {
      id: orders.length + 1,
      createdAt: new Date().toISOString(),
      status: "Pending",
      customer: {
        name,
        address,
        paymentMethod,
        notes,
        userId: currentUser ? currentUser.id : null,
      },
      lineItems,
      total,
    };

    orders.unshift(order);
    clearCart();
    return order;
  };

  const updateOrderStatus = (orderId, status) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) order.status = status;
  };

  const registerUser = ({ name, email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password || !name.trim()) {
      return { success: false, message: "请填写完整的注册信息。" };
    }
    if (users.some((u) => u.email === trimmedEmail)) {
      return { success: false, message: "该邮箱已注册，请直接登录。" };
    }
    const newUser = {
      email: trimmedEmail,
      name: name.trim(),
      password,
      role: "customer",
    };
    users.push(newUser);
    saveUsersToStorage();
    return { success: true, message: "注册成功，请登录。" };
  };

  const loginUser = ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email === trimmedEmail);
    if (!user || user.password !== password) {
      return { success: false, message: "邮箱或密码错误。" };
    }
    currentUser = {
      id: user.role === "admin" ? 0 : 1,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    saveUsersToStorage();
    return { success: true, user: currentUser };
  };

  const logout = () => {
    currentUser = null;
    saveUsersToStorage();
  };

  const getRecommendations = () => {
    const purchasedIds = new Set();
    orders.forEach((o) => {
      if (!currentUser || o.customer.userId !== currentUser.id) return;
      o.lineItems.forEach((li) => purchasedIds.add(li.productId));
    });

    if (purchasedIds.size === 0) {
      return products.filter((p) => p.featured).slice(0, 3);
    }

    const recommended = products
      .filter((p) => !purchasedIds.has(p.id))
      .sort((a, b) => b.rating - a.rating);

    return recommended.slice(0, 3);
  };

  const getAnalytics = () => {
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const itemsSold = orders.reduce(
      (sum, o) => sum + o.lineItems.reduce((s, li) => s + li.quantity, 0),
      0
    );

    return {
      totalOrders,
      revenue,
      itemsSold,
      lowStock: products.filter((p) => p.stock <= 5),
    };
  };

  // 初始化时加载本地存储的用户信息
  if (typeof localStorage !== "undefined") {
    loadUsersFromStorage();
  }

  return {
    // data getters
    getProducts: () => products.slice(),
    getOrders: () => orders.slice(),
    getCart: () => cart.slice(),
    getWishlist: () => wishlist.slice(),
    getCurrentUser: () => currentUser,

    // actions
    addToCart,
    updateCartQty,
    clearCart,
    toggleWishlist,
    calculateCartSummary,
    createOrder,
    updateOrderStatus,
    loginUser,
    registerUser,
    logout,
    getRecommendations,
    getAnalytics,
  };
})();
