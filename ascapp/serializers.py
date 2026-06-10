from rest_framework import serializers
from .models import Product, CustomUser

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price']

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'username': {'validators': []}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user