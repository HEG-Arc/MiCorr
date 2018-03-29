:param common_props {version:4, date:"2018-03-29"}

// graphdb cleanup
// removing old test nodes:Person and relationships :OWNS and :IS_CHILD_OF
MATCH (n:Person) DETACH DELETE n;
// todo also remove redundant unused ? :Label nodes after usage verification

CREATE CONSTRAINT ON (e:Element) ASSERT e.uid IS UNIQUE;
CREATE CONSTRAINT ON (e:Element) ASSERT e.symbol IS UNIQUE;
CREATE CONSTRAINT ON (e:Element) ASSERT e.number IS UNIQUE;

// Adding new elementFamily and creating importing period table elements
// as new nodes with both Element and Characteristic labels
MERGE (f:Family {uid:'elementFamily', name:'Element'})
ON CREATE SET f+=$common_props
WITH f
UNWIND [{phase: "Gas", category: "diatomic nonmetal", symbol: "H", number: 1, name: "Hydrogen"}, {phase: "Gas", category: "noble gas", symbol: "He", number: 2, name: "Helium"}, {phase: "Solid", category: "alkali metal", symbol: "Li", number: 3, name: "Lithium"}, {phase: "Solid", category: "alkaline earth metal", symbol: "Be", number: 4, name: "Beryllium"}, {phase: "Solid", category: "metalloid", symbol: "B", number: 5, name: "Boron"}, {phase: "Solid", category: "polyatomic nonmetal", symbol: "C", number: 6, name: "Carbon"}, {phase: "Gas", category: "diatomic nonmetal", symbol: "N", number: 7, name: "Nitrogen"}, {phase: "Gas", category: "diatomic nonmetal", symbol: "O", number: 8, name: "Oxygen"}, {phase: "Gas", category: "diatomic nonmetal", symbol: "F", number: 9, name: "Fluorine"}, {phase: "Gas", category: "noble gas", symbol: "Ne", number: 10, name: "Neon"}, {phase: "Solid", category: "alkali metal", symbol: "Na", number: 11, name: "Sodium"}, {phase: "Solid", category: "alkaline earth metal", symbol: "Mg", number: 12, name: "Magnesium"}, {phase: "Solid", category: "post-transition metal", symbol: "Al", number: 13, name: "Aluminium"}, {phase: "Solid", category: "metalloid", symbol: "Si", number: 14, name: "Silicon"}, {phase: "Solid", category: "polyatomic nonmetal", symbol: "P", number: 15, name: "Phosphorus"}, {phase: "Solid", category: "polyatomic nonmetal", symbol: "S", number: 16, name: "Sulfur"}, {phase: "Gas", category: "diatomic nonmetal", symbol: "Cl", number: 17, name: "Chlorine"}, {phase: "Gas", category: "noble gas", symbol: "Ar", number: 18, name: "Argon"}, {phase: "Solid", category: "alkali metal", symbol: "K", number: 19, name: "Potassium"}, {phase: "Solid", category: "alkaline earth metal", symbol: "Ca", number: 20, name: "Calcium"}, {phase: "Solid", category: "transition metal", symbol: "Sc", number: 21, name: "Scandium"}, {phase: "Solid", category: "transition metal", symbol: "Ti", number: 22, name: "Titanium"}, {phase: "Solid", category: "transition metal", symbol: "V", number: 23, name: "Vanadium"}, {phase: "Solid", category: "transition metal", symbol: "Cr", number: 24, name: "Chromium"}, {phase: "Solid", category: "transition metal", symbol: "Mn", number: 25, name: "Manganese"}, {phase: "Solid", category: "transition metal", symbol: "Fe", number: 26, name: "Iron"}, {phase: "Solid", category: "transition metal", symbol: "Co", number: 27, name: "Cobalt"}, {phase: "Solid", category: "transition metal", symbol: "Ni", number: 28, name: "Nickel"}, {phase: "Solid", category: "transition metal", symbol: "Cu", number: 29, name: "Copper"}, {phase: "Solid", category: "transition metal", symbol: "Zn", number: 30, name: "Zinc"}, {phase: "Solid", category: "post-transition metal", symbol: "Ga", number: 31, name: "Gallium"}, {phase: "Solid", category: "metalloid", symbol: "Ge", number: 32, name: "Germanium"}, {phase: "Solid", category: "metalloid", symbol: "As", number: 33, name: "Arsenic"}, {phase: "Solid", category: "polyatomic nonmetal", symbol: "Se", number: 34, name: "Selenium"}, {phase: "Liquid", category: "diatomic nonmetal", symbol: "Br", number: 35, name: "Bromine"}, {phase: "Gas", category: "noble gas", symbol: "Kr", number: 36, name: "Krypton"}, {phase: "Solid", category: "alkali metal", symbol: "Rb", number: 37, name: "Rubidium"}, {phase: "Solid", category: "alkaline earth metal", symbol: "Sr", number: 38, name: "Strontium"}, {phase: "Solid", category: "transition metal", symbol: "Y", number: 39, name: "Yttrium"}, {phase: "Solid", category: "transition metal", symbol: "Zr", number: 40, name: "Zirconium"}, {phase: "Solid", category: "transition metal", symbol: "Nb", number: 41, name: "Niobium"}, {phase: "Solid", category: "transition metal", symbol: "Mo", number: 42, name: "Molybdenum"}, {phase: "Solid", category: "transition metal", symbol: "Tc", number: 43, name: "Technetium"}, {phase: "Solid", category: "transition metal", symbol: "Ru", number: 44, name: "Ruthenium"}, {phase: "Solid", category: "transition metal", symbol: "Rh", number: 45, name: "Rhodium"}, {phase: "Solid", category: "transition metal", symbol: "Pd", number: 46, name: "Palladium"}, {phase: "Solid", category: "transition metal", symbol: "Ag", number: 47, name: "Silver"}, {phase: "Solid", category: "transition metal", symbol: "Cd", number: 48, name: "Cadmium"}, {phase: "Solid", category: "post-transition metal", symbol: "In", number: 49, name: "Indium"}, {phase: "Solid", category: "post-transition metal", symbol: "Sn", number: 50, name: "Tin"}, {phase: "Solid", category: "metalloid", symbol: "Sb", number: 51, name: "Antimony"}, {phase: "Solid", category: "metalloid", symbol: "Te", number: 52, name: "Tellurium"}, {phase: "Solid", category: "diatomic nonmetal", symbol: "I", number: 53, name: "Iodine"}, {phase: "Gas", category: "noble gas", symbol: "Xe", number: 54, name: "Xenon"}, {phase: "Solid", category: "alkali metal", symbol: "Cs", number: 55, name: "Cesium"}, {phase: "Solid", category: "alkaline earth metal", symbol: "Ba", number: 56, name: "Barium"}, {phase: "Solid", category: "lanthanide", symbol: "La", number: 57, name: "Lanthanum"}, {phase: "Solid", category: "lanthanide", symbol: "Ce", number: 58, name: "Cerium"}, {phase: "Solid", category: "lanthanide", symbol: "Pr", number: 59, name: "Praseodymium"}, {phase: "Solid", category: "lanthanide", symbol: "Nd", number: 60, name: "Neodymium"}, {phase: "Solid", category: "lanthanide", symbol: "Pm", number: 61, name: "Promethium"}, {phase: "Solid", category: "lanthanide", symbol: "Sm", number: 62, name: "Samarium"}, {phase: "Solid", category: "lanthanide", symbol: "Eu", number: 63, name: "Europium"}, {phase: "Solid", category: "lanthanide", symbol: "Gd", number: 64, name: "Gadolinium"}, {phase: "Solid", category: "lanthanide", symbol: "Tb", number: 65, name: "Terbium"}, {phase: "Solid", category: "lanthanide", symbol: "Dy", number: 66, name: "Dysprosium"}, {phase: "Solid", category: "lanthanide", symbol: "Ho", number: 67, name: "Holmium"}, {phase: "Solid", category: "lanthanide", symbol: "Er", number: 68, name: "Erbium"}, {phase: "Solid", category: "lanthanide", symbol: "Tm", number: 69, name: "Thulium"}, {phase: "Solid", category: "lanthanide", symbol: "Yb", number: 70, name: "Ytterbium"}, {phase: "Solid", category: "lanthanide", symbol: "Lu", number: 71, name: "Lutetium"}, {phase: "Solid", category: "transition metal", symbol: "Hf", number: 72, name: "Hafnium"}, {phase: "Solid", category: "transition metal", symbol: "Ta", number: 73, name: "Tantalum"}, {phase: "Solid", category: "transition metal", symbol: "W", number: 74, name: "Tungsten"}, {phase: "Solid", category: "transition metal", symbol: "Re", number: 75, name: "Rhenium"}, {phase: "Solid", category: "transition metal", symbol: "Os", number: 76, name: "Osmium"}, {phase: "Solid", category: "transition metal", symbol: "Ir", number: 77, name: "Iridium"}, {phase: "Solid", category: "transition metal", symbol: "Pt", number: 78, name: "Platinum"}, {phase: "Solid", category: "transition metal", symbol: "Au", number: 79, name: "Gold"}, {phase: "Liquid", category: "transition metal", symbol: "Hg", number: 80, name: "Mercury"}, {phase: "Solid", category: "post-transition metal", symbol: "Tl", number: 81, name: "Thallium"}, {phase: "Solid", category: "post-transition metal", symbol: "Pb", number: 82, name: "Lead"}, {phase: "Solid", category: "post-transition metal", symbol: "Bi", number: 83, name: "Bismuth"}, {phase: "Solid", category: "post-transition metal", symbol: "Po", number: 84, name: "Polonium"}, {phase: "Solid", category: "metalloid", symbol: "At", number: 85, name: "Astatine"}, {phase: "Gas", category: "noble gas", symbol: "Rn", number: 86, name: "Radon"}, {phase: "Solid", category: "alkali metal", symbol: "Fr", number: 87, name: "Francium"}, {phase: "Solid", category: "alkaline earth metal", symbol: "Ra", number: 88, name: "Radium"}, {phase: "Solid", category: "actinide", symbol: "Ac", number: 89, name: "Actinium"}, {phase: "Solid", category: "actinide", symbol: "Th", number: 90, name: "Thorium"}, {phase: "Solid", category: "actinide", symbol: "Pa", number: 91, name: "Protactinium"}, {phase: "Solid", category: "actinide", symbol: "U", number: 92, name: "Uranium"}, {phase: "Solid", category: "actinide", symbol: "Np", number: 93, name: "Neptunium"}, {phase: "Solid", category: "actinide", symbol: "Pu", number: 94, name: "Plutonium"}, {phase: "Solid", category: "actinide", symbol: "Am", number: 95, name: "Americium"}, {phase: "Solid", category: "actinide", symbol: "Cm", number: 96, name: "Curium"}, {phase: "Solid", category: "actinide", symbol: "Bk", number: 97, name: "Berkelium"}, {phase: "Solid", category: "actinide", symbol: "Cf", number: 98, name: "Californium"}, {phase: "Solid", category: "actinide", symbol: "Es", number: 99, name: "Einsteinium"}, {phase: "Solid", category: "actinide", symbol: "Fm", number: 100, name: "Fermium"}, {phase: "Solid", category: "actinide", symbol: "Md", number: 101, name: "Mendelevium"}, {phase: "Solid", category: "actinide", symbol: "No", number: 102, name: "Nobelium"}, {phase: "Solid", category: "actinide", symbol: "Lr", number: 103, name: "Lawrencium"}, {phase: "Solid", category: "transition metal", symbol: "Rf", number: 104, name: "Rutherfordium"}, {phase: "Solid", category: "transition metal", symbol: "Db", number: 105, name: "Dubnium"}, {phase: "Solid", category: "transition metal", symbol: "Sg", number: 106, name: "Seaborgium"}, {phase: "Solid", category: "transition metal", symbol: "Bh", number: 107, name: "Bohrium"}, {phase: "Solid", category: "transition metal", symbol: "Hs", number: 108, name: "Hassium"}, {phase: "Solid", category: "unknown, probably transition metal", symbol: "Mt", number: 109, name: "Meitnerium"}, {phase: "Solid", category: "unknown, probably transition metal", symbol: "Ds", number: 110, name: "Darmstadtium"}, {phase: "Solid", category: "unknown, probably transition metal", symbol: "Rg", number: 111, name: "Roentgenium"}, {phase: "Gas", category: "transition metal", symbol: "Cn", number: 112, name: "Copernicium"}, {phase: "Solid", category: "unknown, probably transition metal", symbol: "Nh", number: 113, name: "Nihonium"}, {phase: "Solid", category: "post-transition metal", symbol: "Fl", number: 114, name: "Flerovium"}, {phase: "Solid", category: "unknown, probably post-transition metal", symbol: "Mc", number: 115, name: "Moscovium"}, {phase: "Solid", category: "unknown, probably post-transition metal", symbol: "Lv", number: 116, name: "Livermorium"}, {phase: "Solid", category: "unknown, probably metalloid", symbol: "Ts", number: 117, name: "Tennessine"}, {phase: "Solid", category: "unknown, predicted to be noble gas", symbol: "Og", number: 118, name: "Oganesson"}]
AS data
MERGE (e:Element:Characteristic {uid:data.symbol, number:data.number, symbol:data.symbol, name:data.name, phase:data.phase, category:data.category} )
ON CREATE SET e+=$common_props
WITH f,e
MERGE (e)-[:BELONGS_TO]->(f)
RETURN e,f;


/**************************
 MC-219 Strate Pseudomorph of organic material
 adds pomCompositionMetallicPollutants
*/
MERGE (f:Family {uid: 'pomCompositionMetallicPollutants', name: 'POM Composition Metallic pollutants', version: 4})
WITH f
MATCH (n:Nature {uid: 'pom'})
WITH f, n
MERGE (n)-[:HAS_FAMILY]->(f)
WITH n, f
MATCH (ef:Family {uid: 'elementFamily'})
MERGE (f)-[r:IS_LIST_OF {upto: 0}]->(ef)
RETURN n, f, ef, r;

// remove unwanted and unused Characteristics from pomCompositionFamily
// "otherCharacteristic", "textileCharacteristic", "leatherCharacteristic","woodCharacteristic"
// MATCH (c:Characteristic)-->(f:Family {uid:"pomCompositionFamily"})
// WHERE NOT ()-[:IS_CONSTITUTED_BY]->(c) RETURN c.uid

UNWIND ["pomOtherCharacteristic",
"textileOthercharacteristic",
"leatherOtherCharacteristic",
"textileFeCharacteristic",
"textileCuCharacteristic",
"leatherFeCharacteristic",
"leatherCuCharacteristic",
"woodFeCharacteristic",
"woodCuCharacteristic"] AS c_uid
MATCH (c:Characteristic {uid:c_uid})
DETACH DELETE c;

// Set remaining characteristics in alphabetical order but for other
// and change uids for consistency with  other characteristics Families
UNWIND [
  {uid: "leatherCharacteristic", new_uid: "pomLeatherCharacteristic", order: 0},
  {uid: "textileCharacteristic", new_uid: "pomTextileCharacteristic", order: 1},
  {uid: "woodCharacteristic", new_uid: "pomWoodCharacteristic", order: 2},
  {uid: "woodOtherCharacteristic", new_uid: "pomOtherCharacteristic", order: 3}] AS updt
MATCH (c:Characteristic {uid: updt.uid})
SET c.order = updt.order, c.uid = updt.new_uid
RETURN c;


/**************************
// MC-270 Strate M - tableau periodique des éléments
// mCompositionMainElements
*/
UNWIND [
  {uid: 'mCompositionMainElements', name: 'M Composition Main elements'},
  {uid: 'mCompositionSecondaryElements', name: 'M Composition Secondary elements'}
] AS new_f
MERGE (f:Family {uid: new_f.uid, name: new_f.name})
  ON CREATE SET f+=$common_props
WITH f
MATCH (n:Nature {uid: 'metal'})
WITH f, n
MERGE (n)-[:HAS_FAMILY]->(f)
WITH n, f
MATCH (ef:Family {uid: 'elementFamily'})
MERGE (f)-[r:IS_LIST_OF {upto: 0}]->(ef)
RETURN n, f, ef, r;



/**************************
// MC-339 Strate CP - tableau periodique des éléments

*/

// Import all current compounds as an initial list of new Compound/Characteristic nodes

CREATE CONSTRAINT ON (c:Compound) ASSERT c.uid IS UNIQUE;

MERGE (f:Family {uid:"compoundFamily", name:"Compound"}) WITH f
  // see how data fixture was extracted from existing "sub sub characteristics" in neo4j_import_elements.ipynb
  // from : MATCH (c:Characteristic)-[:HAS_SPECIALIZATION *2]->(ssc) WHERE ssc.name contains "(" RETURN ssc.name as name, ssc.uid as uid
  UNWIND [{uid: "cpdAcanthite", name: "Acanthite (\u03b1-Ag2S)"}, {uid: "cpdArgentite", name: "Argentite (\u03b2-Ag2S)"}, {uid: "cpdChlorargyrite", name: "Chlorargyrite (AgCl)"}, {uid: "cpdBromargyrite", name: "Bromargyrite (AgBr)"}, {uid: "cpdAlumina", name: "Alumina (Al2O3)"}, {uid: "cpdBayeriteGibbsiteHydrargillite", name: "Bayerite / Gibbsite / Hydrargillite (Al2O3,3H2O / Al(OH)3)"}, {uid: "cpdBoehmite", name: "Boehmite (Al2O3,H2O / AlO(OH))"}, {uid: "cpdChloraluminite", name: "Chloraluminite (AlCl3.6H2O)"}, {uid: "cpdChalcopyrite", name: "Chalcopyrite (CuFeS2)"}, {uid: "cpdChalconatronite", name: "Chalconatronite (CuNa2(CO3)2.3H2O)"}, {uid: "cpdAtacamite", name: "Atacamite (Cu2Cl(OH)3)"}, {uid: "cpdParatacamite", name: "Paratacamite (Cu2Cl(OH)3)"}, {uid: "cpdEriochalcite", name: "Eriochalcite (CuCl2.2H2O)"}, {uid: "cpdAntlerite", name: "Antlerite (Cu3(OH)4SO4)"}, {uid: "cpdBrochantite", name: "Brochantite (Cu4(OH)6SO4)"}, {uid: "cpdPosnjakite", name: "Posnjakite (Cu4(OH)6SO4.H2O)"}, {uid: "cpdChalcocite", name: "Chalcocite (Cu2S)"}, {uid: "cpdCovellite", name: "Covellite (CuS)"}, {uid: "", name: "Georgite (Cu2CO3(OH))"}, {uid: "cpdCopperAcetateMonohydrate", name: "Copper acetate monohydrate (Cu(CH3CO2)2.H2O)"}, {uid: "cpdAzurite", name: "Azurite (Cu3(CO3)2(OH)2)"}, {uid: "cpdMalachite", name: "Malachite (Cu2CO3(OH)2)"}, {uid: "cpdTenorite", name: "Tenorite (CuO)"}, {uid: "cpdCuprite", name: "Cuprite (Cu2O)"}, {uid: "cpdNantokite", name: "Nantokite (CuCl)"}, {uid: "cpdSpertiniite", name: "Spertiniite (Cu(OH)2)"}, {uid: "cpdGerhardtite", name: "Gerhardtite (Cu2NO3(OH)3)"}, {uid: "cpdLibethenite", name: "Libethenite (Cu2(OH)PO4)"}, {uid: "cpdVivianite", name: "Vivianite (Fe3(PO4)2.8H2O)"}, {uid: "cpdIronIIIchloride", name: "Iron (III) chloride (FeCl3)"}, {uid: "cpdIronIIchloride", name: "Iron (II) chloride (FeCl2)"}, {uid: "cpdPyrite", name: "Pyrite (FeS2)"}, {uid: "cpdSiderite", name: "Siderite (FeCO3)"}, {uid: "cpdW\u00fcstite", name: "W\u00fcstite (FeO)"}, {uid: "cpdMagnetite", name: "Magnetite (Fe3O4)"}, {uid: "cpdMaghemite", name: "Maghemite (\u03b3-Fe2O3)"}, {uid: "cpdHematite", name: "Hematite (\u03b1-Fe2O3)"}, {uid: "cpdLepidocrocite", name: "Lepidocrocite (\u03b3-FeO(OH))"}, {uid: "cpdAkaganeite", name: "Akaganeite ( \u03b2-FeO(OH))"}, {uid: "cpdGoethite", name: "Goethite (\u03b1-FeO(OH))"}, {uid: "cpdJarosite", name: "Jarosite (Fe3K(OH)6(SO4)2)"}, {uid: "cpdRozenite", name: "Rozenite (FeSO4.4H2O)"}, {uid: "cpdButlerite", name: "Butlerite (Fe(OH)SO4.2H2O)"}, {uid: "cpdFayelite", name: "Fayelite (FeSiO4)"}, {uid: "cpdNatrojarosite", name: "Natrojarosite (Fe3Na(OH)6(SO4)2)"}, {uid: "cpdBunsenite", name: "Bunsenite (NiO)"}, {uid: "cpdNickelchloride", name: "Nickel (II) chloride (NiCl2.6H2O)"}, {uid: "cpdTheophrastite", name: "Theophrastite (Ni(OH)2)"}, {uid: "cpdNickelnitratehexahydrate", name: "Nickel nitrate hexahydrate (Ni(NO3)2.6H2O)"}, {uid: "cpdPentlandite", name: "Pentlandite ((Fe,Ni)9S8)"}, {uid: "cpdMillerite", name: "Millerite (NiS)"}, {uid: "cpdHeazlewoodite", name: "Heazlewoodite (Ni3S2)"}, {uid: "cpdRetgersite", name: "Retgersite (NiSO4.6H2O)"}, {uid: "cpdOttemannite", name: "Ottemannite (Sn2S3)"}, {uid: "cpdBerndtite", name: "Berndtite (SnS2)"}, {uid: "cpdHerzenbergite", name: "Herzenbergite (SnS)"}, {uid: "cpdRomarchite", name: "Romarchite (SnO)"}, {uid: "cpdCassiterite", name: "Cassiterite (SnO2)"}, {uid: "cpdHydroromarchite", name: "Hydroromarchite (Sn3O2(OH)2)"}, {uid: "cpdZincite", name: "Zinc white (ZnO)"}, {uid: "cpdSmithsonite", name: "Smithsonite (ZnCO3)"}, {uid: "cpdWulfingite", name: "W\u00fclfingite (Zn(OH)2)"}, {uid: "cpdSimonkolleite", name: "Simonkolleite (Zn5Cl2(OH)8.H2O)"}, {uid: "cpdHydrozincite", name: "Hydrozincite (Zn5(CO3)2(OH)6)"}, {uid: "cpdGoslarite", name: "Goslarite (ZnSO4.7H2O)"}, {uid: "cpdSphalerite", name: "Sphalerite, Wurztite (ZnS)"}]
  AS data
    MERGE (c:Compound:Characteristic {uid:data.uid})
    ON CREATE SET c+=$common_props, c.name=data.name
    ON MATCH SET c.name=data.name //To fix missing parenthesis in some names of 6cd03ab
    WITH f,c
        MERGE (c)-[:BELONGS_TO]->(f)
        RETURN c,f;

/**************************
// MC-339 Strate CP - tableau periodique des éléments
// Create new Families for cp MainElements SecondaryElements and Compounds
//
// MC-340 Strate CM - tableau periodique des éléments
// Create new Families for cmm / cmcp / cmcpag Additional Elements
*/
UNWIND [
  {nature:'cp', uid: 'cpCompositionMainElements', name: 'CP Composition Main elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'cp', uid: 'cpCompositionSecondaryElements', name: 'CP Composition Secondary elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'cp', uid: 'cpCompositionCompounds', name: 'CP Composition Compounds', upto: 1, list_elem_family:"compoundFamily"},
  {nature:'cp', uid: 'cpCompositionAdditionalElements', name: 'CP Composition Additional elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'cm', uid: 'cmmCompositionAdditionalElements', name: 'CM M Composition Additional elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'cm', uid: 'cmcpCompositionAdditionalElements', name: 'CM CP Composition Additional elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'cm', uid: 'cmcpagCompositionAdditionalElements', name: 'CM CP Aggregates Composition Additional elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'soil', uid: 'sCompositionMainElements', name: 'S Composition Main elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'soil', uid: 'sCompositionSecondaryElements', name: 'S Composition Secondary elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'deposit', uid: 'dCompositionMainElements', name: 'D Composition Main elements', upto: 0, list_elem_family:"elementFamily"},
  {nature:'deposit', uid: 'dCompositionSecondaryElements', name: 'D Composition Secondary elements', upto: 0, list_elem_family:"elementFamily"}
] AS new_f
MERGE (f:Family {uid: new_f.uid, name: new_f.name})
  ON CREATE SET f+=$common_props
WITH f, new_f
MATCH (n:Nature {uid: new_f.nature})
WITH f, n, new_f
MERGE (n)-[:HAS_FAMILY]->(f)
WITH n, f, new_f
MATCH (ef:Family {uid: new_f.list_elem_family})
MERGE (f)-[r:IS_LIST_OF {upto: new_f.upto}]->(ef)
RETURN n, f, ef, r;
