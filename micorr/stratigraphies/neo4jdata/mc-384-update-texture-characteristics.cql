:param common_props {version:10, date:"2021-02-01"}

/**************************
// MC-384 Texture update and image support
// Texture Families
load_old_uids('./data/fgTexture_before_new_uids_20210204.csv')

import_family_group('Texture', filter_observation='Binocular', fieldsets=['Cracking'], filter_print=FAMILY, shared_sub_characteristics=False)
import_family_group('Texture', filter_observation='Cross-section', fieldsets=['Cracking'], filter_print=FAMILY, shared_sub_characteristics=False)

*/

WITH 1 as binocular, 2 as cross_section
UNWIND [
// new family_name=Compactness uid: porosityFamily
{fg:'fgTexture', order:1, observation:binocular, uid:'porosityFamily', name:'Compactness', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which compactness is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'textureCompactnessFamily'},
// new family_name=Cohesion uid: cohesionFamily
{fg:'fgTexture', order:2, observation:binocular, uid:'cohesionFamily', name:'Cohesion', visible: False, variable: False, description:'Assessed on the observed area. Only the powdery option is made visible. The blank option corresponds to a stratum which cohesion is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'textureCohesionFamily'},
// new family_name=Hardness uid: hardnessFamily
{fg:'fgTexture', order:3, observation:binocular, uid:'hardnessFamily', name:'Hardness', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which hardness is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'textureHardnessFamily'},
// new fieldset=Cracking
{fg:'fgTexture', order:5, observation:binocular, uid:'crackingStructureFamily', name:'Structure', visible: True, variable: False, description:'Options of patterns. The blank option corresponds to a stratum which cracking is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingStructureFamily'},
{fg:'fgTexture', order:6, observation:binocular, uid:'crackingSurfaceDirectionFamily', name:'Surface direction', visible: False, variable: False, description:'Orientation of the crack in a plane tangential to the surface of the object and direction of propagation.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingSurfaceDirectionFamily'},
{fg:'fgTexture', order:7, observation:binocular, uid:'crackingInwardDirectionFamily', name:'Inward direction', visible: False, variable: False, description:'Orientation of the crack in a plane perpendicular to the surface of the object and with respect to the corrosion layers and direction of propagation.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingInwardDirectionFamily'},
{fg:'fgTexture', order:8, observation:binocular, uid:'crackingWidthFamily', name:'Width', visible: False, variable: False, description:'Average space between the lips of the cracks. To compare to the back of a classical sclapel blade type 11 which is 400µm width.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingWidthFamily'},
{fg:'fgTexture', order:9, observation:binocular, uid:'crackingLengthVarFamily', name:'Length', visible: False, variable: True, description:'Average crack size parallel to the surface.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Cracking', new_uid:'textureCrackingLengthVarFamily'},
{fg:'fgTexture', order:10, observation:binocular, uid:'crackingDepthVarFamily', name:'Depth', visible: False, variable: True, description:'Average crack size perpendicular to the surface.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Cracking', new_uid:'textureCrackingDepthVarFamily'},
{fg:'fgTexture', order:11, observation:binocular, uid:'crackingFillingFamily', name:'Filling', visible: False, variable: False, description:'Material which might fill the cracks.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingFillingFamily'},
{fg:'fgTexture', order:12, observation:binocular, uid:'crackingEdgesFamily', name:'Edges', visible: False, variable: False, description:'', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingEdgesFamily'},
{fg:'fgTexture', order:13, observation:binocular, uid:'crackingTypeOfCracksFamily', name:'Type of cracks', visible: False, variable: False, description:'Main specific types of cracks.', natures:['cp', 'cm', 'deposit', 'metal', 'pom'], fieldset:'Cracking', new_uid:'textureCrackingTypeOfCracksFamily'},
{fg:'fgTexture', order:1, observation:cross_section, uid:'texturePorositiesAmountCSVarFamily', name:'Porosities amount', visible: True, variable: True, description:'Amount of porosities determined on the observed area.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom'], unit:'%'},
{fg:'fgTexture', order:2, observation:cross_section, uid:'textureMicrohardnessCSVarFamily', name:'Microhardness', visible: False, variable: True, description:'Determined on the observed area.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom'], unit:'HV'},
// new fieldset=Cracking
{fg:'fgTexture', order:3, observation:cross_section, uid:'crackingStructureCSFamily', name:'Structure', visible: True, variable: False, description:'Options of patterns. The blank option corresponds to a stratum which cracking is not known?', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingStructureCSFamily'},
{fg:'fgTexture', order:4, observation:cross_section, uid:'crackingInwardDirectionCSFamily', name:'Inward direction', visible: False, variable: False, description:'Orientation of the crack in a plane perpendicular to the surface of the cross-section at the Metal / corrosion products interfaces. ', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingInwardDirectionCSFamily'},
{fg:'fgTexture', order:5, observation:cross_section, uid:'crackingWidthCSVarFamily', name:'Width', visible: False, variable: True, description:'Average spacing of the lips of the crack.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Cracking', new_uid:'textureCrackingWidthCSVarFamily'},
{fg:'fgTexture', order:6, observation:cross_section, uid:'crackingLengthCSVarFamily', name:'Length', visible: False, variable: True, description:'Average crack size parallel to the surface.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Cracking', new_uid:'textureCrackingLengthCSVarFamily'},
{fg:'fgTexture', order:7, observation:cross_section, uid:'crackingDepthCSVarFamily', name:'Depth', visible: False, variable: True, description:'Average crack size perpendicular to the surface.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Cracking', new_uid:'textureCrackingDepthCSVarFamily'},
{fg:'fgTexture', order:8, observation:cross_section, uid:'crackingFillingCSFamily', name:'Filling', visible: False, variable: False, description:'Material which might fill the cracks.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Cracking', new_uid:'textureCrackingFillingCSFamily'}
]
 as updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE
SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset, f.new_uid= updt.new_uid
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

/****
adds all new texture characteristics with image_url support
temp getting img src by exporting google sheet to html [https://docs.google.com/spreadsheets/d/1TAXM1qKFOoqlx5MwpVYnh2dSFWaZyumvk-ohkVOcGew/edit#gid=1581905147]

import_family_group('Texture', filter_observation='Binocular', fieldsets=['Cracking'], filter_print=CHARACTERISTIC, shared_sub_characteristics=False)
*/

UNWIND [
 //Binocular CHARACTERISTICS
{family_uid:'porosityFamily', uid:'textureCompactnessBlankCharacteristic', name:'Blank', order:1, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'porosityFamily', uid:'compactCharacteristic', name:'Compact', order:2, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'No observable pores.', new_uid:'textureCompactnessCompactCharacteristic'},
{family_uid:'porosityFamily', uid:'textureCompactnessNonCompactCharacteristic', name:'Non compact', order:3, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Pores are detected.'},
{family_uid:'cohesionFamily', uid:'textureCohesionBlankCharacteristic', name:'Blank', order:4, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'cohesionFamily', uid:'brittleCharacteristic', name:'Brittle', order:5, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Can be fragmented by pressure with a steel tip, or a scalpel to form piles of varying sizes. ', new_uid:'textureCohesionBrittleCharacteristic'},
{family_uid:'cohesionFamily', uid:'friableCharacteristic', name:'Friable', order:6, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Can be crushed with a scalpel or steel tip to form a powder.', new_uid:'textureCohesionFriableCharacteristic'},
{family_uid:'cohesionFamily', uid:'malleableCharacteristic', name:'Malleable', order:7, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Can be poked in with a steel spike or scalpel and plastically deformed. Can also be flattened mechanically without being pulverized (Syn. plastic).', new_uid:'textureCohesionMalleableCharacteristic'},
{family_uid:'cohesionFamily', uid:'powderyCharacteristic', name:'Powdery', order:8, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Has no cohesion: is easily penetrated by a steel needle or a scalpel, or even a wooden stick without effort.',  image_url: null, new_uid:'textureCohesionPowderyCharacteristic'},
{family_uid:'cohesionFamily', uid:'severableCharacteristic', name:'Severable', order:9, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Can be cut with a scalpel forming lumps or chips without being plastically deformed.', new_uid:'textureCohesionSeverableCharacteristic'},
{family_uid:'cohesionFamily', uid:'toughCharacteristic', name:'Tough', order:10, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cannot be shattered by pressure with a steel tip or scalpel.', new_uid:'textureCohesionToughCharacteristic'},
{family_uid:'hardnessFamily', uid:'textureHardnessBlankCharacteristic', name:'Blank', order:11, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'hardnessFamily', uid:'verySoftCharacteristic', name:'Very soft', order:12, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Scratchable with a hardwood tip (boxwood, yew). Hardness Mohs < 3.', new_uid:'textureHardnessVerySoftCharacteristic'},
{family_uid:'hardnessFamily', uid:'softCharacteristic', name:'Soft', order:13, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Is not scratchable with a hardwood tip, but is easily scratched with a hardened steel spike. Mohs hardness > 3 and < 5.', new_uid:'textureHardnessSoftCharacteristic'},
{family_uid:'hardnessFamily', uid:'hardCharacteristic', name:'Hard', order:14, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Hardly scratchable with a hardened steel tip. Mohs hardness > 5 and < 7.', new_uid:'textureHardnessHardCharacteristic'},
{family_uid:'hardnessFamily', uid:'veryHardCharacteristic', name:'Very hard', order:15, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Is not scratched by a hardened steel tip. Mohs hardness > 7.', new_uid:'textureHardnessVeryHardCharacteristic'},
{family_uid:'crackingStructureFamily', uid:'structureBlankCharacteristic', name:'Blank', order:16, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'crackingStructureFamily', uid:'noCracksCharacteristic', name:'No crack', order:17, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'No crack visible at this observation scale.', new_uid:'structureNoCrackCharacteristic'},
{family_uid:'crackingStructureFamily', uid:'simpleCrackingStructureCharacteristic', name:'Simple', order:18, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Isolated crack.', new_uid:'structureSimpleCharacteristic'},
{family_uid:'crackingStructureFamily', uid:'branchedCrackingStructureCharacteristic', name:'Branched', order:19, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Crack separating into several cracks.', new_uid:'structureBranchedCharacteristic'},
{family_uid:'crackingStructureFamily', uid:'networkCrackingStructureCharacteristic', name:'Network', order:20, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cracks distributed over the entire surface observed according to geometrical shapes.', new_uid:'structureNetworkCharacteristic'},
{family_uid:'crackingSurfaceDirectionFamily', uid:'surfaceDirectionBlankCharacteristic', name:'Blank', order:21, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'crackingSurfaceDirectionFamily', uid:'circularSurfaceDirectionCharacteristic', name:'Circular', order:22, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Versus the object geometry.', new_uid:'surfaceDirectionCircularCharacteristic'},
{family_uid:'crackingSurfaceDirectionFamily', uid:'longitudinalSurfaceDirectionCharacteristic', name:'Longitudinal', order:23, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Versus the object geometry.', new_uid:'surfaceDirectionLongitudinalCharacteristic'},
{family_uid:'crackingSurfaceDirectionFamily', uid:'obliqueSurfaceDirectionCharacteristic', name:'Oblique', order:24, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Versus the object geometry.', new_uid:'surfaceDirectionObliqueCharacteristic'},
{family_uid:'crackingSurfaceDirectionFamily', uid:'surfaceDirectionTransvereCharacteristic', name:'Transvere', order:25, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Versus the object geometry.'},
{family_uid:'crackingInwardDirectionFamily', uid:'inwardDirectionBlankCharacteristic', name:'Blank', order:26, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'crackingInwardDirectionFamily', uid: 'obliqueInwardDirectionCharacteristic', name:'Oblique', order:27, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Oblique to the object geometry', new_uid:'inwardDirectionObliqueCharacteristic'},
{family_uid:'crackingInwardDirectionFamily', uid:'parallelInwardDirectionCharacteristic', name:'Parallel', order:28, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Parallel to the object geometry', new_uid:'inwardDirectionParallelCharacteristic'},
{family_uid:'crackingInwardDirectionFamily', uid:'circularInwardDirectionCharacteristic', name:'Perpendicular', order:29, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Perpendicular to the object geometry', new_uid:'inwardDirectionPerpendicularCharacteristic'},
{family_uid:'crackingWidthFamily', uid:'narrowWidthCharacteristic', name:'Narrow', order:30, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Thinner than the back of a scalpel blade type 11 < 400µm.', new_uid:'widthNarrowCharacteristic'},
{family_uid:'crackingWidthFamily', uid:'largeWidthCharacteristic', name:'Large', order:31, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Larger than the back of a scalpel blade type 11 > 400µm. ', new_uid:'widthLargeCharacteristic'},
{family_uid:'crackingFillingFamily', uid:'emptyFillingCharacteristic', name:'Empty', order:32, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cracks with an empty space between the walls.', new_uid:'fillingEmptyCharacteristic'},
{family_uid:'crackingFillingFamily', uid:'filledFillingCharacteristic', name:'Filled', order:33, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cracks in which the space between the walls is filled with another material.', new_uid:'fillingFilledCharacteristic'},
{family_uid:'crackingEdgesFamily', uid:'sharpEdgesCharacteristic', name:'Sharp', order:34, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cracks with fine edges.', new_uid:'edgesSharpCharacteristic'},
{family_uid:'crackingEdgesFamily', uid:'roundedEdgesCharacteristic', name:'Rounded', order:35, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cracks with rounded edges.', new_uid:'edgesRoundedCharacteristic'},
{family_uid:'crackingTypeOfCracksFamily', uid:'dishingTypeOfCracksCharacteristic', name:'Dishing', order:36, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Scale separation due to circular cracking.', image_url:'https://lh4.googleusercontent.com/GlnmQCgLJobS7onSNiQ4VPMqGLcGwsEDj6bfJ-3-nMSRka5O9M0k3sJaZIsqhwu4ash4TGfpVxyALyZd5YWjipxyi-4jA9oHKMjy5DWiZj80Yh225DOd_tyhS5ka3LY0KZXe2Vytvg=w126-h123', new_uid:'typeOfCracksDishingCharacteristic'},
{family_uid:'crackingTypeOfCracksFamily', uid:'flakingTypeOfCracksCharacteristic', name:'Flaking', order:37, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Separation of the CP strata from the metal core (CM, M strata) as a result of tangential cracking.', image_url:'https://lh5.googleusercontent.com/2kbl0b789GrCBlVEhXToYYTgCDlfPUAQaEFvTN6YBfxOIj1cDWR6oWlbqxQ6Pv0CeEcuMoqu9RPzCkKH0-_bTPVTla_d-tWtAd6qFqqi5dJyyMZ69xusFrWhyRx2M1GgpNjiIpjV5w=w126-h112', new_uid:'typeOfCracksFlakingCharacteristic'},
{family_uid:'crackingTypeOfCracksFamily', uid:'starShapedTypeOfCracksCharacteristic', name:'Star-shaped cracking', order:38, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Perpendicular cracks branching from a centre in all directions.', image_url:'https://lh5.googleusercontent.com/Ai817xaYriJs8zcqJzPw-YteW8yJ4PaM_xC74N3rPszEUcZL3fZEKt4xzUlUZbDAq9TLii2iHXtNzRpCFXWWUz_UmsYzaxME15sOKsSrVxNLvdIUX6g-jcvH0y-izfifqB7OWb9naw=w126-h109', new_uid:'typeOfCracksStarShapedCrackingCharacteristic'},
{family_uid:'crackingTypeOfCracksFamily', uid:'surfaceCrazingTypeOfCracksCharacteristic', name:'Surface crazing', order:39, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Network of perpendicular cracks of variable width covering the entire surface observed', image_url:'https://lh4.googleusercontent.com/VuP-OX4UJIz1rOSatGbLlHcjSbW5H9yKOlJ9GQ40RSBII-SHVLkwLX4LTUWXb0uMrhWk9P5VJnrIjPjy4rdTP859oS5nL6wyTC58NO2TWXILoK4Z1uVn6EGwEJXiuqVB2u5j7M9Urg=w126-h128', new_uid:'typeOfCracksSurfaceCrazingCharacteristic'},
{family_uid:'crackingTypeOfCracksFamily', uid:'wedgesTypeOfCracksCharacteristic', name:'Wedges', order:40, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Perpendicular radial cracking. May lead to separation into wedge-shaped fragments.', image_url:'https://lh5.googleusercontent.com/pUcYBZUjf-AcdKQjW0UZwVpgrrA6_vfFbI5XVV6p5kfPjbiSrVBXUXH3jqr_WecsViVRDVA7OdPzr12SJ1W3BXSgU7BF1gcjbenpd5f43GwzqLv67cHACyyZftjYO1qN7_JWWQw_iA=w126-h128', new_uid:'typeOfCracksWedgesCharacteristic'},

 //Cross-section CHARACTERISTICS
// new fieldset=Cracking
{family_uid:'crackingStructureCSFamily', uid:'structureBlankCSCharacteristic', name:'Blank', order:1, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'crackingStructureCSFamily', uid:'noCrackCrackingStructureCSCharacteristic', name:'No crack', order:2, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'No crack visible at this observation scale.', new_uid:'structureNoCrackCSCharacteristic'},
{family_uid:'crackingStructureCSFamily', uid:'simpleCrackingStructureCSCharacteristic', name:'Simple', order:3, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Isolated crack.', new_uid:'structureSimpleCSCharacteristic'},
{family_uid:'crackingStructureCSFamily', uid:'branchedCrackingStructureCSCharacteristic', name:'Branched', order:4, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Crack separating into several cracks.', new_uid:'structureBranchedCSCharacteristic'},
{family_uid:'crackingStructureCSFamily', uid:'networkCrackingStructureCSCharacteristic', name:'Network', order:5, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cracks distributed over the entire surface observed according to geometrical shapes.', new_uid:'structureNetworkCSCharacteristic'},
{family_uid:'crackingInwardDirectionCSFamily', uid:'inwardDirectionBlankCSCharacteristic', name:'Blank', order:6, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'crackingInwardDirectionCSFamily', uid:'obliqueInwardDirectionCSCharacteristic', name:'Oblique', order:7, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Oblique to the object geometry.', new_uid:'inwardDirectionObliqueCSCharacteristic'},
{family_uid:'crackingInwardDirectionCSFamily', uid:'parallelInwardDirectionCSCharacteristic', name:'Parallel', order:8, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Parallel to the object geometry.', new_uid:'inwardDirectionParallelCSCharacteristic'},
{family_uid:'crackingInwardDirectionCSFamily', uid:'circularInwardDirectionCSCharacteristic', name:'Perpendicular', order:9, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Perpendicular to the object geometry.', new_uid:'inwardDirectionPerpendicularCSCharacteristic'},
{family_uid:'crackingFillingCSFamily', uid:'emptyFillingCSCharacteristic', name:'Empty', order:10, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cracks with an empty space between the walls.', new_uid:'fillingEmptyCSCharacteristic'},
{family_uid:'crackingFillingCSFamily', uid:'filledFillingCSCharacteristic', name:'Filled', order:11, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Cracks in which the space between the walls is filled with another material.', new_uid:'fillingFilledCSCharacteristic'}
]
AS updt
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
{old:'slightlyPorousCharacteristic', new:'textureCompactnessNonCompactCharacteristic'},
{old:'highlyPorousCharacteristic', new:'textureCompactnessNonCompactCharacteristic'},
{old:'porousCharacteristic', new:'textureCompactnessNonCompactCharacteristic'},
// former crackingFamily characteristcs to delete
{old:'branchedCracksCharacteristic', new:'branchedCrackingStructureCharacteristic'},
{old:'networkCracksCharacteristic', new:'networkCrackingStructureCharacteristic'},
{old:'simpleCracksCharacteristic', new:'simpleCrackingStructureCharacteristic'}
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
'slightlyPorousCharacteristic',
'highlyPorousCharacteristic',
'porousCharacteristic',
'branchedCracksCharacteristic',
'networkCracksCharacteristic',
'simpleCracksCharacteristic',
'textureCompactnessSlightyPorousCharacteristic',
'textureCompactnessVeryPorousCharacteristic',
'noCrackCrackingStructureCharacteristic',
'transverseSurfaceDirectionCharacteristic'
]
 AS uid
MATCH (c:Characteristic {uid:uid})
DETACH DELETE c;

// delete obsolete now empty Family
UNWIND [
'crackingFamily',
'crackingWidthVarFamily', //was wrongly added in mc-382-add-familygroup-and-variable.cql
'compactnessVarFamily'
]
 AS uid
MATCH (f:Family {uid:uid})
DETACH DELETE f;
