from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate
from .models import User, Payment, APIKey
from .serializers import UserSerializer, PaymentSerializer, RegisterSerializer, LoginSerializer, APIKeySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import qrcode
from io import BytesIO
from django.core.files import File
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

class AdminPanelView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        return Response({'message': 'Admin Panel'})

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'])
    def all_users(self, request):
        if request.user.is_staff:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=user)

    def perform_create(self, serializer):
        payment = serializer.save(user=self.request.user)
        self.generate_qr_code(payment)

    @action(detail=True, methods=['post'])
    def generate_qr_code(self, request, pk=None):
        payment = get_object_or_404(Payment, pk=pk)
        url = f'{settings.FRONTEND_URL}/pay/{payment.id}/'
        payment.payment_url = url

        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color='white')

        buffer = BytesIO()
        img.save(buffer)
        payment.qr_code.save(f'qr_{payment.id}.png', File(buffer), save=False)
        payment.save()

        return Response({'status': 'QR code generated', 'qr_code_url': payment.qr_code.url})

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        payment = get_object_or_404(Payment, pk=pk)
        card_number = request.data.get('card_number')
        expiry_date = request.data.get('expiry_date')
        cvv = request.data.get('cvv')

        # Реализация логики обработки платежа с использованием банковских данных

        payment.status = 'completed'
        payment.save()
        return Response({'status': 'Payment completed'})

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        payment = get_object_or_404(Payment, pk=pk)
        payment.status = 'cancelled'
        payment.save()
        return Response({'status': 'Payment cancelled'})

    @action(detail=False, methods=['get'])
    def filter_sort(self, request):
        queryset = self.get_queryset()
        status = request.query_params.get('status')
        date = request.query_params.get('date')
        amount = request.query_params.get('amount')

        if status:
            queryset = queryset.filter(status=status)
        if date:
            queryset = queryset.filter(created_at__date=date)
        if amount:
            queryset = queryset.filter(amount=amount)

        queryset = queryset.order_by('-created_at')

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class APIKeyViewSet(viewsets.ModelViewSet):
    queryset = APIKey.objects.all()
    serializer_class = APIKeySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_api_key(request):
    key = request.query_params.get('key')
    if APIKey.objects.filter(key=key, user=request.user).exists():
        return Response({'status': 'valid'})
    return Response({'status': 'invalid'}, status=400)


from django.shortcuts import render

@api_view(['GET', 'POST'])
def payment_page(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id)
    if request.method == 'POST':
        card_number = request.data.get('card_number')
        expiry_date = request.data.get('expiry_date')
        cvv = request.data.get('cvv')

        # Логика обработки платежа

        payment.status = 'completed'
        payment.save()
        return Response({'status': 'Payment completed'})
    return render(request, 'payment_page.html', {'payment': payment})
