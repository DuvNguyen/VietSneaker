# Clockee
![Clockee logo](./assets/logo.png)

Clocke is a pet project for pratice buidling simple ecommerce system in java 
# Technologies and frameworks
- Java 17 
- Spring Boot 3.5
- Next.js 15
- Github actions 
- Test containers 
- MSSQL 2022


# Getting started
**Prerequisites**
- Docker 
- GNU Make

## Docker compose 
Services
``` 
:1080 Maildev 
:1434 MSSQL Server 
:6327 Redis 
:8080 Spring Boot http
:8081 Spring Boot https
:3000 Next.js
```

There are 2 way to run this project: 
1. Run pre-built docker image.
In root entry `clockee/` run 
``` 
make build 
```
You all set!

2. Run application in local source code 

Setup docker and docker compose then run to start mssql and mail server service and utility services. 
```
docker compose up -d 
```
No docker? setup with mssql database `clockeedb` with password for `sa` is `example_123`

Running Clockee server Spring Boot
```
cd clockee-server 
make build
```

Running Clockee client Next.js with npm 
``` 
cd clockee-ui
npm install 
npm run dev 
```

## For explore 
🚧 This project is currently in progress. [Video walkthrough](https://www.youtube.com/watch?v=4C7IJjjg0o0&list=PL6XbmwursK7Zlu8Vv41GYQTuETwrh30zr&index=1)

Seed account for test environment 
- User: `user@clockee.com`/`clockee123`
- Product admin: `admin@clockee.com`/`clockee123`
- Inventory manager: `inventory@clockee.com`/`clockee123`
- Sys admin: `sys@clockee.com`/`clockee123`

[API document](https://localhost:8081/api/swagger-ui/index.html#/)
![swagger-ui](./assets/swagger.png)
[Maildev](http://localhost:1080/#/)
![maildev](./assets/mail-dev.png)
[JobRunr](http://localhost:8000/dashboard/jobs)
![JobRunr](./assets/jobrunr.png)

# Screenshots 
<table>
    <tbody>
        <tr>
            <td>
                <img src="./assets/showcase/1. home.png" alt="Homepage"/>
                <img src="./assets/showcase/2. filter-product.png" alt="Filter Product"/>
                <img src="./assets/showcase/3. product-details.png" alt="Product Details"/>
                <img src="./assets/showcase/4. cart.png" alt="Cart"/>
                <img src="./assets/showcase/5. checkout-address.png" alt="Checkout Address"/>
                <img src="./assets/showcase/6. checkout-confirm.png" alt="Checkout Confirm"/>
                <img src="./assets/showcase/7. customer-order-history.png" alt="Customer Order History"/>
                <img src="./assets/showcase/8. sys-admin-overview.png" alt="System Admin Overview"/>
            </td>
            <td>
                <img src="./assets/showcase/9. create-login.png" alt="Create Login"/>
                <img src="./assets/showcase/10. admin-order-proccessing.png" alt="Admin Order Processing"/>
                <img src="./assets/showcase/11. revinue-order-summary.png" alt="Revenue Order Summary"/>
                <img src="./assets/showcase/12. order-email-notice.png" alt="Order Email Notice"/>
                <img src="./assets/showcase/13. customer.png" alt="Customer"/>
                <img src="./assets/showcase/14. admin-product-overview.png" alt="Admin Product Overview"/>
                <img src="./assets/showcase/15. admin-product-details.png" alt="Admin Product Details"/>
                <img src="./assets/showcase/16. supplier.png" alt="Supplier"/>
            </td>
        </tr>
    </tbody>
</table>

# License

Licensed under the MIT License

