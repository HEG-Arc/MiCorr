from .neo4jdao import Neo4jDAO


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

    def deleteStratigrapy(self, stratigraphy):
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
