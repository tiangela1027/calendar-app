from django.urls import path

from . import views

app_name = 'cal'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:task_id>/', views.details, name='details'),
    path('<int:task_id>/results/', views.results, name='results'),
    path('create/', views.create, name='create'),
    # path('delete/<int:task_id>', views.delete, name='delete'),
]