# coding=utf-8
import os
import uuid

from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from contacts.models import Contact
from users.models import User
from django.conf import settings
from django_extensions.db.models import TimeStampedModel
from tinymce import models as tinymce_models
from cities_light.models import City

from artefacts import get_img_storage_path, get_img_storage_path_stratigraphy, get_doc_storage_path

from wagtail.snippets.models import register_snippet
from wagtail.admin.edit_handlers import FieldPanel

from .year_field import YearField


class Element(TimeStampedModel):
    symbol = models.CharField(max_length=2, blank=False, unique=True, help_text='Symbol of the element')
    name = models.CharField(max_length=50, blank=False, help_text='Name of the element')
    phase = models.CharField(max_length=10, blank=True, help_text='Natural phase of the element at room temperature')
    category = models.CharField(max_length=50, blank=True, help_text='Category of the element')
    number = models.IntegerField(blank=False, null=False, help_text='Atomic number of the element')

    def __str__(self):
        return self.symbol



class Alloy(TimeStampedModel):
    """
    The artefact alloy
    """
    order = models.IntegerField(blank=True, null=True, help_text='The purity of the metal. The lower, the purer the metal is')
    name = models.CharField(max_length=100, blank=True, help_text='The artefact alloy')

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Alloy'
        verbose_name_plural = 'Alloys'

    def __str__(self):
        return self.name


class Type(TimeStampedModel):
    """
    What the artefact was used for
    """
    name = models.CharField(max_length=200, blank=True, help_text='What the artefact was used for')

    class Meta:
        ordering = ['name']
        verbose_name = 'Type'
        verbose_name_plural = 'Types'

    def __str__(self):
        return self.name


class Origin(TimeStampedModel):
    """
    Where the artefact was located
    """
    site = models.CharField(max_length=100, blank=True, verbose_name="site/object",
                            help_text='The place where the artefact was located or the object to which the section considered belongs to')
    city = models.ForeignKey(City, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The city where the artefact was located (optional for objects)')

    def origin_verbose_description(self):
        origin = []
        if self.site:
            origin.append(self.site)
        if self.city:
            origin.append(self.city.name)
            origin.append(self.city.region.name)
            origin.append(self.city.country.name)
        return ", ".join(origin)

    class Meta:
        ordering = ['site']
        verbose_name = 'Origin'
        verbose_name_plural = 'Origins'

    def __str__(self):
        return self.origin_verbose_description()


class RecoveringDate(TimeStampedModel):
    """
    The date when the artefact was found
    """
    date = models.CharField(max_length=200, blank=True, help_text='The date when the artefact was found')

    class Meta:
        verbose_name = 'Recovering Date'
        verbose_name_plural = 'Recovering Dates'

    def __str__(self):
        return self.date


class ChronologyCategory(TimeStampedModel):
    """
    The dating of the artefact
    """
    order = models.IntegerField(blank=True, null=True, help_text='The category chronology')
    name = models.CharField(max_length=100, blank=True, help_text='The dating of the artefact')
    tpq = YearField(blank=True, default=0, help_text='Category TPQ (Terminus post quem) e.g. "3000 B.C."')
    taq = YearField(blank=True, default=0, help_text='Category TAQ (Terminus ante quem) e.g. "200 A.D."')

    class Meta:
        ordering = ['order']
        verbose_name = 'Chronology Category'
        verbose_name_plural = 'Chronology Categories'

    def __str__(self):
        return self.name




class Environment(TimeStampedModel):
    """
    What the burial conditions of the artefact were
    """
    name = models.CharField(max_length=100, blank=True, help_text='The burial conditions of the artefact')

    class Meta:
        ordering = ['name']
        verbose_name = 'Environment'
        verbose_name_plural = 'Environments'

    def __str__(self):
        return self.name


class Technology(TimeStampedModel):
    """
    The manufacturing techniques used
    """
    name = models.CharField(max_length=100, blank=True, help_text='The manufacturing techniques used')

    class Meta:
        ordering = ['name']
        verbose_name = 'Technology'
        verbose_name_plural = 'Technologies'

    def __str__(self):
        return self.name


class Microstructure(TimeStampedModel):
    """
    What the artefact is made of
    """
    name = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Microstructure'
        verbose_name_plural = 'Microstructures'

    def __str__(self):
        return self.name


class CorrosionForm(TimeStampedModel):
    """
    The corrosion form observed
    """
    form = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['form']
        verbose_name = 'Corrosion Form'
        verbose_name_plural = 'Corrosion Forms'

    def __str__(self):
        return self.form


class CorrosionType(TimeStampedModel):
    """
    The corrosion type observed
    """
    type = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['type']
        verbose_name = 'Corrosion Type'
        verbose_name_plural = 'Corrosion Types'

    def __str__(self):
        return self.type

class Object(TimeStampedModel):
    """
    An object can be linked to more than one card (artefact)
    """
    name = models.CharField(max_length=100, verbose_name='name', blank=True, default='', help_text='Name of the object')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.deletion.CASCADE, verbose_name="user's object", blank=True, null=True,
                             help_text='The user who entered the object into the database')

    class Meta:
        ordering = ['name']
        verbose_name = 'Object'
        verbose_name_plural = 'Objects'

    def __str__(self):
        return self.name if len(self.name) else '[blank]'

class Artefact(TimeStampedModel):
    """
    An artefact has many foreign keys, corresponding to its characteristics55
    """
    # Own fields
    """name = models.CharField(max_length=100, verbose_name='name', blank=True, default='', help_text='Name of the artefact')"""
    description = tinymce_models.HTMLField(verbose_name='description of artefact', blank=True, help_text='A short description of the artefact. Can also include its general appearance (colour, presence or not of a corrosion layer, missing parts, large cracks, etc.)')
    inventory_number = models.CharField(max_length=100, verbose_name='inv. Number', blank=True, default='', help_text='The inventory number of the artefact')
    recorded_conservation_data = models.CharField(max_length=500, blank=True, default='', help_text='A brief description of the conservation treatment applied if any with literature references (Names of authors, year)')
    sample_description = tinymce_models.HTMLField(verbose_name='description of sample', blank=True, default='', help_text='Information on the sample, the way it was obtained, its condition (presence or not of corrosion layers) and dimensions')
    sample_number = models.CharField(max_length=100, verbose_name='lab number of sample', blank=True, default='', help_text='The inventory number of the artefact sample')
    date_aim_sampling = models.CharField(max_length=200, verbose_name='date and aim of sampling', blank=True, default='', help_text='The date and aim of sampling')
    validated = models.NullBooleanField(default=None, blank=True, null=True)
    published = models.BooleanField(default=False)

    # Foreign Keys
    object = models.ForeignKey(Object, on_delete=models.deletion.CASCADE, verbose_name='object described', blank=True, null=True, help_text='Name of the artefact')
    author = models.ManyToManyField(Contact, verbose_name='authors', blank=True, related_name='artefacts', help_text='The author(s) of this file is (are) responsible for the information provided. Author(s) should provide after the abbreviation of their institution affiliation their last name and initial of their first name in brackets such as HE-Arc CR (Degrigny C.). Hold down "Control", or "Command" on a Mac, to select more than one')
    metal_e_1 = models.ForeignKey(Element, on_delete=models.deletion.CASCADE, verbose_name='first metal element', blank=True, null=True, related_name='first_metal_artefacts', help_text='The primary metal element of the artefact')
    metal_e_x = models.ManyToManyField(Element, verbose_name='other metal elements', blank=True, related_name='other_metal_artefacts', help_text='The other metal elements of the artefact, several elements can be selected by clicking on Ctrl + elements selected')
    alloy = models.ForeignKey(Alloy, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The alloy the artefact is made of')
    type = models.ForeignKey(Type, on_delete=models.deletion.CASCADE, verbose_name='type of artefact', blank=True, null=True,
                             help_text='The name of the artefact, its typology')
    origin = models.ForeignKey(Origin, on_delete=models.deletion.CASCADE, blank=True, null=True, related_name='artefacts',
                               help_text='The place, city and country where the artefact comes from or the object to which the section considered belongs to')
    recovering_date = models.ForeignKey(RecoveringDate, on_delete=models.deletion.CASCADE, verbose_name='date of recovering', blank=True, null=True, help_text='The date of excavation for archaeological objects, of production and use for other artefacts')
    chronology_category = models.ForeignKey(ChronologyCategory, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='A general dating of the artefact')
    chronology_tpq = YearField( blank=True, default=0, help_text='Dating of artefact TPQ (Terminus post quem) e.g. "3000 B.C."')
    chronology_taq = YearField( blank=True, default=0, help_text='Dating of artefact TAQ (Terminus ante quem) e.g. "200 A.D."')
    chronology_comment = models.CharField(max_length=100, blank=True, default='', help_text='Dating of artefact comment')

    environment = models.ForeignKey(Environment, on_delete=models.deletion.CASCADE, verbose_name='burial conditions / environment', blank=True, null=True,
                                         help_text='The environment where the artefact was found')
    location = models.ForeignKey(Contact, on_delete=models.deletion.CASCADE, verbose_name='artefact location', blank=True, null=True, related_name='artefacts_locations', help_text='The actual location of the artefact')
    owner = models.ForeignKey(Contact, on_delete=models.deletion.CASCADE, blank=True, null=True, related_name='artefacts_owners', help_text='The owner of the artefact')
    technology = models.ForeignKey(Technology, on_delete=models.deletion.CASCADE, blank=True, null=True,
                                   help_text='The manufacturing techniques used to produce the artefact')
    sample_location = models.ForeignKey(Contact, on_delete=models.deletion.CASCADE, blank=True, null=True, related_name='sample_location', help_text='The actual location of the artefact sample')
    responsible_institution = models.ForeignKey(Contact, on_delete=models.deletion.CASCADE, blank=True, null=True, related_name='responsible_institution', help_text='The responsible institution for the artefact sample')
    microstructure = models.ForeignKey(Microstructure, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='Microstructure of the metal')
    corrosion_form = models.ForeignKey(CorrosionForm, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='Based on observation')
    corrosion_type = models.ForeignKey(CorrosionType, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='Based on literature')
    parent = models.ForeignKey('self', on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The card from which this card is the child')


    class Meta:
        verbose_name = 'Artefact'
        verbose_name_plural = 'Artefacts'
        ordering = ['metal_e_1', 'alloy', 'chronology_category', 'type']

    def get_authors(self):
        authors_list = []
        for author in self.author.all():
            authors_list.append("{0}. {1} ({2}, {3})".format(author.name, author.surname,
                                                                  author.organization_name,
                                                                  author.city))
        return " & ".join(authors_list)

    def get_authors_email(self):
        email_list = []
        for author in self.author.all():
            email_list.append(author.email)
        return email_list

    def artefact_verbose_description(self):
        artefact = []
        if self.inventory_number:
            artefact.append(self.inventory_number)
        if self.alloy:
            artefact.append(self.alloy.name)
        if self.chronology_category:
            artefact.append(self.chronology_category.name)
        if self.origin:
            if self.origin.city:
                artefact.append(self.origin.city.country.name)
        return " - ".join(artefact)

    def artefact_verbose_description_short(self):
        artefact = [self.object.name]
        if self.alloy:
            artefact.append(self.alloy.name)
        if self.chronology_category:
            artefact.append(self.chronology_category.name)
        if self.origin:
            if self.origin.city:
                if self.origin.city.country:
                    artefact.append(self.origin.city.country.name)
        return " - ".join(artefact)

    def __str__(self):
        return self.artefact_verbose_description()

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('artefacts:artefact-detail', args=[str(self.id)])


class SectionCategory(TimeStampedModel):
    """
    A section belongs to a section category, which can be i.e. "Sample" or "References"
    """
    ARTEFACT = 'AR'
    DESCRIPTION = 'DE'
    SAMPLE = 'SA'
    ANALYSIS_AND_RESULTS = 'AN'
    SYNTHESIS = 'SY'
    CONCLUSION = 'CO'
    REFERENCES = 'RE'
    SECTION_CATEGORY_CHOICES = (
        (ARTEFACT, 'Artefact'),
        (DESCRIPTION, 'Description'),
        (SAMPLE, 'Sample'),
        (ANALYSIS_AND_RESULTS, 'Analysis and Results'),
        (SYNTHESIS, 'Synthesis'),
        (CONCLUSION, 'Conclusion'),
        (REFERENCES, 'References'),
    )
    page_template = models.IntegerField(blank=False, null=False, default=1, help_text='Page template identifier')
    name = models.CharField(max_length=2, choices=SECTION_CATEGORY_CHOICES)
    order = models.IntegerField(blank=True, null=True, help_text='The order of a section category for a given artefact')

    class Meta:
        ordering = ['order']
        verbose_name = 'Section Category'
        verbose_name_plural = 'Section Categories'
        unique_together = (("page_template", "order"), ("page_template", "name"))

    def __str__(self):
        return self.name


class SectionTemplate(TimeStampedModel):
    page_template = models.IntegerField(blank=False, null=False, default=1, help_text='Page template identifier')
    section_category = models.ForeignKey(SectionCategory, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The corresponding section category')#section_category = enumfields.EnumField(SectionCat, max_lentgh=2, help_text='Category of the section')
    title = models.CharField(max_length=100, blank=True, default='', help_text='The section title')
    title_title = models.TextField(blank=True, default='', help_text='Text displayed when mouse is hovering title')
    fieldset = models.CharField(max_length=50, blank=True, default='',
                                help_text='Name of the Form fieldset associated with the section (if any)')
    is_fieldset_first = models.BooleanField(default=False,  help_text='If true fieldset displayed before images and stratigraphies in section')
    order = models.IntegerField(blank=False, null=False, default=1,
                                help_text='The order of the section in page template')
    has_content = models.BooleanField(default=False)
    content_help_text = models.TextField(blank=True, default='', help_text='Help text of content for author')

    has_complementary_information = models.BooleanField(default=False)
    complementary_information_help_text = models.TextField(blank=True, default='', help_text='Help text of complementary information for author')

    has_images = models.BooleanField(default=False)
    images_help_text = models.TextField(blank=True, default='', help_text='Help text displayed under images "+"')
    images_title = models.TextField(blank=True, default='Add a picture or a drawing', help_text='text displayed when mouse is hovering images "+" ')

    has_stratigraphies = models.BooleanField(default=False)
    stratigraphies_help_text = models.TextField(blank=True, default='', help_text='Help text displayed under stratigraphies "+"')
    stratigraphies_title = models.TextField(blank=True, default='Add a stratigraphy', help_text='text displayed when mouse is hovering stratigraphies "+" ')


    class Meta:
        ordering = ['order']
        verbose_name = 'Section Template'
        verbose_name_plural = 'Section Templates'
        unique_together = ("page_template", "order")

    def __str__(self):
        return "%d, %s, %s, %s" % (self.page_template, self.order, self.section_category, self.title)


class Section(TimeStampedModel):
    """
    An artefact may have many sections with images, stratigraphies inside
    """
    artefact = models.ForeignKey(Artefact, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The corresponding artefact')
    template = models.ForeignKey(SectionTemplate, on_delete=models.SET_NULL,blank=True, null=True, default=None, help_text='The Section template')
    content = tinymce_models.HTMLField(blank=True, help_text='The content of the section')
    complementary_information = tinymce_models.HTMLField(blank=True, default='', help_text='Complementary information')

    @property
    def order(self):
        return self.template.order

    class Meta:
        ordering = ['template__order']
        verbose_name = 'Section'
        verbose_name_plural = 'Sections'

    def __str__(self):
        return "%s, %s, %s" % (self.artefact, self.template.section_category, self.template.title)



class Image(TimeStampedModel):
    """
    An image refers to a section
    """
    section = models.ForeignKey(Section, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The corresponding section')
    image = models.ImageField(upload_to=get_img_storage_path, blank=True, null=True, help_text='The image file')
    legend = models.CharField(max_length=500, blank=True, help_text='The image description')
    credit = models.CharField(max_length=200, blank=True, help_text='Identifies the copyright holder of the image')
    credit_url = models.CharField(max_length=500, blank=True, help_text='Optional URL associated with the credit line')
    order = models.IntegerField(blank=True, null=True, help_text='The order of an image for a given section')

    class Meta:
        ordering = ['order']
        verbose_name = 'Image'
        verbose_name_plural = 'Images'

    def __str__(self):
        return self.legend



class Stratigraphy(TimeStampedModel):
    """
    An artefact can be represented by one or more stratigraphies
    """
    # caution stratigraphies are not linked directly to artefact anymore
    # but indirectly through section
    # todo migrate remaining old stratigraphy_set found in Artefact to section ?

    BINOCULAR = 'BI'
    CROSS_SECTION = 'CS'
    OBSERVATION_MODE_CHOICES = (
        (BINOCULAR, 'Binocular'),
        (CROSS_SECTION, 'Cross section'),
    )

    artefact = models.ForeignKey(Artefact, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The artefact the stratigraphy represents')
    section = models.ForeignKey(Section, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The section in which the stratigraphy is displayed')
    order = models.IntegerField(blank=True, null=True, help_text='The order of a stratigraphy for a given artefact')
    uid = models.CharField(max_length=500, blank=True, null=True, help_text='The unique identifier of the stratigraphy')
    url = models.CharField(max_length=500, blank=True, null=True, help_text='The url that leads to the corresponding stratigraphy in the tool')
    observationMode = models.CharField(max_length=2, choices=OBSERVATION_MODE_CHOICES, default=BINOCULAR)
    colourFamily = models.CharField(max_length=100,  default='colourFamily')
    image = models.ImageField(upload_to=get_img_storage_path_stratigraphy, blank=True, null=True, help_text='The image file for a stratigraphy')
    legend = models.CharField(max_length=500, blank=True, help_text='The stratigraphy description')
    class Meta:
        ordering = ['artefact', 'order']
        verbose_name = 'Stratigraphy'
        verbose_name_plural = 'Stratigraphies'

    def __str__(self):
        return self.uid


class Document(TimeStampedModel):
    """
    A document (PDF, Word, ...) can be attached to an artefact to add information
    """
    artefact = models.ForeignKey(Artefact, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The corresponding artefact')
    document = models.FileField(upload_to=get_doc_storage_path, help_text='The attached document')
    name = models.CharField(max_length=100, blank=True, help_text='The document name')

    def extension(self):
        name, extension = os.path.splitext(self.document.name)
        if 'pdf' in extension:
            return 'pdf'
        if 'doc' in extension:
            return 'word'
        if 'xls' in extension:
            return 'excel'
        if 'ppt' in extension:
            return 'powerpoint'
        if ('zip' or 'rar') in extension:
            return 'archive'
        if ('jpg' or 'jpeg' or 'gif' or 'bmp' or 'png') in extension:
            return 'image'
        if 'txt' in extension:
            return 'text'
        return ''

    class Meta:
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'

    def __str__(self):
        return self.name


class TokenManager(models.Manager):
    def create_token(self, right, artefact, user, comment, recipient):
        token = self.create(right=right,
                            artefact=artefact,
                            uuid=str(uuid.uuid4()),
                            user=user,
                            comment=comment,
                            recipient=recipient)
        return token

    def get_token(self, recipient):
        token = self.get(recipient=recipient)


class Token(TimeStampedModel):
    """
    A token is used to give a read or write right when you share an artefact
    """

    READ = 'R'
    COMMENT = 'W' # we keep 'W' code for COMMENT for compatibility purpose (COMMENT mode was named WRITE before)
    EDIT = 'E'
    RIGHT_CHOICES = (
        (READ, 'Read only'),
        (COMMENT, 'Read and comment'),
        (EDIT, 'Edit (Read/Write)'),
    )
    uuid = models.CharField(max_length=50)
    right = models.CharField(max_length=1, choices=RIGHT_CHOICES, default=READ)
    comment = models.CharField(max_length=100, null=True)
    already_used = models.BooleanField(default=False)
    recipient = models.CharField(max_length=100)
    link = models.CharField(max_length=200, null=True)
    hidden_by_author = models.BooleanField(default=False)
    hidden_by_recipient = models.BooleanField(default=False)
    read = models.BooleanField(default=False)

    # Foreign Keys
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.deletion.CASCADE, verbose_name="user's object", blank=True, null=True)
    artefact = models.ForeignKey(Artefact, on_delete=models.CASCADE, null=True, help_text='The shared artefact')


    tokenManager = TokenManager()

    class Meta:
        verbose_name = 'Token'
        verbose_name_plural = 'Tokens'

    def __str__(self):
        return "Token {} with {} rights, for artefact {} by user {}".format(
            self.uuid, self.right, self.artefact.object.name, self.user.name)


class Publication(TimeStampedModel) :
    """
    An user can send an artefact for publication
    """

    #Own field
    comment_to_user=models.TextField(blank=True, null=True, help_text='A comment send to the user from the analyzer of the artefact')
    comment_delegation=models.TextField(blank=True, null=True, help_text='A comment from the main administrator to the delegated administrator')
    decision_taken=models.BooleanField(default=False)
    decision_delegated_user = models.NullBooleanField(default=None, blank=True, null=True)
    read = models.BooleanField(default=False)

    # Foreign keys
    user = models.ForeignKey(User, on_delete=models.deletion.CASCADE, related_name='main_user', blank=True, help_text='User analyzing the artefact')
    artefact = models.ForeignKey(Artefact, on_delete=models.deletion.CASCADE, blank=True, help_text='Artefact card sent for publication')
    delegated_user = models.ForeignKey(User, on_delete=models.deletion.CASCADE, related_name='delegated_user', blank=True, null=True, help_text='Delegated user for the analyzis of the artefact')

    class Meta:
        verbose_name='Publication'
        verbose_name_plural='Publications'

class Field(TimeStampedModel):
    """
    A field is a part of an artefact
    """
    name = models.CharField(max_length=200, blank=True, help_text='A field of the artefact card')
    title = models.CharField(max_length=200, blank=True, help_text='A field for the name without spaces')

    class Meta:
        verbose_name = 'Field'
        verbose_name_plural = 'Fields'

    def __str__(self):
        return self.name

class Collaboration_comment(TimeStampedModel):
    """
    A comment allow author to collaborate with collaborators and discuss an artefact
    """

    #Own fields
    comment = models.TextField()
    sent = models.BooleanField(default=False)
    read = models.BooleanField(default=False)

    #Foreign keys
    content_type = models.ForeignKey(ContentType, on_delete=models.deletion.CASCADE, blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, help_text='The comment from which this comment is the child')
    field = models.ForeignKey(Field, on_delete=models.deletion.CASCADE, blank=True, null=True, help_text='The field concerned by the comment')
    fieldset_name =  models.CharField(max_length=80, null=True, blank=True)
    field_name = models.CharField(max_length=80, null=True, blank=True)
    object_model_id = models.PositiveIntegerField(blank=True, null=True)
    content_object = GenericForeignKey('content_type', 'object_model_id')
    user = models.ForeignKey(User, on_delete=models.deletion.CASCADE, related_name='user_commenting', blank=True, null=True, help_text='The user who wrote the comment')
    token_for_section = models.ForeignKey(Token, on_delete=models.deletion.CASCADE, related_name="token_for_section", blank=True, null=True, help_text='The token that allow to filter comments for a section from differents tokens')

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'

    def delete(self, *args, **kwargs):
        if self.parent:
            # self has parent we update its children's parent before deleting
            # else (no parent) children parents will be set to Null by on_delete SET_NULL
            children = self.__class__.objects.filter(parent_id=self._get_pk_val())
            for child in children:
                child.parent = self.parent
                child.save()
        super(Collaboration_comment,self).delete(*args, **kwargs)

class FormDescription(models.Model):
    form = models.CharField(max_length=80)
    field = models.CharField(max_length=80,unique=True)
    name = models.CharField(max_length=255)
    text = models.TextField()
    instructions = models.TextField(default='')
    panels = [
        FieldPanel('field'),
        FieldPanel('name'),
        FieldPanel('text'),
        FieldPanel('instructions')
    ]

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        from artefacts.forms import ArtefactForm
        super(FormDescription, self).save(*args, **kwargs)
        ArtefactForm.update_fields()

    def __str__(self):
        return self.name

class ArtefactFormManager(models.Manager):
    def get_queryset(self):
        return super(ArtefactFormManager,self).get_queryset().filter(form='ArtefactForm')

@register_snippet
class ArtefactFormDescription(FormDescription):
    def __init__(self, *args, **kwargs):
        self._meta.get_field('form').default = "ArtefactForm"
        super(ArtefactFormDescription, self).__init__(*args, **kwargs)
    objects = ArtefactFormManager()

    class Meta:
        proxy = True
