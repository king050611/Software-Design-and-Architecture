// 产品数据
let products = [
    {
        id: 1,
        name: "埃塞俄比亚耶加雪菲",
        origin: "Ethiopia",
        roast: "Light",
        price: 128,
        stock: 50,
        description: "来自埃塞俄比亚的精品咖啡豆，带有柑橘和茉莉花的香气，口感清新明亮。",
        rating: 4.8,
        image: "☕"
    },
    {
        id: 2,
        name: "哥伦比亚苏普里莫",
        origin: "Colombia",
        roast: "Medium",
        price: 98,
        stock: 80,
        description: "平衡的酸度和甜度，带有坚果和巧克力的风味，适合日常饮用。",
        rating: 4.6,
        image: "☕"
    },
    {
        id: 3,
        name: "巴西山度士",
        origin: "Brazil",
        roast: "Medium",
        price: 88,
        stock: 100,
        description: "口感顺滑，带有焦糖和坚果的甜味，是制作意式浓缩咖啡的理想选择。",
        rating: 4.5,
        image: "☕"
    },
    {
        id: 4,
        name: "肯尼亚AA",
        origin: "Kenya",
        roast: "Light",
        price: 158,
        stock: 30,
        description: "明亮的酸度，带有黑醋栗和葡萄柚的果香，层次丰富。",
        rating: 4.9,
        image: "☕"
    },
    {
        id: 5,
        name: "苏门答腊曼特宁",
        origin: "Indonesia",
        roast: "Dark",
        price: 108,
        stock: 60,
        description: "浓郁醇厚，带有草本和香料的味道，余韵悠长。",
        rating: 4.7,
        image: "☕"
    },
    {
        id: 6,
        name: "危地马拉安提瓜",
        origin: "Colombia",
        roast: "Medium",
        price: 118,
        stock: 45,
        description: "平衡的酸度和醇厚度，带有烟熏和可可的复杂风味。",
        rating: 4.6,
        image: "☕"
    },
    {
        id: 7,
        name: "哥斯达黎加塔拉珠",
        origin: "Colombia",
        roast: "Light",
        price: 138,
        stock: 35,
        description: "清新的酸度，带有蜂蜜和柑橘的甜味，口感干净。",
        rating: 4.8,
        image: "☕"
    },
    {
        id: 8,
        name: "意式拼配",
        origin: "Brazil",
        roast: "Dark",
        price: 78,
        stock: 120,
        description: "经典意式拼配，浓郁醇厚，适合制作拿铁和卡布奇诺。",
        rating: 4.4,
        image: "☕"
    }
];

// 用户数据
let users = [
    {
        id: 1,
        email: "admin@coffee.com",
        password: "admin123",
        name: "管理员",
        phone: "",
        address: "",
        isAdmin: true
    }
];

// 当前用户
let currentUser = null;

// 购物车
let cart = [];

// 订单
let orders = [];

// 收藏夹
let wishlists = {};

// 订单ID计数器
let orderIdCounter = 1;

// 从localStorage加载数据
function loadData() {
    const savedProducts = localStorage.getItem('coffee_products');
    const savedUsers = localStorage.getItem('coffee_users');
    const savedOrders = localStorage.getItem('coffee_orders');
    const savedCurrentUser = localStorage.getItem('coffee_currentUser');
    const savedCart = localStorage.getItem('coffee_cart');
    const savedWishlists = localStorage.getItem('coffee_wishlists');
    const savedOrderIdCounter = localStorage.getItem('coffee_orderIdCounter');

    if (savedProducts) products = JSON.parse(savedProducts);
    if (savedUsers) users = JSON.parse(savedUsers);
    if (savedOrders) orders = JSON.parse(savedOrders);
    if (savedCurrentUser) currentUser = JSON.parse(savedCurrentUser);
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedWishlists) wishlists = JSON.parse(savedWishlists);
    if (savedOrderIdCounter) orderIdCounter = parseInt(savedOrderIdCounter);

    // 初始化管理员账户
    if (!savedUsers) {
        saveData();
    }
}

// 保存数据到localStorage
function saveData() {
    localStorage.setItem('coffee_products', JSON.stringify(products));
    localStorage.setItem('coffee_users', JSON.stringify(users));
    localStorage.setItem('coffee_orders', JSON.stringify(orders));
    localStorage.setItem('coffee_currentUser', JSON.stringify(currentUser));
    localStorage.setItem('coffee_cart', JSON.stringify(cart));
    localStorage.setItem('coffee_wishlists', JSON.stringify(wishlists));
    localStorage.setItem('coffee_orderIdCounter', orderIdCounter.toString());
}

// 初始化
loadData();

