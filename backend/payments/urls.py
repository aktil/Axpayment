from django.urls import path
from .views import RegisterView, LoginView, UserView, UserViewSet, PaymentViewSet, payment_page
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserView.as_view(), name='user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('pay/<int:payment_id>/', payment_page, name='payment_page'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'payments', PaymentViewSet, basename='payment')
urlpatterns += router.urls
