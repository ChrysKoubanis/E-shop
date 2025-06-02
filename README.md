Γεια σας,
   1) ΕΙΣΑΓΩΓΗ ΠΡΟΪΟΝΤΩΝ ΣΤΗΝ MONGODB (Μόνο την 1η φορά που θα μπείτε):

   Βρείτε το όνομα του κοντέινερ MongoDB ,στο terminal γράψτε:  'docker ps' και δείτε το NAME του E-shop

   Το πιο πιθανόν είναι να εμφανιστεί το όνομα e-shop-mongo-1

   *Αντηγράψτε το JSON:

   Αν το όνομα είναι e-shop-mongo-1 ,στο terminal γράψτε: docker cp products.json e-shop-mongo-1:/products.json    

   *Μπείτε στο κοντέινερ:

   Στο terminal γράψτε:  docker exec -it e-shop-mongo-1 bash

   Για να εισάγετε τα products στο terminal γράψτε: mongoimport --db eshop_db --collection products --file /products.json --jsonArray

   Μετά για να βγείτε απο το container γράψτε 'exit'

   2) ΕΚΚΙΝΗΣΗ ΤΗΣ ΕΦΑΡΜΟΓΗΣ: docker compose up --build

   3) 🛑 Για να τερματίσετε την εφαρμογή γράψτε στο terminal: docker compose down