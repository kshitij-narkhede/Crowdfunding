from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('login/', views.user_login, name='login'),
    path('signup/', views.user_signup, name='signup'),
    path('logout/', views.user_logout, name='logout'),
    path('campaigns/', views.campaign_list, name='campaigns'),
    path('campaigns/create/', views.create_campaign, name='create_campaign'),
    path('<int:campaign_id>/', views.campaign_details, name='campaign_details'),
    path('checkout/', views.payment_checkout, name='checkout_payment'),
    path('create_payment/', views.create_payment, name='create_payment'),
    path('execute_payment/', views.execute_payment, name='execute_payment'),
    path('payment_success/', views.payment_failed, name='payment_success'),
    path('payment_failed/', views.payment_failed, name='payment_failed'),
]