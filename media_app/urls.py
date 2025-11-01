from django.urls import path
from . import views

# Create your URL patterns here
urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('search/', views.search_media, name='search'),
    path('delete_search/<str:term>/', views.delete_search, name='delete_search'),
    path('clear_searches/', views.clear_searches, name='clear_searches'),
    path('history/', views.view_history, name='view_history'),
    path('history/delete/<int:history_id>/', views.delete_history_item, name='delete_history'),
]
