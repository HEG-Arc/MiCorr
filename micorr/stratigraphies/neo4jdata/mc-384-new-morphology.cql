:param common_props {version:10, date:"2021-02-01"}

/* Morphology Families
import_family_group('Morphology', filter_observation=None, fieldsets=['Thickness','Width'],optgroups=['Geometrical shape'], filter_print=FAMILY, shared_sub_characteristics=False)
 */
WITH 1 as binocular, 2 as cross_section
UNWIND [
// new family_name=Shape uid: shapeFamily
{fg:'fgMorphology', order:1, observation:binocular, uid:'shapeFamily', name:'Shape', visible: False, variable: False, description:'Geometry of the stratum in the observed area. Only the film/coating/layer options are made visible. The blank option corresponds to a stratum which shape is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyShapeFamily'},
// morphologyShapeGeometricalShapeCharacteristic optgroup options:
// new fieldset=Width
// new family_name=Width uid: widthFamily
{fg:'fgMorphology', order:2, observation:cross_section, uid:'widthFamily', name:'Width', visible: False, variable: False, description:'Determined on the observed area. It is expressed in µm and %. ', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyWidthCSFamily'},
{fg:'fgMorphology', order:3, observation:cross_section, uid:'areaWidthVarFamily', name:'Observed area', visible: False, variable: True, description:'In µm.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], unit:'µm', fieldset:'Width', new_uid:'morphologyWidthAreaCSVarFamily'},
{fg:'fgMorphology', order:4, observation:cross_section, uid:'stratumWidthVarFamily', name:'Stratum', visible: False, variable: True, description:'In µm.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], unit:'µm', fieldset:'Width', new_uid:'morphologyWidthStratumCSVarFamily'},
{fg:'fgMorphology', order:5, observation:cross_section, uid:'percentageWidthVarFamily', name:'Percentage', visible: False, variable: True, description:'in % (deduced automatically).', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], unit:'%', fieldset:'Width', new_uid:'morphologyWidthPercentageCSVarFamily'},
// new fieldset=Thickness
// new family_name=Thickness uid: morphologyThicknessFamily
{fg:'fgMorphology', order:6, observation:binocular, uid:'thicknessFamily', name:'Relative', visible: False, variable: False, description:'The thickness of the strata in the observed area can be measured if the binocular or microscope is equipped with scales. Otherwise, the thickness should be deduced in relation to the other strata of the corrosion structure (thick, medium, thin). The blank option corresponds to a stratum which thickness is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], fieldset:'Thickness', new_uid:'morphologyThicknessFamily'},
{fg:'fgMorphology', order:7, observation:binocular, uid:'minThicknessVarFamily', name:'Minimal', visible: False, variable: True, description:'In µm', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], unit:'µm', fieldset:'Thickness', new_uid:'morphologyThicknessMinimalVarFamily'},
{fg:'fgMorphology', order:8, observation:binocular, uid:'maxThicknessVarFamily', name:'Maximal', visible: False, variable: True, description:'In µm', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], unit:'µm', fieldset:'Thickness', new_uid:'morphologyThicknessMaximalVarFamily'},
{fg:'fgMorphology', order:9, observation:binocular, uid:'avgThicknessVarFamily', name:'Average', visible: False, variable: True, description:'In µm', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], unit:'µm', fieldset:'Thickness', new_uid:'morphologyThicknessAverageVarFamily'},
{fg:'fgMorphology', order:10, observation:cross_section, uid:'minThicknessCSVarFamily', name:'Minimal', visible: False, variable: True, description:'In µm.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], fieldset:'Thickness', new_uid:'morphologyThicknessMinimalCSVarFamily'},
{fg:'fgMorphology', order:11, observation:cross_section, uid:'maxThicknessCSVarFamily', name:'Maximal', visible: False, variable: True, description:'In µm.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], fieldset:'Thickness', new_uid:'morphologyThicknessMaximalCSVarFamily'},
{fg:'fgMorphology', order:12, observation:cross_section, uid:'avgThicknessCSVarFamily', name:'Average', visible: False, variable: True, description:'In µm.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], fieldset:'Thickness', new_uid:'morphologyThicknessAverageCSVarFamily'},
// new family_name=Continuity uid: continuityFamily
{fg:'fgMorphology', order:13, observation:binocular, uid:'continuityFamily', name:'Continuity', visible: False, variable: False, description:'The continuity of a stratum is assessed in relation to the observed area. The blank option corresponds to a stratum which continuity is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyContinuityFamily'},
// new family_name=Direction uid: directionFamily
{fg:'fgMorphology', order:14, observation:binocular, uid:'directionFamily', name:'Direction', visible: False, variable: False, description:'The surface orientation represents the direction of the described stratum in relation to the tangential plane of the present surface (or to the mean tangential plane of the present surface in the case of macro-roughnesses or irregularities). Only the longitudinal option is made visible. The blank option corresponds to a stratum which direction is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyDirectionFamily'},
// new family_name=Colour uid: colourFamily
{fg:'fgMorphology', order:15, observation:binocular, uid:'colourFamily', name:'Colour', visible: False, variable: False, description:'Assessed with naked eyes on the observed area. The number of colours offered is deliberately limited in order to allow a reliable transmission of this property in the descriptions. The blank option corresponds to a stratum which colour is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'morphologyColourFamily'},
// new family_name=Colour (with optical microscope - bright field) uid: morphologyColourWithOpticalMicroscopeBrightFieldCSFamily
{fg:'fgMorphology', order:16, observation:cross_section, uid:'morphologyColourWithOpticalMicroscopeBrightFieldCSFamily', name:'Colour (with optical microscope - bright field)', visible: False, variable: False, description:'Determined on the observed area. The number of colours offered is deliberately limited in order to allow a reliable transmission of this property in the descriptions. The blank option corresponds to a stratum which colour is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], list_elem_family:'colourFamily', upto:1},
// new family_name=Colour (with optical microscope - dark field) uid: morphologyColourWithOpticalMicroscopeDarkFieldCSFamily
{fg:'fgMorphology', order:17, observation:cross_section, uid:'morphologyColourWithOpticalMicroscopeDarkFieldCSFamily', name:'Colour (with optical microscope - dark field)', visible: False, variable: False, description:'Determined on the observed area. The number of colours offered is deliberately limited in order to allow a reliable transmission of this property in the descriptions. The blank option corresponds to a stratum which colour is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], list_elem_family:'colourFamily', upto:1},
// new family_name=Colour (with scanning electron microscope - secondary electrons) uid: morphologyColourWithScanningElectronMicroscopeSecondaryElectronsCSFamily
{fg:'fgMorphology', order:18, observation:cross_section, uid:'morphologyColourWithScanningElectronMicroscopeSecondaryElectronsCSFamily', name:'Colour (with scanning electron microscope - secondary electrons)', visible: False, variable: False, description:'Determined on the observed area. The number of colours offered is deliberately limited in order to allow a reliable transmission of this property in the descriptions. ', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], list_elem_family:'colourFamily', upto:1},
// new family_name=Colour (with scanning electron microscope - backscattered electrons) uid: morphologyColourWithScanningElectronMicroscopeBackscatteredElectronsCSFamily
{fg:'fgMorphology', order:19, observation:cross_section, uid:'morphologyColourWithScanningElectronMicroscopeBackscatteredElectronsCSFamily', name:'Colour (with scanning electron microscope - backscattered electrons)', visible: False, variable: False, description:'Determined on the observed area. The number of colours offered is deliberately limited in order to allow a reliable transmission of this property in the descriptions.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], list_elem_family:'colourFamily', upto:1},
// new family_name=Brightness uid: brightnessFamily
{fg:'fgMorphology', order:20, observation:binocular, uid:'brightnessFamily', name:'Brightness', visible: False, variable: False, description:'Assessed on the observed area. None of the options is made visible. The blank option corresponds to a stratum which brightness is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'morphologyBrightnessFamily'},
// new family_name=Opacity uid: opacityFamily
{fg:'fgMorphology', order:21, observation:binocular, uid:'opacityFamily', name:'Opacity', visible: False, variable: False, description:'Assessed with naked eyes on the observed area. None of the options is made visible. The blank option corresponds to a stratum which opacity is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'morphologyOpacityFamily'},
// new family_name=Opacity (with optical microscope - dark field) uid: morphologyOpacityWithOpticalMicroscopeDarkFieldCSFamily
{fg:'fgMorphology', order:22, observation:cross_section, uid:'morphologyOpacityWithOpticalMicroscopeDarkFieldCSFamily', name:'Opacity (with optical microscope - dark field)', visible: False, variable: False, description:'Assessed on the observed area. None of the options is made visible. ', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']}
] as updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset, f.new_uid= updt.new_uid
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset, f.new_uid= updt.new_uid
    WITH f, updt
        MATCH (a:FamilyGroup {uid: updt.fg})
        WITH f, a, updt
            MERGE (a)-[:SHOWS]->(f)
            WITH f,updt
                UNWIND updt.natures AS nature
                MATCH (n:Nature {uid:nature})
                MERGE (n)-[:HAS_FAMILY]->(f)
                WITH  f, updt
                    MATCH (ef:Family {uid: updt.list_elem_family})
                    MERGE (f)-[r:IS_LIST_OF {upto: updt.upto}]->(ef)
    RETURN f;


/* Morphology Characteristics
import_family_group('Morphology', filter_observation=None, fieldsets=['Thickness','Width'],optgroups=['Geometrical shape'], filter_print=CHARACTERISTIC, shared_sub_characteristics=False)
 */
UNWIND [
{family_uid:'shapeFamily', uid:'morphologyShapeBlankCharacteristic', name:'Blank', order:1, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv']},
{family_uid:'shapeFamily', uid:'cloudCharacteristic', name:'Cloud', order:2, natures:['cp', 'deposit', 'nmm', 'soil'], description:'Continuous or very fine discontinuous outer stratum showing the underlying stratum.', new_uid:'morphologyShapeCloudCharacteristic'},
{family_uid:'shapeFamily', uid:'clusterCharacteristic', name:'Cluster', order:3, natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], description:'Stratum, usually thick, dispersed or isolated, of irregular massive shape.', new_uid:'morphologyShapeClusterCharacteristic'},
{family_uid:'shapeFamily', uid:'craterCharacteristic', name:'Crater', order:4, natures:['cm', 'metal'], description:'Particular shape at the surface of a metal stratum in the form of a cavity that is wider than deep.', new_uid:'morphologyShapeCraterCharacteristic'},
{family_uid:'shapeFamily', uid:'curlyCharacteristic', name:'Curly', order:5, natures:['cp'], description:'Continuous, dispersed or isolated outer stratrum in the form of tangled curls.', new_uid:'morphologyShapeCurlyCharacteristic'},
{family_uid:'shapeFamily', uid:'crustCharacteristic', name:'Crust', order:6, natures:['cp', 'deposit', 'soil'], description:'Continuous or discontinuous outer stratum of possibly irregular thickness.', new_uid:'morphologyShapeCrustCharacteristic'},
{family_uid:'shapeFamily', uid:'dropletCharacteristic', name:'Droplet', order:7, natures:['cp', 'deposit'], description:'Most often outer stratum dispersed or isolated, droplet-shaped stratum.', new_uid:'morphologyShapeDropletCharacteristic'},
{family_uid:'shapeFamily', uid:'morphologyShapeFilmcoatingCharacteristic', name:'Film/coating', order:8, natures:['cp', 'deposit', 'metal', 'nmm', 'soil'], description:'Thin continuous or discontinuous stratum of regular thickness (on the scale of the observation) and whose faces appear parallel.'},
{family_uid:'shapeFamily', uid:'morphologyShapeLayerCharacteristic', name:'Layer', order:9, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Thin continuous or discontinuous stratum of regular thickness (on the scale of the observation) and whose faces appear parallel.'},
{family_uid:'shapeFamily', uid:'noduleCharacteristic', name:'Nodule', order:10, natures:['cp', 'cm', 'deposit', 'metal', 'soil'], description:'Generally thick, dispersed or isolated stratum of massive pseudo-geometric shape.', new_uid:'morphologyShapeNoduleCharacteristic'},
{family_uid:'shapeFamily', uid:'pitCharacteristic', name:'Pit', order:11, natures:['cm', 'metal'], description:'Particular shape on the surface of a metal stratum in the form of a cavity deeper than wide.', new_uid:'morphologyShapePitCharacteristic'},
{family_uid:'shapeFamily', uid:'pustuleCharacteristic', name:'Pustule', order:12, natures:['cp'], description:'Dispersed or isolated stratum of conical or hemispherical shape.', new_uid:'morphologyShapePustuleCharacteristic'},
{family_uid:'shapeFamily', uid:'vainsOrSeamsCharacteristic', name:'Veins or seams', order:13, natures:['cp', 'deposit', 'metal', 'sv'], description:'Continuous or discontinuous stratum.', new_uid:'morphologyShapeVeinsOrSeamsCharacteristic'},
{family_uid:'shapeFamily', uid:'morphologyShapeWhiskersCharacteristic', name:'Whiskers', order:14, natures:['cp', 'deposit'], description:'Stratum in the form of a filament or hair extending over the surface. '},
//{family_uid:'shapeFamily', uid:'morphologyShapeGeometricalShapeCharacteristic', name:'Geometrical shape', order:15, natures:['cp', 'metal'], description:'Stratum with a specific geometrical shape'},
// morphologyShapeGeometricalShapeCharacteristic optgroup options:
{family_uid:'shapeFamily', uid:'ringShapedCharacteristic', name:'Circular', order:16, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeCircularCharacteristic'},
{family_uid:'shapeFamily', uid:'coneShapedCharacteristic', name:'Conical', order:17, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeConicalCharacteristic'},
{family_uid:'shapeFamily', uid:'cubicCharacteristic', name:'Cubic', order:18, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeCubicCharacteristic'},
{family_uid:'shapeFamily', uid:'cylindricalCharacteristic', name:'Cylindrical', order:19, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeCylindricalCharacteristic'},
{family_uid:'shapeFamily', uid:'hemisphericalCharacteristic', name:'Hemispherical', order:20, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeHemisphericalCharacteristic'},
{family_uid:'shapeFamily', uid:'geometricalShapeLensShapedCharacteristic', name:'Lens-shaped', order:21, natures:['cp', 'metal'], optgroup:'Geometrical shape'},
{family_uid:'shapeFamily', uid:'ovoidCharacteristic', name:'Ovoid', order:22, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeOvoidCharacteristic'},
{family_uid:'shapeFamily', uid:'parallelepipedalCharacteristic', name:'Parallelepipedal', order:23, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeParallelepipedalCharacteristic'},
{family_uid:'shapeFamily', uid:'prismaticCharacteristic', name:'Prismatic', order:24, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapePrismaticCharacteristic'},
{family_uid:'shapeFamily', uid:'pyramidalCharacteristic', name:'Pyramidal', order:25, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapePyramidalCharacteristic'},
{family_uid:'shapeFamily', uid:'geometricalShapeRingShapedCharacteristic', name:'Ring-shaped', order:26, natures:['cp', 'metal'], optgroup:'Geometrical shape'},
{family_uid:'shapeFamily', uid:'sectorOfASphereCharacteristic', name:'Sector of a sphere', order:27, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeSectorOfASphereCharacteristic'},
{family_uid:'shapeFamily', uid:'sphericalCapCharacteristic', name:'Spherical cap', order:28, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeSphericalCapCharacteristic'},
{family_uid:'shapeFamily', uid:'sphericalCharacteristic', name:'Spherical', order:29, natures:['cp', 'metal'], optgroup:'Geometrical shape', new_uid:'geometricalShapeSphericalCharacteristic'},
{family_uid:'shapeFamily', uid:'geometricalShapeTrapezoïdalCharacteristic', name:'Trapezoïdal', order:30, natures:['cp', 'metal'], optgroup:'Geometrical shape'},
{family_uid:'shapeFamily', uid:'geometricalShapeCurveShapedCharacteristic', name:'Curve-shaped', order:31, natures:['cp', 'metal'], optgroup:'Geometrical shape'},
// new fieldset=Width
// new fieldset=Thickness
{family_uid:'morphologyThicknessFamily', uid:'morphologyThicknessBlankCharacteristic', name:'Blank', order:32, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv']},
{family_uid:'morphologyThicknessFamily', uid:'thickCharacteristic', name:'Thick', order:33, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyThicknessThickCharacteristic'},
{family_uid:'morphologyThicknessFamily', uid:'normalWidthCharacteristic', name:'Medium', order:34, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyThicknessMediumCharacteristic'},
{family_uid:'morphologyThicknessFamily', uid:'thinCharacteristic', name:'Thin', order:35, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyThicknessThinCharacteristic'},
{family_uid:'continuityFamily', uid:'morphologyContinuityBlankCharacteristic', name:'Blank', order:36, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv']},
{family_uid:'continuityFamily', uid:'continuousCharacteristic', name:'Continuous', order:37, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Stratum showing no interruption (consisting of a single stratigraphic element) over the observed area.', new_uid:'morphologyContinuityContinuousCharacteristic'},
{family_uid:'continuityFamily', uid:'morphologyContinuityDiscontinuousCharacteristic', name:'Discontinuous', order:38, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Stratum with one ore more interruption(s) in the observed area.'},
{family_uid:'continuityFamily', uid:'scatteredCharacteristic', name:'Scattered', order:39, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Stratum consisting of numerous stratigraphic elements separated from each other and distributed over the observed area.', new_uid:'morphologyContinuityScatteredCharacteristic'},
{family_uid:'continuityFamily', uid:'isolatedCharacteristic', name:'Isolated', order:40, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Stratum consisting of one or more stratigraphic elements having a minority volume over the area observed.', new_uid:'morphologyContinuityIsolatedCharacteristic'},
{family_uid:'continuityFamily', uid:'morphologyContinuityBlankCSCharacteristic', name:'Blank', order:41, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv']},
{family_uid:'continuityFamily', uid:'continuousCharacteristic', name:'Continuous', order:42, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Stratum showing no interruption (consisting of a single stratigraphic element) over the observed area.', new_uid:'morphologyContinuityContinuousCSCharacteristic'},
{family_uid:'continuityFamily', uid:'morphologyContinuityDiscontinuousCSCharacteristic', name:'Discontinuous', order:43, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Stratum with one ore more interruption(s) in the observed area.'},
{family_uid:'directionFamily', uid:'morphologyDirectionBlankCharacteristic', name:'Blank', order:44, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv']},
{family_uid:'directionFamily', uid:'longitudinalCharacteristic', name:'Longitudinal', order:45, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyDirectionLongitudinalCharacteristic'},
{family_uid:'directionFamily', uid:'obliqueCharacteristic', name:'Oblique', order:46, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyDirectionObliqueCharacteristic'},
{family_uid:'directionFamily', uid:'transversalCharacteristic', name:'Transversal', order:47, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyDirectionTransversalCharacteristic'},
{family_uid:'directionFamily', uid:'multidirectionalCharacteristic', name:'Multidirectional', order:48, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'morphologyDirectionMultidirectionalCharacteristic'},
{family_uid:'brightnessFamily', uid:'morphologyBrightnessBlankCharacteristic', name:'Blank', order:88, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'brightnessFamily', uid:'metallicCharacteristic', name:'Metallic', order:89, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Shows high luminance even when the angle of view is varied.', new_uid:'morphologyBrightnessMetallicCharacteristic'},
{family_uid:'brightnessFamily', uid:'submetallicCharacteristic', name:'Submetallic', order:90, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Shows areas of high luminance and areas of lower luminance even when the viewing angle is varied.', new_uid:'morphologyBrightnessSubmetallicCharacteristic'},
{family_uid:'brightnessFamily', uid:'vitreousCharacteristic', name:'Vitreous', order:91, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Luster of the glass, like quartz.', new_uid:'morphologyBrightnessVitreousCharacteristic'},
{family_uid:'brightnessFamily', uid:'resinousCharacteristic', name:'Resinous', order:92, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Resin luster. Some sulphides have a resinous luster.', new_uid:'morphologyBrightnessResinousCharacteristic'},
{family_uid:'brightnessFamily', uid:'morphologyBrightnessSilkyOrSilklikeCharacteristic', name:'Silky or silklike', order:93, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Shows a directed reflection of light. Caused by the reflection of light in a fine aggregate of parallel fibrous crystals (some gypsum, malachite).'},
{family_uid:'brightnessFamily', uid:'greasyCharacteristic', name:'Greasy', order:94, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Shows a slightly diffuse reflection as if a layer of oil was covering the surface.', new_uid:'morphologyBrightnessGreasyCharacteristic'},
{family_uid:'brightnessFamily', uid:'pearlyCharacteristic', name:'Pearly', order:95, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Shows surface iridescence. Caused by the refraction of light in crystal layers cleaved parallel to the surface (mother-of-pearl, micas).', new_uid:'morphologyBrightnessPearlyCharacteristic'},
{family_uid:'brightnessFamily', uid:'adamantineCharacteristic', name:'Adamantine', order:96, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Shows a strong diamond like brilliance. Caused by strong refraction of light. Can be observed on corrosion products with a high refractive index and on fairly large crystals (such as cerusite and anglesite, cuprite).', new_uid:'morphologyBrightnessAdamantineCharacteristic'},
{family_uid:'brightnessFamily', uid:'matteCharacteristic', name:'Matte', order:97, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'No special reflection, no shine. Caused by a very fine aggregate.', new_uid:'morphologyBrightnessMatteCharacteristic'},
{family_uid:'brightnessFamily', uid:'morphologyBrightnessNonObservableBrightnessCharacteristic', name:'Non-observable brightness', order:98, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'opacityFamily', uid:'morphologyOpacityBlankCharacteristic', name:'Blank', order:99, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'opacityFamily', uid:'opaqueCharacteristic', name:'Opaque', order:100, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Which does not let the light pass through.', new_uid:'morphologyOpacityOpaqueCharacteristic'},
{family_uid:'opacityFamily', uid:'translucentCharacteristic', name:'Translucent', order:101, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Which lets the light through, but does not allow the contours of the objects to be clearly discerned.', new_uid:'morphologyOpacityTranslucentCharacteristic'},
{family_uid:'opacityFamily', uid:'transparentCharacteristic', name:'Transparent', order:102, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Which, allowing itself to be easily penetrated by light, makes it possible to clearly distinguish objects through its thickness.', new_uid:'morphologyOpacityTransparentCharacteristic'},
{family_uid:'morphologyOpacityWithOpticalMicroscopeDarkFieldCSFamily', uid:'opaqueCharacteristic', name:'Opaque', order:103, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Which does not let the light pass through.', new_uid:'morphologyOpacityWithOpticalMicroscopeDarkFieldOpaqueCSCharacteristic'},
{family_uid:'morphologyOpacityWithOpticalMicroscopeDarkFieldCSFamily', uid:'translucentCharacteristic', name:'Translucent', order:104, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Which lets the light through, but does not allow the contours of the objects to be clearly discerned.', new_uid:'morphologyOpacityWithOpticalMicroscopeDarkFieldTranslucentCSCharacteristic'}
]AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url, c.new_uid= updt.new_uid
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url, c.new_uid= updt.new_uid
  WITH c,updt
  MATCH (f:Family {uid:updt.family_uid})
  MERGE (c)-[:BELONGS_TO]->(f)
  WITH c,updt
   UNWIND updt.natures AS nature
     MATCH (n:Nature {uid:nature})
     MERGE (n)-[:HAS]->(c)
  RETURN n,c;

// Migrate data
// update strata CONSTITUTED from old to new characteristics
UNWIND [
{old:'discontinuous1Characteristic', new:'morphologyContinuityDiscontinuousCharacteristic'},
{old:'discontinuous2Characteristic', new:'morphologyContinuityDiscontinuousCharacteristic'},
{old:'discontinuous3Characteristic', new:'morphologyContinuityDiscontinuousCharacteristic'},
{old:'layerFilmCoatingCharacteristic', new:'morphologyShapeFilmcoatingCharacteristic'}
] as updt
MATCH (newc:Characteristic {uid:updt.new})
WITH updt,newc
    MATCH (oldc:Characteristic {uid:updt.old})<-[r:IS_CONSTITUTED_BY]-(s)
    WITH  newc,oldc,s,r
        MERGE (s)-[:IS_CONSTITUTED_BY]->(newc)
        DELETE r
        RETURN oldc.uid,newc.uid,s.uid;

// delete obsolete now unlinked characteristics
UNWIND [
'discontinuous1Characteristic',
'discontinuous2Characteristic',
'discontinuous3Characteristic',
'layerFilmCoatingCharacteristic'
]
 AS uid
MATCH (c:Characteristic {uid:uid})
DETACH DELETE c;
