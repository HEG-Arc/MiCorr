# -*- coding: UTF-8 -*-
# models.py
#
# Copyright (C) 2014 HES-SO//HEG Arc
#
# Author(s): Cédric Gaspoz <cedric.gaspoz@he-arc.ch>
#
# This file is part of MiCorr.
#
# MiCorr is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# MiCorr is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with MiCorr. If not, see <http://www.gnu.org/licenses/>.

# Stdlib imports

# Core Django imports
from django.db import models

# Third-party app imports
from wagtail.core.models import Page, Orderable
from wagtail.core.fields import RichTextField, StreamField
from wagtail.admin.edit_handlers import FieldPanel, MultiFieldPanel, InlinePanel, PageChooserPanel, StreamFieldPanel
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.images.models import Image
from wagtail.documents.edit_handlers import DocumentChooserPanel
from wagtail.snippets.models import register_snippet
from wagtail.contrib.forms.models import AbstractEmailForm, AbstractFormField
from wagtail.search import index

from modelcluster.fields import ParentalKey
from modelcluster.tags import ClusterTaggableManager

from wagtail.core import blocks
from wagtail.admin.edit_handlers import FieldPanel, StreamFieldPanel
from wagtail.images.blocks import ImageChooserBlock
from wagtail.embeds.blocks import EmbedBlock
# MiCorr imports


# A couple of abstract classes that contain commonly used fields

class LinkFields(models.Model):
    link_external = models.URLField("External link", blank=True)
    link_page = models.ForeignKey(
        'wagtailcore.Page',
        on_delete=models.deletion.CASCADE,
        null=True,
        blank=True,
        related_name='+'
    )
    link_document = models.ForeignKey(
        'wagtaildocs.Document',
        on_delete=models.deletion.CASCADE,
        null=True,
        blank=True,
        related_name='+'
    )

    @property
    def link(self):
        if self.link_page:
            return self.link_page.url
        elif self.link_document:
            return self.link_document.url
        else:
            return self.link_external

    panels = [
        FieldPanel('link_external'),
        PageChooserPanel('link_page'),
        DocumentChooserPanel('link_document'),
    ]

    class Meta:
        abstract = True


class RelatedLink(LinkFields):
    title = models.CharField(max_length=255, help_text="Link title")

    panels = [
        FieldPanel('title'),
        MultiFieldPanel(LinkFields.panels, "Link"),
    ]

    class Meta:
        abstract = True

# Generic index page


class GenericIndexPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('documents.GenericIndexPage', on_delete=models.deletion.CASCADE, related_name='related_links')


class GenericIndexPage(Page):
    intro = RichTextField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + [
        index.SearchField('intro'),
    ]

GenericIndexPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    InlinePanel('related_links', label="Related links"),
]

GenericIndexPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]

# Generic page


class GenericPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('documents.GenericPage', on_delete=models.deletion.CASCADE, related_name='related_links')


class GenericPage(Page):
    intro = RichTextField(blank=True)
    body = RichTextField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + [
        index.SearchField('intro'),
        index.SearchField('body'),
    ]

    class Meta:
        #description = "A page that can be used to display generic TITLE > ABSTRACT > BODY content."
        verbose_name = "Generic page"

GenericPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    FieldPanel('body', classname="full"),
    InlinePanel('related_links', label="Related links"),
]

GenericPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]

#Steamfield Page

class StreamfieldPage(Page):
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    body = StreamField([
        ('heading', blocks.CharBlock(classname="full title",template="documents/blocks/heading.html")),
        ('paragraph', blocks.RichTextBlock()),
        ('rawparagraph', blocks.RawHTMLBlock()),
        ('image', ImageChooserBlock()),
        ('video', EmbedBlock()),
        ('figure', blocks.StreamBlock(
            [
                ('image', ImageChooserBlock()),
                ('video', EmbedBlock()),
                ('meta', blocks.StructBlock([
                    ('fignum', blocks.IntegerBlock()),
                    ('legend', blocks.TextBlock()),
                    ('credit', blocks.CharBlock()),
                ])),
            ],
            icon='cogs'
        )),
        ('animation',blocks.StaticBlock(
            admin_text='Default tour animation: no configuration needed.',
            # or admin_text=mark_safe('<b>Latest posts</b>: no configuration needed.'),
            template='documents/blocks/animation.html'))
    ])

    content_panels = Page.content_panels + [
        StreamFieldPanel('body'),
    ]
    promote_panels = Page.promote_panels + [
        ImageChooserPanel('feed_image'),
    ]
# Documentation index page


class HelpIndexPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('documents.HelpIndexPage', on_delete=models.deletion.CASCADE, related_name='related_links')


class HelpIndexPage(Page):
    intro = RichTextField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + [
        index.SearchField('intro'),
    ]

HelpIndexPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    InlinePanel('related_links', label="Related links"),
]

HelpIndexPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]

# Documentation page


class HelpPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('documents.HelpPage', on_delete=models.deletion.CASCADE, related_name='related_links')


class HelpPage(Page):
    intro = RichTextField(blank=True)
    body = RichTextField(blank=True)
    tooltip = RichTextField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + [
        index.SearchField('intro'),
        index.SearchField('body'),
        index.SearchField('tooltip'),
    ]

    class Meta:
        #description = "A page that can be used to display generic TITLE > ABSTRACT > BODY content."
        verbose_name = "Help page"

HelpPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    FieldPanel('body', classname="full"),
    InlinePanel('related_links', label="Related links"),
]

HelpPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]


from wagtail.embeds.finders.base import EmbedFinder

class OwnEmbedFinder(EmbedFinder):
    def __init__(self, **options):
        pass

    def accept(self, url):
        """
        Returns True if this finder knows how to fetch an embed for the URL.

        This should not have any side effects (no requests to external servers)
        """
        pass

    def find_embed(self, url, max_width=None):
        """
        Takes a URL and max width and returns a dictionary of information about the
        content to be used for embedding it on the site.

        This is the part that may make requests to external APIs.
        """
        # TODO: Perform the request

        return {
            'title': "Title of the content",
            'author_name': "Author name",
            'provider_name': "Provider name (eg. YouTube, Vimeo, etc)",
            'type': "Either 'photo', 'video', 'link' or 'rich'",
            'thumbnail_url': "URL to thumbnail image",
            'width': 320,
            'height': 200,
            'html': "<h2>The Embed HTML</h2>",
        }
