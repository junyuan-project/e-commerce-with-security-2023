from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from .models import Product, CustomUser
from .serializers import ProductSerializer, CustomUserSerializer
from django.shortcuts import render, redirect
from django.db import IntegrityError
import jwt
from django.conf import settings
from django.http import JsonResponse
from django.db.models import Q
from rest_framework import generics
from django.views import View
from django.utils.html import escape

class ProductListAPI(generics.ListCreateAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        search_query = self.request.query_params.get('search', None)

        if search_query:
            if not is_valid_search_query(search_query):
                return Product.objects.none()

            queryset = queryset.filter(
                Q(name__icontains=search_query) | Q(description__icontains=search_query)
            )

        return queryset

def is_valid_search_query(query):
    sql_injection_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', 'UNION', 'JOIN', 'ALTER', 'DROP', 'CREATE']

    if any(keyword in query.upper() for keyword in sql_injection_keywords):
        return False

    return True

class ValidateSearchAPI(View):
    def get(self, request, *args, **kwargs):
        search_query = request.GET.get('search', '')
        is_valid = is_valid_search_query(search_query)

        escaped_search_query = escape(search_query)

        return JsonResponse({'is_valid': is_valid, 'escaped_search_query': escaped_search_query})

class ProductDetailAPI(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class LoginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password) 

        if user:
            payload = {
                'user_id': user.id,
                'email': user.email,
            }
            access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            return Response({'token': access_token}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterAPI(APIView):
    def post(self, request):
        if request.data.get('password') != request.data.get('password2'):
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        email = request.data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer = CustomUserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Invalid registration data', 'errors': serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e:
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
