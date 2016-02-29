from ..neo4jDaoImpl.Neo4JDAO import Neo4jDAO


class MiCorrService:
    db = None
    def __init__(self):
        if MiCorrService.db == None:
            MiCorrService.db = Neo4jDAO()

    def getAllArtefacts(self):
        MiCorrService.db.begin()
        return MiCorrService.db.getAllArtefacts()

    def getStratigraphyByArtefact(self, artefact):
        MiCorrService.db.begin()
        return MiCorrService.db.getStratigraphyByArtefact(artefact)

    def stratigraphyExists(self, stratigraphy):
        MiCorrService.db.begin()
        return MiCorrService.db.stratigraphyExists(stratigraphy)

    def addStratigraphy(self, artefact, stratigraphy):
        MiCorrService.db.begin()
        ret = MiCorrService.db.addStratigraphy(artefact, stratigraphy)
        MiCorrService.db.commit()
        return ret

    def getAllCharacteristic(self):
        MiCorrService.db.begin()
        return MiCorrService.db.getAllCharacteristic()

    def getStratigraphyDetails(self, stratigraphy):
        MiCorrService.db.begin()
        return MiCorrService.db.getStratigraphyDetails(stratigraphy)

    def save(self, data):
        MiCorrService.db.begin()
        ret = MiCorrService.db.save(data)
        MiCorrService.db.commit()
        return ret

    def match(self, data):
        MiCorrService.db.begin()
        return MiCorrService.db.match(data)

    def deleteStratigrapy(self, stratigraphy):
        MiCorrService.db.begin()
        MiCorrService.db.deleteAllStrataFromAStratigraphy(stratigraphy)
        ret = MiCorrService.db.deleteStratigraphy(stratigraphy)
        MiCorrService.db.commit()
        return ret

    def addArtefact(self, artefact):
        MiCorrService.db.begin()
        return MiCorrService.db.addArtefact(artefact)

    def delArtefact(self, artefact):
        MiCorrService.db.begin()
        ret = MiCorrService.db.delArtefact(artefact)
        MiCorrService.db.commit()
        return ret

    def test(self):
        return MiCorrService.db.test()

    def getnaturefamily(self, nature):
        MiCorrService.db.begin()
        return MiCorrService.db.getnaturefamily(nature)