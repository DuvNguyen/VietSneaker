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

-- Inventory Admin account
INSERT INTO users (user_id, email, password, name, phone, address, is_deleted, is_verified)
VALUES (
  7,
  'inventory.admin@vietsneaker.com',
  '$2a$10$L1NCuZpSXk83cDSSR/C9Hu3kEtI4fnQ5FngLpBwjzj2zB3aLcuejW', -- bcrypt("Admin@123")
  'Kho hàng VietSneaker',
  '0909999999',
  'Khu kho tổng VietSneaker - HCM',
  0,
  1
);


-- Roles - Users
INSERT INTO roles_users (user_id, role_id)
  VALUES (1, 1),
         (2, 1),
         (3, 1),
         (4, 1),
         (5, 1),
         (6, 1),
         (7, 3),
         (7, 2);

-- Products (sneakers)
<<<<<<< HEAD
-- INSERT INTO products (name, description, image_url, actual_price, sell_price, type, stock, brand_id, is_active, visible, is_deleted)
-- VALUES ('Nike Air Force 1', 'Giày sneaker huyền thoại của Nike', 'nike_airforce1.jpg', 2500000, 2700000, 'Casual', 50, 1, 1, 1, 0),
--        ('Adidas Ultraboost 22', 'Giày chạy bộ hiệu năng cao', 'adidas_ultraboost22.jpg', 4500000, 4800000, 'Running', 30, 2, 1, 1, 0),
--        ('Puma Suede Classic', 'Thiết kế retro, phong cách đường phố', 'puma_suede.jpg', 2000000, 2200000, 'Lifestyle', 40, 3, 1, 1, 0),
--        ('Converse Chuck Taylor 70s', 'Mẫu giày canvas cổ điển', 'converse_chuck70.jpg', 1800000, 2000000, 'Casual', 60, 4, 1, 1, 0),
--        ('Vans Old Skool', 'Sneaker skateboarding nổi tiếng', 'vans_oldskool.jpg', 1900000, 2100000, 'Skate', 55, 5, 1, 1, 0),
--        ('New Balance 550', 'Phong cách retro basketball', 'newbalance_550.jpg', 3200000, 3500000, 'Lifestyle', 25, 6, 1, 1, 0),
--        ('Reebok Classic Leather', 'Phong cách vintage từ thập niên 80', 'reebok_classic.jpg', 2200000, 2500000, 'Lifestyle', 35, 7, 1, 1, 0),
--        ('ASICS Gel-Kayano 29', 'Giày chạy bộ bền bỉ', 'asics_kayano.jpg', 4000000, 4300000, 'Running', 20, 8, 1, 1, 0),
--        ('Fila Disruptor II', 'Thiết kế hầm hố chunky', 'fila_disruptor.jpg', 2600000, 2800000, 'Streetwear', 30, 9, 1, 1, 0),
--        ('Under Armour Curry Flow 10', 'Giày bóng rổ của Stephen Curry', 'ua_curry10.jpg', 4200000, 4500000, 'Basketball', 15, 10, 1, 1, 0);

-- INSERT INTO products
-- (name, description, image_url, actual_price, sell_price, type, shoe_size, stock, brand_id, is_active, visible, is_deleted)
-- VALUES
-- ('Nike Air Force 1', 'Giày sneaker huyền thoại của Nike, condition khá tốt, vân đế gần full', 'nike_airforce1.jpg', 700000, 1200000, 'Casual', '42', 50, 1, 1, 1, 0),
-- ('Adidas Ultraboost 22', 'Giày chạy bộ hiệu năng cao', 'adidas_ultraboost22.jpg', 4500000, 4800000, 'Running', '41', 30, 2, 1, 1, 0),
-- ('Puma Suede Classic', 'Thiết kế retro, phong cách đường phố', 'puma_suede.jpg', 2000000, 2200000, 'Lifestyle', '40', 40, 3, 1, 1, 0),
-- ('Converse Chuck Taylor 70s', 'Mẫu giày canvas cổ điển', 'converse_chuck70.jpg', 1800000, 2000000, 'Casual', '42', 60, 4, 1, 1, 0),
-- ('Vans Old Skool', 'Sneaker skateboarding nổi tiếng', 'vans_oldskool.jpg', 1900000, 2100000, 'Skate', '41', 55, 5, 1, 1, 0),
-- ('New Balance 550', 'Phong cách retro basketball', 'newbalance_550.jpg', 3200000, 3500000, 'Lifestyle', '43', 25, 6, 1, 1, 0),
-- ('Reebok Classic Leather', 'Phong cách vintage từ thập niên 80', 'reebok_classic.jpg', 2200000, 2500000, 'Lifestyle', '42', 35, 7, 1, 1, 0),
-- ('ASICS Gel-Kayano 29', 'Giày chạy bộ bền bỉ', 'asics_kayano.jpg', 4000000, 4300000, 'Running', '41', 20, 8, 1, 1, 0),
-- ('Fila Disruptor II', 'Thiết kế hầm hố chunky', 'fila_disruptor.jpg', 2600000, 2800000, 'Streetwear', '40', 30, 9, 1, 1, 0),
-- ('Under Armour Curry Flow 10', 'Giày bóng rổ của Stephen Curry', 'ua_curry10.jpg', 4200000, 4500000, 'Basketball', '44', 15, 10, 1, 1, 0);

INSERT INTO products
(name, description, image_url, actual_price, sell_price, type, shoe_size, stock, brand_id, is_active, visible, is_deleted)
VALUES
('Nike Air Force 1', 'Giày sneaker huyền thoại của Nike – hàng 2hand chính hãng, **vân đế gần full**, form giữ chuẩn, upper đẹp như mới, chỉ vài vết sử dụng nhẹ.', 'nike_airforce1.jpg', 700000, 950000, 'Casual', '42', 50, 1, 1, 1, 0),
('Adidas Ultraboost 22', 'Giày chạy bộ hiệu năng cao của Adidas – hàng 2hand, đế vẫn còn bám tốt, form chưa xẹp, upper còn rất đẹp.', 'adidas_ultraboost22.jpg', 4500000, 3800000, 'Running', '41', 30, 2, 1, 1, 0),
('Puma Suede Classic', 'Thiết kế retro đường phố của Puma – hàng 2hand chính hãng, **vân đế rõ nét**, form vẫn giữ tốt, suede chỉ vài vết sử dụng nhỏ.', 'puma_suede.jpg', 2000000, 1600000, 'Lifestyle', '40', 40, 3, 1, 1, 0),
('Converse Chuck Taylor 70s', 'Mẫu giày canvas cổ điển – hàng 2hand, form ổn, đế chưa mòn nhiều, vải và đế giữ rất tốt.', 'converse_chuck70.jpg', 1800000, 1400000, 'Casual', '42', 60, 4, 1, 1, 0),
('Vans Old Skool', 'Sneaker skate nổi tiếng – hàng 2hand chính hãng, đế hơi ngả màu theo thời gian nhưng **form vẫn chuẩn**, upper còn đẹp.', 'vans_oldskool.jpg', 1900000, 1500000, 'Skate', '41', 55, 5, 1, 1, 0),
('New Balance 550', 'Phong cách retro basketball của NB – hàng 2hand, mid-sole còn dày, upper chỉ hơi nhăn, form vẫn chắc.', 'newbalance_550.jpg', 3200000, 2500000, 'Lifestyle', '43', 25, 6, 1, 1, 0),
('Reebok Classic Leather', 'Phong cách vintage từ thập niên 80 – hàng 2hand, da upper giữ tốt, chỉ có vết gấp nhỏ ở mũi, form vẫn đẹp.', 'reebok_classic.jpg', 2200000, 1700000, 'Lifestyle', '42', 35, 7, 1, 1, 0),
('ASICS Gel-Kayano 29', 'Giày chạy bộ bền bỉ – hàng 2hand, đế chưa bị sờn, form chưa xẹp, chỉ có vài vết nhỏ, cực hợp tập hoặc đi bộ.', 'asics_kayano.jpg', 4000000, 3300000, 'Running', '41', 20, 8, 1, 1, 0),
=======
INSERT INTO products
(name, description, image_url, actual_price, sell_price, type, shoe_size, stock, brand_id, is_active, visible, is_deleted)
VALUES
('Nike Air Force 1', 'Giày sneaker huyền thoại của Nike – hàng 2hand chính hãng, vân đế gần full, form giữ chuẩn, upper đẹp như mới, chỉ vài vết sử dụng nhẹ.', 'nike_airforce1.jpg', 700000, 950000, 'Casual', '40.5', 50, 1, 1, 1, 0),
('Adidas Ultraboost 22', 'Giày chạy bộ hiệu năng cao của Adidas – hàng 2hand, đế vẫn còn bám tốt, form chưa xẹp, upper còn rất đẹp.', 'adidas_ultraboost.jpg', 4500000, 3800000, 'Running', '36', 30, 2, 1, 1, 0),
('Puma Suede Classic', 'Thiết kế retro đường phố của Puma – hàng 2hand chính hãng, vân đế rõ nét, form vẫn giữ tốt, suede chỉ vài vết sử dụng nhỏ.', 'puma_suede.jpg', 2000000, 1600000, 'Lifestyle', '40', 40, 3, 1, 1, 0),
('Converse Chuck Taylor 70s', 'Mẫu giày canvas cổ điển – hàng 2hand, form ổn, đế chưa mòn nhiều, vải và đế giữ rất tốt.', 'converse_chuck70.jpg', 1800000, 1400000, 'Casual', '36.5', 60, 4, 1, 1, 0),
('Vans Old Skool', 'Sneaker skate nổi tiếng – hàng 2hand chính hãng, đế hơi ngả màu theo thời gian nhưng form vẫn chuẩn, upper còn đẹp.', 'vans_oldskool.jpg', 1900000, 1500000, 'Skate', '37', 55, 5, 1, 1, 0),
('New Balance 550', 'Phong cách retro basketball của NB – hàng 2hand, mid-sole còn dày, upper chỉ hơi nhăn, form vẫn chắc.', 'newbalance_550.jpg', 3200000, 2500000, 'Lifestyle', '40.5', 25, 6, 1, 1, 0),
('Reebok Classic Leather', 'Phong cách vintage từ thập niên 80 – hàng 2hand, da upper giữ tốt, chỉ có vết gấp nhỏ ở mũi, form vẫn đẹp.', 'reebok_classic.jpg', 2200000, 1700000, 'Lifestyle', '40', 35, 7, 1, 1, 0),
('ASICS Gel-Kayano 29', 'Giày chạy bộ bền bỉ – hàng 2hand, đế chưa bị sờn, form chưa xẹp, chỉ có vài vết nhỏ, cực hợp tập hoặc đi bộ.', 'asics_kayano.jpg', 4000000, 3300000, 'Running', '38', 20, 8, 1, 1, 0),
>>>>>>> vi
('Fila Disruptor II', 'Thiết kế chunky hầm hố Streetwear – hàng 2hand chính hãng, đế vẫn cao rõ, upper còn đẹp, form giữ tốt.', 'fila_disruptor.jpg', 2600000, 2000000, 'Streetwear', '40', 30, 9, 1, 1, 0),
('Under Armour Curry Flow 10', 'Giày bóng rổ của Stephen Curry – hàng 2hand, độ mòn đế thấp, form vẫn rất đẹp, phù hợp chơi bóng hoặc diện hàng ngày.', 'ua_curry10.jpg', 4200000, 3400000, 'Basketball', '44', 15, 10, 1, 1, 0);


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