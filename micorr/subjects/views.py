from django.shortcuts import get_object_or_404, render
from .models import Subject


def index(request):
    subjects_list = Subject.objects.all()
    return render(request, 'subjects/index.html', {'subjects_list': subjects_list})


def detail(request, subject_id):
    subject = get_object_or_404(Subject, pk=subject_id)
    return render(request, 'subjects/detail.html', {'subject': subject})