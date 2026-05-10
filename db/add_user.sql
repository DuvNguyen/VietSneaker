-- SQL Script to add the requested user to the current database
-- Email: user@vietsneaker.com
-- Password: Admin@123

INSERT INTO users (user_id, email, password, name, phone, address, is_deleted, is_verified, enabled)
VALUES (
  9,
  'user@vietsneaker.com',
  '$2a$10$L1NCuZpSXk83cDSSR/C9Hu3kEtI4fnQ5FngLpBwjzj2zB3aLcuejW', -- bcrypt("Admin@123")
  'Khách hàng VietSneaker',
  '0911223344',
  'Số 1 Đại Lồ Thăng Long, Hà Nội',
  0,
  1,
  1
);

INSERT INTO roles_users (user_id, role_id) VALUES (9, 1);
