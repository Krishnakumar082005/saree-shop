// Silk Sutra - Inbuilt LocalStorage Database Engine v2.0

const defaultProducts = [
    {
        id: "p1",
        name: "Crimson Pure Kanjeevaram Silk Saree",
        category: "silk",
        price: 8500,
        originalPrice: 10000,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        rating: 4.5, reviews: 42, isNew: false, discount: 15, stock: 5,
        description: "A stunning crimson red pure kanjeevaram silk saree featuring intricate zari work and a traditional border."
    },
    {
        id: "p2",
        name: "Royal Bridal Lehenga Saree",
        category: "bridal",
        price: 12500,
        originalPrice: 15000,
        image: "https://images.unsplash.com/photo-1595777457583-95e059f581ce?auto=format&fit=crop&w=600&q=80",
        img: "https://images.unsplash.com/photo-1595777457583-95e059f581ce?auto=format&fit=crop&w=600&q=80",
        rating: 5, reviews: 18, isNew: true, discount: 0, stock: 2,
        description: "Bridal masterpiece with heavy embroidery and elegant drape."
    },
    {
        id: "p3",
        name: "Lavender Handloom Cotton",
        category: "cotton",
        price: 2500,
        originalPrice: 3000,
        image: "https://images.unsplash.com/photo-1583391733958-d25e6112d711?auto=format&fit=crop&w=600&q=80",
        img: "https://images.unsplash.com/photo-1583391733958-d25e6112d711?auto=format&fit=crop&w=600&q=80",
        rating: 4, reviews: 15, isNew: true, discount: 0, stock: 20,
        description: "Comfortable, breathable cotton saree for daily wear."
    },
    {
        id: "p4",
        name: "Emerald Green Party Wear Saree",
        category: "party",
        price: 4200,
        originalPrice: 5000,
        image: "https://images.unsplash.com/photo-1583391733975-fc5f5cfeb504?auto=format&fit=crop&w=600&q=80",
        img: "https://images.unsplash.com/photo-1583391733975-fc5f5cfeb504?auto=format&fit=crop&w=600&q=80",
        rating: 4.5, reviews: 28, isNew: false, discount: 16, stock: 12,
        description: "Stunning emerald green saree with sequence work."
    },
    {
        id: "p5",
        name: "Floral Print Designer Silk",
        category: "silk",
        price: 3800,
        originalPrice: 4500,
        image: "https://images.unsplash.com/photo-1596455607563-ad6193f76b1b?auto=format&fit=crop&w=600&q=80",
        img: "https://images.unsplash.com/photo-1596455607563-ad6193f76b1b?auto=format&fit=crop&w=600&q=80",
        rating: 4, reviews: 10, isNew: false, discount: 15, stock: 8,
        description: "Modern floral print on pure silk fabric."
    },
    {
        id: "p6",
        name: "Golden Tissue Silk",
        category: "silk",
        price: 6700,
        originalPrice: 7500,
        image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=600&q=80",
        img: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=600&q=80",
        rating: 5, reviews: 35, isNew: false, discount: 10, stock: 0,
        description: "Shimmering golden tissue silk for special occasions."
    }
];

const defaultOrders = [];

const defaultUsers = [
    { id: "u1", name: "Admin User", email: "admin@silksutra.com", role: "admin", password: "password123" },
    { id: "u2", name: "Priya Sharma", email: "priya@example.com", role: "customer", password: "password123" }
];

const defaultSettings = {
    storeName: "Silk Sutra",
    email: "info@silksutra.com",
    phone: "+91 98765 43210",
    address: "123 Heritage Lane, Craft Bazaar, New Delhi, Delhi 110001, India",
    currency: "₹",
    taxRate: 12,
    bannerImage: "",      // base64 or URL for homepage hero banner
    bannerTitle: "Premium Handcrafted Sarees",
    bannerSubtitle: "Authentic weaves directly from artisans across India",
    bannerLink: "shop.html"
};

// Initialize Database
function initDB() {
    // Version bump to 2.0 clears stale data
    if (localStorage.getItem('ss_db_v') !== '2.0') {
        localStorage.removeItem('ss_orders');
        localStorage.removeItem('ss_settings');
        localStorage.setItem('ss_db_v', '2.0');
    }
    if (!localStorage.getItem('ss_products')) localStorage.setItem('ss_products', JSON.stringify(defaultProducts));
    if (!localStorage.getItem('ss_orders'))   localStorage.setItem('ss_orders',   JSON.stringify(defaultOrders));
    if (!localStorage.getItem('ss_users'))    localStorage.setItem('ss_users',    JSON.stringify(defaultUsers));
    if (!localStorage.getItem('ss_settings')) localStorage.setItem('ss_settings', JSON.stringify(defaultSettings));
    if (!localStorage.getItem('ss_order_seq')) localStorage.setItem('ss_order_seq', '0');
}

// Helper: Get next sequential order number
function nextOrderId() {
    let seq = parseInt(localStorage.getItem('ss_order_seq') || '0') + 1;
    localStorage.setItem('ss_order_seq', seq.toString());
    return 'ORD-' + String(seq).padStart(3, '0');
}

// Helper Functions
const DB = {
    getProducts: () => JSON.parse(localStorage.getItem('ss_products')) || [],
    saveProducts: (products) => localStorage.setItem('ss_products', JSON.stringify(products)),

    getOrders: () => JSON.parse(localStorage.getItem('ss_orders')) || [],
    saveOrders: (orders) => localStorage.setItem('ss_orders', JSON.stringify(orders)),

    getUsers: () => JSON.parse(localStorage.getItem('ss_users')) || [],

    getSettings: () => {
        const stored = JSON.parse(localStorage.getItem('ss_settings')) || {};
        return { ...defaultSettings, ...stored };
    },
    saveSettings: (settings) => localStorage.setItem('ss_settings', JSON.stringify(settings)),

    addProduct: (product) => {
        const products = DB.getProducts();
        product.id = 'p' + Date.now();
        // Keep both image and img fields in sync
        product.img = product.image || product.img || '';
        product.image = product.img;
        products.push(product);
        DB.saveProducts(products);
        return product;
    },

    updateProduct: (id, updatedData) => {
        let products = DB.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index > -1) {
            if (updatedData.image) updatedData.img = updatedData.image;
            if (updatedData.img) updatedData.image = updatedData.img;
            products[index] = { ...products[index], ...updatedData };
            DB.saveProducts(products);
        }
    },

    deleteProduct: (id) => {
        let products = DB.getProducts();
        products = products.filter(p => p.id !== id);
        DB.saveProducts(products);
    },

    addOrder: (order) => {
        const orders = DB.getOrders();
        order.id   = nextOrderId();
        order.date = new Date().toISOString();
        orders.push(order);
        DB.saveOrders(orders);
        return order;
    },

    deleteOrder: (id) => {
        let orders = DB.getOrders();
        orders = orders.filter(o => o.id !== id);
        DB.saveOrders(orders);
    },

    updateOrderStatus: (id, status) => {
        let orders = DB.getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index > -1) {
            orders[index].status = status;
            DB.saveOrders(orders);
        }
    }
};

// Auto initialize
initDB();
