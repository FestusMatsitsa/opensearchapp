from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from .forms import RegisterForm
from .models import SearchHistory
import requests
# media_app/views.py
def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        user = authenticate(username=request.POST['username'], password=request.POST['password'])
        if user:
            login(request, user)
            return redirect('home')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

# media_app/views.py
import requests
import random
from django.shortcuts import render

def home(request):
    # Fetch 20 random public domain images from Openverse
    try:
        response = requests.get("https://api.openverse.engineering/v1/images", params={
            "q": "nature",  # generic query
            "license": "cc0",  # public domain images
            "page_size": 50
        })
        data = response.json()
        images = data.get("results", [])
        random_images = random.sample(images, k=min(6, len(images)))  # pick up to 6
        random_images = [{"url": img["url"], "title": img.get("title", "")} for img in random_images]
    except Exception as e:
        print(f"[Openverse API error] {e}")
        random_images = []

    return render(request, 'home.html')



def search_media(request):
    query = request.GET.get('q')
    license_type = request.GET.get('license')
    date_from = request.GET.get('date_range_from')
    date_to = request.GET.get('date_range_to')
    page = request.GET.get('page', 1)  # Pagination: default to page 1
    
    results = []
    
    if query:
        api_url = f'https://api.openverse.org/v1/images?q={query}&page={page}'  # API URL with pagination

        SearchHistory.objects.create(user=request.user, query=query)
        
        # Add license filter
        if license_type:
            api_url += f'&license={license_type}'
        
        # Add date range filter if specified
        if date_from and date_to:
            api_url += f'&date_range={date_from},{date_to}'
        elif date_from:
            api_url += f'&date_range={date_from}'
        elif date_to:
            api_url += f'&date_range={date_to}'
        
        # Make the request to Openverse API
        response = requests.get(api_url)
        
        if response.status_code == 200:
            results = response.json().get('results', [])
        else:
            # Handle error if API request fails
            results = []
        
        # Save the search history if the user is logged in
        if request.user.is_authenticated:
            SearchHistory.objects.create(user=request.user, query=query)

        history = SearchHistory.objects.filter(user=request.user).order_by()[:10]

        context = {
        'results': results,
        'search_history': history,
    }
    return render(request, 'search.html', {'results': results, 'query': query})

def delete_search(request, term):
    recent = request.session.get('recent_searches', [])
    if term in recent:
        recent.remove(term)
        request.session['recent_searches'] = recent
    return redirect('search')

def clear_searches(request):
    request.session['recent_searches'] = []
    return redirect('search')


def view_history(request):
    history = SearchHistory.objects.filter(user=request.user).order_by('-id')
    return render(request, 'media_app/history.html', {'history': history})


def delete_history_item(request, history_id):
    item = SearchHistory.objects.filter(id=history_id, user=request.user).first()
    if item:
        item.delete()
    return redirect('view_history')