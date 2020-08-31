from collections import OrderedDict, defaultdict
from contextlib import contextmanager

from py2neo import Graph, NodeMatcher
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
        neo4j_auth = settings.NEO4J_AUTH.split(':')
        if len(neo4j_auth)!=2:
            raise ValueError('NEO4J_AUTH environment variable expected format user:pass')
        self.url = "%s://%s:%s@%s/db/data" % (
        settings.NEO4J_PROTOCOL, neo4j_auth[0], neo4j_auth[1], settings.NEO4J_HOST)
        self.graph = Graph(self.url)
        self.tx = None

    def begin(self):
        self.tx = self.graph.begin()
        # forcing auto commit
        # self.tx =self.graph
        return self.tx
    # commit des transaction. Si rien n'est precise, autocommit
    def commit(self):
        self.tx.process()
        self.tx.commit()
        self.tx = None

    def rollback(self):
        self.tx.rollback()
        self.tx = None

    @contextmanager
    def transaction(self, *args, **kwds):
        tx=self.begin()
        try:
            yield tx
        except Exception as e:
            logger.error('Unhandled ({}) in transaction'.format(e), exc_info=True)
            self.rollback()
            raise
        else:
            self.commit()

    def match_node(self,  *labels, **properties):
        """
        replacement for NodeMatcher.match
        using transaction
        :param labels: node labels to match
        :param properties: set of property keys and values to match
        :return: NodeMatch instance
        """
        matcher = NodeMatcher(self.tx)
        # caution NodeMatcher (replacement for v3 NodeSelector and v2 find_one api)
        # is intended to be initialized with a graph object
        # (see https://py2neo.org/v4/matching.html)
        # in our context (py2neo 4.3 and match call) duck typed tx used instead works
        # double check compatibility in case of any change.
        return matcher.match(*labels, **properties)

    def getStratigraphiesByUser(self, user_id, order_by='description'):
        stratigraphies = self.tx.run(
            "MATCH (n:Stratigraphy) WHERE n.user_uid=$user_id RETURN n ORDER BY n.%s" % (order_by,),
            user_id=user_id)
        stratigraphies_list = []
        for stratigraphy in stratigraphies:
            if stratigraphy['n']['timestamp']:
                timestamp = datetime.datetime.fromtimestamp(float(stratigraphy['n']['timestamp'])).strftime('%Y-%m-%d %H:%M:%S')
            else:
                timestamp = None
            stratigraphies_list.append(
                {'date': stratigraphy['n']['date'], 'uid': stratigraphy['n']['uid'],
                 'description': stratigraphy['n']['description'],
                 'artefact_uid': stratigraphy['n']['artefact_uid'],
                 'timestamp': timestamp})
        return stratigraphies_list

    def getStratigraphyUser(self, stratigraphy):
        user_uid = self.tx.evaluate(
            "MATCH (n:Stratigraphy) WHERE n.uid=$stratigraphy RETURN n.user_uid", stratigraphy=stratigraphy)
        if user_uid:
            try:
                user_id = int(user_uid)
            except TypeError:
                user_id = None
        else:
            user_id = None
        return user_uid

    def setStratigraphyUser(self, stratigraphy, user_id):
        n = self.tx.evaluate("MATCH (n:`Stratigraphy`) WHERE n.uid=$stratigraphy RETURN n", stratigraphy=stratigraphy)
        if n is None:
            return
        n['user_uid'] = user_id
        n['creator_uid'] = user_id
        self.tx.push(n)

    def delStratigraphyUser(self, stratigraphy):
        n=self.tx.evaluate("MATCH (n:`Stratigraphy`) WHERE n.uid=$stratigraphy REMOVE n.user_uid RETURN n", stratigraphy=stratigraphy)

    def updateStratigraphyDescription(self, stratigraphy, description):
        n = self.tx.evaluate("MATCH (n:`Stratigraphy`) WHERE n.uid=$stratigraphy RETURN n", stratigraphy=stratigraphy)
        n['description'] = description
        self.tx.push(n)

    def getStratigraphyElement(self, stratigraphy_uid):
        """
         get main element of first Metal stratum in stratigraphy  (uid:stratigraphy_uid}

        :param stratigraphy_uid
        :return: main element uid/symbol
        """
        return self.tx.evaluate(
            """
                MATCH (sg:Stratigraphy)-[r:POSSESSES]->(st:Strata)-[:IS_CONSTITUTED_BY]->(c:Characteristic)-[:BELONGS_TO]->(f:Family {uid:"natureFamily"}),
                (st)-[:INCLUDES]->(ctn:Container)-->(e:Element),(ctn)-[:BELONGS_TO]->(ctn_f:Family {uid:"mCompositionMainElements"})
                 where c.uid="mCharacteristic" and sg.uid=$uid
                RETURN e.uid as main_element,toInteger(replace(st.uid, (sg.uid+"_Strata"), "")) as strata_num
                order by -strata_num limit 1
            """, uid=stratigraphy_uid)


    # retourne tous les details d'une stratigraphie, caracteristiques, sous-caracteristiques et interfaces
    # @params le nom de la stratigraphie
    # @returns tous les details de la stratigraphie voulue
    def getStratigraphyDetails(self, stratigraphy_uid):
        # on cherche d'abord toutes les strates
        strata_records = self.tx.run(
            """MATCH (sg:Stratigraphy)-[r:POSSESSES]->(st:Strata) where sg.uid=$uid
               RETURN sg.description as description, st.uid as uid,
                toInteger(replace(st.uid, $sg_strata_prefix, "")) as strata_num
                order by strata_num""",
            uid=stratigraphy_uid,sg_strata_prefix= stratigraphy_uid +"_Strata").data()
        # todo optimization something like the following query would be enough
        # stratigraphy_records = self.tx.run(
        # MATCH (sg:Stratigraphy)-[:POSSESSES]->(st:Strata),(st)-[:IS_CONSTITUTED_BY]->(csc)-[b:BELONGS_TO]->(f:Family) where sg.uid=$uid
        # OPTIONAL MATCH (st)-[:HAS_UPPER_INTERFACE]->(ui:Interface)-[:IS_CONSTITUTED_BY]->(uicsc)-[:BELONGS_TO]->(uif:Family)
        # return sg,st,csc,f,ui,uicsc,uif
        # , uid=stratigraphy_uid)
        stratigraphy = {'uid':stratigraphy_uid,
                        'description': strata_records[0]['description'] if len(strata_records) else None,
                        'strata':[]
                        }
        logger.debug (stratigraphy_uid)

        # pour chaque strates on va faire une requete
        for strata in strata_records:
            st = {'name': strata['uid'], 'characteristics': '', 'subcharacteristics': '', 'interfaces': '',
                  'children': '', 'containers': defaultdict(list), 'variables': {}}
            logger.debug ("***" + strata['uid'])

            # Chaque strates a des caracteristiques
            charactList = self.tx.run(
                """MATCH (n:Strata)-[r:IS_CONSTITUTED_BY]->(c:Characteristic)-[b:BELONGS_TO]->(f:Family) where n.uid=$strata_uid
                   RETURN c,f ORDER by c.order,c.uid
                """, strata_uid=strata['uid'])
            logger.debug ("======Characteristic")
            # c.uid as uid, f.uid as family, c.name as real_name, c.visible as visible, c.order as order
            clist = []
            for charact in charactList:
                cp=charact['c']
                fp=charact['f']
                if fp['uid']=='elementFamily':
                        clist.append({'name': cp['uid'], 'family': fp['uid'], 'real_name': cp['name'],
                                  'symbol': cp['symbol'], 'category':cp['category'], 'order':0, 'visible': True})
                else:
                    clist.append({'name': cp['uid'], 'family': fp['uid'], 'real_name': cp['name'],
                              'order': cp['order'], 'visible': cp['visible']})
                logger.debug ("         " + cp['uid'])

            # Chaque strate a des sous-caracteristiques
            logger.debug ("======subCharacteristic")
            slist = self.tx.run(
                "MATCH (s:Strata)-[r:IS_CONSTITUTED_BY]->(c:SubCharacteristic) where s.uid=$strata_uid RETURN c.uid as name, c.name as real_name order by name",
                strata_uid=strata['uid']).data()

            logger.debug ("======Components")

            def convert_elem_or_cpnd(elem_or_cpnd):
                # to be consistent with getAllCharacteristic name/uid renaming scheme
                # and remaining client code we still need to "convert" the original Element and Compound Characteristics
                # before returning to client
                hacked_characteristic = elem_or_cpnd.copy()
                hacked_characteristic['real_name'] = hacked_characteristic['name']
                hacked_characteristic['name'] = hacked_characteristic['uid']
                del hacked_characteristic['uid']
                return hacked_characteristic

            component_records = self.tx.run(
                """MATCH (sg:Stratigraphy {uid:$stratigraphy_uid})-[POSSESSES]->(s:Strata {uid:$strata_uid})-[r:INCLUDES]->(cpnt:Component)
                    OPTIONAL MATCH (cpnt)-[r_const_or_incl]->(char_or_ctn)-[:BELONGS_TO]->(family:Family)
                    OPTIONAL MATCH (char_or_ctn)-[ce_r:IS_CONSTITUTED_BY]->(elem_or_cpnd:Characteristic)
                   RETURN s.uid,id(cpnt),char_or_ctn, family.uid, ce_r.order, elem_or_cpnd
                   ORDER BY s.uid, id(cpnt), family.uid, ce_r.order, char_or_ctn.uid
                """, strata_uid=strata['uid'],stratigraphy_uid=stratigraphy_uid)
            secondary_components = [{'characteristics': [], 'subCharacteristics': [], 'containers': defaultdict(list)}]
            for record in component_records:
                # Caution bug fix line below
                # to verify  if the OPTIONAL MATCH char_or_ctn is in a record
                # we must test with get method and a default value such as None
                # testing if record['char_or_ctn'] would fail in case of Container node (that has no properties)
                # so for ex. bool((_14056:Container {})) == False due to the empty dict of property even if an actual
                # Container node is returned in the record and we would then skip actual Container content
                # from elem_or_cpnd
                if record.get('char_or_ctn',None) is not None:
                    if 'SubCharacteristic' in record['char_or_ctn'].labels:
                        secondary_components[0]['subCharacteristics'].append(
                            {'name': record['char_or_ctn']['uid'], 'real_name': record['char_or_ctn']['name']})
                    elif 'Characteristic' in record['char_or_ctn'].labels:
                        secondary_components[0]['characteristics'].append(
                            {'name': record['char_or_ctn']['uid'], 'family': record['family.uid'],
                             'real_name': record['char_or_ctn']['name'],
                             'order': record['char_or_ctn']['order'], 'visible': record['char_or_ctn']['visible']})
                    elif 'Container' in record['char_or_ctn'].labels and record['elem_or_cpnd']:
                        secondary_components[0]['containers'][record['family.uid']].append(
                            convert_elem_or_cpnd(record['elem_or_cpnd']))

                logger.debug("         " + str(record['char_or_ctn']))

            if len(secondary_components[0]['characteristics']) or len(
                secondary_components[0]['subCharacteristics']) or len(secondary_components[0]['containers']):
                st['secondaryComponents'] = secondary_components

            logger.debug ("======Containers")
            container_records = self.tx.run(
                """MATCH (s:Strata { uid:$strata_uid })-[r:INCLUDES]->(c:Container)-[ce_r:IS_CONSTITUTED_BY]->(elem_or_cpnd:Characteristic)
                   MATCH (c)-[:BELONGS_TO]->(f:Family) RETURN s,c,ce_r,elem_or_cpnd,f ORDER BY f.uid, ce_r.order""",
                strata_uid=strata['uid'])
            for r in container_records:
                st['containers'][r['f']['uid']].append(convert_elem_or_cpnd(r['elem_or_cpnd']))

            logger.debug("======Variables")
            variable_records = self.tx.run(
                """MATCH (s:Strata { uid:$strata_uid })-[r:HAS]->(v:Variable)
                   MATCH (v)-[:BELONGS_TO]->(f:Family) RETURN s,v,f ORDER BY f.uid""",
                strata_uid=strata['uid'])
            for r in variable_records:
                st['variables'][r['f']['uid']]=r['v']['value']  # r['v'].copy() => whole dict


            # Chaque strates a des interfaces
            logger.debug("======interface")
            interface_uid = self.tx.evaluate(
                """MATCH (s:Strata)-[r:HAS_UPPER_INTERFACE]->(n:Interface) WHERE s.uid=$strata_uid
                   RETURN n.uid as uid ORDER BY uid""", strata_uid=strata['uid'])

            if interface_uid and len(interface_uid) > 0:
                # il n'y a qu'une UPPER_INTERFACE interface
                ilist = {'name': interface_uid, 'characteristics': ''}

                #Chaque interface a des caracteristiques
                intCharactList = self.tx.run(
                    """MATCH (i:Interface)-[r:IS_CONSTITUTED_BY]->(c:Characteristic)-[b:BELONGS_TO]->(f:Family) WHERE i.uid=$interface_uid
                       RETURN c.uid as uid, f.uid as family ORDER BY uid""", interface_uid=interface_uid)
                iclist = []
                for ic in intCharactList:
                    iclist.append({'name': ic['uid'], 'family': ic['family']})
                    logger.debug("            " + ic['uid'])

                # on rassemble toutes les donnees dans c
                ilist['characteristics'] = iclist
                st['interfaces'] = ilist
            else:
                st['interfaces'] = []

            st['characteristics'] = clist
            st['subcharacteristics'] = slist


            #Recuperation des enfants

            childList = self.tx.run(
                """MATCH (a:Strata)-[r:IS_PARENT_OF]->(b:Strata) where a.uid=$strata_uid
                   RETURN b.uid as uid ORDER BY uid""", strata_uid=strata['uid'])

            st['children'] = [
                {'name': child['uid'],
                 'characteristics': self.tx.run(
                     """MATCH (n:Strata)-[r:IS_CONSTITUTED_BY]->(c:Characteristic)-[b:BELONGS_TO]->(f:Family) where n.uid=$child_uid
                        RETURN c.uid as name, c.name as real_name, f.uid as family ORDER BY name""", child_uid=child['uid']).data()}
                for child in childList
            ]
            stratigraphy['strata'].append(st)
        return stratigraphy

    # retourne la liste de toutes les caracteristiques, sous-caracteristiques et sous-sous-caracteristiques
    # @params
    # @returns toutes les caracteristiques et sous-caracteristiques de la base
    def getAllCharacteristic(self):
        all_characteristics = self.tx.run("""
         MATCH (f:Family)
         OPTIONAL MATCH (f)<-[:SHOWS]-(fg:FamilyGroup)
         OPTIONAL MATCH (f)<-[:BELONGS_TO]-(c:Characteristic)
         OPTIONAL MATCH (c)-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic)
         OPTIONAL MATCH (sc)-[:HAS_SPECIALIZATION]->(ssc:SubCharacteristic)
         RETURN f,fg,c,sc,ssc
         ORDER BY fg.order,f.order, f.name, c.order, sc.name, ssc.name
        """)
        # here we get a flat list of records including all family, Characteristic, SubCharacteristic, SubCharacteristic
        # convert it into hierarchical lists of f -> c -> sc -> ssc, setting field names as expected by api client
        # we use OrderedDicts to build the "lists" and easily create or update list items from redundant elements in records
        family_dic = OrderedDict()
        for record in all_characteristics:
            f_uid = record['f']['uid']
            if f_uid not in family_dic:
                family_dic[f_uid] = record['f'].copy()
                family_dic[f_uid].update({'family': f_uid, 'familyGroup':record['fg'],
                                     'characteristics': OrderedDict()})
            if record['c']:
                c_uid = record['c']['uid']
                if c_uid not in family_dic[f_uid]['characteristics']:
                    c_dic = {'name': c_uid, 'real_name': record['c']['name'], 'subcharacteristics': OrderedDict()}
                    if f_uid == 'elementFamily':
                        c_dic.update({'symbol': record['c']['symbol'], 'category': record['c']['category'], 'order': 0, 'visible': True})
                    else:
                        c_dic.update({'description': record['c']['description'], 'order': record['c']['order'], 'visible': record['c']['visible'],
                                      'image_url': record['c']['image_url'], 'optgroup': record['c']['optgroup']})
                    family_dic[f_uid]['characteristics'][c_uid] = c_dic
            else:
                logger.debug('no characteristic in : %s',record)
            if record['sc']:
                sc_uid = record['sc']['uid']
                if sc_uid not in family_dic[f_uid]['characteristics'][c_uid]['subcharacteristics']:
                    family_dic[f_uid]['characteristics'][c_uid]['subcharacteristics'][sc_uid] = \
                                                            {'name': sc_uid, 'sub_real_name': record['sc']['name'],
                                                             'description': record['sc']['description'],
                                                             'subcharacteristics': [],
                                                             }
                if record['ssc']:
                    ssc_uid = record['ssc']['uid']
                    family_dic[f_uid]['characteristics'][c_uid]['subcharacteristics'][sc_uid][
                        'subcharacteristics'].append({'name': ssc_uid, 'subsub_real_name': record['ssc']['name']})
        # now convert the dictionaries into lists as expected by api client
        for f_uid, f in list(family_dic.items()):
            for c_uid, c in list(f['characteristics'].items()):
                c['subcharacteristics'] = list(c['subcharacteristics'].values())
            f['characteristics'] = list(f['characteristics'].values())
        return list(family_dic.values())



    # Ajout d'une stratigraphie
    # @params nom de l'artefact et description de la stratigraphie de la stratigraphie
    # @returns true si ajout, false si refus d'ajout
    def addStratigraphy(self, artefact, stratigraphy):
        name = str(uuid.uuid1())
        if self.stratigraphyExists(stratigraphy) > 0:
            insertOk = False
        else:
            insertOk = name
            self.tx.evaluate("CREATE(stratigraphy:Stratigraphy{uid:$stratigraphy_uid, timestamp: $timestamp, date:$date, artefact_uid:$artefact_uid, label:'stratigraphy', description:$description})",
            stratigraphy_uid=name, timestamp=time.time(), date=time.strftime("%Y-%m-%d"), artefact_uid=artefact,description=stratigraphy)
            self.tx.evaluate(
                "MATCH (a:Artefact),(b:Stratigraphy) WHERE a.uid = $artefact AND b.uid=$name CREATE (a)-[:IS_REPRESENTED_BY]->(b)",
                artefact=artefact, name=name)

        return insertOk

    # retourne la liste de tous les artefacts
    # @params
    # @returns liste de tous les artefacts
    def getAllArtefacts(self):
        return self.tx.run("MATCH (p:Artefact) RETURN p.uid AS name order by p.uid").data()

    # retourne la liste de toutes les stratigraphies pour un artefact
    # @params
    # @returns
    def getStratigraphyByArtefact(self, artefact):
        return self.tx.run(
            """MATCH (n:`Artefact`)-[:`IS_REPRESENTED_BY`]->(m) where n.uid=$artefact
             RETURN m.uid as name, m.description as description""", artefact=artefact).data()

    # verifie si une stratigraphie existe ou pas
    # @params nom de la stratigraphie
    # @returns True si existe, False sinon
    def stratigraphyExists(self, stratigraphy):
        nbo = self.tx.evaluate(
            "MATCH (n:`Stratigraphy`) WHERE n.uid=$stratigraphy RETURN count(n) as nbo", stratigraphy=stratigraphy)
        return nbo > 0

    # supprime toutes les strates et sous strates d'une stratigraphie
    # @params nom de la stratigraphie
    # @returns
    def deleteAllStrataFromAStratigraphy(self, stratigraphy):
        # supression des strates enfants, interfaces, components et containers
        self.tx.run("""
            MATCH (sg:Stratigraphy {uid:$stratigraphy})
            OPTIONAL MATCH (sg)-[:POSSESSES]->(parent_st:Strata)-[:IS_PARENT_OF]->(child_st:Strata)
            DETACH DELETE child_st
            WITH sg MATCH (sg)-[:POSSESSES]->(st:Strata)
            OPTIONAL MATCH (st)-[:HAS_UPPER_INTERFACE]->(i:Interface)
            OPTIONAL MATCH (st)-[:INCLUDES]->(c) WHERE c:Component OR c:Container
            OPTIONAL MATCH (st)-[:HAS]->(v:Variable)
            DETACH DELETE c,i,st,v
        """, stratigraphy=stratigraphy)
        # optional "WHERE c:Component OR c:Container" is there to be explicit on types of Node INCLUDED

    # # supprime une stratigraphie
    # @params nom de la stratigraphie
    # @returns
    def deleteStratigraphy(self, stratigraphy):
        self.tx.run(
            "match (a:Artefact)-[i:IS_REPRESENTED_BY]->(s:Stratigraphy) where s.uid = $stratigraphy optional match (s)-[r]->()  delete i, r, s",
            stratigraphy=stratigraphy)
        return {'res': 1}

    # cree une interface
    # @params uid de la strate et uid de l'interface
    # @returns
    def createInterface(self, strata_uid, interface_uid):
        self.tx.run("""
                MATCH(s:Strata {uid:$strata_uid})
                CREATE (s)-[:HAS_UPPER_INTERFACE]->(interface:Interface {uid:$interface_uid,date:$date})
                """, strata_uid=strata_uid, interface_uid=interface_uid, date=time.strftime("%Y-%m-%d") )

    # attache une caracteristique a une interface
    # @params nom de l'interface et nom de la caracteristique
    # @returns
    def attachCharacteristicToInterface(self, interface, characteristic):
        self.tx.run("""MATCH (a:Interface),(b) WHERE a.uid = $interface AND b.uid=$characteristic
                       CREATE (a)-[r:IS_CONSTITUTED_BY]->(b)""", interface=interface, characteristic=characteristic)

    # attache une caracteristique a une strate
    # @params nom de la strate et nom de la caracteristique
    # @returns
    def attachCharacteristicToStrata(self, strata, c_uid, label="Characteristic"):
      self.tx.run("""
      MATCH (s:Strata),(c:%s) WHERE s.uid =$strata AND c.uid=$c_uid
      CREATE (s)-[r:IS_CONSTITUTED_BY]->(c)""" %(label,), strata=strata, c_uid=c_uid, label=label)

    # wip trying to use stratum_node object and subgraph
    # instead of MATCHING again by name but not working properly yet
    def attachCharacteristicToStratumNode(self, stratum_node, c_uid, label="Characteristic"):
        c = Node(label, uid=c_uid)
        stc = Relationship(stratum_node, "IS_CONSTITUTED_BY", c)
        subgraph = stratum_node | stc | c
        self.tx.merge(subgraph, label, "uid")

    # attache une sous-caracteristique a une strate
    # @params nom de la strate et nom de la sous-caracteristique
    # @returns
    def attachSubCharacteristicToStrata(self, strata, sub_characteristic):
        self.attachCharacteristicToStrata(strata, sub_characteristic, "SubCharacteristic")

    # attache une caracteristique ou sous-caracteristique a un node (Strata, Interface, ...)
    # @params nom de la strate etnom de la caracteristique, sous-caracteristique
    # @returns
    def attachCharacteristic(self, node_uid, characteristic_uid):
        self.tx.run("""MATCH (n),(c)
                                WHERE n.uid = $node_uid AND c.uid=$characteristic_uid
                                CREATE (a)-[r:IS_CONSTITUTED_BY]->(b)""",
                                  node_uid=node_uid,characteristic=characteristic_uid)

    # cree une strate
    # @params nom de la strate et nom de la stratigraphie
    # @returns Strata node py2neo object
    def createStrata(self, strata_uid, stratigraphy_uid):
        return self.tx.evaluate("""
               CREATE(strata:Strata{uid:$strata_uid, date:$today, stratigraphy_uid: $stratigraphy_uid})
               WITH strata
               MATCH (stgy:Stratigraphy {uid:$stratigraphy_uid})
               CREATE (stgy)-[:POSSESSES]->(strata) RETURN strata""",
                             strata_uid=strata_uid, today=time.strftime("%Y-%m-%d"), stratigraphy_uid=stratigraphy_uid)

    # cree une strate enfant
    # @params nom de la strate et nom de la strate parent
    # @returns
    def createChildStrata(self, strata, parentstrata):
        self.tx.run("CREATE(strata:Strata{uid:$strata ,date:$today, label:'strata'})",
                       strata=strata, today=time.strftime("%Y-%m-%d"))
        self.tx.run(
            """MATCH (a:Strata),(b:Strata) WHERE a.uid =$strata AND b.uid=$parentstrata
               CREATE (b)-[:IS_PARENT_OF]->(a)""", strata=strata, parentstrata=parentstrata)

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
            self.tx.create(c | stratum_node | stc)

            def find_and_attach_node_to_component(label,key,value,component):
                node = self.match_node(label, **{key: value}).first()
                # alternative syntaxes
                # node = self.match_node(label, uid=value).first()
                # node = self.match_node(label).where("{}={}".format(key, value)).first()
                if node:
                    self.tx.create(Relationship(component, "IS_CONSTITUTED_BY", node))
                else:
                    logger.debug("{}: with {}={} not found".format(label, key, value))

            for characteristic in component['characteristics']:
                find_and_attach_node_to_component('Characteristic','uid', characteristic['name'], c)

            for sub_characteristic in component['subCharacteristics']:
                find_and_attach_node_to_component('SubCharacteristic', 'uid', sub_characteristic['name'], c)

            if len(component['containers']):
                self.create_containers(c, component['containers'])

    def create_containers(self, parent_node, containers):
        """
        :param parent_node: (stratum or component node)
        :param containers: dictionary of Elements/Compound list
        :return:
        """
        if not len(containers):
            return
        for family, elements in list(containers.items()):
            c = Node("Container")
            stc_rel = Relationship(parent_node, "INCLUDES", c)

            cf = self.match_node("Family", uid=family).first()
            if not cf:
                logger.error('missing family "{}" in graph db. elements not saved'.format(family))
                continue
            fc_rel = Relationship(c, "BELONGS_TO", cf)
            logger.debug('{} {} {} {} {}'.format(c, parent_node, stc_rel, cf, fc_rel))
            self.tx.create(c | parent_node | stc_rel | cf | fc_rel)

            if len(elements):
                for i,e in enumerate(elements):
                    element = self.match_node("Characteristic", uid=e['name']).first()
                    if element:
                        self.tx.create(Relationship(c, "IS_CONSTITUTED_BY", element, order=i))
                    else:
                        logger.debug ("create_containers(): Characteristic :{} not found - not added to container {}".format(e['name'], c))
                        logger.error("Characteristic :{} not found - not added to container {}".format(e['name'], c))

    def create_variables(self, parent_node, variables):
        """
        :param parent_node: (stratum)
        :param variables: dictionary of variables
        :return:
        """
        if not len(variables):
            return
        for family, value in list(variables.items()):
            v = Node("Variable", value=value)
            pv_rel = Relationship(parent_node, "HAS", v)

            vf = self.match_node("Family", uid=family).first()
            if not vf:
                logger.error('missing family "{}" in graph db. variable not saved'.format(family))
                continue
            fv_rel = Relationship(v, "BELONGS_TO", vf)
            logger.debug('{} {} {} {} {}'.format(v, parent_node, pv_rel, vf, fv_rel))
            self.tx.create(v | parent_node | pv_rel | vf | fv_rel)

    # retourne le nombre de strates pour une stratigraphie
    # @params nom de la stratigraphie
    # @returns nombre de strates pour cette stratigraphie
    def getNbStratasByStratigraphy(self, stratigraphy):
        return self.tx.evaluate("MATCH (n:Stratigraphy)-[p:POSSESSES]->(s:Strata) where n.uid=$stratigraphy RETURN  count(s) as nb")

    # sauvegarde toutes les strates d'une stratigraphie
    # @params details d'une stratigraphie au format json
    # @returns 1 si ok
    def save(self, data):
        stratigraphy_name = data['stratigraphy']
        logger.debug('save:%s',stratigraphy_name)
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
            interface_name = stratum_name + "_interface" + str(i + 1)
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
            self.create_variables(stratum_node, stratum['variables'])

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
        logger.debug("MATCHING QUERY: %s", qry)
        result_list = []

        res = self.tx.run(qry)
        logger.debug(res)
        for r in  res:
            # Add artefact characteristics
            artefact = Artefact.objects.filter(pk=r['artefact_id']).first()
            # for now (query tuning, and not enough published artefact) we don't filter unpublished artefacts
            # published_artefact = artefact.object.artefact_set.filter(published=True).first() if a else None
            published_artefact = artefact
            if published_artefact:
                # else todo check artefact.user against logged in user to list only published or own artefacts
                # but there (in api context) we are missing the request.user

                line = dict(r) # or {k: r[k] for k in res.keys()}
                line['node_base_url'] = node_base_url

                line['artefact_id'] = published_artefact.pk
                line['artefact_metal_e_1'] = published_artefact.metal_e_1.symbol
                line['artefact_alloy'] = published_artefact.alloy.name
                line['artefact_type'] = published_artefact.type.name
                line['artefact_chronology_category'] = published_artefact.chronology_category.name
                line['artefact_technology'] = published_artefact.technology.name
                line['artefact_microstructure'] = published_artefact.microstructure.name
                result_list.append(line)

        # logger.debug(result_list)
        return result_list

    # Ajout d'un artefact
    # @params nom de l'artefact
    # @returns 0 si pas ok, 1 si ok
    def addArtefact(self, artefact):
        nb = self.tx.evaluate("MATCH (n:Artefact) where n.uid=$artefact RETURN count(n.uid) as nb",
                                 artefact=artefact)
        if nb >= 1:
            return {'res': 0}
        else:
            self.tx.run("CREATE(artefact:Artefact{uid:$artefact, date:$today, label:'artefact'})",
                           artefact=artefact, today=time.strftime("%Y-%m-%d"))
            return {'res': 1}
        """
        todo: replace by a merge..
        MERGE (n:Artefact {uid:$artefact})
        ON CREATE SET n.date = $today
        RETURN n.uid
        """

    # suppression d'un artefact
    # @params nom de l'artefact
    # @returns
    def delArtefact(self, artefact):
        listStrat = self.tx.run(
            "MATCH (a:Artefact)-[r:IS_REPRESENTED_BY]->(s:Stratigraphy) where a.uid=$artefact RETURN  s.uid as uid",
            artefact=artefact)
        for strat in listStrat:
            self.deleteStratigraphy(strat['uid'])
        self.tx.run("MATCH (a:Artefact) where a.uid=$artefact OPTIONAL MATCH (a)-[x]-() DELETE x, a",
                       artefact=artefact)
        return {'res': 1}
