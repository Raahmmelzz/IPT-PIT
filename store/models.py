from django.db import models

from django.db import models

class Customer(models.Model):
    customerid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=50, unique=True) # <-- NEW
    email = models.EmailField(unique=True)
    number = models.CharField(max_length=20)
    password = models.CharField(max_length=255) 

    def __str__(self):
        return self.username # Updated to show username in admin

class Product(models.Model):
    productid = models.AutoField(primary_key=True)
    productname = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Base price

    def __str__(self):
        return self.productname

class Order(models.Model):
    orderid = models.AutoField(primary_key=True)
    customerid = models.ForeignKey(Customer, on_delete=models.CASCADE)
    productid = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Order-specific price
