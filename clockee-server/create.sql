    create table brands (
        is_deleted bit,
        brand_id bigint identity not null,
        name varchar(255) not null,
        primary key (brand_id)
    );

    create table cart_items (
        cart_item_id bigint identity not null,
        product_id bigint not null,
        quantity bigint not null,
        user_id bigint not null,
        primary key (cart_item_id)
    );

    create table order_items (
        price float(53) not null,
        order_id bigint not null,
        order_item_id bigint identity not null,
        product_id bigint not null,
        quantity bigint not null,
        primary key (order_item_id)
    );

    create table orders (
        total_price float(34) not null,
        created_at datetime2(6) not null,
        order_id bigint identity not null,
        user_id bigint not null,
        phone varchar(11) not null,
        address TEXT not null,
        status varchar(255) not null check (status in ('PENDING','PROCESSING','SHIPPED','RETURNING','RETURNED','CANCELLED','COMPLETED')),
        primary key (order_id)
    );

    create table products (
        actual_price float(34) not null,
        is_active bit,
        is_deleted bit,
        sell_price float(34) not null,
        visible bit,
        brand_id bigint not null,
        created_at datetime2(6),
        product_id bigint identity not null,
        stock BIGINT DEFAULT 0 not null,
        type varchar(50),
        description TEXT,
        image_url varchar(255),
        name varchar(255) not null,
        primary key (product_id)
    );

    create table purchases (
        price float(34) not null,
        total_price float(34) not null,
        created_at datetime2(6) not null,
        product_id bigint not null,
        purchase_id bigint identity not null,
        quantity bigint not null,
        supplier_id bigint not null,
        primary key (purchase_id)
    );

    create table roles (
        role_id bigint identity not null,
        role_name varchar(255) check (role_name in ('CUSTOMER','PRODUCT_ADMIN','INVENTORY_MANAGER')),
        primary key (role_id)
    );

    create table roles_users (
        role_id bigint not null,
        user_id bigint not null,
        primary key (role_id, user_id)
    );

    create table suppliers (
        is_deleted bit,
        supplier_id bigint identity not null,
        phone varchar(11),
        address TEXT,
        email varchar(255),
        name varchar(255) not null,
        primary key (supplier_id)
    );

    create table users (
        is_deleted bit,
        user_id bigint identity not null,
        phone varchar(20),
        address TEXT,
        email varchar(255) not null,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (user_id)
    );

    create table verification_codes (
        email_sent bit,
        user_id bigint not null,
        verification_id bigint identity not null,
        code varchar(255),
        primary key (verification_id)
    );

    create unique nonclustered index UK716hgxp60ym1lifrdgp67xt5k
       on roles (role_name) where role_name is not null;

    alter table users
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table verification_codes
       add constraint UKbf0ofef2q09iwv2jg00aygy4q unique (user_id);

    alter table cart_items
       add constraint FK1re40cjegsfvw58xrkdp6bac6
       foreign key (product_id)
       references products;

    alter table cart_items
       add constraint FK709eickf3kc0dujx3ub9i7btf
       foreign key (user_id)
       references users;

    alter table order_items
       add constraint FKbioxgbv59vetrxe0ejfubep1w
       foreign key (order_id)
       references orders;

    alter table order_items
       add constraint FKocimc7dtr037rh4ls4l95nlfi
       foreign key (product_id)
       references products;

    alter table orders
       add constraint FK32ql8ubntj5uh44ph9659tiih
       foreign key (user_id)
       references users;

    alter table products
       add constraint FKa3a4mpsfdf4d2y6r8ra3sc8mv
       foreign key (brand_id)
       references brands;

    alter table purchases
       add constraint FKcacbvw28fu31rv1vrhnkcbe28
       foreign key (product_id)
       references products;

    alter table purchases
       add constraint FK9ho3w23v5du4x0hrp6rqs1wmh
       foreign key (supplier_id)
       references suppliers;

    alter table roles_users
       add constraint FKsmos02hm32191ogexm2ljik9x
       foreign key (role_id)
       references roles;

    alter table roles_users
       add constraint FKlkcn1l0gnfshcn4rnmak73ta
       foreign key (user_id)
       references users;

    alter table verification_codes
       add constraint FKa4qo6nts1xd94owirq5evcpda
       foreign key (user_id)
       references users;
