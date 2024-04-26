# import os
# import sys

# sys.path.append(os.path.abspath('../crowdfunding'))

# # Now you can import the file from the first folder
# import settings


from decimal import Decimal
from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import SignupForm, LoginForm, CampaignForm
from django.urls import reverse
from .models import Campaign
import paypalrestsdk

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent

# Create your views here.
# Home page
PAYPAL_CLIENT_ID = 'ATVSKJJabQepqW3iDJOKgVzCVfHpDdBKx8TwOo0HzqM_9rtTrPG-BXVorrmHcySgIqbg1Qm2Xvxn7dnC'
PAYPAL_SECRET = 'EB9qpvp7NF2BHaME53BGz7PGaypp-MyDXCDk7pZHzjaVBUMgEoKkYbJ0GBOglDSW7893Kifa75OAQCk8'


def index(request):
    return campaign_list(request)


# signup page
def user_signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = SignupForm()
    return render(request, 'newUI/signup.html', {'form': form})


# login page
def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('home')
    else:
        form = LoginForm()
    return render(request, 'newUI/login.html', {'form': form})


# logout page
def user_logout(request):
    logout(request)
    return redirect('login')


# Create your views here.

def create_campaign(request):
    if request.method == 'POST':
        form = CampaignForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('campaigns')  # Redirect to campaigns list after creating a campaign
    else:
        form = CampaignForm()
    return render(request, 'newUI/create_campaign.html', {'form': form})


def campaign_list(request):
    campaigns = Campaign.objects.all()
    return render(request, 'newUI/campaign_list.html', {'campaigns': campaigns})


def campaign_details(request, campaign_id):
    campaign = get_object_or_404(Campaign, pk=campaign_id)
    file = open(BASE_DIR / "campaign_store_id.txt", "w")
    file.write(str(campaign_id))
    return render(request, 'newUI/campaign_details.html', {'campaign': campaign})


paypalrestsdk.configure({
    "mode": "sandbox",  # Change to "live" for production
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_SECRET,
})


# views.py

def checkout_payment(request):
    if request.method == 'POST':
        campaign_id = request.POST.get('campaign_id')
        if campaign_id:
            request.session['campaign_id'] = campaign_id
            return redirect('create_payment')  # Assuming the PayPal payment process starts here
    return HttpResponseBadRequest("Invalid request")  # Handle invalid requests


def create_payment(request):
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal",
        },
        "redirect_urls": {
            "return_url": request.build_absolute_uri(reverse('execute_payment')),
            "cancel_url": request.build_absolute_uri(reverse('payment_failed')),
        },
        "transactions": [
            {
                "amount": {
                    "total": "10.00",  # Total amount in USD
                    "currency": "USD",
                },
                "description": "Payment for Product/Service",
            }
        ],
    })

    if payment.create():
        return redirect(payment.links[1].href)  # Redirect to PayPal for payment
    else:
        return render(request, 'payment_failed.html')


def execute_payment(request):
    payment_id = request.GET.get('paymentId')
    payer_id = request.GET.get('PayerID')

    payment = paypalrestsdk.Payment.find(payment_id)

    if payment.execute({"payer_id": payer_id}):
        file = open(BASE_DIR / "campaign_store_id.txt", "r")
        context = file.read(1)
        campaign_id = int(context)
        print(campaign_id)
        try:
            campaign = Campaign.objects.get(pk=campaign_id)
        except Campaign.DoesNotExist:
            return render(request, 'campaign_not_found.html')  # Render an error page
        amount = payment.transactions[0].amount.total
        campaign.collected_amount += Decimal(amount)
        campaign.save()
        return render(request, 'payment_success.html')
    else:
        return render(request, 'payment_failed.html')


def payment_checkout(request):
    return render(request, 'checkout.html')


def payment_failed(request):
    return render(request, 'payment_failed.html')


def payment_success(request):
    return render(request, 'payment_success.html')
