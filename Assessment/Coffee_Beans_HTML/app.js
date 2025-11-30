// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

const AI_DEFAULT_ENDPOINT = window.COFFEE_AI_ENDPOINT || '';
const AI_DEFAULT_API_KEY = window.COFFEE_AI_KEY || '';
let aiConversation = [];

function initializeApp() {
    // 绑定导航链接
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });

    // 绑定认证标签页
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });

    // 绑定管理员标签页
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchAdminTab(tabName);
        });
    });

    // 绑定个人中心菜单
    document.querySelectorAll('.profile-menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchProfileSection(section);
        });
    });

    // 搜索功能
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    // 排序和筛选
    const sortSelect = document.getElementById('sort-select');
    const filterOrigin = document.getElementById('filter-origin');
    const filterRoast = document.getElementById('filter-roast');

    if (sortSelect) sortSelect.addEventListener('change', filterProducts);
    if (filterOrigin) filterOrigin.addEventListener('change', filterProducts);
    if (filterRoast) filterRoast.addEventListener('change', filterProducts);

    // 更新UI
    updateUI();
    displayProducts();
    updateCartCount();
    initializeAIPage();
}

// 页面切换
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 更新导航链接状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll(`.nav-link[data-page="${pageName}"]`).forEach(link => {
        link.classList.add('active');
    });

    // 根据页面加载内容
    switch(pageName) {
        case 'home':
            displayProducts();
            displayRecommendations();
            break;
        case 'products':
            initializeAIPage();
            updateAIContextLine();
            break;
        case 'cart':
            displayCart();
            break;
        case 'orders':
            displayOrders();
            break;
        case 'profile':
            loadProfile();
            break;
        case 'admin':
            if (currentUser && currentUser.isAdmin) {
                loadAdminDashboard();
            } else {
                showMessage('您没有权限访问管理页面', 'error');
                showPage('home');
            }
            break;
    }
}

// 更新UI（根据登录状态）
function updateUI() {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const profileLink = document.getElementById('profile-link');
    const adminLink = document.getElementById('admin-link');

    if (currentUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline-block';
        if (profileLink) profileLink.style.display = 'inline-block';
        if (currentUser.isAdmin && adminLink) adminLink.style.display = 'inline-block';
    } else {
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }

    updateAIContextLine();
}

// 显示产品
function displayProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const productsToShow = filteredProducts || products;
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-origin">${getOriginName(product.origin)} · ${getRoastName(product.roast)}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">¥${product.price}</div>
                    <div class="product-actions">
                        <button class="btn-icon" onclick="event.stopPropagation(); addToCart(${product.id})" title="加入购物车">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn-icon" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="收藏">
                            <i class="fas ${isInWishlist(product.id) ? 'fa-heart' : 'fa-heart'}"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 显示推荐产品
function displayRecommendations() {
    const recommendationsSection = document.getElementById('recommendations-section');
    const recommendationsGrid = document.getElementById('recommendations-grid');
    
    if (!recommendationsSection || !recommendationsGrid || !currentUser) {
        if (recommendationsSection) recommendationsSection.style.display = 'none';
        return;
    }

    // 基于用户订单历史推荐
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    if (userOrders.length === 0) {
        recommendationsSection.style.display = 'none';
        return;
    }

    // 获取用户购买过的产品ID
    const purchasedProductIds = new Set();
    userOrders.forEach(order => {
        order.items.forEach(item => {
            purchasedProductIds.add(item.productId);
        });
    });

    // 推荐相似产品（相同产地或烘焙度）
    const recommendations = products.filter(product => {
        if (purchasedProductIds.has(product.id)) return false;
        
        // 检查是否有相同产地或烘焙度的已购买产品
        return Array.from(purchasedProductIds).some(id => {
            const purchasedProduct = products.find(p => p.id === id);
            return purchasedProduct && 
                   (purchasedProduct.origin === product.origin || 
                    purchasedProduct.roast === product.roast);
        });
    }).slice(0, 4);

    if (recommendations.length === 0) {
        recommendationsSection.style.display = 'none';
        return;
    }

    recommendationsSection.style.display = 'block';
    recommendationsGrid.innerHTML = recommendations.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-origin">${getOriginName(product.origin)} · ${getRoastName(product.roast)}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">¥${product.price}</div>
                    <div class="product-actions">
                        <button class="btn-icon" onclick="event.stopPropagation(); addToCart(${product.id})" title="加入购物车">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 筛选和排序产品
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortValue = document.getElementById('sort-select').value;
    const originFilter = document.getElementById('filter-origin').value;
    const roastFilter = document.getElementById('filter-roast').value;

    let filtered = products.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(searchTerm) ||
                          product.description.toLowerCase().includes(searchTerm);
        const matchOrigin = originFilter === 'all' || product.origin === originFilter;
        const matchRoast = roastFilter === 'all' || product.roast === roastFilter;
        
        return matchSearch && matchOrigin && matchRoast;
    });

    // 排序
    switch(sortValue) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating-desc':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
    }

    displayProducts(filtered);
}

// 显示产品详情
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const detailPage = document.getElementById('product-detail-page');
    const detailContent = document.getElementById('product-detail');

    detailContent.innerHTML = `
        <div class="detail-content">
            <div class="detail-image">${product.image}</div>
            <div class="detail-info">
                <h1>${product.name}</h1>
                <div class="detail-meta">
                    <span>产地：${getOriginName(product.origin)}</span>
                    <span>烘焙度：${getRoastName(product.roast)}</span>
                    <span>评分：${product.rating} ⭐</span>
                </div>
                <div class="detail-price">¥${product.price}</div>
                <div class="detail-description">${product.description}</div>
                <div class="stock-info">
                    <strong>库存：</strong>${product.stock} 件
                </div>
                <div class="detail-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="changeQuantity(-1, ${product.id})">-</button>
                        <input type="number" class="quantity-input" id="quantity-${product.id}" value="1" min="1" max="${product.stock}">
                        <button class="quantity-btn" onclick="changeQuantity(1, ${product.id})">+</button>
                    </div>
                    <button class="btn-primary" onclick="addToCartFromDetail(${product.id})">加入购物车</button>
                    <button class="btn-icon" onclick="toggleWishlist(${product.id})" title="收藏">
                        <i class="fas ${isInWishlist(product.id) ? 'fa-heart' : 'fa-heart'}"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    showPage('product-detail');
}

// 修改数量
function changeQuantity(delta, productId) {
    const input = document.getElementById(`quantity-${productId}`);
    if (!input) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let quantity = parseInt(input.value) || 1;
    quantity += delta;
    quantity = Math.max(1, Math.min(quantity, product.stock));
    input.value = quantity;
}

// 添加到购物车（从详情页）
function addToCartFromDetail(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    const quantity = input ? parseInt(input.value) || 1 : 1;
    addToCart(productId, quantity);
}

// 添加到购物车
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showMessage('产品不存在', 'error');
        return;
    }

    if (product.stock < quantity) {
        showMessage('库存不足', 'error');
        return;
    }

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
            showMessage('库存不足', 'error');
            return;
        }
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity
        });
    }

    saveData();
    updateCartCount();
    showMessage('已添加到购物车', 'success');
}

// 更新购物车数量显示
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// 显示购物车
function displayCart() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>购物车是空的</p>
                <button class="btn-primary" onclick="showPage('products')">去购物</button>
            </div>
        `;
        return;
    }

    let total = 0;
    const cartItemsHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        
        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div class="cart-item-image">${product.image}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">¥${product.price} × ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${product.stock}" 
                               onchange="updateCartQuantity(${item.productId}, 0, this.value)">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, 1)">+</button>
                    </div>
                    <button class="btn-icon" onclick="removeFromCart(${item.productId})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    cartContent.innerHTML = `
        <div class="cart-items">${cartItemsHTML}</div>
        <div class="cart-total">
            <div class="total-label">总计：</div>
            <div class="total-amount">¥${total.toFixed(2)}</div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <button class="btn-primary" style="padding: 15px 40px; font-size: 1.2rem;" onclick="checkout()">去结账</button>
        </div>
    `;
}

// 更新购物车数量
function updateCartQuantity(productId, delta, newValue = null) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newValue !== null) {
        const quantity = parseInt(newValue);
        if (quantity < 1 || quantity > product.stock) {
            showMessage('数量无效', 'error');
            displayCart();
            return;
        }
        item.quantity = quantity;
    } else {
        item.quantity += delta;
        if (item.quantity < 1) {
            removeFromCart(productId);
            return;
        }
        if (item.quantity > product.stock) {
            showMessage('库存不足', 'error');
            item.quantity = product.stock;
        }
    }

    saveData();
    displayCart();
    updateCartCount();
}

// 从购物车移除
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveData();
    displayCart();
    updateCartCount();
    showMessage('已从购物车移除', 'success');
}

// 结账
function checkout() {
    if (!currentUser) {
        showMessage('请先登录', 'warning');
        showPage('login');
        return;
    }

    if (cart.length === 0) {
        showMessage('购物车是空的', 'warning');
        return;
    }

    // 检查库存
    for (let item of cart) {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
            showMessage(`${product ? product.name : '产品'}库存不足`, 'error');
            displayCart();
            return;
        }
    }

    // 显示结账模态框
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutContent = document.getElementById('checkout-content');

    let total = 0;
    const itemsHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        return `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--beige);">
                <span>${product.name} × ${item.quantity}</span>
                <span>¥${itemTotal.toFixed(2)}</span>
            </div>
        `;
    }).join('');

    checkoutContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>订单详情</h3>
            ${itemsHTML}
            <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 1.2rem; font-weight: bold;">
                <span>总计：</span>
                <span style="color: var(--primary-brown);">¥${total.toFixed(2)}</span>
            </div>
        </div>
        <div style="margin-bottom: 20px;">
            <h3>配送信息</h3>
            <div class="form-group">
                <label>收货地址</label>
                <textarea id="checkout-address" rows="3" required>${currentUser.address || ''}</textarea>
            </div>
            <div class="form-group">
                <label>联系电话</label>
                <input type="tel" id="checkout-phone" value="${currentUser.phone || ''}" required>
            </div>
        </div>
        <div style="margin-bottom: 20px;">
            <h3>支付方式</h3>
            <select id="payment-method" style="width: 100%; padding: 10px; border: 2px solid var(--beige); border-radius: 5px;">
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="alipay">支付宝</option>
                <option value="wechat">微信支付</option>
            </select>
        </div>
        <div style="text-align: center;">
            <button class="btn-primary" style="padding: 15px 40px; font-size: 1.2rem;" onclick="confirmCheckout()">确认订单</button>
        </div>
    `;

    checkoutModal.style.display = 'flex';
}

// 确认结账
function confirmCheckout() {
    const address = document.getElementById('checkout-address').value;
    const phone = document.getElementById('checkout-phone').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (!address || !phone) {
        showMessage('请填写完整的配送信息', 'error');
        return;
    }

    // 再次检查库存
    for (let item of cart) {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
            showMessage(`${product ? product.name : '产品'}库存不足`, 'error');
            closeCheckoutModal();
            displayCart();
            return;
        }
    }

    // 创建订单
    let total = 0;
    const orderItems = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        // 更新库存
        product.stock -= item.quantity;
        
        return {
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            price: product.price,
            total: itemTotal
        };
    });

    const order = {
        id: orderIdCounter++,
        userId: currentUser.id,
        userName: currentUser.name,
        items: orderItems,
        total: total,
        status: 'pending',
        address: address,
        phone: phone,
        paymentMethod: paymentMethod,
        date: new Date().toISOString()
    };

    orders.push(order);
    cart = [];
    
    saveData();
    updateCartCount();
    closeCheckoutModal();
    showMessage('订单提交成功！', 'success');
    showPage('orders');
    displayOrders();
}

// 关闭结账模态框
function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// 显示订单
function displayOrders() {
    const ordersContent = document.getElementById('orders-content');
    if (!ordersContent) return;

    if (!currentUser) {
        ordersContent.innerHTML = `
            <div class="empty-cart">
                <p>请先登录查看订单</p>
                <button class="btn-primary" onclick="showPage('login')">去登录</button>
            </div>
        `;
        return;
    }

    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    if (userOrders.length === 0) {
        ordersContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-box"></i>
                <p>暂无订单</p>
                <button class="btn-primary" onclick="showPage('products')">去购物</button>
            </div>
        `;
        return;
    }

    ordersContent.innerHTML = userOrders.map(order => {
        const itemsHTML = order.items.map(item => `
            <div class="order-item">
                <span>${item.productName} × ${item.quantity}</span>
                <span>¥${item.total.toFixed(2)}</span>
            </div>
        `).join('');

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-number">订单号：#${order.id}</div>
                        <div style="color: var(--light-brown); font-size: 0.9rem; margin-top: 5px;">
                            ${new Date(order.date).toLocaleString('zh-CN')}
                        </div>
                    </div>
                    <div class="order-status status-${order.status}">${getOrderStatusName(order.status)}</div>
                </div>
                <div class="order-items">${itemsHTML}</div>
                <div class="order-total">
                    <span>总计：</span>
                    <span>¥${order.total.toFixed(2)}</span>
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--beige);">
                    <div style="margin-bottom: 5px;"><strong>收货地址：</strong>${order.address}</div>
                    <div><strong>联系电话：</strong>${order.phone}</div>
                </div>
            </div>
        `;
    }).join('');
}

// 登录处理
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        saveData();
        updateUI();
        showMessage('登录成功', 'success');
        showPage('home');
    } else {
        showMessage('邮箱或密码错误', 'error');
    }
}

// 注册处理
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        showMessage('两次输入的密码不一致', 'error');
        return;
    }

    if (users.find(u => u.email === email)) {
        showMessage('该邮箱已被注册', 'error');
        return;
    }

    const newUser = {
        id: users.length + 1,
        email: email,
        password: password,
        name: name,
        phone: '',
        address: '',
        isAdmin: false
    };

    users.push(newUser);
    currentUser = newUser;
    saveData();
    updateUI();
    showMessage('注册成功', 'success');
    showPage('home');
}

// 退出登录
function logout() {
    currentUser = null;
    saveData();
    updateUI();
    showMessage('已退出登录', 'success');
    showPage('home');
}

// 切换认证标签页
function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-form`).classList.add('active');
}

// 加载个人资料
function loadProfile() {
    if (!currentUser) {
        showPage('login');
        return;
    }

    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-address').value = currentUser.address || '';

    // 加载订单历史
    loadProfileOrders();
    
    // 加载收藏夹
    loadWishlist();
}

// 更新个人资料
function updateProfile(event) {
    event.preventDefault();
    if (!currentUser) return;

    currentUser.name = document.getElementById('profile-name').value;
    currentUser.phone = document.getElementById('profile-phone').value;
    currentUser.address = document.getElementById('profile-address').value;

    // 更新users数组
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    }

    saveData();
    showMessage('资料更新成功', 'success');
}

// 切换个人中心部分
function switchProfileSection(section) {
    document.querySelectorAll('.profile-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.profile-section').forEach(sec => {
        sec.classList.remove('active');
    });

    document.querySelector(`.profile-menu-item[data-section="${section}"]`).classList.add('active');
    document.getElementById(`profile-${section}`).classList.add('active');

    if (section === 'orders') {
        loadProfileOrders();
    } else if (section === 'wishlist') {
        loadWishlist();
    }
}

// 加载个人中心的订单
function loadProfileOrders() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p>暂无订单</p>';
        return;
    }

    ordersList.innerHTML = userOrders.map(order => {
        const itemsHTML = order.items.map(item => `
            <div class="order-item">
                <span>${item.productName} × ${item.quantity}</span>
                <span>¥${item.total.toFixed(2)}</span>
            </div>
        `).join('');

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-number">订单号：#${order.id}</div>
                        <div style="color: var(--light-brown); font-size: 0.9rem; margin-top: 5px;">
                            ${new Date(order.date).toLocaleString('zh-CN')}
                        </div>
                    </div>
                    <div class="order-status status-${order.status}">${getOrderStatusName(order.status)}</div>
                </div>
                <div class="order-items">${itemsHTML}</div>
                <div class="order-total">
                    <span>总计：</span>
                    <span>¥${order.total.toFixed(2)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// 收藏夹功能
function toggleWishlist(productId) {
    if (!currentUser) {
        showMessage('请先登录', 'warning');
        showPage('login');
        return;
    }

    if (!wishlists[currentUser.id]) {
        wishlists[currentUser.id] = [];
    }

    const index = wishlists[currentUser.id].indexOf(productId);
    if (index > -1) {
        wishlists[currentUser.id].splice(index, 1);
        showMessage('已取消收藏', 'success');
    } else {
        wishlists[currentUser.id].push(productId);
        showMessage('已添加到收藏夹', 'success');
    }

    saveData();
}

function isInWishlist(productId) {
    if (!currentUser || !wishlists[currentUser.id]) return false;
    return wishlists[currentUser.id].includes(productId);
}

function loadWishlist() {
    const wishlistGrid = document.getElementById('wishlist-grid');
    if (!wishlistGrid) return;

    if (!currentUser || !wishlists[currentUser.id] || wishlists[currentUser.id].length === 0) {
        wishlistGrid.innerHTML = '<p>收藏夹是空的</p>';
        return;
    }

    const wishlistProducts = products.filter(p => wishlists[currentUser.id].includes(p.id));
    wishlistGrid.innerHTML = wishlistProducts.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-origin">${getOriginName(product.origin)} · ${getRoastName(product.roast)}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">¥${product.price}</div>
                    <div class="product-actions">
                        <button class="btn-icon" onclick="event.stopPropagation(); addToCart(${product.id})" title="加入购物车">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn-icon" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="取消收藏">
                            <i class="fas fa-heart" style="color: var(--error);"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 管理员功能
function loadAdminDashboard() {
    if (!currentUser || !currentUser.isAdmin) return;

    // 更新统计数据
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.filter(u => !u.isAdmin).length;

    document.getElementById('total-sales').textContent = '¥' + totalSales.toFixed(2);
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-users').textContent = totalUsers;

    // 加载产品管理
    loadAdminProducts();
    
    // 加载订单管理
    loadAdminOrders();
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelector(`.admin-tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'products-admin') {
        loadAdminProducts();
    } else if (tabName === 'orders-admin') {
        loadAdminOrders();
    }
}

function loadAdminProducts() {
    const tableBody = document.getElementById('admin-products-table');
    if (!tableBody) return;

    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>¥${product.price}</td>
            <td>${product.stock}</td>
            <td>${getOriginName(product.origin)}</td>
            <td>
                <button class="btn-icon" onclick="editProduct(${product.id})" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteProduct(${product.id})" title="删除" style="background: var(--error);">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadAdminOrders() {
    const tableBody = document.getElementById('admin-orders-table');
    if (!tableBody) return;

    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.userName}</td>
            <td>¥${order.total.toFixed(2)}</td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, this.value)" style="padding: 5px; border-radius: 3px;">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>待处理</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>处理中</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>已发货</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>已送达</option>
                </select>
            </td>
            <td>${new Date(order.date).toLocaleDateString('zh-CN')}</td>
            <td>
                <button class="btn-icon" onclick="viewOrderDetail(${order.id})" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveData();
        showMessage('订单状态已更新', 'success');
        loadAdminOrders();
    }
}

function resetAllData() {
    if (!currentUser || !currentUser.isAdmin) {
        showMessage('只有管理员可以执行该操作', 'error');
        return;
    }

    const confirmed = confirm('确定要清除所有产品、用户、订单、购物车等本地数据吗？此操作不可撤销。');
    if (!confirmed) return;

    const storageKeys = [
        'coffee_products',
        'coffee_users',
        'coffee_orders',
        'coffee_currentUser',
        'coffee_cart',
        'coffee_wishlists',
        'coffee_orderIdCounter'
    ];

    storageKeys.forEach(key => localStorage.removeItem(key));
    showMessage('数据已清除，正在刷新页面', 'success');
    setTimeout(() => {
        location.reload();
    }, 600);
}

function showAddProductModal() {
    const modal = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>添加产品</h2>
        <form onsubmit="addProduct(event)">
            <div class="form-group">
                <label>产品名称</label>
                <input type="text" id="new-product-name" required>
            </div>
            <div class="form-group">
                <label>产地</label>
                <select id="new-product-origin" required>
                    <option value="Ethiopia">埃塞俄比亚</option>
                    <option value="Colombia">哥伦比亚</option>
                    <option value="Brazil">巴西</option>
                    <option value="Kenya">肯尼亚</option>
                    <option value="Indonesia">印度尼西亚</option>
                </select>
            </div>
            <div class="form-group">
                <label>烘焙度</label>
                <select id="new-product-roast" required>
                    <option value="Light">浅烘</option>
                    <option value="Medium">中烘</option>
                    <option value="Dark">深烘</option>
                </select>
            </div>
            <div class="form-group">
                <label>价格</label>
                <input type="number" id="new-product-price" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>库存</label>
                <input type="number" id="new-product-stock" min="0" required>
            </div>
            <div class="form-group">
                <label>描述</label>
                <textarea id="new-product-description" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label>评分</label>
                <input type="number" id="new-product-rating" min="0" max="5" step="0.1" value="4.5" required>
            </div>
            <button type="submit" class="btn-primary">添加产品</button>
        </form>
    `;
    
    modal.classList.add('active');
}

function addProduct(event) {
    event.preventDefault();
    
    const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: document.getElementById('new-product-name').value,
        origin: document.getElementById('new-product-origin').value,
        roast: document.getElementById('new-product-roast').value,
        price: parseFloat(document.getElementById('new-product-price').value),
        stock: parseInt(document.getElementById('new-product-stock').value),
        description: document.getElementById('new-product-description').value,
        rating: parseFloat(document.getElementById('new-product-rating').value),
        image: "☕"
    };
    
    products.push(newProduct);
    saveData();
    closeModal();
    showMessage('产品添加成功', 'success');
    loadAdminProducts();
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>编辑产品</h2>
        <form onsubmit="saveProduct(${productId}, event)">
            <div class="form-group">
                <label>产品名称</label>
                <input type="text" id="edit-product-name" value="${product.name}" required>
            </div>
            <div class="form-group">
                <label>产地</label>
                <select id="edit-product-origin" required>
                    <option value="Ethiopia" ${product.origin === 'Ethiopia' ? 'selected' : ''}>埃塞俄比亚</option>
                    <option value="Colombia" ${product.origin === 'Colombia' ? 'selected' : ''}>哥伦比亚</option>
                    <option value="Brazil" ${product.origin === 'Brazil' ? 'selected' : ''}>巴西</option>
                    <option value="Kenya" ${product.origin === 'Kenya' ? 'selected' : ''}>肯尼亚</option>
                    <option value="Indonesia" ${product.origin === 'Indonesia' ? 'selected' : ''}>印度尼西亚</option>
                </select>
            </div>
            <div class="form-group">
                <label>烘焙度</label>
                <select id="edit-product-roast" required>
                    <option value="Light" ${product.roast === 'Light' ? 'selected' : ''}>浅烘</option>
                    <option value="Medium" ${product.roast === 'Medium' ? 'selected' : ''}>中烘</option>
                    <option value="Dark" ${product.roast === 'Dark' ? 'selected' : ''}>深烘</option>
                </select>
            </div>
            <div class="form-group">
                <label>价格</label>
                <input type="number" id="edit-product-price" value="${product.price}" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>库存</label>
                <input type="number" id="edit-product-stock" value="${product.stock}" min="0" required>
            </div>
            <div class="form-group">
                <label>描述</label>
                <textarea id="edit-product-description" rows="3" required>${product.description}</textarea>
            </div>
            <div class="form-group">
                <label>评分</label>
                <input type="number" id="edit-product-rating" value="${product.rating}" min="0" max="5" step="0.1" required>
            </div>
            <button type="submit" class="btn-primary">保存更改</button>
        </form>
    `;
    
    modal.classList.add('active');
}

function saveProduct(productId, event) {
    event.preventDefault();
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    product.name = document.getElementById('edit-product-name').value;
    product.origin = document.getElementById('edit-product-origin').value;
    product.roast = document.getElementById('edit-product-roast').value;
    product.price = parseFloat(document.getElementById('edit-product-price').value);
    product.stock = parseInt(document.getElementById('edit-product-stock').value);
    product.description = document.getElementById('edit-product-description').value;
    product.rating = parseFloat(document.getElementById('edit-product-rating').value);
    
    saveData();
    closeModal();
    showMessage('产品更新成功', 'success');
    loadAdminProducts();
    displayProducts();
}

function deleteProduct(productId) {
    if (confirm('确定要删除这个产品吗？')) {
        products = products.filter(p => p.id !== productId);
        saveData();
        showMessage('产品已删除', 'success');
        loadAdminProducts();
        displayProducts();
    }
}

function viewOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    
    const itemsHTML = order.items.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--beige);">
            <span>${item.productName} × ${item.quantity}</span>
            <span>¥${item.total.toFixed(2)}</span>
        </div>
    `).join('');

    modalBody.innerHTML = `
        <h2>订单详情 #${order.id}</h2>
        <div style="margin-bottom: 15px;">
            <p><strong>客户：</strong>${order.userName}</p>
            <p><strong>日期：</strong>${new Date(order.date).toLocaleString('zh-CN')}</p>
            <p><strong>状态：</strong>${getOrderStatusName(order.status)}</p>
        </div>
        <div style="margin-bottom: 15px;">
            <h3>订单商品</h3>
            ${itemsHTML}
            <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 1.2rem; font-weight: bold;">
                <span>总计：</span>
                <span>¥${order.total.toFixed(2)}</span>
            </div>
        </div>
        <div>
            <h3>配送信息</h3>
            <p><strong>地址：</strong>${order.address}</p>
            <p><strong>电话：</strong>${order.phone}</p>
            <p><strong>支付方式：</strong>${order.paymentMethod}</p>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// 工具函数
function getOriginName(origin) {
    const names = {
        'Ethiopia': '埃塞俄比亚',
        'Colombia': '哥伦比亚',
        'Brazil': '巴西',
        'Kenya': '肯尼亚',
        'Indonesia': '印度尼西亚'
    };
    return names[origin] || origin;
}

function getRoastName(roast) {
    const names = {
        'Light': '浅烘',
        'Medium': '中烘',
        'Dark': '深烘'
    };
    return names[roast] || roast;
}

function getOrderStatusName(status) {
    const names = {
        'pending': '待处理',
        'processing': '处理中',
        'shipped': '已发货',
        'delivered': '已送达'
    };
    return names[status] || status;
}

function showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// AI 产品顾问
function initializeAIPage() {
    const form = document.getElementById('ai-chat-form');
    if (form && !form.dataset.bound) {
        form.addEventListener('submit', handleAIQuery);
        form.dataset.bound = 'true';
    }

    const input = document.getElementById('ai-question-input');
    const statusBar = document.getElementById('ai-status');
    if (statusBar && !statusBar.dataset.initialized) {
        statusBar.textContent = '';
        statusBar.dataset.initialized = 'true';
    }

    document.querySelectorAll('.ai-suggestion').forEach(button => {
        if (button.dataset.bound) return;
        button.addEventListener('click', () => {
            const presetQuestion = button.getAttribute('data-question') || button.textContent;
            if (input) {
                input.value = presetQuestion;
            }
            handleAIQuery(null, presetQuestion);
        });
        button.dataset.bound = 'true';
    });

    updateAIContextLine();
}

async function handleAIQuery(event, presetQuestion = null) {
    if (event) event.preventDefault();

    const input = document.getElementById('ai-question-input');
    if (!input && !presetQuestion) return;

    const question = (presetQuestion || (input ? input.value : '')).trim();
    if (!question) return;

    if (input && !presetQuestion) {
        input.value = '';
    }

    aiConversation.push({ role: 'user', content: question });
    aiConversation = aiConversation.slice(-10);

    appendAIMessage('user', question);

    const placeholder = appendAIMessage('ai', '正在为你分析品味与库存...');
    setAIStatus('正在联系咖啡AI，请稍候 ☕');

    try {
        const response = await getAIAnswer(question);
        if (placeholder) {
            placeholder.textContent = response.answer;
        }
        aiConversation.push({ role: 'assistant', content: response.answer });
        aiConversation = aiConversation.slice(-10);
        renderAIRecommendations(response.recommendations || []);
        setAIStatus('AI 已完成分析，如需更多建议可继续提问。');
    } catch (error) {
        console.error('AI response failed', error);
        if (placeholder) {
            placeholder.textContent = '抱歉，暂时无法连接到AI，我根据库存给出建议。';
        }
        setAIStatus('AI 暂时不可用，请稍后再试。');
    }
}

function appendAIMessage(role, content) {
    const history = document.getElementById('ai-chat-history');
    if (!history) return null;

    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ${role === 'user' ? 'ai-message-user' : 'ai-message-ai'}`;

    if (role === 'ai') {
        const roleEl = document.createElement('div');
        roleEl.className = 'ai-message-role';
        roleEl.innerHTML = `<i class="fas fa-robot"></i><span>豆豆顾问</span>`;
        messageEl.appendChild(roleEl);
    }

    const textEl = document.createElement('p');
    textEl.textContent = content;
    messageEl.appendChild(textEl);

    history.appendChild(messageEl);
    history.scrollTop = history.scrollHeight;
    return textEl;
}

function setAIStatus(message) {
    const statusEl = document.getElementById('ai-status');
    if (!statusEl) return;
    statusEl.textContent = message || '';
}

async function getAIAnswer(question) {
    const payload = {
        question,
        conversation: aiConversation,
        context: buildAIContext()
    };

    try {
        const apiResponse = await fetchAIResponse(payload);
        if (!apiResponse || !apiResponse.answer) {
            throw new Error('缺少AI回答');
        }
        return apiResponse;
    } catch (error) {
        console.warn('Falling back to local AI', error);
        return createFallbackAIResponse(question, payload.context);
    }
}

async function fetchAIResponse(payload) {
    const endpoint = window.COFFEE_AI_ENDPOINT || AI_DEFAULT_ENDPOINT;
    if (!endpoint) {
        throw new Error('未配置AI接口');
    }

    const headers = {
        'Content-Type': 'application/json'
    };

    const apiKey = window.COFFEE_AI_KEY || AI_DEFAULT_API_KEY;
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('AI 接口请求失败');
    }

    return await response.json();
}

function createFallbackAIResponse(question, context) {
    const preferences = extractPreferencesFromQuestion(question);
    const recommendations = buildFallbackRecommendations(preferences, context);

    const descriptor = preferences.summary || '口味偏好';
    const answer = recommendations.length
        ? `根据你提到的${descriptor}，我为你挑选了 ${recommendations.length} 款豆子，欢迎查看详情。`
        : '我暂时找不到完全匹配的豆子，但以下几款是当前评价最高、适合尝试的选择。';

    return {
        answer,
        recommendations
    };
}

function extractPreferencesFromQuestion(question) {
    const text = question.toLowerCase();
    const pref = {
        roast: null,
        keywords: [],
        summary: ''
    };

    if (text.includes('浅') || text.includes('light')) pref.roast = 'Light';
    else if (text.includes('中') || text.includes('medium')) pref.roast = 'Medium';
    else if (text.includes('深') || text.includes('dark')) pref.roast = 'Dark';

    if (text.includes('酸')) pref.keywords.push('酸');
    if (text.includes('巧克力') || text.includes('chocolate')) pref.keywords.push('巧克力');
    if (text.includes('坚果')) pref.keywords.push('坚果');
    if (text.includes('花') || text.includes('花香')) pref.keywords.push('花香');
    if (text.includes('水果') || text.includes('果')) pref.keywords.push('果香');

    const parts = [];
    if (pref.roast) parts.push(`${getRoastName(pref.roast)}烘焙`);
    if (pref.keywords.length) parts.push(pref.keywords.join('、') + '风味');
    pref.summary = parts.length ? parts.join('和') : '喜好';
    return pref;
}

function buildFallbackRecommendations(preferences, context) {
    let candidate = [...products];

    if (preferences.roast) {
        candidate = candidate.filter(product => product.roast === preferences.roast);
    }

    if (preferences.keywords.length) {
        candidate = candidate.filter(product =>
            preferences.keywords.some(keyword => product.description.includes(keyword))
        );
    }

    if (!candidate.length) {
        candidate = [...products];
    }

    candidate.sort((a, b) => b.rating - a.rating);

    const recommendations = candidate.slice(0, 3).map(product => ({
        id: product.id,
        name: product.name,
        origin: getOriginName(product.origin),
        roast: getRoastName(product.roast),
        description: product.description,
        price: product.price,
        rating: product.rating
    }));

    if (context && context.user && context.user.wishlistIds && context.user.wishlistIds.length) {
        return recommendations.map(rec => {
            if (context.user.wishlistIds.includes(rec.id)) {
                return { ...rec, badge: '收藏夹优先' };
            }
            return rec;
        });
    }

    return recommendations;
}

function buildAIContext() {
    if (!currentUser) {
        return {
            user: null,
            cartSummary: cart.length,
            totalProducts: products.length
        };
    }

    const userWishlist = wishlists[currentUser.id] || [];
    const userOrders = orders.filter(order => order.userId === currentUser.id);

    return {
        user: {
            id: currentUser.id,
            name: currentUser.name,
            wishlistIds: userWishlist,
            orderCount: userOrders.length
        },
        recentOrders: userOrders.slice(-3),
        cartSummary: cart.reduce((sum, item) => sum + item.quantity, 0),
        totalProducts: products.length
    };
}

function renderAIRecommendations(recommendations = []) {
    const container = document.getElementById('ai-recommendations');
    if (!container) return;

    if (!recommendations.length) {
        container.innerHTML = `
            <div class="ai-empty">
                <i class="fas fa-compass"></i>
                <p>暂时没有推荐，试着描述你想要的风味或冲煮方式。</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recommendations.map(rec => `
        <div class="ai-recommendation-card">
            <h4>${rec.name} ${rec.badge ? `<span style="font-size:0.8rem;color:var(--cream);">(${rec.badge})</span>` : ''}</h4>
            <div class="ai-recommendation-meta">
                <span>${rec.origin} · ${rec.roast}</span>
                <span>评分 ${rec.rating} ⭐</span>
                <span>¥${rec.price}</span>
            </div>
            <p>${rec.description}</p>
            <div class="ai-recommendation-actions">
                <button class="btn-primary" onclick="showProductDetail(${rec.id})">查看详情</button>
                <button class="btn-secondary" onclick="addToCart(${rec.id})">加入购物车</button>
            </div>
        </div>
    `).join('');
}

function updateAIContextLine() {
    const line = document.getElementById('ai-context-line');
    if (!line) return;

    if (!currentUser) {
        line.textContent = '登录后我可以记住你的口味、购物车和订单，提供更精准的建议。';
        return;
    }

    const userOrders = orders.filter(order => order.userId === currentUser.id);
    const wishlistCount = (wishlists[currentUser.id] || []).length;
    line.textContent = `嗨 ${currentUser.name}，我记得你有 ${userOrders.length} 条订单记录和 ${wishlistCount} 款收藏，随时可以为你量身推荐。`;
}

