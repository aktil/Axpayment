from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from payments.views import UserViewSet, PaymentViewSet, RegisterView, LoginView, UserView, APIKeyViewSet, check_api_key, AdminPanelView
from django.contrib.auth import views as auth_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import permissions
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.conf import settings
from django.conf.urls.static import static

# Swagger Schema view
schema_view = get_schema_view(
    openapi.Info(
        title="Axpayment",
        default_version='v1',
        description="API документация для платежной системы",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# DRF router
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'api-keys', APIKeyViewSet)

@require_http_methods(["GET"])
@ensure_csrf_cookie
def get_csrf_token(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response["Access-Control-Allow-Credentials"] = "true"
    return response

# URL patterns
urlpatterns = [
    path('admin/', staff_member_required(admin.site.urls)),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/user/', UserView.as_view(), name='user'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('csrf/', get_csrf_token), 
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api/admin/users/', UserViewSet.as_view({'get': 'all_users'})),
    path('api/admin/payments/', PaymentViewSet.as_view({'get': 'all_payments'})),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)