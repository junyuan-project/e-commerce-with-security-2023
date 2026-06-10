from django.urls import path
from .views import ProductListAPI, ProductDetailAPI, LoginAPI, RegisterAPI, ValidateSearchAPI

urlpatterns = [
    path('products/', ProductListAPI.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailAPI.as_view(), name='product-detail'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('register/', RegisterAPI.as_view(), name='register'),
    path('validate_search/', ValidateSearchAPI.as_view(), name='validate_search'),
]