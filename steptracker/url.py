from django.conf.urls import url
from django.views.generic import TemplateView, DetailView
from django.views.decorators.cache import cache_page
import views
urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name="index.html")),
    url(r'^auth$', views.auth, name='auth'),
    url(r'^validate_token$', views.validate_token, name='validate_token'),
    url(r'^distance$', views.distance, name='distance'),
    url(r'^log_distance$', views.log_distance, name='log_distance'),
    url(r'^profile$', views.profile, name='profile'),
    url(r'^weekly_stat$', views.profile, name='weekly_stat'),
    url(r'^qr_info$', views.qr_info, name='qr_info'),
    url(r'^update_profile$', views.update_profile, name='update_profile'),
    url(r'^top_ten', views.top_ten, name='top_ten'),
    url(r'^all_time_top_ten', views.all_time_top_ten, name='all_time_top_ten'),
    url(r'^qr_list', views.qr_list, name='qr_list'),
    url(r'^my_ranking_all_time', views.my_ranking_all_time, name='my_ranking_all_time'),
    url(r'^my_ranking_weekly', views.my_ranking_weekly, name='my_ranking_weekly'),
]