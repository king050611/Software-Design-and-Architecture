// View layer: DOM rendering only (no business logic)

const AppView = (() => {
  const els = {
    views: document.querySelectorAll(".view"),
    navButtons: document.querySelectorAll(".nav-btn"),
    productGrid: document.getElementById("product-grid"),
    cartIndicator: document.getElementById("cart-indicator"),
    cartCount: document.getElementById("cart-count"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartItems: document.getElementById("cart-items"),
    cartSummaryCount: document.getElementById("cart-summary-count"),
    cartSummaryTotal: document.getElementById("cart-summary-total"),
    closeCart: document.getElementById("close-cart"),
    checkoutBtn: document.getElementById("checkout-btn"),
    checkoutModal: document.getElementById("checkout-modal"),
    closeCheckout: document.getElementById("close-checkout"),
    checkoutForm: document.getElementById("checkout-form"),
    ordersContainer: document.getElementById("orders-container"),
    accountPanel: document.getElementById("account-panel"),
    wishlistList: document.getElementById("wishlist-list"),
    adminTabs: document.getElementById("admin-tabs"),
    adminContent: document.getElementById("admin-content"),
    searchInput: document.getElementById("search-input"),
    sortSelect: document.getElementById("sort-select"),
    filterRoast: document.getElementById("filter-roast"),
    filterOrigin: document.getElementById("filter-origin"),
    recommendationList: document.getElementById("recommendation-list"),
    userLabel: document.getElementById("user-label"),
    userIndicator: document.getElementById("user-indicator"),
  };

  const formatPrice = (value) => "$" + value.toFixed(2);

  const clearElement = (el) => {
    while (el.firstChild) el.removeChild(el.firstChild);
  };

  const setActiveView = (viewId) => {
    els.views.forEach((v) => {
      v.classList.toggle("active", v.id === viewId);
    });
  };

  const setActiveNav = (viewName) => {
    els.navButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });
  };

  const renderProducts = (products, wishlistIds) => {
    clearElement(els.productGrid);
    products.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-header">
          <div>
            <div class="card-title">${p.name}</div>
            <div class="pill badge-soft">${p.origin} · ${p.roast.toUpperCase()} ROAST</div>
          </div>
          <button class="icon-btn js-wishlist" data-id="${p.id}" title="Toggle wishlist">
            ${wishlistIds.indexOf(p.id) >= 0 ? "★" : "☆"}
          </button>
        </div>
        <div class="card-body">
          <p>${p.notes}</p>
        </div>
        <div class="card-meta">
          <span class="rating">★ ${p.rating.toFixed(1)}</span>
          <span class="price">${formatPrice(p.price)}</span>
        </div>
        <div class="card-footer">
          <span class="pill">Stock: ${p.stock}</span>
          <button class="primary-btn js-add-cart" data-id="${p.id}" ${p.stock === 0 ? "disabled" : ""}>
            🛒 Add to Cart
          </button>
        </div>
      `;
      els.productGrid.appendChild(card);
    });
  };

  const renderCart = (cartItems, products, summary) => {
    els.cartCount.textContent = summary.count;
    els.cartSummaryCount.textContent = summary.count;
    els.cartSummaryTotal.textContent = formatPrice(summary.total);

    clearElement(els.cartItems);
    if (summary.count === 0) {
      const empty = document.createElement("p");
      empty.className = "hint";
      empty.textContent = "Your cart is empty. Add some beans to get started.";
      els.cartItems.appendChild(empty);
      return;
    }

    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <div class="cart-item-title">${product.name}</div>
          <div class="cart-item-meta">
            ${formatPrice(product.price)} · Qty: ${item.quantity} · Subtotal: ${formatPrice(
        product.price * item.quantity
      )}
          </div>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn js-qty" data-id="${product.id}" data-delta="-1">-</button>
          <button class="qty-btn js-qty" data-id="${product.id}" data-delta="1">+</button>
        </div>
      `;
      els.cartItems.appendChild(row);
    });
  };

  const setCartOpen = (isOpen) => {
    els.cartDrawer.classList.toggle("open", isOpen);
  };

  const setCheckoutOpen = (isOpen) => {
    els.checkoutModal.classList.toggle("open", isOpen);
  };

  const renderOrders = (orders) => {
    clearElement(els.ordersContainer);
    if (orders.length === 0) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "You have no orders yet. Place an order to see it here.";
      els.ordersContainer.appendChild(p);
      return;
    }

    orders.forEach((o) => {
      const card = document.createElement("article");
      card.className = "card";
      const date = new Date(o.createdAt).toLocaleString();
      card.innerHTML = `
        <div class="card-header">
          <div>
            <div class="card-title">Order #${o.id}</div>
            <div class="pill">${date}</div>
          </div>
          <span class="badge-status status-${o.status.toLowerCase()}">${o.status}</span>
        </div>
        <div class="card-body">
          <ul class="hint">
            ${o.lineItems
              .map(
                (li) =>
                  `<li>${li.quantity} × ${li.name} @ ${formatPrice(li.price)} = ${formatPrice(
                    li.price * li.quantity
                  )}</li>`
              )
              .join("")}
          </ul>
        </div>
        <div class="card-meta">
          <span>Total: <strong>${formatPrice(o.total)}</strong></span>
          <span>${o.customer.name}</span>
        </div>
      `;
      els.ordersContainer.appendChild(card);
    });
  };

  const renderAccount = (user) => {
    clearElement(els.accountPanel);
    const container = document.createElement("div");

    if (!user) {
      container.className = "account-card";
      container.innerHTML = `
        <div class="account-row">
          <div>
            <div class="account-label">You are browsing as guest</div>
            <div class="hint">登录后即可保存订单、心愿单。管理员账号：admin@coffee.com / admin123。</div>
          </div>
        </div>
        <div class="form-wrapper">
          <div class="sub-card">
            <h3>Login</h3>
            <form id="login-form" class="form" autocomplete="off">
              <div class="form-group">
                <label for="login-email">Email</label>
                <input id="login-email" type="email" required placeholder="you@example.com" />
              </div>
              <div class="form-group">
                <label for="login-password">Password</label>
                <input id="login-password" type="password" required placeholder="Your password" />
              </div>
              <button type="submit" class="primary-btn full-width">Login</button>
            </form>
          </div>
          <div class="sub-card">
            <h3>Register</h3>
            <form id="register-form" class="form" autocomplete="off">
              <div class="form-group">
                <label for="register-name">Full Name</label>
                <input id="register-name" required placeholder="Your name" />
              </div>
              <div class="form-group">
                <label for="register-email">Email</label>
                <input id="register-email" type="email" required placeholder="you@example.com" />
              </div>
              <div class="form-group">
                <label for="register-password">Password</label>
                <input id="register-password" type="password" required placeholder="Set a password" />
              </div>
              <div class="form-group">
                <label for="register-confirm">Confirm Password</label>
                <input id="register-confirm" type="password" required placeholder="Repeat password" />
              </div>
              <button type="submit" class="secondary-btn full-width">Create Account</button>
            </form>
          </div>
        </div>
      `;
    } else {
      container.className = "account-card";
      container.innerHTML = `
        <div class="account-row">
          <div>
            <div class="account-label">Signed in as</div>
            <div class="account-value">${user.name}</div>
            <div class="hint">${user.email}</div>
            <div class="hint">Role: ${user.role === "admin" ? "Administrator" : "Customer"}</div>
          </div>
          <button class="secondary-btn" id="logout-btn">Logout</button>
        </div>
        <div class="hint">Profile editing and password management would be implemented on the server in a full system.</div>
      `;
    }
    els.accountPanel.appendChild(container);
  };

  const renderWishlist = (wishlistIds, products) => {
    clearElement(els.wishlistList);
    if (wishlistIds.length === 0) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "No favorites yet. Tap the star on any bean to add it here.";
      els.wishlistList.appendChild(p);
      return;
    }

    wishlistIds.forEach((id) => {
      const p = products.find((x) => x.id === id);
      if (!p) return;
      const li = document.createElement("li");
      li.className = "card";
      li.innerHTML = `
        <div class="card-title">${p.name}</div>
        <div class="card-meta">
          <span>${p.origin} · ${p.roast}</span>
          <span class="price">${formatPrice(p.price)}</span>
        </div>
      `;
      els.wishlistList.appendChild(li);
    });
  };

  const renderRecommendations = (recs) => {
    clearElement(els.recommendationList);
    if (recs.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No recommendations yet.";
      els.recommendationList.appendChild(li);
      return;
    }
    recs.forEach((r) => {
      const li = document.createElement("li");
      li.dataset.id = r.id;
      li.innerHTML = `
        <span>${r.name}</span>
        <span class="rating">★ ${r.rating.toFixed(1)}</span>
      `;
      els.recommendationList.appendChild(li);
    });
  };

  const renderAdminProducts = (products) => {
    const container = document.createElement("div");
    container.className = "card-list";
    products.forEach((p) => {
      const row = document.createElement("div");
      row.className = "card";
      row.innerHTML = `
        <div class="card-header">
          <div>
            <div class="card-title">${p.name}</div>
            <div class="pill">${p.origin} · ${p.roast}</div>
          </div>
          <div class="pill">Stock: ${p.stock}</div>
        </div>
        <div class="card-meta">
          <span>Price: ${formatPrice(p.price)}</span>
          <span>Rating: ${p.rating.toFixed(1)}</span>
        </div>
      `;
      container.appendChild(row);
    });
    clearElement(els.adminContent);
    els.adminContent.appendChild(container);
  };

  const renderAdminInventory = (analytics) => {
    const container = document.createElement("div");
    const list = document.createElement("div");
    list.className = "card-list";

    analytics.lowStock.forEach((p) => {
      const row = document.createElement("div");
      row.className = "card";
      row.innerHTML = `
        <div class="card-header">
          <div class="card-title">${p.name}</div>
          <span class="badge-status status-pending">Low stock</span>
        </div>
        <div class="card-meta">
          <span>Current stock: ${p.stock}</span>
          <span class="hint">Consider reordering soon.</span>
        </div>
      `;
      list.appendChild(row);
    });

    if (analytics.lowStock.length === 0) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "No low-stock items. Inventory looks healthy.";
      list.appendChild(p);
    }

    container.appendChild(list);
    clearElement(els.adminContent);
    els.adminContent.appendChild(container);
  };

  const renderAdminAnalytics = (analytics) => {
    const wrapper = document.createElement("div");
    const metrics = document.createElement("div");
    metrics.className = "metrics-row";

    const c1 = document.createElement("div");
    c1.className = "metric-card";
    c1.innerHTML = `
      <div class="metric-label">Total Orders</div>
      <div class="metric-value">${analytics.totalOrders}</div>
      <div class="metric-trend neutral">Cumulative</div>
    `;

    const c2 = document.createElement("div");
    c2.className = "metric-card";
    c2.innerHTML = `
      <div class="metric-label">Total Revenue</div>
      <div class="metric-value">${formatPrice(analytics.revenue)}</div>
      <div class="metric-trend positive">Simulated</div>
    `;

    const c3 = document.createElement("div");
    c3.className = "metric-card";
    c3.innerHTML = `
      <div class="metric-label">Items Sold</div>
      <div class="metric-value">${analytics.itemsSold}</div>
      <div class="metric-trend neutral">All time</div>
    `;

    metrics.appendChild(c1);
    metrics.appendChild(c2);
    metrics.appendChild(c3);

    wrapper.appendChild(metrics);
    clearElement(els.adminContent);
    els.adminContent.appendChild(wrapper);
  };

  const renderAdminOrders = (orders) => {
    const container = document.createElement("div");
    const list = document.createElement("div");
    list.className = "card-list";

    if (orders.length === 0) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "No orders yet.";
      list.appendChild(p);
    } else {
      orders.forEach((o) => {
        const row = document.createElement("article");
        row.className = "card";
        const date = new Date(o.createdAt).toLocaleString();
        row.innerHTML = `
          <div class="card-header">
            <div>
              <div class="card-title">Order #${o.id}</div>
              <div class="pill">${date}</div>
            </div>
            <select class="pill js-admin-status" data-id="${o.id}">
              ${["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
                .map((s) => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s}</option>`)
                .join("")}
            </select>
          </div>
          <div class="card-body">
            <div class="hint">${o.customer.name} · ${o.customer.paymentMethod}</div>
          </div>
          <div class="card-meta">
            <span>Total: ${formatPrice(o.total)}</span>
            <span>Status: ${o.status}</span>
          </div>
        `;
        list.appendChild(row);
      });
    }

    container.appendChild(list);
    clearElement(els.adminContent);
    els.adminContent.appendChild(container);
  };

  const setUserLabel = (user) => {
    els.userLabel.textContent = user ? user.name : "Guest";
  };

  return {
    els,
    setActiveView,
    setActiveNav,
    renderProducts,
    renderCart,
    setCartOpen,
    setCheckoutOpen,
    renderOrders,
    renderAccount,
    renderWishlist,
    renderRecommendations,
    renderAdminProducts,
    renderAdminInventory,
    renderAdminAnalytics,
    renderAdminOrders,
    setUserLabel,
  };
})();
