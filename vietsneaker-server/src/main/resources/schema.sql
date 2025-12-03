DROP TABLE IF EXISTS verification_codes;
DROP TABLE IF EXISTS roles_users;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS purchase_items;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

CREATE TABLE brands (
    brand_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT 0
);

CREATE TABLE roles (
    role_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    is_deleted BOOLEAN DEFAULT 0,
    is_verified BOOLEAN DEFAULT 0,
    enabled BOOLEAN DEFAULT 1
);

CREATE TABLE roles_users (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    actual_price DOUBLE NOT NULL,
    sell_price DOUBLE NOT NULL,
    type VARCHAR(100),
    shoe_size VARCHAR(10), -- add shoeSize field
    stock BIGINT DEFAULT 0,
    brand_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    visible BOOLEAN DEFAULT 1,
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

CREATE TABLE cart_items (
    cart_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    total_price DOUBLE NOT NULL,
    status ENUM('PENDING','PROCESSING','SHIPPED','COMPLETED','CANCELLED','RETURNING','RETURNED') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    price DOUBLE NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- CREATE TABLE suppliers (
--     supplier_id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     address VARCHAR(255),
--     phone VARCHAR(20),
--     email VARCHAR(255),
--     is_deleted BOOLEAN DEFAULT 0
-- );

CREATE TABLE suppliers (
    supplier_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Thông tin cơ bản
    name VARCHAR(255) NOT NULL,
    supplier_type ENUM('PERSON','SHOP','WHOLESALE','CONSIGN') DEFAULT 'PERSON',  -- Loại NCC
    
    -- Liên hệ
    phone VARCHAR(20),
    email VARCHAR(255),
    zalo VARCHAR(100),
    facebook VARCHAR(255),

    -- Địa chỉ
    address VARCHAR(255),

    -- Đánh giá
    rating INT DEFAULT 5,               -- Uy tín: 1–5
    total_transactions BIGINT DEFAULT 0, -- Lịch sử giao dịch
    notes TEXT,                          -- Ghi chú nội bộ

    is_deleted BOOLEAN DEFAULT 0
);


CREATE TABLE purchases (
    purchase_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    total_price DOUBLE,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE purchase_items (
    purchase_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    supplier_id BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    price DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_id) REFERENCES purchases(purchase_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

CREATE TABLE verification_codes (
    verification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    code VARCHAR(255),
    email_sent BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
