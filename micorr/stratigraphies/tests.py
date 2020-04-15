from django.test import TestCase, Client

from jsoncompare import  jsoncompare
from deepdiff import DeepDiff
import json

STRATIGRAPHY_REFS = {
#'67d11e72-2574-11e6-a316-000c29148083':{"strata": [{"name": "67d11e72-2574-11e6-a316-000c29148083_Strata1", "characteristics": [{"visible": False, "order": 13, "name": "cpExtensionSi", "family": "cpCompositionExtensionFamily", "real_name": "Si"}, {"visible": False, "order": 3, "name": "cpCuCharacteristic", "family": "cpCompositionFamily", "real_name": "Cu"}, {"visible": True, "order": 6, "name": "noMicrostructureCharacteristic", "family": "cpriMicrostructureFamily", "real_name": "no microstructure"}, {"visible": True, "order": 1, "name": "branchedCracksCharacteristic", "family": "crackingFamily", "real_name": "branched cracks"}, {"visible": False, "order": 6, "name": "toughCharacteristic", "family": "cohesionFamily", "real_name": "tough"}, {"visible": False, "order": 3, "name": "hardCharacteristic", "family": "hardnessFamily", "real_name": "hard"}, {"visible": True, "order": 1, "name": "compactCharacteristic", "family": "porosityFamily", "real_name": "compact"}, {"visible": False, "order": 1, "name": "opaqueCharacteristic", "family": "opacityFamily", "real_name": "opaque"}, {"visible": True, "order": 10, "name": "darkGreenCharacteristic", "family": "colourFamily", "real_name": "dark green"}, {"visible": True, "order": 1, "name": "continuousCharacteristic", "family": "continuityFamily", "real_name": "continuous"}, {"visible": True, "order": 2, "name": "normalWidthCharacteristic", "family": "widthFamily", "real_name": "medium"}, {"visible": False, "order": 2, "name": "notMagneticCharacteristic", "family": "magnetismFamily", "real_name": "non magnetic"}, {"visible": False, "order": 10, "name": "matteCharacteristic", "family": "brightnessFamily", "real_name": "matte"}, {"visible": False, "order": 1, "name": "longitudinalCharacteristic", "family": "directionFamily", "real_name": "longitudinal"}, {"visible": True, "order": 2, "name": "normalThicknessCharacteristic", "family": "thicknessFamily", "real_name": "medium"}, {"visible": False, "order": 12, "name": "layerFilmCoatingCharacteristic", "family": "shapeFamily", "real_name": "layer/film/coating"}, {"visible": False, "order": 2, "name": "cpCharacteristic", "family": "natureFamily", "real_name": "Corrosion products"}], "interfaces": {"characteristics": [{"name": "sharpCharacteristic", "family": "interfaceTransitionFamily"}, {"name": "roughCharacteristic", "family": "interfaceRoughnessFamily"}, {"name": "irregularCharacteristic", "family": "interfaceProfileFamily"}], "name": "67d11e72-2574-11e6-a316-000c29148083_Strata1_interface1"}, "subcharacteristics": [], "children": [], "containers": {"cpCompositionMainElements": [{"category": "transition metal", "name": "Cu", "symbol": "Cu", "number": 29, "real_name": "Copper", "phase": "Solid", "version": 4, "date": "2018-02-09"}], "cpCompositionSecondaryElements": [{"category": "polyatomic nonmetal", "symbol": "S", "number": 16, "real_name": "Sulfur", "phase": "Solid", "version": 4, "date": "2018-02-09", "name": "S"}, {"category": "diatomic nonmetal", "symbol": "O", "number": 8, "real_name": "Oxygen", "phase": "Gas", "version": 4, "date": "2018-02-09", "name": "O"}, {"category": "diatomic nonmetal", "symbol": "H", "number": 1, "real_name": "Hydrogen", "phase": "Gas", "version": 4, "date": "2018-02-09", "name": "H"}], "cpCompositionAdditionalElements": [{"category": "metalloid", "name": "Si", "symbol": "Si", "number": 14, "real_name": "Silicon", "phase": "Solid", "version": 4, "date": "2018-02-09"}], "cpCompositionCompounds": [{"date": "2018-02-09", "real_name": "Brochantite (Cu4(OH)6SO4)", "version": 4, "name": "cpdBrochantite"}]}}, {"name": "67d11e72-2574-11e6-a316-000c29148083_Strata2", "characteristics": [{"visible": False, "order": 3, "name": "cpCuCharacteristic", "family": "cpCompositionFamily", "real_name": "Cu"}, {"visible": True, "order": 6, "name": "noMicrostructureCharacteristic", "family": "cpriMicrostructureFamily", "real_name": "no microstructure"}, {"visible": True, "order": 1, "name": "branchedCracksCharacteristic", "family": "crackingFamily", "real_name": "branched cracks"}, {"visible": False, "order": 6, "name": "toughCharacteristic", "family": "cohesionFamily", "real_name": "tough"}, {"visible": False, "order": 3, "name": "hardCharacteristic", "family": "hardnessFamily", "real_name": "hard"}, {"visible": True, "order": 1, "name": "compactCharacteristic", "family": "porosityFamily", "real_name": "compact"}, {"visible": False, "order": 1, "name": "opaqueCharacteristic", "family": "opacityFamily", "real_name": "opaque"}, {"visible": True, "order": 6, "name": "darkRedCharacteristic", "family": "colourFamily", "real_name": "dark red"}, {"visible": True, "order": 1, "name": "continuousCharacteristic", "family": "continuityFamily", "real_name": "continuous"}, {"visible": True, "order": 2, "name": "normalWidthCharacteristic", "family": "widthFamily", "real_name": "medium"}, {"visible": False, "order": 2, "name": "notMagneticCharacteristic", "family": "magnetismFamily", "real_name": "non magnetic"}, {"visible": False, "order": 10, "name": "matteCharacteristic", "family": "brightnessFamily", "real_name": "matte"}, {"visible": False, "order": 1, "name": "longitudinalCharacteristic", "family": "directionFamily", "real_name": "longitudinal"}, {"visible": True, "order": 3, "name": "thinCharacteristic", "family": "thicknessFamily", "real_name": "thin"}, {"visible": False, "order": 12, "name": "layerFilmCoatingCharacteristic", "family": "shapeFamily", "real_name": "layer/film/coating"}, {"visible": False, "order": 2, "name": "cpCharacteristic", "family": "natureFamily", "real_name": "Corrosion products"}], "interfaces": {"characteristics": [{"name": "adherentCharacteristic", "family": "interfaceAdherenceFamily"}, {"name": "sharpCharacteristic", "family": "interfaceTransitionFamily"}, {"name": "roughCharacteristic", "family": "interfaceRoughnessFamily"}, {"name": "irregularCharacteristic", "family": "interfaceProfileFamily"}], "name": "67d11e72-2574-11e6-a316-000c29148083_Strata2_interface2"}, "subcharacteristics": [], "children": [], "containers": {"cpCompositionMainElements": [{"category": "transition metal", "name": "Cu", "symbol": "Cu", "number": 29, "real_name": "Copper", "phase": "Solid", "version": 4, "date": "2018-02-09"}], "cpCompositionSecondaryElements": [{"category": "diatomic nonmetal", "symbol": "O", "number": 8, "real_name": "Oxygen", "phase": "Gas", "version": 4, "date": "2018-02-09", "name": "O"}], "cpCompositionAdditionalElements": [{"category": "polyatomic nonmetal", "symbol": "S", "number": 16, "real_name": "Sulfur", "phase": "Solid", "version": 4, "date": "2018-02-09", "name": "S"}], "cpCompositionCompounds": [{"date": "2018-02-09", "real_name": "Cuprite (Cu2O)", "version": 4, "name": "cpdCuprite"}]}}, {"name": "67d11e72-2574-11e6-a316-000c29148083_Strata3", "characteristics": [{"visible": True, "order": 3, "name": "grainLargeCharacteristic", "family": "mMicrostructureFamily", "real_name": "large grain"}, {"visible": True, "order": 3, "name": "noCracksCharacteristic", "family": "crackingFamily", "real_name": "no crack"}, {"visible": False, "order": 6, "name": "toughCharacteristic", "family": "cohesionFamily", "real_name": "tough"}, {"visible": False, "order": 3, "name": "hardCharacteristic", "family": "hardnessFamily", "real_name": "hard"}, {"visible": True, "order": 1, "name": "compactCharacteristic", "family": "porosityFamily", "real_name": "compact"}, {"visible": False, "order": 1, "name": "opaqueCharacteristic", "family": "opacityFamily", "real_name": "opaque"}, {"visible": True, "order": 1, "name": "continuousCharacteristic", "family": "continuityFamily", "real_name": "continuous"}, {"visible": True, "order": 2, "name": "normalWidthCharacteristic", "family": "widthFamily", "real_name": "medium"}, {"visible": False, "order": 2, "name": "notMagneticCharacteristic", "family": "magnetismFamily", "real_name": "non magnetic"}, {"visible": False, "order": 1, "name": "metallicCharacteristic", "family": "brightnessFamily", "real_name": "metallic"}, {"visible": False, "order": 1, "name": "longitudinalCharacteristic", "family": "directionFamily", "real_name": "longitudinal"}, {"visible": True, "order": 1, "name": "thickCharacteristic", "family": "thicknessFamily", "real_name": "thick"}, {"visible": False, "order": 16, "name": "parallelepipedalCharacteristic", "family": "shapeFamily", "real_name": "parallelepipedal"}, {"visible": True, "order": 7, "name": "pinkCharacteristic", "family": "colourFamily", "real_name": "pink"}, {"visible": False, "order": 4, "name": "mCharacteristic", "family": "natureFamily", "real_name": "Metal"}], "interfaces": {"characteristics": [{"name": "looselyCharacteristic", "family": "interfaceAdherenceFamily"}, {"name": "sharpCharacteristic", "family": "interfaceTransitionFamily"}, {"name": "roughCharacteristic", "family": "interfaceRoughnessFamily"}, {"name": "irregularCharacteristic", "family": "interfaceProfileFamily"}], "name": "67d11e72-2574-11e6-a316-000c29148083_Strata3_interface3"}, "subcharacteristics": [{"name": "inclusionsGrainLarge", "real_name": "inclusions"}, {"name": "twinLinesGrainLarge", "real_name": "twin lines / Newmann bands"}], "children": [], "containers": {"mCompositionMainElements": [{"category": "transition metal", "name": "Cu", "symbol": "Cu", "number": 29, "real_name": "Copper", "phase": "Solid", "version": 4, "date": "2018-02-09"}]}}], "uid": "67d11e72-2574-11e6-a316-000c29148083", "description": "Shingle of a roof"},
'67d11e72-2574-11e6-a316-000c29148083':{"strata": [{"name": "67d11e72-2574-11e6-a316-000c29148083_Strata1", "characteristics": [{"visible": False, "order": 13, "name": "cpExtensionSi", "family": "cpCompositionExtensionFamily", "real_name": "Si"}, {"visible": False, "order": 3, "name": "cpCuCharacteristic", "family": "cpCompositionFamily", "real_name": "Cu"}, {"visible": True, "order": 6, "name": "noMicrostructureCharacteristic", "family": "cpriMicrostructureFamily", "real_name": "no microstructure"}, {"visible": True, "order": 1, "name": "branchedCracksCharacteristic", "family": "crackingFamily", "real_name": "branched cracks"}, {"visible": False, "order": 6, "name": "toughCharacteristic", "family": "cohesionFamily", "real_name": "tough"}, {"visible": False, "order": 3, "name": "hardCharacteristic", "family": "hardnessFamily", "real_name": "hard"}, {"visible": True, "order": 1, "name": "compactCharacteristic", "family": "porosityFamily", "real_name": "compact"}, {"visible": False, "order": 1, "name": "opaqueCharacteristic", "family": "opacityFamily", "real_name": "opaque"}, {"visible": True, "order": 10, "name": "darkGreenCharacteristic", "family": "colourFamily", "real_name": "dark green"}, {"visible": True, "order": 1, "name": "continuousCharacteristic", "family": "continuityFamily", "real_name": "continuous"}, {"visible": True, "order": 2, "name": "normalWidthCharacteristic", "family": "widthFamily", "real_name": "medium"}, {"visible": False, "order": 2, "name": "notMagneticCharacteristic", "family": "magnetismFamily", "real_name": "non magnetic"}, {"visible": False, "order": 10, "name": "matteCharacteristic", "family": "brightnessFamily", "real_name": "matte"}, {"visible": False, "order": 1, "name": "longitudinalCharacteristic", "family": "directionFamily", "real_name": "longitudinal"}, {"visible": True, "order": 2, "name": "normalThicknessCharacteristic", "family": "thicknessFamily", "real_name": "medium"}, {"visible": False, "order": 12, "name": "layerFilmCoatingCharacteristic", "family": "shapeFamily", "real_name": "layer/film/coating"}, {"visible": False, "order": 2, "name": "cpCharacteristic", "family": "natureFamily", "real_name": "Corrosion products"}], "interfaces": {"characteristics": [{"name": "sharpCharacteristic", "family": "interfaceTransitionFamily"}, {"name": "roughCharacteristic", "family": "interfaceRoughnessFamily"}, {"name": "irregularCharacteristic", "family": "interfaceProfileFamily"}], "name": "67d11e72-2574-11e6-a316-000c29148083_Strata1_interface1"}, "subcharacteristics": [], "children": [], "containers": {"cpCompositionMainElements": [{"category": "transition metal", "name": "Cu", "symbol": "Cu", "number": 29, "real_name": "Copper", "phase": "Solid", "version": 4, "date": "2018-02-09"}], "cpCompositionSecondaryElements": [{"category": "polyatomic nonmetal", "symbol": "S", "number": 16, "real_name": "Sulfur", "phase": "Solid", "version": 4, "date": "2018-02-09", "name": "S"}, {"category": "diatomic nonmetal", "symbol": "O", "number": 8, "real_name": "Oxygen", "phase": "Gas", "version": 4, "date": "2018-02-09", "name": "O"}, {"category": "diatomic nonmetal", "symbol": "H", "number": 1, "real_name": "Hydrogen", "phase": "Gas", "version": 4, "date": "2018-02-09", "name": "H"}], "cpCompositionAdditionalElements": [{"category": "metalloid", "name": "Si", "symbol": "Si", "number": 14, "real_name": "Silicon", "phase": "Solid", "version": 4, "date": "2018-02-09"}], "cpCompositionCompounds": [{"date": "2018-02-09", "real_name": "Brochantite (Cu4(OH)6SO4)", "version": 4, "name": "cpdBrochantite"}]}}, {"name": "67d11e72-2574-11e6-a316-000c29148083_Strata2", "characteristics": [{"visible": False, "order": 3, "name": "cpCuCharacteristic", "family": "cpCompositionFamily", "real_name": "Cu"}, {"visible": True, "order": 6, "name": "noMicrostructureCharacteristic", "family": "cpriMicrostructureFamily", "real_name": "no microstructure"}, {"visible": True, "order": 1, "name": "branchedCracksCharacteristic", "family": "crackingFamily", "real_name": "branched cracks"}, {"visible": False, "order": 6, "name": "toughCharacteristic", "family": "cohesionFamily", "real_name": "tough"}, {"visible": False, "order": 3, "name": "hardCharacteristic", "family": "hardnessFamily", "real_name": "hard"}, {"visible": True, "order": 1, "name": "compactCharacteristic", "family": "porosityFamily", "real_name": "compact"}, {"visible": False, "order": 1, "name": "opaqueCharacteristic", "family": "opacityFamily", "real_name": "opaque"}, {"visible": True, "order": 6, "name": "darkRedCharacteristic", "family": "colourFamily", "real_name": "dark red"}, {"visible": True, "order": 1, "name": "continuousCharacteristic", "family": "continuityFamily", "real_name": "continuous"}, {"visible": True, "order": 2, "name": "normalWidthCharacteristic", "family": "widthFamily", "real_name": "medium"}, {"visible": False, "order": 2, "name": "notMagneticCharacteristic", "family": "magnetismFamily", "real_name": "non magnetic"}, {"visible": False, "order": 10, "name": "matteCharacteristic", "family": "brightnessFamily", "real_name": "matte"}, {"visible": False, "order": 1, "name": "longitudinalCharacteristic", "family": "directionFamily", "real_name": "longitudinal"}, {"visible": True, "order": 3, "name": "thinCharacteristic", "family": "thicknessFamily", "real_name": "thin"}, {"visible": False, "order": 12, "name": "layerFilmCoatingCharacteristic", "family": "shapeFamily", "real_name": "layer/film/coating"}, {"visible": False, "order": 2, "name": "cpCharacteristic", "family": "natureFamily", "real_name": "Corrosion products"}], "interfaces": {"characteristics": [{"name": "adherentCharacteristic", "family": "interfaceAdherenceFamily"}, {"name": "sharpCharacteristic", "family": "interfaceTransitionFamily"}, {"name": "roughCharacteristic", "family": "interfaceRoughnessFamily"}, {"name": "irregularCharacteristic", "family": "interfaceProfileFamily"}], "name": "67d11e72-2574-11e6-a316-000c29148083_Strata2_interface2"}, "subcharacteristics": [], "children": [], "containers": {"cpCompositionMainElements": [{"category": "transition metal", "name": "Cu", "symbol": "Cu", "number": 29, "real_name": "Copper", "phase": "Solid", "version": 4, "date": "2018-02-09"}], "cpCompositionSecondaryElements": [{"category": "diatomic nonmetal", "symbol": "O", "number": 8, "real_name": "Oxygen", "phase": "Gas", "version": 4, "date": "2018-02-09", "name": "O"}], "cpCompositionAdditionalElements": [{"category": "polyatomic nonmetal", "symbol": "S", "number": 16, "real_name": "Sulfur", "phase": "Solid", "version": 4, "date": "2018-02-09", "name": "S"}], "cpCompositionCompounds": [{"date": "2018-02-09", "real_name": "Cuprite (Cu2O)", "version": 4, "name": "cpdCuprite"}]}}, {"name": "67d11e72-2574-11e6-a316-000c29148083_Strata3", "characteristics": [{"visible": True, "order": 3, "name": "grainLargeCharacteristic", "family": "mMicrostructureFamily", "real_name": "large grain"}, {"visible": True, "order": 3, "name": "noCracksCharacteristic", "family": "crackingFamily", "real_name": "no crack"}, {"visible": False, "order": 6, "name": "toughCharacteristic", "family": "cohesionFamily", "real_name": "tough"}, {"visible": False, "order": 3, "name": "hardCharacteristic", "family": "hardnessFamily", "real_name": "hard"}, {"visible": True, "order": 1, "name": "compactCharacteristic", "family": "porosityFamily", "real_name": "compact"}, {"visible": False, "order": 1, "name": "opaqueCharacteristic", "family": "opacityFamily", "real_name": "opaque"}, {"visible": True, "order": 1, "name": "continuousCharacteristic", "family": "continuityFamily", "real_name": "continuous"}, {"visible": True, "order": 2, "name": "normalWidthCharacteristic", "family": "widthFamily", "real_name": "medium"}, {"visible": False, "order": 2, "name": "notMagneticCharacteristic", "family": "magnetismFamily", "real_name": "non magnetic"}, {"visible": False, "order": 1, "name": "metallicCharacteristic", "family": "brightnessFamily", "real_name": "metallic"}, {"visible": False, "order": 1, "name": "longitudinalCharacteristic", "family": "directionFamily", "real_name": "longitudinal"}, {"visible": True, "order": 1, "name": "thickCharacteristic", "family": "thicknessFamily", "real_name": "thick"}, {"visible": False, "order": 16, "name": "parallelepipedalCharacteristic", "family": "shapeFamily", "real_name": "parallelepipedal"}, {"visible": True, "order": 7, "name": "pinkCharacteristic", "family": "colourFamily", "real_name": "pink"}, {"visible": False, "order": 4, "name": "mCharacteristic", "family": "natureFamily", "real_name": "Metal"}], "interfaces": {"characteristics": [{"name": "looselyCharacteristic", "family": "interfaceAdherenceFamily"}, {"name": "sharpCharacteristic", "family": "interfaceTransitionFamily"}, {"name": "roughCharacteristic", "family": "interfaceRoughnessFamily"}, {"name": "irregularCharacteristic", "family": "interfaceProfileFamily"}], "name": "67d11e72-2574-11e6-a316-000c29148083_Strata3_interface3"}, "subcharacteristics": [{"name": "inclusionsGrainLarge", "real_name": "inclusions"}, {"name": "twinLinesGrainLarge", "real_name": "twin lines / Newmann bands"}], "children": [], "containers": {"mCompositionMainElements": [{"category": "transition metal", "name": "Cu", "symbol": "Cu", "number": 29, "real_name": "Copper", "phase": "Solid", "version": 4, "date": "2018-02-09"}]}}], "uid": "67d11e72-2574-11e6-a316-000c29148083", "description": "Shingle of a roof"},

}
class MicorrService(TestCase):
    """ Test module for micorrservice API """

    def setUp(self):
        self.client = Client()

    def test_getstratigraphydetails(self):
        # get API response
        # response = self.client.get('/micorr/json/getstratigraphydetails/')
        # self.assertEqual(response.status_code, 404)
        # we don't do actual service test as no neo4j test db is setup on travis.ci for now
        for s_uid in STRATIGRAPHY_REFS:
            response = self.client.get('/micorr/json/getstratigraphydetails/{uid}'.format(uid=s_uid))
            self.assertEqual(response.status_code, 200)
            stratigraphy = response.json()
            self.assertTrue('strata' in stratigraphy)
            self.assertTrue('description' in stratigraphy)
            self.assertTrue(len(stratigraphy['strata'])>0)
            str_ref = json.dumps(STRATIGRAPHY_REFS[s_uid], sort_keys=True)
            str_test = json.dumps(stratigraphy, sort_keys=True)
            print(('\n/micorr/json/getstratigraphydetails/{uid} =>\n{dump}'.format(uid=s_uid,dump=str_test)))
            #cmp_res=jsoncompare.are_same(str_ref, str_test, True)
            cmp_res=jsoncompare.are_same(STRATIGRAPHY_REFS[s_uid], stratigraphy, True)
            ddiff = DeepDiff(STRATIGRAPHY_REFS[s_uid], stratigraphy, ignore_order=True)
            if ddiff:
                print(ddiff)
            #if not cmp_res[0]:
            #    print(cmp_res[1])
            self.assertTrue(cmp_res[0])

            # self.assertEqual(str_ref, str_test)

