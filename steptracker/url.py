from django.conf.urls import url
from django.views.generic import TemplateView, DetailView
from django.views.decorators.cache import cache_page
import views
urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name="index.html")),
    url(r'^auth/(?P<token>\w{0,50})/$', views.auth, name='auth'),
    url(r'^gentoken/$', views.gen_token, ),

]
"""urlpatterns = ['restaurant.views',
               url(r'^$', cache_page(60 * 15)(TemplateView.as_view(template_name="home.haml")), name='home'),
               url(r'^about/$', TemplateView.as_view(template_name="about.haml"), name='about'),
               url(r'^restaurants.json$', 'restaurants_json', name='json'),
               url(r'^restaurant/(?P<pk>\d+)/$',
                   DetailView.as_view(model=Restaurant, template_name="restaurant/restaurant_detail.haml"),
                   name='restaurant_detail'),
               ]
"""
