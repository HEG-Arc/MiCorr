from .neo4jdao import Neo4jDAO

_OBSERVATIONS = [
    {'name': 'Binocular', 'observationMode': 'BI', 'colourFamily': 'colourFamily'},
    {'name': 'CS - Bright field', 'observationMode': 'CS', 'colourFamily': 'morphologyColourWithOpticalMicroscopeBrightFieldCSFamily'},
    {'name': 'CS - Dark field', 'observationMode': 'CS', 'colourFamily': 'morphologyColourWithOpticalMicroscopeDarkFieldCSFamily'},
    {'name': 'CS - SE', 'observationMode': 'CS', 'colourFamily': 'morphologyColourWithScanningElectronMicroscopeSecondaryElectronsCSFamily'},
    {'name': 'CS - BSE', 'observationMode': 'CS', 'colourFamily': 'morphologyColourWithScanningElectronMicroscopeBackscatteredElectronsCSFamily'}
]

class MiCorrService:

    def __init__(self):
        self.db = Neo4jDAO()

    def getStratigraphyUser(self, stratigraphy):
        with self.db.transaction():
            return self.db.getStratigraphyUser(stratigraphy)

    def setStratigraphyUser(self, stratigraphy, user_id):
        with self.db.transaction():
            return self.db.setStratigraphyUser(stratigraphy, user_id)

    def delStratigraphyUser(self, stratigraphy):
        with self.db.transaction():
            return self.db.delStratigraphyUser(stratigraphy)

    def updateStratigraphyDescription(self, stratigraphy, description):
        with self.db.transaction():
            return self.db.updateStratigraphyDescription(stratigraphy, description)

    def getAllArtefacts(self):
        with self.db.transaction():
            return self.db.getAllArtefacts()

    def getStratigraphyByArtefact(self, artefact):
        with self.db.transaction():
            return self.db.getStratigraphyByArtefact(artefact)

    def stratigraphyExists(self, stratigraphy):
        with self.db.transaction():
            return self.db.stratigraphyExists(stratigraphy)

    def addStratigraphy(self, artefact, stratigraphy):
        with self.db.transaction():
            return self.db.addStratigraphy(artefact, stratigraphy)


    def getAllCharacteristic(self):
        with self.db.transaction():
            return self.db.getAllCharacteristic()

    def getStratigraphyDetails(self, stratigraphy):
        with self.db.transaction():
            return self.db.getStratigraphyDetails(stratigraphy)

    def getStratigraphiesByUser(self, user_id, order_by='description'):
        with self.db.transaction():
            return self.db.getStratigraphiesByUser(user_id,order_by)

    def save(self, data):
        with self.db.transaction():
            return self.db.save(data)

    def match(self, data):
        with self.db.transaction():
            return self.db.match(data)

    def deleteStratigraphy(self, stratigraphy):
        with self.db.transaction():
            self.db.deleteAllStrataFromAStratigraphy(stratigraphy)
            return self.db.deleteStratigraphy(stratigraphy)

    def addArtefact(self, artefact):
        with self.db.transaction():
            return self.db.addArtefact(artefact)

    def delArtefact(self, artefact):
        with self.db.transaction():
            return self.db.delArtefact(artefact)

    def test(self):
        return self.db.test()

    def getnaturefamily(self, nature):
        with self.db.transaction():
            return self.db.getnaturefamily(nature)

    def share_stratigraphy(self, user_id, stratigraphy, recipient_user_id, recipient_email=None):
        with self.db.transaction():
            return self.db.share_stratigraphy(user_id, stratigraphy, recipient_user_id, recipient_email)

    def get_all_shares(self, stratigraphy):
        with self.db.transaction():
            return self.db.get_all_shares(stratigraphy)

    def delete_stratigraphy_share(self, user_id, stratigraphy, recipient_user_id):
        with self.db.transaction():
            return self.db.delete_stratigraphy_share(user_id, stratigraphy, recipient_user_id)



    @classmethod
    def getObservations(cls):
        return _OBSERVATIONS
