"""
URL configuration for outpostapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from characters import urls as character_urls
from campaigns import urls as campaign_urls
from .views import RegisterView
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('api/characters/', include(character_urls)),
    path('api/campaigns/', include(campaign_urls)),
    path('api/token/',
        jwt_views.TokenObtainPairView.as_view(),
        name ='token_obtain_pair'),
    path('api/token/refresh/',
        jwt_views.TokenRefreshView.as_view(),
        name ='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='auth_register'),

]
