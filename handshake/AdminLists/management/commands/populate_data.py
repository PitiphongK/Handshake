from django.core.management.base import BaseCommand
from AdminLists.models import InterestField, Institution 

class Command(BaseCommand):
    help = 'Populates the database with initial data for InterestField and Institution models.'

    def handle(self, *args, **options):
        # fill InterestField
        interests = [
            "Animal Physiology", "Marine (offshore)", "Zoology", "Mammology", "Behavioural ecology",
            "Marine (intertidal)", "Marine mammals", "Movement ecology", "Coastal", "Chiropterology",
            "Population ecology", "Upland", "Herpetology", "Community ecology", "Lowland", "Ornithology",
            "Plant ecology", "Forest/Woodland", "Entomology", "Freshwater ecology", "Limnology",
            "Ichthyology", "Vector ecology", "Soils", "Plant scientist", "Paleobotany", "Aquaculture",
            "Peatland", "Crop science", "Agroecology", "Estuarine", "Forestry", "Statistical ecology",
            "Tundra", "Bryology", "Theoretical ecology", "Wetland", "Microbiology", "Parasitology",
            "Environmental change", "Urban", "Mycology", "Population genetics", "Bacteriology",
            "Evolutionary ecology", "Virology", "Disease ecology", "Animal welfare", "One Health",
            "Conservation biology", "Pollution biology/Toxicology", "Environment economics",
            "Biogeography", "Taxonomy/Systematics", "Genetics", "Carbon cycling",
            "Social/Human Behavioural Scientist", "Environmental Education", "Geologist",
            "Geomorphologist", "Data Scientist", "Geographer", "Geographical Information Systems expert"
        ]
        for interest_name in interests:
            InterestField.objects.get_or_create(name=interest_name)
        self.stdout.write(self.style.SUCCESS('Successfully populated InterestField data.'))

        # fill Institution
        institutions = [
            {'name': 'University of Glasgow', 'suffix': 'glasgow.ac.uk'},
            {'name': 'University of Aberdeen', 'suffix': 'abdn.ac.uk'},
            {'name': 'University of Edinburgh', 'suffix': 'ed.ac.uk'},
            {'name': 'University of Strathclyde', 'suffix': 'strath.ac.uk'},
            {'name': 'University of Stirling', 'suffix': 'stir.ac.uk'},
            {'name': 'Centre for Ecology and Hydrology', 'suffix': 'ceh.ac.uk'},
            {'name': 'Edinburgh Napier', 'suffix': 'napier.ac.uk'},
            {'name': 'University of Highlands and Islands', 'suffix': 'uhi.ac.uk'},
            {'name': 'University of Dundee', 'suffix': 'dundee.ac.uk'},
            {'name': "Scotland's Rural College", 'suffix': 'sruc.ac.uk'},
            {'name': 'Scottish Association for Marine Science', 'suffix': 'sams.ac.uk'},
            {'name': 'Nature Scot', 'suffix': 'nature.scot'},
            {'name': 'James Hutton Institute', 'suffix': 'hutton.ac.uk'},
            {'name': 'University of St Andrews', 'suffix': 'st-andrews.ac.uk'},
        ]
        for inst_data in institutions:
            Institution.objects.get_or_create(name=inst_data['name'], suffix=inst_data['suffix'])
        self.stdout.write(self.style.SUCCESS('Successfully populated Institution data.'))