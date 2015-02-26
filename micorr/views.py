from django.views.generic.base import TemplateView
from artefacts.models import Metal, Artefact, CorrosionForm, Environment


class HomePageView(TemplateView):

    template_name = "landing_new.html"

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        context['metalfamilies'] = Metal.objects.filter(id__in=Artefact.objects.values_list("metal1").distinct())
        context['corrosionforms'] = CorrosionForm.objects.all()
        context['environments'] = Environment.objects.all()
        return context