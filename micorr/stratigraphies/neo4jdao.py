from collections import OrderedDict, defaultdict

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
            """MATCH (sg:Stratigraphy)-[r:POSSESSES]->(st:Strata) where sg.uid={uid}
               RETURN sg.description as description, st.uid as uid,
                toInteger(replace(st.uid, {sg_strata_prefix}, "")) as strata_num
                order by strata_num""",
            uid=stratigraphy_uid,sg_strata_prefix= stratigraphy_uid +"_Strata")
        # todo optimization something like the following query would be enough
        # stratigraphy_records = self.graph.cypher.execute(
        # MATCH (sg:Stratigraphy)-[:POSSESSES]->(st:Strata),(st)-[:IS_CONSTITUTED_BY]->(csc)-[b:BELONGS_TO]->(f:Family) where sg.uid={uid}
        # OPTIONAL MATCH (st)-[:HAS_UPPER_INTERFACE]->(ui:Interface)-[:IS_CONSTITUTED_BY]->(uicsc)-[:BELONGS_TO]->(uif:Family)
        # return sg,st,csc,f,ui,uicsc,uif
        # , uid=stratigraphy_uid)

        stratigraphy = {'uid':stratigraphy_uid,
                        'description': strata_records[0].description if len(strata_records) else None,
                        'strata':[]
                        }
        print (stratigraphy_uid)

        # pour chaque strates on va faire une requete
        for strata in strata_records:
            st = {'name': strata.uid, 'characteristics': '', 'subcharacteristics': '', 'interfaces': '',
                  'children': '', 'containers': defaultdict(list)}
            print ("***" + strata.uid)

            # Chaque strates a des caracteristiques
            charactList = self.graph.cypher.execute(
                """MATCH (n:Strata)-[r:IS_CONSTITUTED_BY]->(c:Characteristic)-[b:BELONGS_TO]->(f:Family) where n.uid={strata_uid}
                   RETURN c,f
                """, strata_uid=strata.uid)
            print ("======Characteristic")
            # c.uid as uid, f.uid as family, c.name as real_name, c.visible as visible, c.order as order
            clist = []
            for charact in charactList:
                cp=charact.c.properties
                fp=charact.f.properties
                if fp['uid']=='elementFamily':
                        clist.append({'name': cp['uid'], 'family': fp['uid'], 'real_name': cp['name'],
                                  'symbol': cp['symbol'], 'category':cp['category'], 'order':0, 'visible': True})
                else:
                    clist.append({'name': cp['uid'], 'family': fp['uid'], 'real_name': cp['name'],
                              'order': cp['order'], 'visible': cp['visible']})
                print ("         " + cp['uid'])

            # Chaque strate a des sous-caracteristiques
            print ("======subCharacteristic")
            subCharactList = self.graph.cypher.execute(
                "MATCH (s:Strata)-[r:IS_CONSTITUTED_BY]->(c:SubCharacteristic) where s.uid='" + strata.uid + "' RETURN c.uid as uid, c.name as real_name order by real_name")
            slist = []
            for subCharact in subCharactList:
                slist.append({'name': subCharact.uid, 'real_name': subCharact.real_name})
                print("         " + subCharact.uid)

            print ("======Components")

            def convert_elem_or_cpnd(elem_or_cpnd):
                # to be consistent with getAllCharacteristic name/uid renaming scheme
                # and remaining client code we still need to "convert" the original Element and Compound Characteristics
                # before returning to client
                hacked_characteristic = elem_or_cpnd.copy()
                hacked_characteristic['real_name'] = hacked_characteristic['name']
                hacked_characteristic['name'] = hacked_characteristic['uid']
                del hacked_characteristic['uid']
                return hacked_characteristic

            component_records = self.graph.cypher.execute(
                """MATCH (sg:Stratigraphy {uid:{stratigraphy_uid}})-[POSSESSES]->(s:Strata {uid:{strata_uid}})-[r:INCLUDES]->(cpnt:Component)
                    OPTIONAL MATCH (cpnt)-[r_const_or_incl]->(char_or_ctn)-[:BELONGS_TO]->(family:Family)
                    OPTIONAL MATCH (char_or_ctn)-[ce_r:IS_CONSTITUTED_BY]->(elem_or_cpnd:Characteristic)
                   RETURN s.uid,id(cpnt),char_or_ctn, family.uid, ce_r.order, elem_or_cpnd
                   ORDER BY s.uid, id(cpnt), family.uid, ce_r.order
                """, strata_uid=strata.uid,stratigraphy_uid=stratigraphy_uid)
            secondary_components = [{'characteristics': [], 'subCharacteristics': [], 'containers': defaultdict(list)}]
            for record in component_records:
                if record.char_or_ctn:
                    if 'SubCharacteristic' in record.char_or_ctn.labels:
                        secondary_components[0]['subCharacteristics'].append(
                            {'name': record.char_or_ctn['uid'], 'real_name': record.char_or_ctn['name']})
                    elif 'Characteristic' in record.char_or_ctn.labels:
                        secondary_components[0]['characteristics'].append(
                            {'name': record.char_or_ctn['uid'], 'family': record['family.uid'],
                             'real_name': record.char_or_ctn['name'],
                             'order': record.char_or_ctn['order'], 'visible': record.char_or_ctn['visible']})
                    elif 'Container' in record.char_or_ctn.labels and record.elem_or_cpnd:
                        secondary_components[0]['containers'][record['family.uid']].append(
                            convert_elem_or_cpnd(record.elem_or_cpnd.properties))

                print("         " + str(record.char_or_ctn))

            if len(secondary_components[0]['characteristics']) or len(
                secondary_components[0]['subCharacteristics']) or len(secondary_components[0]['containers']):
                st['secondaryComponents'] = secondary_components

            print ("======Containers")
            container_records = self.graph.cypher.execute(
                """MATCH (s:Strata { uid:{strata_uid} })-[r:INCLUDES]->(c:Container)-[ce_r:IS_CONSTITUTED_BY]->(elem_or_cpnd:Characteristic)
                   MATCH (c)-[BELONGS_TO]->(f:Family) RETURN s,c,ce_r,elem_or_cpnd,f ORDER BY f.uid, ce_r.order""",
                strata_uid=strata.uid)
            for r in container_records:
                st['containers'][r.f['uid']].append(convert_elem_or_cpnd(r.elem_or_cpnd.properties))

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
            if record.c:
                c_uid = record.c['uid']
                if not family_dic[f_uid]['characteristics'].has_key(c_uid):
                    c_dic = {'name': c_uid, 'real_name': record.c['name'], 'subcharacteristics': OrderedDict()}
                    if f_uid == 'elementFamily':
                        c_dic.update({'symbol': record.c['symbol'], 'category': record.c['category'], 'order': 0, 'visible': True})
                    else:
                        c_dic.update({'description': record.c['description'], 'order': record.c['order'], 'visible': record.c['visible']})
                    family_dic[f_uid]['characteristics'][c_uid] = c_dic
            else:
                print 'no characteristic in : ',record
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
        # supression des strates enfants, interfaces, components et containers
        self.graph.cypher.execute('''
            MATCH (sg:Stratigraphy {uid:{stratigraphy}})
            OPTIONAL MATCH (sg)-[:POSSESSES]->(parent_st:Strata)-[:IS_PARENT_OF]->(child_st:Strata)
            DETACH DELETE child_st
            WITH sg MATCH (sg)-[:POSSESSES]->(st:Strata)-[:HAS_UPPER_INTERFACE]->(i:Interface)
            OPTIONAL MATCH (st)-[:INCLUDES]->(c) WHERE c:Component OR c:Container
            DETACH DELETE c,i,st
        ''', stratigraphy=stratigraphy)
        # optional "WHERE c:Component OR c:Container" is there to be explicit on types of Node INCLUDED

    # # supprime une stratigraphie
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

    # attache une caracteristique a une strate
    # @params nom de la strate et nom de la caracteristique
    # @returns
    def attachCharacteristicToStrata(self, strata, c_uid, label="Characteristic"):
        self.graph.cypher.execute("""
      MATCH (s:Strata),(c:{label}) WHERE s.uid = "{strata}" AND c.uid="{c_uid}"
      CREATE (s)-[r:IS_CONSTITUTED_BY]->(c)""".
                                  format(strata=strata, c_uid=c_uid, label=label))

    # attache une sous-caracteristique a une strate
    # @params nom de la strate et nom de la sous-caracteristique
    # @returns
    def attachSubCharacteristicToStrata(self, strata, sub_characteristic):
        self.attachCharacteristicToStrata(strata, sub_characteristic, "SubCharacteristic")

    # attache une caracteristique ou sous-caracteristique a un node (Strata, Interface, ...)
    # @params nom de la strate etnom de la caracteristique, sous-caracteristique
    # @returns
    def attachCharacteristic(self, node_uid, characteristic_uid):
        self.graph.cypher.execute("""MATCH (n),(c)
                                WHERE n.uid = {node_uid} AND c.uid={characteristic_uid}
                                CREATE (a)-[r:IS_CONSTITUTED_BY]->(b)""",
                                  node_uid=node_uid,characteristic=characteristic_uid)

    # cree une strate
    # @params nom de la strate et nom de la stratigraphie
    # @returns Strata node py2neo object
    def createStrata(self, strata_uid, stratigraphy_uid):
        today = time.strftime("%Y-%m-%d")
        res = self.graph.cypher.execute("""
               CREATE(strata:Strata{uid:{strata_uid}, date:{today}, stratigraphy_uid: {stratigraphy_uid}})
               WITH strata 
               MATCH (stgy:Stratigraphy {uid:{stratigraphy_uid}})
               CREATE (stgy)-[:POSSESSES]->(strata) RETURN strata""",
                                  strata_uid=strata_uid, today=today, stratigraphy_uid=stratigraphy_uid)
        return res[0]['strata']

    # cree une strate enfant
    # @params nom de la strate et nom de la strate parent
    # @returns
    def createChildStrata(self, strata, parentstrata):
        self.query = "CREATE(strata:Strata{uid:'" + strata + "',date:'" + time.strftime(
            "%Y-%m-%d") + "',label:'strata'})"
        self.graph.cypher.execute(self.query)
        self.query = "MATCH (a:Strata),(b:Strata) WHERE a.uid = '" + strata + "' AND b.uid= '" + parentstrata + "' CREATE (b)-[:IS_PARENT_OF]->(a)"
        self.graph.cypher.execute(self.query)

    def create_secondary_components(self, stratum_node, components):
        """
        :param stratum_node:
        :param components:
        :return:
        """
        if not len(components):
            return
        for i, component in enumerate(components):
            c = Node("Component", order=i)
            stc = Relationship(stratum_node, "INCLUDES", c)
            self.graph.create(c, stratum_node, stc)

            def find_and_attach_node_to_component(label,key,value,component):
                node = self.graph.find_one(label, key, value)
                if node:
                    self.graph.create(Relationship(component, "IS_CONSTITUTED_BY", node))
                else:
                    print(u"{}: with {}={} not found".format(label, key, value))

            for characteristic in component["characteristics"]:
                find_and_attach_node_to_component("Characteristic","uid", characteristic["name"], c)

            for sub_characteristic in component["subCharacteristics"]:
                find_and_attach_node_to_component("SubCharacteristic", "uid", sub_characteristic["name"], c)

            if len(component["containers"]):
                self.create_containers(c, component["containers"])

    def create_containers(self, parent_node, containers):
        """
        :param parent_node: (stratum or component node)
        :param containers: dictionary of Elements/Compound list
        :return:
        """
        if not len(containers):
            return
        for family, elements in containers.iteritems():
            c = Node("Container")
            stc_rel = Relationship(parent_node, "INCLUDES", c)

            cf = self.graph.find_one("Family", "uid", family)
            if not cf:
                logger.error('missing family "{}" in graph db. elements not saved'.format(family))
                continue
            fc_rel = Relationship(c, "BELONGS_TO", cf)
            print(c, parent_node, stc_rel, cf, fc_rel)
            self.graph.create(c, parent_node, stc_rel, cf, fc_rel)

            if len(elements):
                for i,e in enumerate(elements):
                    element = self.graph.find_one("Characteristic", "uid", e['name'])
                    if element:
                        self.graph.create(Relationship(c, "IS_CONSTITUTED_BY", element, order=i))
                    else:
                        print ("create_containers(): Characteristic :{} not found - not added to container {}".format(e['name'], c))
                        logger.error("Characteristic :{} not found - not added to container {}".format(e['name'], c))

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
        stratigraphy_name = data['stratigraphy']
        print('save:',stratigraphy_name)
        # on supprime entierement toutes les strates de l'ancienne stratigraphie pour en creer une nouvelle
        # on fait ca pour partir sur une base vierge et on reconstruit de graphe a chaque sauvegarde
        self.deleteAllStrataFromAStratigraphy(stratigraphy_name)

        # on parcourt toutes les strates
        for i,stratum in enumerate(data['stratas']):
            stratum_name = "{}_Strata{}".format(stratigraphy_name,i+1)
            stratum_node = self.createStrata(stratum_name, stratigraphy_name)

            # pour chaque strate on attache une caracteristique ou sous caracteristique
            for characteristic in stratum['characteristics']:
                if characteristic:
                    self.attachCharacteristicToStrata(stratum_name, characteristic['name'])
            for sc in stratum['subCharacteristics']:
                if sc:
                    self.attachSubCharacteristicToStrata(stratum_name, sc['name'])

            # pour chaque strate on cree une interface et on y attache des caracteristiques
            interface_name = stratum_name + "_interface" + str(self.getNbInterfaceByStratigraphy(stratigraphy_name) + 1)
            self.createInterface(stratum_name, interface_name)
            for interface in stratum['interfaces']:
                if len(interface) > 0:
                    self.attachCharacteristicToInterface(interface_name, interface['name'])


            #Pour chaque strate on attache les strates enfants
            for s in stratum['children']:
                if len(s) > 0:
                    child_name = s['name']
                    self.createChildStrata(child_name, stratum_name)

                    for c in s['characteristics']:
                        if c:
                            self.attachCharacteristicToStrata(child_name, c['name'])
                    for sc in s['subCharacteristics']:
                        if sc:
                            self.attachSubCharacteristicToStrata(stratum_name, sc['name'])

            self.create_secondary_components(stratum_node, stratum['secondaryComponents'])
            self.create_containers(stratum_node, stratum['containers'])

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
        listSubChar = []
        listCharInt = []

        for t in data['stratas']:
            listChar += [c['name'] for c in t['characteristics']]
            listSubChar += [c['name'] for c in t['subCharacteristics']]
            listCharInt += [c['name'] for c in t['interfaces']]
        logger.debug("Source stratum: {} Total number of characteristics:{}".format(data['stratigraphy'],len(listChar)+len(listSubChar)+len(listCharInt)))
        listChar = set(listChar)
        listCharInt = set(listCharInt)
        listSubChar = set(listSubChar)
        logger.debug("Unique characteristics:{}".format(len(listChar) + len(listSubChar) + len(listCharInt)))

        qry = "MATCH (s:Stratigraphy)-[:POSSESSES]->(st:Strata) WHERE s.public = true "

        cpt = 1
        for c in listChar:
            qry += "OPTIONAL MATCH (st)-[:IS_CONSTITUTED_BY]->(m{}:Characteristic {{uid:'{}'}}) ".format(cpt,c)
            cpt += 1
        for c in listSubChar:
            qry += "OPTIONAL MATCH (st)-[:IS_CONSTITUTED_BY]->(m{}:SubCharacteristic {{uid:'{}'}}) ".format(cpt,c)
            cpt += 1
        for c in listCharInt:
            qry += "OPTIONAL MATCH (st)-[:HAS_UPPER_INTERFACE]->(:Interface)-[:IS_CONSTITUTED_BY]->(m{} {{uid:'{}'}}) ".format(cpt,c)
            cpt +=1

        nbChar = cpt -1

        qry += "WITH s, count(st) as stratum, count(st)-" + str(nbStrata) + " as diffnbstratum, "

        qry += '+'.join(["sum(m{}.comparisonIndicator1)".format(i + 1) for i in range(nbChar)]) + " as tci, "
        qry += '+'.join(["count(m{})".format(i + 1) for i in range(nbChar)]) + " as totalmatching \n"

        qry += "MATCH (s)-[:POSSESSES]->(st:Strata)-[r:IS_CONSTITUTED_BY]->(o) "
        qry += "WITH s, stratum, diffnbstratum, tci, totalmatching, count(r) as countrelations "
        qry += "MATCH (s)-->(:Strata)-[:HAS_UPPER_INTERFACE]->(:Interface)-[r1:IS_CONSTITUTED_BY]->() "
        qry += "WITH s, stratum, diffnbstratum, tci, totalmatching, count(r1) + countrelations as totalrelation "
        qry += 'MATCH (s)<-[:IS_REPRESENTED_BY]-(a:Artefact) WHERE (a.uid <> "Search")'
        qry += "RETURN a.uid as artefact, a.artefact_id AS artefact_id, s.uid as stratigraphy_uid, stratum, diffnbstratum, tci, totalmatching, totalrelation, 100*totalmatching/totalrelation as matching100 "
        qry += "ORDER BY matching100 DESC, tci"
        logger.debug("MATCHING QUERY: %s" % qry)
        result_list = []

        res = self.graph.cypher.execute(qry)
        logger.debug(res)
        for r in  res:
            # Add artefact characteristics
            artefact = Artefact.objects.filter(pk=r.artefact_id).first()
            # for now (query tuning, and not enough published artefact) we don't filter unpublished artefacts
            # published_artefact = artefact.object.artefact_set.filter(published=True).first() if a else None
            published_artefact = artefact
            if published_artefact:
                # else todo check artefact.user against logged in user to list only published or own artefacts
                # but there (in api context) we are missing the request.user

                line = {k: r[k] for k in res.columns}
                line['node_base_url'] = node_base_url

                line['artefact_id'] = published_artefact.pk
                line['artefact_metal1'] = published_artefact.metal1.element
                line['artefact_alloy'] = published_artefact.alloy.name
                line['artefact_type'] = published_artefact.type.name
                line['artefact_chronology_category'] = published_artefact.chronology_period.chronology_category.name
                line['artefact_technology'] = published_artefact.technology.name
                line['artefact_microstructure'] = published_artefact.microstructure.name
                result_list.append(line)

        # logger.debug(result_list)
        return result_list

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
