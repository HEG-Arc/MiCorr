:param common_props {version:3, date:"2017-09-12",comparisonIndicator1:1, comparisonIndicator2:1,comparisonIndicator3:1, comparisonIndicator4:1, comparisonIndicator5:1}

//:param "common_props": {"version":3, "date":"2017-08-28","comparisonIndicator1":1, "comparisonIndicator2":1,"comparisonIndicator3":1, "comparisonIndicator4":1, "comparisonIndicator5":1}
//:param common_props {version:3, date:"2017-08-28",comparisonIndicator1:1, comparisonIndicator2:1,comparisonIndicator3:1, comparisonIndicator4:1, comparisonIndicator5:1}

/************************
//MC-232 Famille des Zn / Strate CP / Composition / Secondary element (mettre la formule des composés)

•    la ligne O correspondant au composé : Zinc white (ZnO)
•    la ligne O,C correspondant au composé : Smithsonite (ZnCO3)

•    la ligne O,H correspondant au composé : Wülfingite (Zn(OH)2)

•    la ligne O,C,H correspondant au composé : Hydrozincite (Zn5(CO3)2(OH)6)
•    la ligne O,Cl,H correspondant au composé : Simonkolleite (Zn5Cl2(OH)8.H2O)
•    la ligne S correspondant au composé : Sphalerite, Wurztite (ZnS)
•    la ligne O,S,H correspondant au composé : Goslarite (ZnSO4.7H2O)

//existing verification:
MATCH  (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Zn" })-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic)
RETURN f,c,sc;
*/

// Insert new elements:
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Zn" })
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"O, H",uid:"cpZnOH"})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Wülfingite (Zn(OH)2)",uid:"cpWulfingite"})
ON CREATE set ssc+=$common_props
WITH (c)
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"O, C, H",uid:"cpZnOCH"})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Hydrozincite (Zn5(CO3)2(OH)6)",uid:"cpHydrozincite"})
ON CREATE set ssc+=$common_props
WITH (c)
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"O, Cl, H",uid:"cpZnOClH"})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Simonkolleite (Zn5Cl2(OH)8.H2O)",uid:"cpSimonkolleite"})
ON CREATE set ssc+=$common_props
WITH (c)
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"S",uid:"cpZnS"})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Sphalerite, Wurztite (ZnS)",uid:"cpSphalerite"})
ON CREATE set ssc+=$common_props
WITH (c)
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"O, S, H",uid:"cpZnOSH"})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Goslarite (ZnSO4.7H2O)",uid:"cpGoslarite"})
ON CREATE set ssc+=$common_props
RETURN c,sc,ssc;

//Update existing name

MATCH (sc:SubCharacteristic {uid:"cpSmithsonite"})  SET sc.name="Smithsonite (ZnCO3)";
MATCH (sc:SubCharacteristic {uid:"cpZincite"}) SET sc.name="Zinc white (ZnO)";

/*
MATCH (sc:SubCharacteristic {uid:"cpZnOH"})  SET sc.name="O, H"
with 1 as d
MATCH (sc:SubCharacteristic {uid:"cpZnOCH"}) WITH sc SET sc.name="O, C, H"
with 1 as d
MATCH (sc:SubCharacteristic {uid:"cpZnOClH"}) WITH sc SET sc.name="O, Cl, H"
with 1 as d
MATCH (sc:SubCharacteristic {uid:"cpZnOSH"}) WITH sc SET sc.name="O, S, H"
*/

/*
MERGE (c:Characteristic {name: "Zn" })-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"O, H",uid:"cpZnOH"})
ON CREATE set sc+=$common_props
WITH c,sc
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Wülfingite (Zn(OH)2)",uid:"cpWulfingite"})
ON CREATE set ssc+=$common_props
WITH c
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"O,C",uid:"cpZnOC"})
ON CREATE set sc+=$common_props
WITH c,sc
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Smithsonite (ZnCO3)",uid:"cpSmithsonite"})
ON CREATE set ssc+=$common_props
RETURN c,sc,ssc
*/

/************************
//MC-231
 Famille des zinc / Strate M / Composition / Additional element(s)
 Ajouter :
 -    la ligne Al, Sn, Cu
retrieve existing
MATCH  (f:Family {name:"M Composition"})<--(c:Characteristic {name: "Zn" })-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic)
RETURN f,c,sc,c.uid,sc.uid
*/

MATCH (f:Family {name:"M Composition"})<--(c:Characteristic {name: "Zn" })
MERGE (c)-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic {name:"Al, Sn, Cu", uid: "mAlSnCu"})
ON CREATE set sc+=$common_props
RETURN c, sc;

// next one not working error c already exist with uid = mZnCharacteristic ?? -> should merge and only create sc...
// MERGE (c:Characteristic {uid: "mZnCharacteristic"})-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"Al, Sn, Cu", uid: "mAlSnCu"});
// ON CREATE set ssc+=$common_props
// RETURN c, sc

/************************
//MC-230
Famille des Sn / Strate CP / Composition / Secondary element (mettre la formule des composés)
//retrieve existing:
MATCH  (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Sn" })-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic)-->(ssc)
RETURN f,c,sc,ssc,c.uid,sc.uid,ssc.uid
*/

//Update
//la ligne O correspondant aux composés : Romarchite (SnO), Cassiterite (SnO2)
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Sn" })
with c
MATCH (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"O",uid: "cpSnO" })-->(ssc:SubCharacteristic {name:"Romarchite"})
WITH c, sc, ssc
SET ssc.name = "Romarchite (SnO)"
with c,sc
MATCH (sc)-->(ssc:SubCharacteristic {name:"Cassiterite"})
WITH c,sc,ssc
SET ssc.name = "Cassiterite (SnO2)";

// Add
// la ligne O,H correspondant au composé : Hydroromarchite (Sn3O2(OH)2)
// la ligne S correspondant aux composés : Herzenbergite (SnS), Ottemannite (Sn2S3), Berndtite (SnS2)
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Sn" })
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"O, H",uid:"cpSnOH"})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Hydroromarchite (Sn3O2(OH)2)",uid:"cpHydroromarchite"})
ON CREATE set ssc+=$common_props
WITH c
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:"S",uid:"cpSnS"})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Herzenbergite (SnS)",uid:"cpHerzenbergite"})
ON CREATE set ssc+=$common_props
WITH c,sc
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Ottemannite (Sn2S3)",uid:"cpOttemannite"})
ON CREATE set ssc+=$common_props
WITH c,sc
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:"Berndtite (SnS2)",uid:"cpBerndtite"})
ON CREATE set ssc+=$common_props
RETURN c.name,sc.name,ssc.name;

/************************
//MC-229
 Famille des Nickel / Strate CP / Composition <https://code.micorr.org/youtrack/issue/MC-229>
  update
    la ligne O correspondant au composé : Bunsenite (NiO)
    add
    la ligne Fe,S doit correspondre au composé : Pentlandite ((Fe,Ni)9S8)
    la ligne N,O,H doit correspondre au composé : Nickel nitrate hexahydrate (Ni(NO3)2.6H2O)
    la ligne O,H correspondant au composé : Theophrastite (Ni(OH)2)
    la ligne O,H,Cl doit correspondre au composé : Nickel (II) chloride (NiCl2.6H2O)
    la ligne O,H,S doit correspondre au composé : Retgersite (NiSO4.6H2O)
    la ligne S doit correspondre aux composés : Millerite (NiS), Heazlewoodite (Ni3S2)
*/

MATCH (ssc {uid:"cpBunsenite"}) SET ssc.name = "Bunsenite (NiO)";

UNWIND [
{sc:"Fe, S", sc_uid:"cpNiFeS", ssc:"Pentlandite ((Fe,Ni)9S8)", ssc_uid:"cpPentlandite"},
{sc:"N, O, H", sc_uid:"cpNiNOH", ssc:"Nickel nitrate hexahydrate (Ni(NO3)2.6H2O)", ssc_uid:"cpNickelnitratehexahydrate"},
{sc:"O, H", sc_uid:"cpNiOH", ssc:"Theophrastite (Ni(OH)2)", ssc_uid:"cpTheophrastite"},
{sc:"O, H, Cl", sc_uid:"cpNiOHCl", ssc:"Nickel (II) chloride (NiCl2.6H2O)", ssc_uid:"cpNickelchloride"},
{sc:"O, H, S", sc_uid:"cpNiOHS", ssc:"Retgersite (NiSO4.6H2O)", ssc_uid:"cpRetgersite"},
{sc:"S", sc_uid:"cpNiS", ssc:"Millerite (NiS)", ssc_uid:"cpMillerite"},
{sc:"S", sc_uid:"cpNiS", ssc:"Heazlewoodite (Ni3S2)", ssc_uid:"cpHeazlewoodite"}
] as new_nodes
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Ni" })
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:new_nodes.sc, uid:new_nodes.sc_uid})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:new_nodes.ssc, uid:new_nodes.ssc_uid})
ON CREATE set ssc+=$common_props
RETURN f.name,c.name,sc.name,ssc.name;

/************************
//MC-228
 Famille des ferreux / Strate CP / Composition / Secondary element (mettre la formule des composés)
    la ligne Cl correspondant aux composés : Iron (II) chloride (FeCl2), Iron (III) chloride (FeCl3)
    la ligne O correspondant aux composés : Wüstite (FeO), Magnetite (Fe3O4), Maghemite (γ-Fe2O3), Hematite (α-Fe2O3)

    la ligne O,C correspondant au composé : Siderite (FeCO3)

    la ligne O,H correspondant aux composés : Goethite (α-FeO(OH)), Akaganeite ( β-FeO(OH)), Lepidocrocite (γ-FeO(OH))

    la ligne P,O,H correspondant au composé : Vivianite (Fe3(PO4)2.8H2O)
    la ligne S correspondant au composé : Pyrite (FeS2)
    la ligne S,O,H correspondant au composé : BuRozenite (FeSO4.4H2O), tlerite (Fe(OH)SO4.2H2O)

    la ligne S,O,H,K correspondant au composé : Jarosite Fe3K(OH)6(SO4)2
    la ligne S,O,H,Na correspondant au composé : Natrojarosite Fe3Na(OH)6(SO4)2)
    la ligne Si,O  correspondant au composé : Fayelite (FeSiO4)
*/

/*check existing
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Fe" })-->(sc)-->(ssc) RETURN sc.name, sc.uid,ssc.name,ssc.uid ORDER BY sc.name, ssc.name
╒═════════╤════════╤═══════════════╤═════════════════╕
│"sc.name"│"sc.uid"│"ssc.name"     │"ssc.uid"        │
╞═════════╪════════╪═══════════════╪═════════════════╡
│"C, O"   │"cpFeCO"│"Siderite"     │"cpSiderite"     │ //Upd sc & ssc                 C, O -> O, C
├─────────┼────────┼───────────────┼─────────────────┤
│"Cl"     │"cpFeCl"│"Akaganeite"   │"cpAkaganeite"   │ //Upd relations then Del       (Akaganeite->O,H not Cl) if any existing relations with artefacts
├─────────┼────────┼───────────────┼─────────────────┤
│"O"      │"cpFeO" │"Geothite"     │"cpGeothite"     │ //Upd relations then Del       (Goethite->O,H not Geothite->O) if any existing relations with artefacts
├─────────┼────────┼───────────────┼─────────────────┤
│"O"      │"cpFeO" │"Hematite"     │"cpHematite"     │ //Upd ssc
├─────────┼────────┼───────────────┼─────────────────┤
│"O"      │"cpFeO" │"Lepidocrocite"│"cpLepidocrocite"│ //Upd relations then Del       (Lepidocrocite->O,H not Lepidocrocite->O) if any existing relations with artefacts
├─────────┼────────┼───────────────┼─────────────────┤
│"O"      │"cpFeO" │"Maghemite"    │"cpMaghemite"    │ //Upd ssc
├─────────┼────────┼───────────────┼─────────────────┤
│"O"      │"cpFeO" │"Magnetite"    │"cpMagnetite"    │ //Upd ssc
├─────────┼────────┼───────────────┼─────────────────┤
│"O"      │"cpFeO" │"Wustite"      │"cpWustite"      │ //Upd ssc
├─────────┼────────┼───────────────┼─────────────────┤
│"P, O"   │"cpFePO"│"Vivanite"     │"cpVivanite"     │ //Upd sc & ssc                 (P, O -> P, O, H), ssc and ssc.uid (Vivanite (typo), -> Vivianite (Fe3(PO4)2.8H2O))
├─────────┼────────┼───────────────┼─────────────────┤
│"S"      │"cpFeS" │"Pyrite"       │"cpPyrite"       │ //Upd ssc
└─────────┴────────┴───────────────┴─────────────────┘
*/
//Update ssc
UNWIND [
{old_ssc_uid:"cpWustite", ssc: "Wüstite (FeO)", ssc_uid:"cpWüstite"},
{old_ssc_uid:"cpMagnetite", ssc:"Magnetite (Fe3O4)", ssc_uid:"cpMagnetite"},
{old_ssc_uid:"cpMaghemite", ssc:"Maghemite (γ-Fe2O3)", ssc_uid:"cpMaghemite"},
{old_ssc_uid:"cpHematite", ssc:"Hematite (α-Fe2O3)", ssc_uid:"cpHematite"},
{old_ssc_uid:"cpPyrite", ssc:"Pyrite (FeS2)", ssc_uid:"cpPyrite"}
] as upd_node
MATCH (ssc:SubCharacteristic {uid:upd_node.old_ssc_uid})
SET ssc.name =  upd_node.ssc, ssc.uid = upd_node.ssc_uid
RETURN ssc.name,ssc.uid;

//Update both sc and ssc
UNWIND [
{old_sc_uid:"cpFeCO", old_ssc_uid:"cpSiderite", sc:"O, C", sc_uid:"cpFeOC", ssc:"Siderite (FeCO3)", ssc_uid:"cpSiderite"},
{old_sc_uid:"cpFePO", old_ssc_uid:"cpVivanite", sc:"P, O, H", sc_uid:"cpFePOH", ssc:"Vivianite (Fe3(PO4)2.8H2O)", ssc_uid:"cpVivianite"}
] as upd_node
MATCH (sc:SubCharacteristic {uid:upd_node.old_sc_uid})-->(ssc:SubCharacteristic {uid:upd_node.old_ssc_uid})
SET sc.name=upd_node.sc, sc.uid=upd_node.sc_uid, ssc.name=upd_node.ssc, ssc.uid=upd_node.ssc_uid
RETURN sc.nane, sc.uid, ssc.name, ssc.uid;

/*
same as below
MATCH (sc:SubCharacteristic {uid:"cpFeCO"})-->(ssc:SubCharacteristic {uid:"cpSiderite"})
SET sc.name="O, C", sc.uid="cpFeOC", ssc.name="Siderite (FeCO3)"
MATCH (sc:SubCharacteristic {uid:"cpFePO"})-->(ssc:SubCharacteristic {uid:"cpVivanite"})
SET sc.name="P, O, H", sc.uid="cpFePOH", ssc.name="Vivianite (Fe3(PO4)2.8H2O)", ssc.uid="cpVivianite"
*/

//Del or move
// view existing:
// MATCH  (f:Family {name:"CP Composition"})<--(c:Characteristic {name:"Fe"})-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic)-[:HAS_SPECIALIZATION]->(ssc) RETURN c,sc,ssc
// MATCH  (f:Family {name:"CP Composition"})<--(c:Characteristic {name:"Fe"})-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic)-[:HAS_SPECIALIZATION]->(ssc)-[:IS_CONSTITUTED_BY]-(s:Strata) WHERE sc.uid="cpFeOH" OR sc.uid="cpFeO" OR sc.uid="cpFeCl" RETURN c,sc,ssc,s

UNWIND[
{old_sc_uid:"cpFeO", old_ssc_uid:"cpGeothite", sc:"O, H", sc_uid:"cpFeOH", ssc:"Goethite (α-FeO(OH))", ssc_uid:"cpGoethite"},
{old_sc_uid:"cpFeCl", old_ssc_uid:"cpAkaganeite", sc:"O, H", sc_uid:"cpFeOH", ssc:"Akaganeite ( β-FeO(OH))", ssc_uid:"cpAkaganeite"},
{old_sc_uid:"cpFeO", old_ssc_uid:"cpLepidocrocite", sc:"O, H", sc_uid:"cpFeOH", ssc:"Lepidocrocite (γ-FeO(OH))", ssc_uid:"cpLepidocrocite"}
] as upd_node
// First we update ssc names and possibly id
MATCH (ssc:SubCharacteristic {uid:upd_node.old_ssc_uid})
// then we create new sc cpFeOH
MERGE (sc:SubCharacteristic {uid:upd_node.sc_uid, name:upd_node.sc})
ON CREATE set sc+=$common_props
WITH sc,ssc, upd_node
// link new ssc to sc
MERGE (sc)-[:HAS_SPECIALIZATION]->(ssc)
SET  ssc.name=upd_node.ssc, ssc.uid=upd_node.ssc_uid
WITH sc, ssc, upd_node
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Fe" })
MERGE (c)-[:HAS_SPECIALIZATION]->(sc)
WITH sc, ssc, upd_node
// and find and update existing relations  (strata -> cpFeO-> ssc) into (strata -> cpFeOH -> ssc)
MATCH (s:Strata)-[r_icb_ssc:IS_CONSTITUTED_BY]->(ssc)
MATCH (s)-[r_icb_osc:IS_CONSTITUTED_BY]->(old_sc {uid:upd_node.old_sc_uid})-[r_hs:HAS_SPECIALIZATION]->(ssc)
//Create new relation betwin strata an new sc
MERGE (s)-[icb:IS_CONSTITUTED_BY]->(sc)
//Create new relation betwin Characteristic  and new sc
// delete the old relationships
DELETE r_icb_osc
WITH s,sc,ssc,upd_node
// to delete old HAS_SPECIALIZATION  in all cases need to match it again alone
MATCH (old_sc {uid:upd_node.old_sc_uid})-[r_hs:HAS_SPECIALIZATION]->(ssc)
DELETE r_hs
RETURN s.name, sc.name,ssc.name;

//Verification
/*
MATCH (s:Strata)-[r_icb_ssc:IS_CONSTITUTED_BY]->(ssc:SubCharacteristic {uid:"cpLepidocrocite"}),(s)-[r_icb_sc:IS_CONSTITUTED_BY]->(sc:SubCharacteristic)-[r_hs:HAS_SPECIALIZATION]->(ssc)
RETURN s,sc,ssc
*/

//Add
UNWIND [
{sc:"Cl", sc_uid:"cpFeCl", ssc:"Iron (II) chloride (FeCl2)", ssc_uid:"cpIronIIchloride"},
{sc:"Cl", sc_uid:"cpFeCl", ssc:"Iron (III) chloride (FeCl3)", ssc_uid:"cpIronIIIchloride"},
{sc:"S, O, H", sc_uid:"cpFeSOH", ssc:"Rozenite (FeSO4.4H2O)", ssc_uid:"cpRozenite"},
{sc:"S, O, H", sc_uid:"cpFeSOH", ssc:"Butlerite (Fe(OH)SO4.2H2O)", ssc_uid:"cpButlerite"},
{sc:"S, O, H, K", sc_uid:"cpFeSOHK", ssc:"Jarosite Fe3K(OH)6(SO4)2", ssc_uid:"cpJarosite"},
{sc:"S, O, H, Na", sc_uid:"cpFeSOHNa", ssc:"Natrojarosite Fe3Na(OH)6(SO4)2)", ssc_uid:"cpNatrojarosite"},
{sc:"Si, O", sc_uid:"cpFeSiO", ssc:"Fayelite (FeSiO4)", ssc_uid:"cpFayelite"}
] as new_nodes

MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Fe" })
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:new_nodes.sc, uid:new_nodes.sc_uid})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:new_nodes.ssc, uid:new_nodes.ssc_uid})
ON CREATE set ssc+=$common_props
RETURN f.name,c.name,sc.name,ssc.name;


/************************
//MC-227
ferreux / Strate M / Composition / Additional element(s)
Ajouter :
    la ligne C steel, Ni
    la ligne C steel, Ni, As, P
    la ligne Ni, Co, Cu
    la ligne P
    la ligne C steel, Cu, P, As, Co, Ni
    la ligne C grey cast iron, P, Si

Modifier
    la ligne C, Steel pour une ligne C steel
    la ligne Mn pour une ligne C steel, Mn
    la ligne C, Ni, Cr pour une ligne C steel, Ni, Cr
    la ligne C, Cu, P, Cr, Ni, Mo pour une ligne C steel, Cu, P, Cr, Ni, Mo
*/
//Update sc
UNWIND [
{old_uid:"mFeCSteel", uid:"mFeCSteel", name: "C steel"},
{old_uid:"mFeMn", uid:"mFeCSteelMn", name: "C steel, Mn"},
{old_uid:"mFeCNiCr", uid:"mFeCSteelNiCr", name: "C steel, Ni, Cr"},
{old_uid:"mFeCCuPCrNiMo",uid:"mFeCSteelCuPCrNiMo", name: "C steel, Cu, P, Cr, Ni, Mo"}
] as upd_node
MATCH (sc:SubCharacteristic {uid:upd_node.old_uid})
SET sc.name =  upd_node.name, sc.uid = upd_node.uid;

// Add
UNWIND [
{uid:"mFeCSteelNi", name: "C steel, Ni"},
{uid:"mFeCSteelNiAsP", name: "C steel, Ni, As, P"},
{uid:"mFeNiCoCu", name: "Ni, Co, Cu"},
{uid:"mFeP", name: "P"},
{uid:"mFeCSteelCuPAsCoNi", name: "C steel, Cu, P, As, Co, Ni"},
{uid:"mFeCGreyCastIronPSi", name: "C grey cast iron, P, Si"}
] as new_node
MATCH (f:Family {name:"M Composition"})<--(c:Characteristic {name: "Fe" })
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:new_node.name, uid:new_node.uid})
ON CREATE set sc+=$common_props
RETURN f.name,c.name,sc.name;

/* existing
MATCH (f:Family {name:"M Composition"})<--(c:Characteristic {name:"Fe"})-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic) return sc.name, sc.uid ORDER BY sc.name
╒══════════════════════╤═══════════════════╕
│"sc.name"             │"sc.uid"           │
╞══════════════════════╪═══════════════════╡
│"C grey cast Iron"    │"mFeCgreyCastIron" │
├──────────────────────┼───────────────────┤
│"C white cast Iron"   │"mFeCwhiteCastIron"│
├──────────────────────┼───────────────────┤
│"C, Cu, P, Cr, Ni, Mo"│"mFeCCuPCrNiMo"    │
├──────────────────────┼───────────────────┤
│"C, Ni, Cr"           │"mFeCNiCr"         │
├──────────────────────┼───────────────────┤
│"C, Steel"            │"mFeCSteel"        │
├──────────────────────┼───────────────────┤
│"Fe"                  │"mFe"              │
├──────────────────────┼───────────────────┤
│"Mn"                  │"mFeMn"            │
├──────────────────────┼───────────────────┤
│"Mo"                  │"mFeMo"            │
├──────────────────────┼───────────────────┤
│"Ni"                  │"mFeNi"            │
├──────────────────────┼───────────────────┤
│"W"                   │"mFeW"             │
└──────────────────────┴───────────────────┘
*/



/**************************
//MC-225
 Famille des cuivreux / Strate CP / Composition / secondary element (mettre la formule des composés)
 Modifier/ajouter :
    la ligne Cl doit correspondre au composé : Nantokite (CuCl)
    la ligne Cl,O,H doit correspondre aux composés : Eriochalcite (CuCl2.2H2O), Atacamite (Cu2Cl(OH)3), paratacamite (Cu2Cl(OH)3)
    la ligne N,O,H doit correspondre au composé : Gerhardtite (Cu2NO3(OH)3)
    la ligne O doit correspondre aux composés : Cuprite (Cu2O) et Tenorite (CuO)
    la ligne O,H doit correspondre au composé : Spertiniite (Cu(OH)2)
    la ligne O,H,C doit correspondre aux composés : Malachite (Cu2CO3(OH)2), Georgite, Cu2CO3(OH), Azurite (Cu3(CO3)2(OH)2), Copper acetate monohydrate (Cu(CH3CO2)2.H2O)
    la ligne O,H,C,Na doit correspondre au composé : Chalconatronite (CuNa2(CO3)2.3H2O)
    la ligne P,O,H doit correspondre au composé : Libethenite (Cu2(OH)PO4)
    la ligne S doit correspondre aux composés : Chalcocite (Cu2S), Covellite (CuS)
    la ligne S,Fe doit correspondre au composé : Chalcopyrite (CuFeS2)
    la ligne S,O,H doit correspondre aux composés : Brochantite Cu4(OH)6SO4, Antlerite (Cu3(OH)4SO4), Posnjakite Cu4(OH)6SO4.H2O

 existing
MATCH (f:Family {name:"M Composition"})<--(c:Characteristic {name:"Cu"})-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic) return sc.name, sc.uid ORDER BY sc.name
MATCH  (f:Family {name:"CP Composition"})<--(c:Characteristic {name:"Cu"})-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic)-[:HAS_SPECIALIZATION]->(ssc) RETURN c,sc,ssc
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Cu" })-->(sc)-->(ssc) RETURN sc.name, sc.uid,ssc.name,ssc.uid ORDER BY sc.name, ssc.name
+---------------------------------------------------------------+
| sc.name | sc.uid    | ssc.name          | ssc.uid             |
+---------------------------------------------------------------+
| "C, O"  | "cpCuCO"  | "Azurite"         | "cpAzurite"         | //Upd both C, O -> O, H, C
| "C, O"  | "cpCuCO"  | "Malachite"       | "cpMalachite"       | //Upd both C, O -> O, H, C
| "Cl, O" | "cpCuClO" | "Atacamite"       | "cpAtacamite"       | //Upd both Cl, O -> Cl, O, H
| "Cl, O" | "cpCuClO" | "Paratacamite"    | "cpParatacamite"    | //Upd both Cl, O -> Cl, O, H

| "Cl, O" | "cpCuClO" | "Nantokite"       | "cpNantokite"       | //Upd both MOVE Cl, O -> Cl

| "Fe, S" | "cpCuFeS" | "Chalcopyrite"    | "cpChalcopyrite"    | //Upd both Fe, S -> S, Fe
| "Na, O" | "cpCuNaO" | "Chalconatronite" | "cpChalconatronite" | //Upd both Na, O -> O, H, C, Na
| "O"     | "cpCuO"   | "Cuprite"         | "cpCuprite"         | //Upd ssc
| "O"     | "cpCuO"   | "Tenorite"        | "cpTenorite"        | //Upd ssc
| "S"     | "cpCuS"   | "Chalcocite"      | "cpChalcocite"      | //Upd ssc
| "S"     | "cpCuS"   | "Covellite"       | "cpCovellite"       | //Upd ssc
| "S, O"  | "cpCuSO"  | "Antlerite"       | "cpAntlerite"       | //Upd both S, O -> S, O, H
| "S, O"  | "cpCuSO"  | "Brochantite"     | "cpBrochantite"     | //Upd both S, O -> S, O, H
+---------------------------------------------------------------+
*/

//Update both sc and ssc
UNWIND [
{old_sc_uid:"cpCuCO", old_ssc_uid:"cpAzurite", sc:"O, H, C", sc_uid:"cpCuOHC", ssc:"Azurite (Cu3(CO3)2(OH)2)", ssc_uid:"cpAzurite"},
{old_sc_uid:"cpCuOHC", old_ssc_uid:"cpMalachite", sc:"O, H, C", sc_uid:"cpCuOHC", ssc:"Malachite (Cu2CO3(OH)2)", ssc_uid:"cpMalachite"},
{old_sc_uid:"cpCuClO", old_ssc_uid:"cpAtacamite", sc:"Cl, O, H", sc_uid:"cpCuClOH", ssc:"Atacamite (Cu2Cl(OH)3)", ssc_uid:"cpAtacamite"},
{old_sc_uid:"cpCuClOH", old_ssc_uid:"cpParatacamite", sc:"Cl, O, H", sc_uid:"cpCuClOH", ssc:"Paratacamite (Cu2Cl(OH)3)", ssc_uid:"cpParatacamite"},
{old_sc_uid:"cpCuFeS", old_ssc_uid:"cpChalcopyrite", sc:"S, Fe", sc_uid:"cpCuSFe", ssc:"Chalcopyrite (CuFeS2)", ssc_uid:"cpChalcopyrite"},
{old_sc_uid:"cpCuNaO", old_ssc_uid:"cpChalconatronite", sc:"O, H, C, Na", sc_uid:"cpCuOHCNa", ssc:"Chalconatronite (CuNa2(CO3)2.3H2O)", ssc_uid:"cpChalconatronite"},
{old_sc_uid:"cpCuSO", old_ssc_uid:"cpAntlerite", sc:"S, O, H", sc_uid:"cpCuSOH", ssc:"Antlerite (Cu3(OH)4SO4)", ssc_uid:"cpAntlerite"},
{old_sc_uid:"cpCuSOH", old_ssc_uid:"cpBrochantite", sc:"S, O, H", sc_uid:"cpCuSOH", ssc:"Brochantite Cu4(OH)6SO4", ssc_uid:"cpBrochantite"}
] as upd_node
MATCH (sc:SubCharacteristic {uid:upd_node.old_sc_uid})-->(ssc:SubCharacteristic {uid:upd_node.old_ssc_uid})
SET sc.name=upd_node.sc, sc.uid=upd_node.sc_uid, ssc.name=upd_node.ssc, ssc.uid=upd_node.ssc_uid
return sc.name,sc.uid,ssc.name,ssc.uid;

//Update ssc
UNWIND [
{old_ssc_uid:"cpCuprite", ssc: "Cuprite (Cu2O)", ssc_uid:"cpCuprite"},
{old_ssc_uid:"cpTenorite", ssc: "Tenorite (CuO)", ssc_uid:"cpTenorite"},
{old_ssc_uid:"cpChalcocite", ssc: "Chalcocite (Cu2S)", ssc_uid:"cpChalcocite"},
{old_ssc_uid:"cpCovellite", ssc: "Covellite (CuS)", ssc_uid:"cpCovellite"}
] as upd_node
MATCH (ssc:SubCharacteristic {uid:upd_node.old_ssc_uid})
SET ssc.name =  upd_node.ssc
RETURN ssc.name,ssc.uid;


/* Find existing strata relations
MATCH (n:SubCharacteristic {uid:"cpNantokite"})--(rn)
MATCH (rn)-[:IS_CONSTITUTED_BY]->(ssc:SubCharacteristic)
RETURN n,rn,ssc
*/
//Up and Move
UNWIND[
{old_sc_uid:"cpCuClOH", old_ssc_uid:"cpNantokite", sc:"Cl", sc_uid:"cpCuCl", ssc:"Nantokite (CuCl)", ssc_uid:"cpNantokite"}
] as upd_node
// First we update ssc names and possibly id
MATCH (ssc:SubCharacteristic {uid:upd_node.old_ssc_uid})
// then we create new sc cpCuCl
MERGE (sc:SubCharacteristic {uid:upd_node.sc_uid, name:upd_node.sc})
ON CREATE set sc+=$common_props
WITH sc,ssc, upd_node
// link new ssc to sc
MERGE (sc)-[:HAS_SPECIALIZATION]->(ssc)
SET  ssc.name=upd_node.ssc, ssc.uid=upd_node.ssc_uid
WITH sc, ssc, upd_node
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Cu" })
MERGE (c)-[:HAS_SPECIALIZATION]->(sc)
WITH sc, ssc, upd_node
// and find and update existing relations  (strata -> cpFeO-> ssc) into (strata -> cpFeOH -> ssc)
MATCH (s:Strata)-[r_icb_ssc:IS_CONSTITUTED_BY]->(ssc)
MATCH (s)-[r_icb_osc:IS_CONSTITUTED_BY]->(old_sc {uid:upd_node.old_sc_uid})-[r_hs:HAS_SPECIALIZATION]->(ssc)
//Create new relation betwin strata an new sc
MERGE (s)-[icb:IS_CONSTITUTED_BY]->(sc)
//Create new relation betwin Characteristic  and new sc
// delete the old relationships
DELETE r_icb_osc
WITH s,sc,ssc,upd_node
// to delete old HAS_SPECIALIZATION  in all cases need to match it again alone
MATCH (old_sc {uid:upd_node.old_sc_uid})-[r_hs:HAS_SPECIALIZATION]->(ssc)
DELETE r_hs
RETURN s.name, sc.name,ssc.name;


//Add new sc and ssc
/*
Cl, O, H: Eriochalcite (CuCl2.2H2O)
N, O, H: Gerhardtite (Cu2NO3(OH)3)
O,H:  Spertiniite (Cu(OH)2)
O, H, C: Georgite Cu2CO3(OH), Copper acetate monohydrate (Cu(CH3CO2)2.H2O)
P, O, H: Libethenite (Cu2(OH)PO4)
S, O, H:   Posnjakite Cu4(OH)6SO4.H2O
*/
UNWIND [
{sc:"Cl, O, H", sc_uid:"cpCuClOH", ssc:"Eriochalcite (CuCl2.2H2O)", ssc_uid:"cpEriochalcite"},
{sc:"N, O, H", sc_uid:"cpCuNOH", ssc:"Gerhardtite (Cu2NO3(OH)3)", ssc_uid:"cpGerhardtite"},
{sc:"O, H", sc_uid:"cpCuOH", ssc:"Spertiniite (Cu(OH)2)", ssc_uid:"cpSpertiniite"},
{sc:"O, H, C", sc_uid:"cpCuOHC", ssc:"Georgite Cu2CO3(OH)", ssc_uid:""},
{sc:"O, H, C", sc_uid:"cpCuOHC", ssc:"Copper acetate monohydrate (Cu(CH3CO2)2.H2O)", ssc_uid:"cpCopperAcetateMonohydrate"},
{sc:"P, O, H", sc_uid:"cpCuPOH", ssc:"Libethenite (Cu2(OH)PO4)", ssc_uid:"cpLibethenite"},
{sc:"S, O, H", sc_uid:"cpCuSOH", ssc:"Posnjakite Cu4(OH)6SO4.H2O", ssc_uid:"cpPosnjakite"}
] as new_nodes

MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Cu" })
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:new_nodes.sc, uid:new_nodes.sc_uid})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:new_nodes.ssc, uid:new_nodes.ssc_uid})
ON CREATE set ssc+=$common_props
RETURN f.name, c.name, sc.name,ssc.name;


/**************************
//MC-224
Famille des argent / Strate CP / Composition / Secondary element (mettre la formule des composés)

Add
  la ligne Br correspondant au composé : Bromargyrite (AgBr)
Update
  la ligne Cl correspondant au composé : Chlorargyrite (AgCl)
  la ligne S correspondant aux composés : Acanthite (α-Ag2S), Argentite (β-Ag2S)

MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Ag" })-->(sc)-->(ssc) RETURN sc.name, sc.uid,ssc.name,ssc.uid ORDER BY sc.name, ssc.name
╒═════════╤════════╤═══════════════╤═════════════════╕
│"sc.name"│"sc.uid"│"ssc.name"     │"ssc.uid"        │
╞═════════╪════════╪═══════════════╪═════════════════╡
│"Cl"     │"cpAgCl"│"Chlorargyrite"│"cpChlorargyrite"│
├─────────┼────────┼───────────────┼─────────────────┤
│"S"      │"cpAgS" │"Acanthite"    │"cpAcanthite"    │
├─────────┼────────┼───────────────┼─────────────────┤
│"S"      │"cpAgS" │"Argentite"    │"cpArgentite"    │
└─────────┴────────┴───────────────┴─────────────────┘
*/

//Update ssc
UNWIND [
{ ssc: "Chlorargyrite (AgCl)", ssc_uid:"cpChlorargyrite"},
{ ssc: "Acanthite (α-Ag2S)", ssc_uid:"cpAcanthite"},
{ ssc: "Argentite (β-Ag2S)", ssc_uid:"cpArgentite"}
] as upd_node
MATCH (ssc:SubCharacteristic {uid:upd_node.ssc_uid})
SET ssc.name =  upd_node.ssc
RETURN ssc.name,ssc.uid;

//Add
UNWIND [
{sc:"Br", sc_uid:"cpAgBr", ssc:"Bromargyrite (AgBr)", ssc_uid:"cpBromargyrite"}
] as new_nodes
MATCH (f:Family {name:"CP Composition"})<--(c:Characteristic {name: "Ag" })
MERGE (c)-[:HAS_SPECIALIZATION]-> (sc:SubCharacteristic {name:new_nodes.sc, uid:new_nodes.sc_uid})
ON CREATE set sc+=$common_props
MERGE (sc)-[:HAS_SPECIALIZATION]-> (ssc:SubCharacteristic {name:new_nodes.ssc, uid:new_nodes.ssc_uid})
ON CREATE set ssc+=$common_props
RETURN f.name,c.name,sc.name,ssc.name;
