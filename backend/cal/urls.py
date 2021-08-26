from django.urls import path

from . import views

app_name = 'cal'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:task_id>/', views.details, name='details'),
    path('<int:task_id>/results/', views.results, name='results'),
    path('<int:task_id>/changeStatus/<int:status>', views.change_status, name='changeStatus'),
]