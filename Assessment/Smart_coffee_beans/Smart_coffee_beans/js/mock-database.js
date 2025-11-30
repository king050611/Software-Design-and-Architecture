// mock-database.js
let mockDatabase = {
    users: [],
    products: [
        {
            id: 1,
            name: "Colombia Coffee Bean",
            price: 59.99,
            image: "../photo/哥伦比亚咖啡豆.png",
            description: "Colombian coffee beans are known for their medium roast and balanced taste. It has subtle nutty and fresh herbal flavors with moderate acidity and alcohol.",
            category: "medium",
            origin: "Colombia",
            stock: 50,
            rating: 4.5,
            reviews: 120
        },
        {
            id: 2,
            name: "Kenya Coffee Bean",
            price: 49.99,
            image: "../photo/肯尼亚咖啡豆.png",
            description: "Kenyan coffee beans are known for their distinctive grapefruit and blackcurrant flavors, which are particularly prominent when refrigerated.",
            category: "light",
            origin: "Kenya",
            stock: 35,
            rating: 4.7,
            reviews: 95
        },
        {
            id: 3,
            name: "Antigua, Guatemala Coffee Bean",
            price: 69.99,
            image: "../photo/安提瓜咖啡豆.png",
            description: "Guatemalan Antigua coffee beans are appreciated for their elegant and delicate flavor, cocoa and soft spice notes, as well as slight lemon notes.",
            category: "medium",
            origin: "Guatemala",
            stock: 40,
            rating: 4.6,
            reviews: 88
        },
        {
            id: 4,
            name: "Ethiopia Coffee Bean",
            price: 59.99,
            image: "../photo/埃塞俄比亚咖啡豆.png",
            description: "Ethiopian coffee beans are known for their light dark chocolate, sweet orange flavor and a hint of green pepper spicy aftertaste.",
            category: "light",
            origin: "Ethiopia",
            stock: 45,
            rating: 4.8,
            reviews: 150
        },
        {
            id: 5,
            name: "Flona Coffee Bean",
            price: 79.99,
            image: "../photo/佛罗娜咖啡豆.png",
            description: "This is a coffee full of love, has been known by three names. Starbucks first created this coffee bean for a Seattle restaurant in 1975.",
            category: "dark",
            origin: "Blend",
            stock: 30,
            rating: 4.4,
            reviews: 200
        },
        {
            id: 6,
            name: "Italian Roasted Coffee Bean",
            price: 39.99,
            image: "../photo/意式烘焙咖啡豆.png",
            description: "The name alone seems to represent a love of all that is good about Italy: the food, the Scooter, the Espresso and the passionate lifestyle.",
            category: "dark",
            origin: "Italy",
            stock: 60,
            rating: 4.3,
            reviews: 175
        }
    ],
    orders: [],
    cart: [],
    wishlist: [],
    adminUsers: ["admin@coffee.com"] // Admin email
};

// 哈希函数
function getHash(value) {
    return CryptoJS.SHA256(value).toString();
}

// 页面加载时加载 mockDatabase
window.addEventListener('load', function() {
    const storedDatabase = localStorage.getItem('mockDatabase');
    if (storedDatabase) {
        const parsed = JSON.parse(storedDatabase);
        mockDatabase = {
            users: parsed.users || [],
            products: parsed.products || mockDatabase.products,
            orders: parsed.orders || [],
            cart: parsed.cart || [],
            wishlist: parsed.wishlist || [],
            adminUsers: parsed.adminUsers || mockDatabase.adminUsers
        };
    } else {
        localStorage.setItem('mockDatabase', JSON.stringify(mockDatabase));
    }
});

// Save database to localStorage
function saveDatabase() {
    localStorage.setItem('mockDatabase', JSON.stringify(mockDatabase));
}