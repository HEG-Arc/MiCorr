from collections import OrderedDict

from py2neo import Graph, authenticate
import time
import datetime
from py2neo import Node, Relationship
import uuid
from django.conf import settings
from artefacts.models import Artefact
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

class Neo4jDAO:
    # Initialisation de la connexion avec le serveur
    def __init__(self):
        # self.url = "http://MiCorr:hmqKUx4ehTQv0M7Z1STc@micorr.sb04.stations.graphenedb.com:24789/db/data/"
        neo4j_host = settings.NEO4J_HOST
        neo4j_auth = settings.NEO4J_AUTH.split(':')
        if len(neo4j_auth)!=2:
            raise ValueError('NEO4J_AUTH environment variable expected format user:pass')
        self.url = "http://%s:%s@%s/db/data" % (neo4j_auth[0], neo4j_auth[1], neo4j_host)
        self.graph = Graph(self.url)
        self.tx = self.graph.cypher.begin()

    def begin(self):
        self.tx = self.graph.cypher.begin()

    # commit des transaction. Si rien n'est precise, autocommit
    def commit(self):
        self.tx.process()
        self.tx.commit()

    def rollback(self):
        self.tx.rollback()

    def getStratigraphiesByUser(self, user_id, order_by='description'):
        stratigraphies = self.graph.cypher.execute("MATCH (n:Stratigraphy) WHERE n.user_uid=%s RETURN n ORDER BY n.%s" % (user_id, order_by))
        stratigraphies_list = []
        for stratigraphy in stratigraphies:
            # TODO: We should be able to use stratigraphy.date to access the properties of the record :-(
            if stratigraphy[0].properties['timestamp']:
                timestamp = datetime.datetime.fromtimestamp(float(stratigraphy[0].properties['timestamp'])).strftime('%Y-%m-%d %H:%M:%S')
            else:
                timestamp = None
            stratigraphies_list.append(
                {'date': stratigraphy[0].properties['date'], 'uid': stratigraphy[0].properties['uid'],
                 'description': stratigraphy[0].properties['description'],
                 'artefact_uid': stratigraphy[0].properties['artefact_uid'],
                 'timestamp': timestamp})
        return stratigraphies_list

    def getStratigraphyUser(self, stratigraphy):
        user_uid = self.graph.cypher.execute_one(
            "MATCH (n:Stratigraphy) WHERE n.uid='%s' RETURN n.user_uid" % stratigraphy)
        if user_uid:
            try:
                user_id = int(user_uid)
            except TypeError:
                user_id = None
        else:
            user_id = None
        return user_uid

    def setStratigraphyUser(self, stratigraphy, user_id):
        n = self.graph.cypher.execute_one("MATCH (n:`Stratigraphy`) WHERE n.uid='%s' RETURN n" % stratigraphy)
        n.properties["user_uid"] = user_id
        n.properties["creator_uid"] = user_id
        n.push()

    def delStratigraphyUser(self, stratigraphy):
        n = self.graph.cypher.execute_one("MATCH (n:`Stratigraphy`) WHERE n.uid='%s' REMOVE n.user_uid" % stratigraphy)
        return n

    def updateStratigraphyDescription(self, stratigraphy, description):
        n = self.graph.cypher.execute_one("MATCH (n:`Stratigraphy`) WHERE n.uid='%s' RETURN n" % stratigraphy)
        n.properties["description"] = description
        n.push()

    # retourne tous les details d'une stratigraphie, caracteristiques, sous-caracteristiques et interfaces
    # @params le nom de la stratigraphie
    # @returns tous les details de la stratigraphie voulue
    def getStratigraphyDetails(self, stratigraphy_uid):
        # on cherche d'abord toutes les strates
        strata_records = self.graph.cypher.execute(
            "MATCH (sg:Stratigraphy)-[r:POSSESSES]->(st:Strata) where sg.uid={uid}\
               RETURN sg.description as description, st.uid as uid order by st.uid",
            uid=stratigraphy_uid )

        stratigraphy = {'uid':stratigraphy_uid,
                        'description': strata_records[0].description if len(strata_records) else None,
                        'strata':[]
                        }
        print (stratigraphy_uid)

        # pour chaque strates on va faire une requete
        for strata in strata_records:
            st = {'name': strata.uid, 'characteristics': '', 'subcharacteristics': '', 'interfaces': '', 'children': ''}
            print ("***" + strata.uid)

            # Chaque strates a des caracteristiques
            charactList = self.graph.cypher.execute(
                "MATCH (n:Strata)-[r:IS_CONSTITUTED_BY]->(c:Characteristic)-[b:BELONGS_TO]->(f:Family) where n.uid='" + strata.uid + "' RETURN c.uid as uid, f.uid as family, c.name as real_name, c.visible as visible, c.order as order")
            print ("======Characteristic")
            clist = []
            for charact in charactList:
                clist.append({'name': charact.uid, 'family': charact.family, 'real_name': charact.real_name,
                              'order': charact.order, 'visible': charact.visible})
                print ("         " + charact.uid)

            # Chaque strate a des sous-caracteristiques
            print ("======subCharacteristic")
            subCharactList = self.graph.cypher.execute(
                "MATCH (s:Strata)-[r:IS_CONSTITUTED_BY]->(c:SubCharacteristic) where s.uid='" + strata.uid + "' RETURN c.uid as uid, c.name as real_name order by real_name")
            slist = []
            for subCharact in subCharactList:
                slist.append({'name': subCharact.uid, 'real_name': subCharact.real_name})
                print("         " + subCharact.uid)

            # Chaque strates a des interfaces
            print("======interface")
            interfaceName = self.graph.cypher.execute(
                "MATCH (s:Strata)-[r:HAS_UPPER_INTERFACE]->(n:Interface) where s.uid='" + strata.uid + "' RETURN n.uid as uid")

            if len(interfaceName) > 0:
                ilist = {'name': interfaceName[0].uid, 'characteristics': ''}
                interfaceList = self.graph.cypher.execute(
                    "MATCH (s:Strata)-[r:HAS_UPPER_INTERFACE]->(i:Interface) where s.uid='" + strata.uid + "' RETURN i.uid as uid")

                #Chaque interface a des caracteristiques
                intCharactList = self.graph.cypher.execute(
                    "MATCH (i:Interface)-[r:IS_CONSTITUTED_BY]->(c:Characteristic)-[b:BELONGS_TO]->(f:Family) where i.uid='" +
                    interfaceName[0].uid + "' RETURN c.uid as uid, f.uid as family")
                iclist = []
                for ic in intCharactList:
                    iclist.append({'name': ic.uid, 'family': ic.family})
                    print("            " + ic.uid)

                # on rassemble toutes les donnees dans c
                ilist['characteristics'] = iclist
                st['interfaces'] = ilist
            else:
                st['interfaces'] = []

            st['characteristics'] = clist
            st['subcharacteristics'] = slist



            #Recuperation des enfants

            childList = self.graph.cypher.execute("MATCH (a:Strata)-[r:IS_PARENT_OF]->(b:Strata) where a.uid='" + strata.uid + "' RETURN b.uid as uid")
            children = []
            for child in childList:
                cst = {'name': child.uid, 'characteristics': ''}

                # Chaque strate enfant a des caracteristiques
                print ("======Characteristic")
                childCharactList = self.graph.cypher.execute("MATCH (n:Strata)-[r:IS_CONSTITUTED_BY]->(c:Characteristic)-[b:BELONGS_TO]->(f:Family) where n.uid='" + child.uid + "' RETURN c.uid as uid, c.name as real_name, f.uid as family")
                childCList = []
                for charact in childCharactList:
                    childCList.append({'name': charact.uid, 'real_name': charact.real_name, 'family': charact.family})
                    print ("         " + charact.uid)


                '''
                # Chaque strate a des sous-caracteristiques
                print ("======subCharacteristic")
                subCharactList = self.graph.cypher.execute("MATCH (s:Strata)-[r:IS_CONSTITUTED_BY]->(c:SubCharacteristic) where s.uid='" + strata.uid + "' RETURN c.uid as uid, c.name as real_name")
                childSList = []
                for subCharact in subCharactList:
                    childSList.append({'name': subCharact.uid, 'real_name': subCharact.real_name})
                    print("         " + subCharact.uid)
                '''
                cst['characteristics'] = childCList
                children.append(cst)
                #childStList['subcharacteristics'] = childSList
            st['children'] = children;
            stratigraphy['strata'].append(st)
        return stratigraphy

    # retourne la liste de toutes les caracteristiques, sous-caracteristiques et sous-sous-caracteristiques
    # @params
    # @returns toutes les caracteristiques et sous-caracteristiques de la base
    def getAllCharacteristic(self):
        all_characteristics = self.graph.cypher.execute("""
         MATCH (f:Family) OPTIONAL MATCH (f)<-[:BELONGS_TO]-(c:Characteristic)
         OPTIONAL MATCH (c)-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic)
         OPTIONAL MATCH (sc)-[:HAS_SPECIALIZATION]->(ssc:SubCharacteristic)
         RETURN f,c,sc,ssc
         ORDER BY f.name, c.order, sc.name, ssc.name  
        """)
        # here we get a flat list of records including all family, Characteristic, SubCharacteristic, SubCharacteristic
        # convert it into hierarchical lists of f -> c -> sc -> ssc, setting field names as expected by api client
        # we use OrderedDicts to build the "lists" and easily create or update list items from redundant elements in records
        family_dic = OrderedDict()
        for record in all_characteristics:
            f_uid = record.f['uid']
            if not family_dic.has_key(f_uid):
                family_dic[f_uid] = {'family': f_uid, 'fam_real_name': record.f['name'],
                                     'characteristics': OrderedDict()}
            c_uid = record.c['uid']
            if not family_dic[f_uid]['characteristics'].has_key(c_uid):
                family_dic[f_uid]['characteristics'][c_uid] = {'name': c_uid, 'real_name': record.c['name'],
                                                               'description': record.c['description'],
                                                               'visible': record.c['visible'],
                                                               'subcharacteristics': OrderedDict()}
            if record.sc:
                sc_uid = record.sc['uid']
                if not family_dic[f_uid]['characteristics'][c_uid]['subcharacteristics'].has_key(sc_uid):
                    family_dic[f_uid]['characteristics'][c_uid]['subcharacteristics'][sc_uid] = \
                                                            {'name': sc_uid, 'sub_real_name': record.sc['name'],
                                                             'description': record.sc['description'],
                                                             'subcharacteristics': [],
                                                             }
                if record.ssc:
                    ssc_uid = record.ssc['uid']
                    family_dic[f_uid]['characteristics'][c_uid]['subcharacteristics'][sc_uid][
                        'subcharacteristics'].append({'name': ssc_uid, 'subsub_real_name': record.ssc['name']})
        # now convert the dictionaries into lists as expected by api client
        for f_uid, f in family_dic.iteritems():
            for c_uid, c in f['characteristics'].iteritems():
                c['subcharacteristics'] = c['subcharacteristics'].values()
            f['characteristics'] = f['characteristics'].values()
        return family_dic.values()

    # Retourne la liste des caracteristiques pour une nature family (S, NMM, Metal, etc.)
    # @params uid de la nature family
    # @returns la liste des caracteristiques pour une nature family (S, NMM, Metal, etc.)
    def getnaturefamily(self, nature):
        # on retournera n
        n = []

        # on cherche d'abord toutes les families liees a la nature family cherchee
        familiesList = self.graph.cypher.execute(
            "MATCH (a:Nature)-[r:HAS_FAMILY]->(b:Family) where a.uid='" + nature + "' RETURN b.uid as uid order by ID(b)")
        print (nature)

        # pour chaque famille on va faire une requete
        for family in familiesList:
            fam = {'name': family.uid, 'characteristics': []}
            print ("***" + family.uid)

            # chaque famille a des caracteristiques
            charactList = self.graph.cypher.execute(
                "MATCH (c:Characteristic)-[b:BELONGS_TO]->(f:Family) where f.uid='" + family.uid + "' RETURN f.uid as family, c.uid as uid, c.name as real_name, c.description as description")

            for charact in charactList:
                # pour chaque caracteristique on ajoute les sous-caracteristiques
                subcharactList = self.graph.cypher.execute(
                    "MATCH (a)-[r:HAS_SPECIALIZATION]->(b) where a.uid='" + charact.uid + "' RETURN b.uid as uid, b.description as description, b.name as sub_real_name order by a.uid asc")

                sc = []
                for subcharact in subcharactList:
                    # pour chaque sous-caracteristique on ajoute les sous-sous-caracteristiques
                    subsubcharactList = self.graph.cypher.execute(
                        "MATCH (sub:SubCharacteristic)-[:HAS_SPECIALIZATION]->(subsub:SubCharacteristic) where sub.uid='" + subcharact.uid + "' RETURN subsub.uid as uid, subsub.name as subsub_real_name order by subsub.uid asc")

                    subsubcharactItems = []
                    for subsubcharact in subsubcharactList:
                        subsubcharactItems.append(
                            {'name': subsubcharact.uid, 'subsub_real_name': subsubcharact.subsub_real_name})

                    ssc = {'name': subcharact.uid, 'description': subcharact.description, 'subcharacteristics': '',
                           'sub_real_name': subcharact.sub_real_name}
                    ssc['subcharacteristics'] = subsubcharactItems
                    sc.append(ssc)

                fam['characteristics'].append(
                    {'name': charact.uid, 'description': charact.description, 'real_name': charact.real_name,
                     'subcharacteristics': sc})

            n.append(fam)
        return n

    # Ajout d'une stratigraphie
    # @params nom de l'artefact et description de la stratigraphie de la stratigraphie
    # @returns true si ajout, false si refus d'ajout
    def addStratigraphy(self, artefact, stratigraphy):
        self.insertOk = False

        name = str(uuid.uuid1())

        if self.stratigraphyExists(stratigraphy) > 0:
            self.insertOk = False
        else:
            self.insertOk = name
            self.graph.cypher.execute_one("CREATE(stratigraphy:Stratigraphy{uid:'%s', timestamp: %f, date:'%s', artefact_uid: '%s', label:'stratigraphy', description:'%s'})" % (name, time.time(), time.strftime("%Y-%m-%d"), artefact, stratigraphy))
            self.graph.cypher.execute_one(
                "MATCH (a:Artefact),(b:Stratigraphy) WHERE a.uid = '" + artefact + "' AND b.uid= '" + name + "' CREATE (a)-[:IS_REPRESENTED_BY]->(b)")

        return self.insertOk

    # retourne la liste de tous les artefacts
    # @params
    # @returns liste de tous les artefacts
    def getAllArtefacts(self):
        return self.graph.cypher.execute("MATCH (p:Artefact) RETURN p.uid AS name order by p.uid")

    # retourne la liste de toutes les stratigraphies pour un artefact
    # @params
    # @returns
    def getStratigraphyByArtefact(self, artefact):
        return self.graph.cypher.execute(
            "MATCH (n:`Artefact`)-[:`IS_REPRESENTED_BY`]->(m) where n.uid='" + artefact + "' RETURN m.uid as name, m.description as description")

    # verifie si une stratigraphie existe ou pas
    # @params nom de la stratigraphie
    # @returns chiffre > 0 si existe, 0 sinon
    def stratigraphyExists(self, stratigraphy):
        self.strat = self.graph.cypher.execute(
            "match (n:`Stratigraphy`) where n.uid='" + stratigraphy + "' return n.uid as name")
        return len(self.strat) > 0

    # supprime toutes les strates et sous strates d'une stratigraphie
    # @params nom de la stratigraphie
    # @returns
    def deleteAllStrataFromAStratigraphy(self, stratigraphy):
        #supression des strates enfant
        self.query = "MATCH (n:Stratigraphy)-[p:POSSESSES]->(b:Strata)-[i:IS_PARENT_OF]->(c:Strata) where n.uid='" + stratigraphy + "' optional match (c)-[z]-() DELETE z, i ,c"
        self.graph.cypher.execute(self.query)
        #supression des strates
        self.query = "MATCH (n:Stratigraphy)-[p:POSSESSES]->(b:Strata)-[h:HAS_UPPER_INTERFACE]->(i:Interface) where n.uid='" + stratigraphy + "' optional match (i)-[x]-() optional match (b)-[y]-() optional match (b)-[z]-()  delete x, y, z, h, p, i, b"
        self.graph.cypher.execute(self.query)

    # supprime une stratigraphie
    # @params nom de la stratigraphie
    # @returns
    def deleteStratigraphy(self, stratigraphy):
        #self.deleteAllStrataFromAStratigraphy(stratigraphy)
        self.query = "match (a:Artefact)-[i:IS_REPRESENTED_BY]->(s:Stratigraphy) where s.uid = '" + stratigraphy + "' optional match (s)-[r]->()  delete i, r, s";
        self.graph.cypher.execute(self.query)
        return {'res': 1}

    # cree une interface
    # @params nom de la strate et nom de l'interface
    # @returns
    def createInterface(self, strata, interface):
        self.query = "CREATE (interface:Interface {uid:'" + interface + "', date:'" + time.strftime(
            "%Y-%m-%d") + "', strata_uid:'" + strata + "', label:'interface'})"
        self.queryMatch = (
        "MATCH (a:Strata),(b:Interface) WHERE a.uid = '" + strata + "' AND b.uid= '" + interface + "' CREATE (a)-[:HAS_UPPER_INTERFACE]->(b)")
        self.graph.cypher.execute(self.query)
        self.graph.cypher.execute(self.queryMatch)

    # attache une caracteristique a une interface
    # @params nom de l'interface et nom de la caracteristique
    # @returns
    def attachCharacteristicToInterface(self, interface, characteristic):
        self.query = "MATCH (a:Interface),(b) WHERE a.uid = '" + interface + "' AND b.uid= '" + characteristic + "' CREATE (a)-[r:IS_CONSTITUTED_BY]->(b)"
        self.graph.cypher.execute(self.query)

    # attache une caracteristique,sous-caracteristique a une strate
    # @params nom de la strate etnom de la caracteristique, sous-caracteristique
    # @returns
    def attachCharacteristicToStrata(self, strata, characteristic):
        self.query = "MATCH (a:Strata),(b) WHERE a.uid = '" + strata + "' AND b.uid= '" + characteristic + "' CREATE (a)-[r:IS_CONSTITUTED_BY]->(b)"
        print(self.query)
        self.graph.cypher.execute(self.query)

    # cree une strate
    # @params nom de la strate et nom de la stratigraphie
    # @returns
    def createStrata(self, strata, stratigraphy):
        self.query = "CREATE(strata:Strata{uid:'" + strata + "',date:'" + time.strftime(
            "%Y-%m-%d") + "',stratigraphy_uid: '" + stratigraphy + "',label:'strata'})"
        self.graph.cypher.execute(self.query)
        self.query = "MATCH (a:Stratigraphy),(b:Strata) WHERE a.uid = '" + stratigraphy + "' AND b.uid= '" + strata + "' CREATE (a)-[:POSSESSES]->(b)"
        self.graph.cypher.execute(self.query)

    # cree une strate enfant
    # @params nom de la strate et nom de la strate parent
    # @returns
    def createChildStrata(self, strata, parentstrata):
        self.query = "CREATE(strata:Strata{uid:'" + strata + "',date:'" + time.strftime(
            "%Y-%m-%d") + "',label:'strata'})"
        self.graph.cypher.execute(self.query)
        self.query = "MATCH (a:Strata),(b:Strata) WHERE a.uid = '" + strata + "' AND b.uid= '" + parentstrata + "' CREATE (b)-[:IS_PARENT_OF]->(a)"
        self.graph.cypher.execute(self.query)

    # retourne le nombre d'interface pour toutes les strates d'une stratigraphie
    # @params nom de la stratigraphie
    # @returns nombre d'interface pour toutes les strates d'une stratigrpahie
    def getNbInterfaceByStratigraphy(self, stratigraphy):
        self.query = "MATCH (n:Stratigraphy)-[p:POSSESSES]->(s:Strata)-[u:HAS_UPPER_INTERFACE]->(i:Interface) where n.uid='" + stratigraphy + "' RETURN  count(i) as nb"
        return self.graph.cypher.execute(self.query)[0].nb

    # retourne le nombre de strates pour une stratigraphie
    # @params nom de la stratigraphie
    # @returns nombre de strates pour cette stratigraphie
    def getNbStratasByStratigraphy(self, stratigraphy):
        self.query = "MATCH (n:Stratigraphy)-[p:POSSESSES]->(s:Strata) where n.uid='" + stratigraphy + "' RETURN  count(s) as nb"
        return self.graph.cypher.execute(self.query)[0].nb

    # sauvegarde toutes les strates d'une stratigraphie
    # @params details d'une stratigraphie au format json
    # @returns 1 si ok
    def save(self, data):
        stratigraphyName = data['stratigraphy']
        print stratigraphyName
        # on supprime entierement toutes les strates de l'ancienne stratigraphie pour en creer une nouvelle
        # on fait ca pour partir sur une base vierge et on reconstruit de graphe a chaque sauvegarde
        self.deleteAllStrataFromAStratigraphy(stratigraphyName)

        # on parcourt toutes les strates
        for t in data['stratas']:
            strataName = stratigraphyName + "_Strata" + str(self.getNbStratasByStratigraphy(stratigraphyName) + 1)
            self.createStrata(strataName, stratigraphyName)

            # pour chaque strate on attache une caracteristique ou sous caracteristique
            for c in t['characteristics']:
                if len(c) > 0:
                    self.attachCharacteristicToStrata(strataName, c['name'])

            # pour chaque strate on cree une interface et on y attache des caracteristiques
            interfaceName = strataName + "_interface" + str(self.getNbInterfaceByStratigraphy(stratigraphyName) + 1)
            self.createInterface(strataName, interfaceName)
            for i in t['interfaces']:
                if len(i) > 0:
                    self.attachCharacteristicToInterface(interfaceName, i['name'])


            #Pour chaque strate on attache les strates enfants
            for s in t['children']:
                if len(s) > 0:
                    childName = s['name']
                    self.createChildStrata(childName, strataName)

                    for sc in s['characteristics']:
                        if len(sc) > 0:
                            self.attachCharacteristicToStrata(childName, sc['name'])

        return {'res': 1}

    # on cree une requete pour retrouver les artefacts similaires dans la base
    # @params stratigraphie au format json
    # @returns
    def match(self, data):

        # pour ce faire on va construire une requete au format cypher avec les
        # donnees qu'on a recu de l'interface angular.
        # les donnees sont au format json et on les lit.
        # ensuite on cree notre requete cypher
        # pour savoir ce que fait exactement la requete cypher, il faut se referrer au document de
        # Vincent Rochat sur la creation du modele numerique de MiCorr

        node_base_url = settings.NODE_BASE_URL

        nbStrata = len(data['stratas'])

        listChar = []
        listCharInt = []

        for t in data['stratas']:
            for c in t['characteristics']:
                if len(c) > 0:
                    listChar.append(c['name'])
            for i in t['interfaces']:
                if len(i) > 0:
                    listCharInt.append(i['name'])

        listChar = set(listChar)
        listCharInt = set(listCharInt)

        qry = "MATCH (a:Artefact)-->(s:Stratigraphy)-->(st:Strata) "

        cpt = 1
        for c in listChar:
            qry += "OPTIONAL MATCH (st)-[:IS_CONSTITUTED_BY]->(m" + str(cpt) + "{uid:'" + c + "'}) "
            cpt += 1

        for c in listCharInt:
            qry += "OPTIONAL MATCH (st)-[:HAS_UPPER_INTERFACE]->(i:Interface)-[:IS_CONSTITUTED_BY]->(m" + str(
                cpt) + "{uid:'" + c + "'}) "
            cpt += 1

        nbChar = len(listChar) + len(listCharInt)

        qry += "with a.uid as auid, a.artefact_id as artefact_id, s.uid as stratigraphy_uid, count(st) as stratum, count(st)-" + str(
            nbStrata) + " as DiffNombreStratum, "

        qry += "( "
        cpt = 1
        while cpt <= nbChar:
            qry += "sum(m" + str(cpt) + ".comparisonIndicator1) "
            if cpt != nbChar:
                qry += "+ "
            cpt += 1
        qry += ") as TotalComparisonIndicator1, "

        qry += "( "
        cpt = 1
        while cpt <= nbChar:
            qry += "count(m" + str(cpt) + ") "
            if cpt != nbChar:
                qry += "+ "
            cpt += 1
        qry += ") as TotalMatching "

        qry += "MATCH (a:Artefact)-->(s:Stratigraphy)-->(st:Strata)-[r:IS_CONSTITUTED_BY]-(o) WHERE a.uid=auid "
        qry += "with auid, artefact_id, stratigraphy_uid, stratum, DiffNombreStratum, TotalComparisonIndicator1, TotalMatching, count(r) as countrelations "
        qry += "MATCH(a:Artefact)-->(s:Stratigraphy)-->(st:Strata)-[:HAS_UPPER_INTERFACE]->(i:Interface)-[r1:IS_CONSTITUTED_BY]->(o1) WHERE a.uid=auid AND s.public=true "
        qry += "with auid, artefact_id, stratigraphy_uid, stratum, DiffNombreStratum, TotalComparisonIndicator1, TotalMatching, count(r1) + countrelations as TotalRelations "
        qry += "RETURN auid, artefact_id, stratigraphy_uid, stratum, DiffNombreStratum, TotalComparisonIndicator1, TotalMatching, TotalRelations, 100*TotalMatching/TotalRelations as Matching100 "
        qry += "ORDER BY Matching100 DESC, TotalComparisonIndicator1 DESC "
        logger.debug("MATCHING QUERY: %s" % qry)
        old_list = []

        res = self.graph.cypher.execute(qry)

        for i in res:
            line = {'node_base_url': '', 'artefact': '', 'artefact_id': '', 'stratigraphy_uid': '', 'stratum': '', 'diffnbstratum': '', 'tci': '',
                    'totalmatching': '', 'totalrelation': '', 'matching100': ''}
            line['node_base_url'] = node_base_url
            line['artefact'] = i['auid']
            line['artefact_id'] = i['artefact_id']
            line['stratigraphy_uid'] = i['stratigraphy_uid']
            line['stratum'] = i['stratum']
            line['diffnbstratum'] = i['DiffNombreStratum']
            line['tci'] = i['TotalComparisonIndicator1']
            line['totalmatching'] = i['TotalMatching']
            line['totalrelation'] = i['TotalRelations']
            line['matching100'] = i['Matching100']
            # Add artefact characteristics
            if i['artefact_id']:
                artefact = Artefact.objects.get(pk=i['artefact_id'])
                # Quick fix
                published_artefact = artefact.object.artefact_set.filter(published=True).first()
                if published_artefact:
                    artefact = published_artefact
                    # else todo check artefact.user against logged in user to list only published or own artefacts
                    # but there (in api context) we are missing the request.user
                line['artefact_metal1'] = artefact.metal1.element
                line['artefact_alloy'] = artefact.alloy.name
                line['artefact_type'] = artefact.type.name
                line['artefact_chronology_category'] = artefact.chronology_period.chronology_category.name
                line['artefact_technology'] = artefact.technology.name
                line['artefact_microstructure'] = artefact.microstructure.name
            old_list.append(line)
        result = []
        for j in old_list:
            if j['artefact_id'] and j['matching100'] < 100:
                result.append(j)
        print result
        return result

    # Ajout d'un artefact
    # @params nom de l'artefact
    # @returns 0 si pas ok, 1 si ok
    def addArtefact(self, artefact):
        self.query = "MATCH (n:Artefact) where n.uid='" + artefact + "' RETURN count(n.uid) as nb"
        self.nb = self.graph.cypher.execute(self.query)[0].nb

        if self.nb >= 1:
            return {'res': 0}
        else:
            self.query = "CREATE(artefact:Artefact{uid:'" + artefact + "',date:'" + time.strftime(
                "%Y-%m-%d") + "',label:'artefact'})"
            self.graph.cypher.execute(self.query)
            return {'res': 1}

    # suppression d'un artefact
    # @params nom de l'artefact
    # @returns
    def delArtefact(self, artefact):
        self.query = "MATCH (a:Artefact)-[r:IS_REPRESENTED_BY]->(s:Stratigraphy) where a.uid='" + artefact + "' RETURN  s.uid as uid"
        listStrat = self.graph.cypher.execute(self.query)
        for strat in listStrat:
            self.deleteStratigraphy(strat.uid)

        self.query = "match (a:Artefact) where a.uid='" + artefact + "' optional match (a)-[x]-() delete x, a"
        self.graph.cypher.execute(self.query)

        return {'res': 1}
