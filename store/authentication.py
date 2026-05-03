from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Customer


class CustomerJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None  # No token — let permission class decide (anonymous)

        token_str = auth_header.split(' ')[1]
        try:
            token = AccessToken(token_str)
            customer_id = token.get('customer_id')
            if not customer_id:
                raise AuthenticationFailed('Token missing customer_id claim.')
            customer = Customer.objects.get(customerid=customer_id)
            return (customer, token)
        except TokenError:
            raise AuthenticationFailed('Token is invalid or expired.')
        except Customer.DoesNotExist:
            raise AuthenticationFailed('No customer found for this token.')
