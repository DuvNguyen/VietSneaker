USE vietsneaker;

-- Brand (sneaker brands)
INSERT INTO brands (name, is_deleted) VALUES
('Nike', 0),
('Adidas', 0),
('Puma', 0),
('Converse', 0),
('Vans', 0),
('New Balance', 0),
('Reebok', 0),
('ASICS', 0),
('Fila', 0),
('Under Armour', 0);

-- Roles
INSERT INTO roles (role_name)
VALUES ('CUSTOMER'),
       ('PRODUCT_ADMIN'),
       ('INVENTORY_MANAGER'),
       ('SYS_ADMIN');

-- Users
INSERT INTO users (user_id, email, password, name, phone, address, is_deleted, is_verified)
VALUES (1, 'nguyen.van.a@gmail.com', 'hashedpassword1', 'Nguyễn Văn An', '0912345678', '123 Nguyễn Trãi, Hà Nội', 0, 1),
       (2, 'tran.thi.b@gmail.com', 'hashedpassword2', 'Trần Thị Bình', '0987654321', '456 Lê Lợi, TP.HCM', 0, 1),
       (3, 'le.van.c@yahoo.com', 'hashedpassword3', 'Lê Văn Cường', '0909123456', '78 Hùng Vương, Đà Nẵng', 0, 1),
       (4, 'pham.thi.d@gmail.com', 'hashedpassword4', 'Phạm Thị Dung', '0935123456', '12 Trần Phú, Huế', 0, 1),
       (5, 'hoang.van.e@hotmail.com', 'hashedpassword5', 'Hoàng Văn Em', '0978123456', '34 Nguyễn Huệ, Nha Trang', 0, 1),
       (6, 'vu.thi.f@gmail.com', 'hashedpassword6', 'Vũ Thị Phượng', '0918765432', '56 Phạm Ngũ Lão, Hà Nội', 0, 1);

-- Roles - Users
INSERT INTO roles_users (user_id, role_id)
  VALUES (1, 1),
         (2, 1),
         (3, 1),
         (4, 1),
         (5, 2),
         (6, 3);

-- Products (sneakers)
INSERT INTO products (name, description, image_url, actual_price, sell_price, type, stock, brand_id, is_active, visible, is_deleted)
VALUES ('Nike Air Force 1', 'Giày sneaker huyền thoại của Nike', 'nike_airforce1.jpg', 2500000, 2700000, 'Casual', 50, 1, 1, 1, 0),
       ('Adidas Ultraboost 22', 'Giày chạy bộ hiệu năng cao', 'adidas_ultraboost22.jpg', 4500000, 4800000, 'Running', 30, 2, 1, 1, 0),
       ('Puma Suede Classic', 'Thiết kế retro, phong cách đường phố', 'puma_suede.jpg', 2000000, 2200000, 'Lifestyle', 40, 3, 1, 1, 0),
       ('Converse Chuck Taylor 70s', 'Mẫu giày canvas cổ điển', 'converse_chuck70.jpg', 1800000, 2000000, 'Casual', 60, 4, 1, 1, 0),
       ('Vans Old Skool', 'Sneaker skateboarding nổi tiếng', 'vans_oldskool.jpg', 1900000, 2100000, 'Skate', 55, 5, 1, 1, 0),
       ('New Balance 550', 'Phong cách retro basketball', 'newbalance_550.jpg', 3200000, 3500000, 'Lifestyle', 25, 6, 1, 1, 0),
       ('Reebok Classic Leather', 'Phong cách vintage từ thập niên 80', 'reebok_classic.jpg', 2200000, 2500000, 'Lifestyle', 35, 7, 1, 1, 0),
       ('ASICS Gel-Kayano 29', 'Giày chạy bộ bền bỉ', 'asics_kayano.jpg', 4000000, 4300000, 'Running', 20, 8, 1, 1, 0),
       ('Fila Disruptor II', 'Thiết kế hầm hố chunky', 'fila_disruptor.jpg', 2600000, 2800000, 'Streetwear', 30, 9, 1, 1, 0),
       ('Under Armour Curry Flow 10', 'Giày bóng rổ của Stephen Curry', 'https://pos.nvncdn.com/6a2de0-203642/ps/20250717_uvakcnntKw.jpeg?v=1752742658', 4200000, 4500000, 'Basketball', 15, 10, 1, 1, 0);

-- Cart Items
INSERT INTO cart_items (product_id, user_id, quantity)
VALUES (1, 1, 2),
       (2, 2, 1),
       (4, 3, 1),
       (5, 4, 3),
       (6, 5, 1),
       (7, 6, 2);

-- Orders
INSERT INTO orders (user_id, created_at, address, phone, total_price, status)
VALUES (1, '2025-01-15', '123 Nguyễn Trãi, Hà Nội', '0912345678', 5400000, 'PENDING'),
       (2, '2025-01-20', '456 Lê Lợi, TP.HCM', '0987654321', 4800000, 'SHIPPED'),
       (3, '2025-02-05', '78 Hùng Vương, Đà Nẵng', '0909123456', 2000000, 'SHIPPED');

-- Order Items
INSERT INTO order_items (product_id, order_id, quantity, price)
VALUES (1, 1, 2, 2700000),
       (2, 2, 1, 4800000),
       (4, 3, 1, 2000000);

-- Suppliers
INSERT INTO suppliers (name, address, phone, email, is_deleted)
VALUES ('Công ty Nike VN', '12 Nguyễn Trãi, Hà Nội', '0241234567', 'nikevn@gmail.com', 0),
       ('Công ty Adidas VN', '45 Lê Lợi, TP.HCM', '0289876543', 'adidasvn@gmail.com', 0),
       ('Công ty Converse VN', '67 Hai Bà Trưng, Đà Nẵng', '0236123456', 'conversevn@gmail.com', 0),
       ('Nhà phân phối Vans VN', '89 Điện Biên Phủ, Cần Thơ', '0292233445', 'vansvn@gmail.com', 0);

-- Purchases
-- INSERT INTO purchases (supplier_id, product_id, quantity, purchase_price, purchase_date)
-- VALUES (1, 1, 100, 2500000, '2024-12-01'),
--        (2, 2, 80, 4500000, '2024-12-05'),
--        (3, 4, 120, 1800000, '2024-12-10'),
--        (4, 5, 90, 1900000, '2024-12-15');   

