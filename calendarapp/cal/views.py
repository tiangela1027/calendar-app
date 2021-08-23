from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
# from django.template import loader
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view

from .serializers import TaskSerializer
from .models import Task, Details

# Create your views here.
def index (request):
    return render(request, 'cal/index.html', render_all_tasks())

def details(request, task_id):
    # Example 1
    # return HttpResponse("You're looking at question %s." % task_id)

    # Example 2
    # try:
    #     details = Details.objects.get(task_id=task_id)
    # except Details.DoesNotExist:
    #     raise Http404("Details does not exist")
    # return render(request, 'cal/details.html', {'details': details})

    details = get_object_or_404(Details, task_id=task_id)
    return render(request, 'cal/details.html', {'details': details})

def results(request, task_id):
    response = "You're looking at the results of task %s."
    return HttpResponse(response % task_id)

def create(request):
    new_task = Task(title=request.POST['title'], create_date=timezone.now())
    new_task.save()
    new_description = Details(task=new_task, description=request.POST['description'], completed=0)
    new_description.save()
    return render(request, 'cal/index.html', render_all_tasks())

# helpers

def render_all_tasks():
    latest_tasks_list = Task.objects.order_by('-create_date')[:5]

    # Example 1
    # output = ', '.join([t.title for t in latest_tasks_list])

    # Example 2
    # template = loader.get_template('cal/index.html')
    # context = {
    #     'latest_tasks_list': latest_tasks_list,
    # }
    # return HttpResponse(template.render(context, request))

    context = {'latest_tasks_list': latest_tasks_list}
    return context

# api

class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
