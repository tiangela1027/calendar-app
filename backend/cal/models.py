import datetime

from django.db import models
from django.utils import timezone

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=200)
    create_date = models.DateTimeField('Date Created')
    description = models.CharField(max_length=200)
    completed = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    def was_created_recently(self):
        return self.create_date >= timezone.now() - datetime.timedelta(days=1)

class Details(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    completed = models.IntegerField(default=0)

    def __str__(self):
        return self.description

