from django.views.generic.base import TemplateView

from documents.models import NewsItem,NewsIndex


class HomePageView(TemplateView):

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        news_index = NewsIndex.objects.first()
        context_data.update({'top_news':news_index.top_news_item if news_index and news_index.top_news_item else NewsItem.objects.last()})
        return context_data

    template_name = "landing_new.html"
