from django.contrib import admin

from AdminLists.models import Institution, InterestActivity, InterestField


class InstitutionAdmin(admin.ModelAdmin):
    list_display = ["name", "suffix"]
    search_fields = ["name", "suffix"]


admin.site.register(Institution, InstitutionAdmin)
admin.site.register(InterestField)
admin.site.register(InterestActivity)
