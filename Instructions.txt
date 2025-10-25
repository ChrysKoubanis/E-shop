# Electronics E-Shop (University Group Project)

This repository contains the code for an **e-commerce website for electronic products**, originally developed as a **university group project** by a team of four students.  
This public repository is a copy of the original private group project, created to showcase the work as part of my personal portfolio.

---

## 🛠️ Setup Instructions

1) Import Products into MongoDB (Only required the first time)

   -Find the name of the MongoDB container by running on
      terminal: docker ps
      Look at the NAME of the e-shop container.
      Most likely it will be e-shop-mongo-1.

   -Copy the JSON file into the container:
      terminal: docker cp products.json e-shop-mongo-1:/products.json

   -Access the container:
      terminal: docker exec -it e-shop-mongo-1 bash

   -Import the products into MongoDB:
      terminal: mongoimport --db eshop_db --collection products --file /products.json --jsonArray
  
   -Exit the container:
      terminal: exit

2) Start the application

   terminal: docker compose up --build

3) Stop the application

   docker compose down

   
Site in link: http://127.0.0.1:5000