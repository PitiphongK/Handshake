from django.contrib import admin
from superuser.models import InstitutionProfile
from AdminLists.models import Institution #keep this for further needs

class InstitutionProfileAdmin(admin.ModelAdmin):
    list_display = ['get_institution_name', 'location', 'description']
    search_fields = ['institution__name', 'location', 'description']
    list_filter = ['institution__name']

    def get_institution_name(self, obj):
        return obj.institution.name
    get_institution_name.admin_order_field = 'institution__name'
    get_institution_name.short_description = 'Institution Name'

admin.site.register(InstitutionProfile, InstitutionProfileAdmin)
