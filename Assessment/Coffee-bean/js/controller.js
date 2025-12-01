// Controller layer: connects Model and View, handles events

document.addEventListener("DOMContentLoaded", () => {
  const M = AppModel;
  const V = AppView;

  // ====== Initial State & Rendering ======
  const state = {
    filter: {
      search: "",
      roast: "all",
      origin: "all",
      sort: "featured",
    },
    currentAdminTab: "products",
  };

  const applyFilters = () => {
    const products = M.getProducts();
    let result = products.slice();

    // search
    if (state.filter.search.trim()) {
      const q = state.filter.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.notes.toLowerCase().includes(q)
      );
    }

    // roast
    if (state.filter.roast !== "all") {
      result = result.filter((p) => p.roast === state.filter.roast);
    }

    // origin
    if (state.filter.origin !== "all") {
      result = result.filter((p) => p.origin === state.filter.origin);
    }

    // sort
    if (state.filter.sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (state.filter.sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (state.filter.sort === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // featured first
      result.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
    }

    return result;
  };

  const refreshShop = () => {
    const filtered = applyFilters();
    V.renderProducts(filtered, M.getWishlist());
  };

  const refreshCart = () => {
    V.renderCart(M.getCart(), M.getProducts(), M.calculateCartSummary());
  };

  const refreshOrders = () => {
    V.renderOrders(M.getOrders());
  };

  const refreshAccount = () => {
    const user = M.getCurrentUser();
    V.renderAccount(user);
    V.setUserLabel(user);
  };

  const refreshWishlist = () => {
    V.renderWishlist(M.getWishlist(), M.getProducts());
  };

  const refreshRecommendations = () => {
    V.renderRecommendations(M.getRecommendations());
  };

  const refreshAdmin = () => {
    const products = M.getProducts();
    const analytics = M.getAnalytics();
    const tab = state.currentAdminTab;

    if (tab === "products") {
      V.renderAdminProducts(products);
    } else if (tab === "inventory") {
      V.renderAdminInventory(analytics);
    } else if (tab === "analytics") {
      V.renderAdminAnalytics(analytics);
    } else if (tab === "orders") {
      V.renderAdminOrders(M.getOrders());
    }
  };

  const refreshAll = () => {
    refreshShop();
    refreshCart();
    refreshOrders();
    refreshAccount();
    refreshWishlist();
    refreshRecommendations();
    refreshAdmin();
  };

  refreshAll();

  // 默认视图
  V.setActiveView("view-shop");
  V.setActiveNav("shop");

  // ====== Event bindings ======

  // 顶部导航
  V.els.navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      V.setActiveNav(view);
      if (view === "shop") {
        V.setActiveView("view-shop");
      } else if (view === "orders") {
        V.setActiveView("view-orders");
      } else if (view === "account") {
        V.setActiveView("view-account");
      } else if (view === "admin") {
        const user = M.getCurrentUser();
        if (!user || user.role !== "admin") {
          alert("只有管理员可以进入后台，请使用 admin@coffee.com 登录账户页面。");
          V.setActiveNav("account");
          V.setActiveView("view-account");
          return;
        }
        V.setActiveView("view-admin");
      }
    });
  });

  // 搜索 & 排序 & 筛选
  V.els.searchInput.addEventListener("input", (e) => {
    state.filter.search = e.target.value;
    refreshShop();
  });

  V.els.sortSelect.addEventListener("change", (e) => {
    state.filter.sort = e.target.value;
    refreshShop();
  });

  V.els.filterRoast.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const value = btn.dataset.roast;
    state.filter.roast = value;
    V.els.filterRoast.querySelectorAll(".chip").forEach((c) => c.classList.remove("chip-active"));
    btn.classList.add("chip-active");
    refreshShop();
  });

  V.els.filterOrigin.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const value = btn.dataset.origin;
    state.filter.origin = value;
    V.els.filterOrigin
      .querySelectorAll(".chip")
      .forEach((c) => c.classList.remove("chip-active"));
    btn.classList.add("chip-active");
    refreshShop();
  });

  // 商品网格：添加购物车 / 心愿单
  V.els.productGrid.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".js-add-cart");
    if (addBtn) {
      const id = parseInt(addBtn.dataset.id, 10);
      M.addToCart(id);
      refreshCart();
      return;
    }
    const wishBtn = e.target.closest(".js-wishlist");
    if (wishBtn) {
      const id = parseInt(wishBtn.dataset.id, 10);
      M.toggleWishlist(id);
      refreshShop();
      refreshWishlist();
    }
  });

  // 推荐列表：点击跳转到商品并高亮（这里简单滚动到顶部）
  V.els.recommendationList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = parseInt(li.dataset.id || "0", 10);
    if (!id) return;
    // 当前只是刷新商品列表，真实系统可滚动到该卡片
    state.filter.search = "";
    V.els.searchInput.value = "";
    refreshShop();
  });

  // 购物车抽屉
  V.els.cartIndicator.addEventListener("click", () => {
    V.setCartOpen(true);
  });

  V.els.closeCart.addEventListener("click", () => {
    V.setCartOpen(false);
  });

  V.els.cartItems.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-qty");
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    const delta = parseInt(btn.dataset.delta, 10);
    M.updateCartQty(id, delta);
    refreshCart();
  });

  // 结算弹窗
  V.els.checkoutBtn.addEventListener("click", () => {
    const summary = M.calculateCartSummary();
    if (summary.count === 0) {
      alert("Cart is empty.");
      return;
    }
    V.setCheckoutOpen(true);
  });

  V.els.closeCheckout.addEventListener("click", () => {
    V.setCheckoutOpen(false);
  });

  V.els.checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("checkout-name").value.trim();
    const address = document.getElementById("checkout-address").value.trim();
    const paymentMethod = document.getElementById("checkout-method").value;
    const notes = document.getElementById("checkout-notes").value.trim();

    const order = M.createOrder({ name, address, paymentMethod, notes });
    if (!order) {
      alert("Unable to create order. Please check your cart.");
      return;
    }

    V.setCheckoutOpen(false);
    V.setCartOpen(false);
    refreshCart();
    refreshOrders();
    refreshAdmin();
    refreshRecommendations();

    alert("Order placed successfully! (Mock payment gateway)");
  });

  // 账户：登录 / 登出
  V.els.accountPanel.addEventListener("submit", (e) => {
    if (e.target.id === "login-form") {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      if (!email || !password) {
        alert("请输入邮箱和密码。");
        return;
      }
      const res = M.loginUser({ email, password });
      if (!res.success) {
        alert(res.message);
        return;
      }
      refreshAccount();
      refreshRecommendations();
      V.setActiveNav("account");
      V.setActiveView("view-account");
    } else if (e.target.id === "register-form") {
      e.preventDefault();
      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;
      const confirm = document.getElementById("register-confirm").value;
      if (!name || !email || !password || !confirm) {
        alert("请完整填写注册信息。");
        return;
      }
      if (password !== confirm) {
        alert("两次密码不一致。");
        return;
      }
      const res = M.registerUser({ name, email, password });
      alert(res.message);
      if (res.success) {
        // 自动填充登录表单
        document.getElementById("login-email").value = email;
        document.getElementById("login-password").value = password;
      }
    }
  });

  V.els.accountPanel.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {
      M.logout();
      refreshAccount();
      refreshRecommendations();
    }
  });

  // 管理员 Dashboard 标签
  V.els.adminTabs.addEventListener("click", (e) => {
    const tabBtn = e.target.closest(".tab");
    if (!tabBtn) return;
    const tab = tabBtn.dataset.adminTab;
    state.currentAdminTab = tab;
    V.els.adminTabs
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.toggle("tab-active", t.dataset.adminTab === tab));
    refreshAdmin();
  });

  // 管理员：修改订单状态
  V.els.adminContent.addEventListener("change", (e) => {
    const sel = e.target.closest(".js-admin-status");
    if (!sel) return;
    const id = parseInt(sel.dataset.id, 10);
    const status = sel.value;
    M.updateOrderStatus(id, status);
    refreshOrders();
    refreshAdmin();
  });
});
