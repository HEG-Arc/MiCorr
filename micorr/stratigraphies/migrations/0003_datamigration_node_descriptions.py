# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-31 10:05
from __future__ import unicode_literals

from django.db import migrations

#Adding first set of node descriptions as per MC-202 (to be maintained via wagtail admin snippets)

NODE_DESCRIPTIONS = [{u'label': u'Family',
            u'name': u'Shape',
            u'text': u'Geometry of the stratum. The list of possible shapes is self-explanatory except perhaps cloud (very thin layer that allows to see the stratum below). Only one option is made visible: layer/film/coating.',
            u'uid': u'shapeFamily'},
           {u'label': u'Family',
            u'name': u'Magnetism',
            u'text': u'two options are possible (magnetic or non magnetic) but are not visible. Fe, Ni, Co are normally magnetic but not stainless steel.',
            u'uid': u'magnetismFamily'},
           {u'label': u'Family',
            u'name': u'Thickness',
            u'text': u'Three options are possible (thin, medium and thick) and are made visible. When adding a new stratum, the thickness is automatically medium. The user has to select another thickness if needed. When ignoring the thickness of a stratum, choose the most appropriate option: thin \u201cM\u201d in case of an archaeological metal with almost no metal left, medium \u201cM\u201d for historical metals, etc. Thicknesses of other strata are deduced from the first stratum of the corrosion structure.',
            u'uid': u'thicknessFamily'},
           {u'label': u'Family',
            u'name': u'Width',
            u'text': u'Three options are possible (small, medium, large) and are made visible. When adding a new stratum, the width is automatically medium. The user has to select another width if needed.',
            u'uid': u'widthFamily'},
           {u'label': u'Family',
            u'name': u'Direction',
            u'text': u'Direction of the stratum in the whole stratigraphy. Although the direction can be longitudinal, transversal or oblique, only the longitudinal option is made visible.',
            u'uid': u'directionFamily'},
           {u'label': u'Family',
            u'name': u'Continuity',
            u'text': u'Either the stratum is continuous, divided in one, two or three major elements, isolated or scattered. Only the continuous option is made visible.',
            u'uid': u'continuityFamily'},
           {u'label': u'Family',
            u'name': u'Brightness',
            u'text': u'Combines both lustre / brightness. None of the option is made visible. The list of options is self-explanatory except perhaps submetallic (presents areas that are more or less shiny even if the angle of vision changes) and adamantine (shiny like a diamond).',
            u'uid': u'brightnessFamily'},
           {u'label': u'Family',
            u'name': u'Colour',
            u'text': u'Options from a colour chart is self-explanatory. Colours are made visible. Colours of strata are those observed visually or from a micrograph observed with a polarised microscope for corrosion layers and in bright field for the metal stratum.',
            u'uid': u'colourFamily'},
           {u'label': u'Family',
            u'name': u'Opacity',
            u'text': u'Three options are possible (opaque, translucent, transparent) but only the opaque option is made visible. a \u201cM\u201d stratum is normally opaque.',
            u'uid': u'opacityFamily'},
           {u'label': u'FamilyGroup',
            u'name': u'Morphology',
            u'text': u'General geometry of a stratum (shape, thickness, width, direction, continuity) with information on interaction light & environment / material (brightness, colour, opacity and magnetism)',
            u'uid': u'fgMorphology'},
           {u'label': u'FamilyGroup',
            u'name': u'Microstructure',
            u'text': u'Internal organisation of a stratum.',
            u'uid': u'fgMicrostructure'},
           {u'label': u'FamilyGroup',
            u'name': u'Texture',
            u'text': u'Physical properties of a stratum (compactness, hardness, cohesion, cracking)',
            u'uid': u'fgTexture'},
           {u'label': u'FamilyGroup',
            u'name': u'Composition',
            u'text': u'Chemical nature of the stratum',
            u'uid': u'fgComposition'},
           {u'label': u'FamilyGroup',
            u'name': u'Interface',
            u'text': u'Relation between the stratum and the next stratum above (profile, roughness, transition, adherence)',
            u'uid': u'fgInterface'},
           {u'label': u'Family',
            u'name': u'M Microstructure',
            u'text': u'Several options are possible (dendrites (deformed or not), grains (large, small, elongated), no microstructure) with sub-options. The size of the grains is given when available from a micrograph. All options are made visible. A cast object has normally a dendritic microstructure while a forged metal a grain microstructure. A laminated sheet should have elongated grains except if it was annealed. Grey cast iron has graphite lamellas.',
            u'uid': u'mMicrostructureFamily'},
           {u'label': u'Family',
            u'name': u'CM Additionnal Microstructure',
            u'text': u'two options are possible (isolated aggregate microstructure, lenticular, no microstructure, scattered aggregate microstructure) in the CP part of the CM. All options are made visible (?)',
            u'uid': u'cmCpMicrostructureFamily'},
           {u'label': u'Family',
            u'name': u'CP Microstructure',
            u'text': u'Several options are possible (alternating bands, crystalline microstructure, pseudomorph of dendritic microstructure, pseudomorph of granular microstructure, pseudomorph of organic material (POM), hexagonal network, isolated aggregate microstructure, lenticular, no microstructure, non-metallic material (NMM), scattered aggregate microstructure, structured void (SV)). All options are made visible except lenticular.',
            u'uid': u'cpriMicrostructureFamily'},
           {u'label': u'Family',
            u'name': u'Compactness',
            u'text': u'Four options are possible (compact, slightly porous, porous, highly porous) and are made visible. Visually, the number of pores (\uf0b7) is increasing from slightly to highly porous). Pores are described by their size (nm) and their surface density on a micrograph.',
            u'uid': u'porosityFamily'},
           {u'label': u'Family',
            u'name': u'Hardness',
            u'text': u'Four options are possible (very soft, soft, hard, very hard) depending on Vickers hardness (micro) or Brinell hardness (macro). These sub-characteristics are not made visible.',
            u'uid': u'hardnessFamily'},
           {u'label': u'Family',
            u'name': u'Cohesion',
            u'text': u'The list of options (powdery, friable, brittle, severable, malleable, tough) is self-explanatory. Only the powdery option is made visible.',
            u'uid': u'cohesionFamily'},
           {u'label': u'Family',
            u'name': u'Cracking',
            u'text': u'Four options are possible (simple crack, branched cracks, network of cracks, no crack). All options are made visible.',
            u'uid': u'crackingFamily'},
           {u'label': u'Family',
            u'name': u'Profile',
            u'text': u'four options are possible (straight, wavy, bumpy and irregular). They are made visible.',
            u'uid': u'profileFamily'},
           {u'label': u'Family',
            u'name': u'Roughness',
            u'text': u'four options are possible (smooth, slightly rough, rough, uneven). These sub-characteristics are not made visible. ',
            u'uid': u'roughnessFamily'},
           {u'label': u'Family',
            u'name': u'Transition',
            u'text': u'five options are possible (sharp, diffuse, semi gradual superior, semi gradual inferior, gradual). Only the graduals options are made visible. ',
            u'uid': u'transitionFamily'},
           {u'label': u'Family',
            u'name': u'Adherence',
            u'text': u'four options are possible (inseparable, adherent, loosely, non-adherent). None of these options are made visible.',
            u'uid': u'interfaceAdherenceFamily'},
           # extra new ones
           {u'label': u'Family',
            u'name': u'CP Sub-microstructure available sub-characteristics',
            u'text': u'Four sub-characteristics (Cementite / perlite phase, Eutectic phase, Ferritic phase, Ferrito-perlitic phase, Graphite lamellas, Inclusions (Elongated & Multidirections), Newmann bands, Quenched phase, Slip lines and Twin lines) are available for each microstructure. Once selected these sub-characteristics have to be transferred with the arrow in the box \u201cchosen sub-characteristics to make them visible.',
            u'uid': u'subcprimicrostructureFamily'},
           {u'label': u'Family',
            u'name': u'M Sub-microstructure available sub-characteristics',
            u'text': u'Several sub-characteristics (Cementite / perlite phase, Eutectic phase, Ferritic phase, Ferrito-perlitic phase, Graphite lamellas, Inclusions (Elongated & Multidirections), Newmann bands, Quenched phase, Slip lines and Twin lines) are available. Once selected these sub-characteristics have to be transferred with the arrow in the box \u201cchosen sub-characteristics to make them visible.',
            u'uid': u'submmicrostructureFamily'},
           {u'label': u'Family',
            u'name': u'M Main element',
            u'text': u'Only one element might be chosen among the existing list, even with binary alloys with elements having the same content.',
            u'uid': u'mcompositionFamily'},
           {u'label': u'Family',
            u'name': u'CP Main element',
            u'text': u'Only one element might be chosen among the existing list, even with binary alloys with elements having the same content.',
            u'uid': u'cpcompositionFamily'},
           {u'label': u'Family',
            u'name': u'M additional element(s) available sub-characteristics',
            u'text': u'Secondary elements. They depend on the nature of the main element.',
            u'uid': u'submcompositionFamily'},
           {u'label': u'Family',
            u'name': u'CP Secondary element(s)',
            u'text': u'They depend on the nature of the main element.',
            u'uid': u'subcpcompositionFamily'},
           {u'label': u'Family',
            u'name': u'CP Compound',
            u'text': u'Formula of the CP deduced from its main and secondary elements.',
            u'uid': u'subsubcpcompositionFamily'},
           {u'label': u'Family',
            u'name': u'CP Additional element(s) available sub-characteristics',
            u'text': u'select the corresponding elements. Once selected these sub-characteristics have to be transferred with the arrow in the box \u201cchosen sub-characteristics.',
            u'uid': u'cpcompositionextensionFamily'},
           {u'label': u'Family',
            u'name': u'CM Additional elements in M available sub-characteristics',
            u'text': u'Select the corresponding elements. Once selected these sub-characteristics have to be transferred with the arrow in the box \u201cchosen sub-characteristics.',
            u'uid': u'cmmcompositionFamily'},
           {u'label': u'Family',
            u'name': u'CM Additional elements in CP available sub-characteristics',
            u'text': u'Select the corresponding elements. Once selected these sub-characteristics have to be transferred with the arrow in the box \u201cchosen sub-characteristics.',
            u'uid': u'cmcpcompositionFamily'},
           {u'label': u'Family',
            u'name': u'Additional element(s) in CP aggregates  available sub-characteristics',
            u'text': u'Select the corresponding elements. Once selected these sub-characteristics have to be transferred with the arrow in the box \u201cchosen sub-characteristics.',
            u'uid': u'cmcpaggregateCompositionFamily'},
           {u'label': u'Family',
            u'name': u'CM M/CP Ratio',
            u'text': u'Select the proper ratio M/CP. Three options exist: if the cursor is on the left, the ratio M/CP is low, if the cursor is in the centre, the ratio M/CP has an average value, if the cursor is on the right, the ratio M/CP is high.',
            u'uid': u'mcpRatio'}
           ]


def add_node_descriptions(apps, schema_editor):
    NodeDescription = apps.get_model('stratigraphies', 'NodeDescription')
    for rec in NODE_DESCRIPTIONS:
        NodeDescription.objects.update_or_create(uid=rec.pop('uid'),defaults=rec)


def remove_node_descriptions(apps, schema_editor):
    NodeDescription = apps.get_model('stratigraphies', 'NodeDescription')
    NodeDescription.objects.filter(uid__in=[r['uid'] for r in NODE_DESCRIPTIONS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('stratigraphies', '0002_alter_nodedescription_fields'),
    ]

    operations = [
        migrations.RunPython(add_node_descriptions, remove_node_descriptions)
    ]
