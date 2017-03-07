from django.contrib import admin
from .models import Like, InBoard, Picture
# Register your models here.


class PictureAdmin(admin.ModelAdmin):
    exclude = ('slug',)


admin.site.register(Picture, PictureAdmin)
admin.site.register(InBoard)
admin.site.register(Like)
