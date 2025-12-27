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

-- Thêm tài khoản User Test (Mật khẩu: User@123)
INSERT INTO users (user_id, email, password, name, phone, address, is_deleted, is_verified, enabled)
VALUES (
  8,
  'test.user@gmail.com',
  '$2a$10$L1NCuZpSXk83cDSSR/C9Hu3kEtI4fnQ5FngLpBwjzj2zB3aLcuejW', -- bcrypt("User@123")
  'Người Dùng Thử Nghiệm',
  '0988888888',
  '789 Cách Mạng Tháng 8, TP.HCM',
  0,
  1,
  1 -- Thêm trường enabled nếu bảng của bạn có dùng Spring Security
);

-- Products (sneakers)
INSERT INTO products 
(name, description, image_url, actual_price, sell_price, type, shoe_size, stock, brand_id, is_active, visible, is_deleted) 
VALUES 
('Nike Air Force 1', 'Giày sneaker huyền thoại của Nike – hàng 2hand chính hãng, vân đế gần full, form giữ chuẩn, upper đẹp như mới, chỉ vài vết sử dụng nhẹ.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895265/nike_airforce1_zg95sz.jpg', 700000, 950000, 'Casual', '40.5', 50, 1, 1, 1, 0),
('Adidas Ultraboost 22', 'Giày chạy bộ hiệu năng cao của Adidas – hàng 2hand, đế vẫn còn bám tốt, form chưa xẹp, upper còn rất đẹp.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895265/adidas_ultraboost_z24uqf.jpg', 1800000, 2500000, 'Running', '36', 30, 2, 1, 1, 0),
('Puma Suede Classic', 'Thiết kế retro đường phố của Puma – hàng 2hand chính hãng, vân đế rõ nét, form vẫn giữ tốt, suede chỉ vài vết sử dụng nhỏ.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895266/puma_suede_uddlgu.jpg', 800000, 1200000, 'Lifestyle', '40', 40, 3, 1, 1, 0),
('Converse Chuck Taylor 70s', 'Mẫu giày canvas cổ điển – hàng 2hand, form ổn, đế chưa mòn nhiều, vải và đế giữ rất tốt.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895265/converse_chuck70_q7z5fj.jpg', 650000, 950000, 'Casual', '36.5', 60, 4, 1, 1, 0),
('Vans Old Skool', 'Sneaker skate nổi tiếng – hàng 2hand chính hãng, đế hơi ngả màu theo thời gian nhưng form vẫn chuẩn, upper còn đẹp.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895266/vans_oldskool_yoqvks.jpg', 600000, 850000, 'Skate', '37', 55, 5, 1, 1, 0),
('New Balance 550', 'Phong cách retro basketball của NB – hàng 2hand, mid-sole còn dày, upper chỉ hơi nhăn, form vẫn chắc.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895265/newbalance_550_otvhsj.jpg', 1200000, 1800000, 'Lifestyle', '40.5', 25, 6, 1, 1, 0),
('Reebok Classic Leather', 'Phong cách vintage từ thập niên 80 – hàng 2hand, da upper giữ tốt, chỉ có vết gấp nhỏ ở mũi, form vẫn đẹp.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895266/reebok_classic_e1d3hg.jpg', 900000, 1350000, 'Lifestyle', '40', 35, 7, 1, 1, 0),
('ASICS Gel-Kayano 29', 'Giày chạy bộ bền bỉ – hàng 2hand, đế chưa bị sờn, form chưa xẹp, chỉ có vài vết nhỏ, cực hợp tập hoặc đi bộ.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895265/asics_kayano_qcybl8.jpg', 1500000, 2200000, 'Running', '38', 20, 8, 1, 1, 0),
('Fila Disruptor II', 'Thiết kế chunky hầm hố Streetwear – hàng 2hand chính hãng, đế vẫn cao rõ, upper còn đẹp, form giữ tốt.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895265/fila_disruptor_qzkjas.jpg', 700000, 1100000, 'Streetwear', '40', 30, 9, 1, 1, 0),
('Under Armour Curry Flow 10', 'Giày bóng rổ của Stephen Curry – hàng 2hand, độ mòn đế thấp, form vẫn rất đẹp, phù hợp chơi bóng hoặc diện hàng ngày.', 'https://res.cloudinary.com/dxvg97ojw/image/upload/v1765895266/ua_curry10_bngms4.jpg', 1800000, 2600000, 'Basketball', '44', 15, 10, 1, 1, 0);

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
INSERT INTO suppliers (name, supplier_type, phone, email, zalo, facebook, address, rating, total_transactions, notes, is_deleted)
VALUES
  ('Tiệm Giày Cũ Sài Gòn', 'SHOP', '0968047079', 'tgcsaigon@gmail.com', '0968047079', 'facebook.com/tgc.sneaker.saigon', 
   '208 Nguyễn Gia Trí, P.25, Bình Thạnh, TP.HCM', 4, 12, 'Sneaker 2hand chính hãng, check legit kỹ', 0),

  ('Trung Sneaker', 'SHOP', '0973614345', 'contact@trungsneaker.vn', '0973614345', 'facebook.com/trungsneaker.official',
   '14/220 Nguyễn Oanh, P.17, Gò Vấp, TP.HCM', 5, 28, 'Chuyên hàng OG, hiếm; vệ sinh giày', 0),

  ('Chuck Secondhand OG', 'SHOP', '0342713164', 'chuckog.store@gmail.com', '0342713164', 'facebook.com/chucksecondhandog',
   'B116 Nguyễn Thần Hiến, P.18, Q.4, TP.HCM', 4, 7, 'Converse 2hand 85–95% new', 0),

  ('Xóm Mê Giày', 'SHOP', '0937187613', 'xommegiay.shop@gmail.com', '0937187613', 'facebook.com/xommegiay.store',
   '6 Lý Tự Trọng, P.Bến Nghé, Q.1, TP.HCM', 3, 4, 'Giày da & sneaker 2hand mẫu ít', 0),

  ('Bèo Store', 'SHOP', '0398999181', 'contact@beostore.vn', '0398999181', 'facebook.com/beostore.2hand',
   '429/17E Lê Văn Sỹ, P.13, Q.3, TP.HCM', 4, 10, 'Giày 2hand giá mềm, nhiều size phổ thông', 0),

  ('Sneaker 2Hand Hà Nội', 'SHOP', '0912345678', 'hn.snk2hand@gmail.com', '0912345678', 'facebook.com/sneaker2hand.hn',
   '29 Trần Đăng Ninh, Cầu Giấy, Hà Nội', 5, 21, 'Chuyên giày Adidas, Nike, Vans 2hand', 0),

  ('Tiệm Sneaker Hải Phòng', 'SHOP', '0856789123', 'hp.sneaker.store@gmail.com', '0856789123', 'facebook.com/hp.sneaker2hand',
   '33 Lạch Tray, Ngô Quyền, Hải Phòng', 4, 9, 'Hàng 2hand tình trạng đẹp, giá tốt', 0),

  ('Saigon Resell Hub', 'CONSIGN', '0907778899', 'support@srhub.vn', '0907778899', 'facebook.com/saigonresellhub',
   '355 Điện Biên Phủ, Bình Thạnh, TP.HCM', 5, 15, 'Nhận ký gửi sneaker cao cấp', 0),

  ('Kho Sneaker 2hand', 'WHOLESALE', '0984456672', 'khosneaker.sale@gmail.com', '0984456672', 'facebook.com/khosneaker2hand',
   'Kho hàng: 1200 Quốc Lộ 1A, Bình Tân, TP.HCM', 4, 102, 'Chuyên sỉ giày 2hand lô lớn', 0),

  ('Minh Ký Gửi Sneaker', 'CONSIGN', '0922334556', 'minhkysneaker@gmail.com', '0922334556', 'facebook.com/minhkygui.sneaker',
   '252 Tân Sơn Nhì, Tân Phú, TP.HCM', 4, 6, 'Nhận ký gửi – chăm sóc giày trước khi bán', 0);
-- Purchases
-- INSERT INTO purchases (supplier_id, product_id, quantity, purchase_price, purchase_date)
-- VALUES (1, 1, 100, 2500000, '2024-12-01'),
--        (2, 2, 80, 4500000, '2024-12-05'),
--        (3, 4, 120, 1800000, '2024-12-10'),
--        (4, 5, 90, 1900000, '2024-12-15');   