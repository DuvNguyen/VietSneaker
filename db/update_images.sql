-- SQL Script to update broken Cloudinary links with local mock images
-- Run this in your database console (e.g., MySQL Workbench, pgAdmin, or via terminal)

UPDATE products SET image_url = 'http://localhost:3000/images/products/nike_air_force_1.png' WHERE name = 'Nike Air Force 1';
UPDATE products SET image_url = 'http://localhost:3000/images/products/adidas_ultraboost_22.png' WHERE name = 'Adidas Ultraboost 22';
UPDATE products SET image_url = 'http://localhost:3000/images/products/puma_suede_classic.png' WHERE name = 'Puma Suede Classic';
UPDATE products SET image_url = 'http://localhost:3000/images/products/converse_chuck_70.png' WHERE name = 'Converse Chuck Taylor 70s';
UPDATE products SET image_url = 'http://localhost:3000/images/products/vans_old_skool.png' WHERE name = 'Vans Old Skool';
UPDATE products SET image_url = 'http://localhost:3000/images/products/new_balance_550.png' WHERE name = 'New Balance 550';
UPDATE products SET image_url = 'http://localhost:3000/images/products/reebok_classic.png' WHERE name = 'Reebok Classic Leather';
UPDATE products SET image_url = 'http://localhost:3000/images/products/asics_kayano.png' WHERE name = 'ASICS Gel-Kayano 29';
UPDATE products SET image_url = 'http://localhost:3000/images/products/fila_disruptor.png' WHERE name = 'Fila Disruptor II';
UPDATE products SET image_url = 'http://localhost:3000/images/products/ua_curry_10.png' WHERE name = 'Under Armour Curry Flow 10';
