:param common_props {version:8, date:'2020-08-31'}

// Adds/updates new colour characteristics generated using MetalPAT_colourFamily.ipynb
UNWIND [
{uid: 'colourBlankCharacteristic', name: 'Blank', description: 'Unknown', order: 1},
//old_rgb=#efef8f new rgb:#fff8dc => [255, 248, 220] old_hls:(60, 75.0, 75.0) => (48, 100, 93)
{optgroup: 'Yellow', uid: 'lightYellowCharacteristic', name: 'Light Yellow', color: 'hsl(48, 100%, 93%)', description: '#fff8dc', order: 2},
{optgroup: 'Yellow', uid: 'yellowCharacteristic', name: 'Yellow', color: 'hsl(60, 100%, 50%)', description: '#feff00', order: 3},
//old_rgb=#7f7f00 new rgb:#ffd700 => [255, 215, 0] old_hls:(60, 100, 25.0) => (51, 100, 50)
{optgroup: 'Yellow', uid: 'darkYellowCharacteristic', name: 'Dark Yellow', color: 'hsl(51, 100%, 50%)', description: '#ffd700', order: 4},
{optgroup: 'Orange', uid: 'lightOrangeCharacteristic', name: 'Light Orange', color: 'hsl(30, 75.0%, 75.0%)', description: '#efbf8f', order: 5},
{optgroup: 'Orange', uid: 'orangeCharacteristic', name: 'Orange', color: 'hsl(30, 100%, 50%)', description: '#ff7f00', order: 6},
//old_rgb=#7f3f00 new rgb:#d2691e => [210, 105, 30] old_hls:(30, 100, 25.0) => (25, 75, 47)
{optgroup: 'Orange', uid: 'darkOrangeCharacteristic', name: 'Dark Orange', color: 'hsl(25, 75%, 47%)', description: '#d2691e', order: 7},
//old_rgb=#c66b6b new rgb:#deb887 => [222, 184, 135] old_hls:(0, 45.0, 60.0) => (34, 57, 70)
{optgroup: 'Brown', uid: 'lightBrownCharacteristic', name: 'Light Brown', color: 'hsl(34, 57%, 70%)', description: '#deb887', order: 8},
//old_rgb=#a32828 new rgb:#8b4513 => [139, 69, 19] old_hls:(0, 60, 40) => (25, 76, 31)
{optgroup: 'Brown', uid: 'brownCharacteristic', name: 'Brown', color: 'hsl(25, 76%, 31%)', description: '#8b4513', order: 9},
{optgroup: 'Brown', uid: 'darkBrownCharacteristic', name: 'Dark Brown', color: 'hsl(0, 60%, 20.0%)', description: '#511414', order: 10},
//old_rgb=#ef8f8f new rgb:#ffcbc5 => [255, 203, 197] old_hls:(0, 75.0, 75.0) => (6, 100, 89)
{optgroup: 'Red', uid: 'lightRedCharacteristic', name: 'Light Red', color: 'hsl(6, 100%, 89%)', description: '#ffcbc5', order: 11},
{optgroup: 'Red', uid: 'redCharacteristic', name: 'Red', color: 'hsl(0, 100%, 50%)', description: '#ff0000', order: 12},
//old_rgb=#7f0000 new rgb:#b22222 => [178, 34, 34] old_hls:(0, 100, 25.0) => (0, 68, 42)
{optgroup: 'Red', uid: 'darkRedCharacteristic', name: 'Dark Red', color: 'hsl(0, 68%, 42%)', description: '#b22222', order: 13},
{optgroup: 'Pink', uid: 'lightPinkCharacteristic', name: 'Light Pink', color: 'hsl(350, 56.25%, 95%)', description: '#f9ebed', order: 14},
{optgroup: 'Pink', uid: 'pinkCharacteristic', name: 'Pink', color: 'hsl(350, 100%, 88%)', description: '#fec1cc', order: 15},
//old_rgb=#e00025 new rgb:#ff1493 => [255, 20, 147] old_hls:(350, 100, 44.0) => (328, 100, 54)
{optgroup: 'Pink', uid: 'darkPinkCharacteristic', name: 'Dark Pink', color: 'hsl(328, 100%, 54%)', description: '#ff1493', order: 16},
{optgroup: 'Magenta', uid: 'lightMagentaCharacteristic', name: 'Light Magenta', color: 'hsl(300, 75.0%, 75.0%)', description: '#ef8fef', order: 17},
//old_rgb=#ff00fe new rgb:#ff00ff => [255, 0, 255] old_hls:(300, 100, 50) => (300, 100, 50)
{optgroup: 'Magenta', uid: 'magentaCharacteristic', name: 'Magenta', color: 'hsl(300, 100%, 50%)', description: '#ff00ff', order: 18},
{optgroup: 'Magenta', uid: 'darkMagentaCharacteristic', name: 'Dark Magenta', color: 'hsl(300, 100%, 25.0%)', description: '#7f007f', order: 19},
//old_rgb=#8f8fef new rgb:#f0f8ff => [240, 248, 255] old_hls:(240, 75.0, 75.0) => (208, 100, 97)
{optgroup: 'Blue', uid: 'lightBlueCharacteristic', name: 'Light Blue', color: 'hsl(208, 100%, 97%)', description: '#f0f8ff', order: 20},
//old_rgb=#0000ff new rgb:#1e90ff => [30, 144, 255] old_hls:(240, 100, 50) => (210, 100, 56)
{optgroup: 'Blue', uid: 'blueCharacteristic', name: 'Blue', color: 'hsl(210, 100%, 56%)', description: '#1e90ff', order: 21},
{optgroup: 'Blue', uid: 'darkBlueCharacteristic', name: 'Dark Blue', color: 'hsl(240, 100%, 25.0%)', description: '#00007f', order: 22},
{optgroup: 'Turquoise', uid: 'paleTurquoiseCharacteristic', name: 'Pale Turquoise', color: 'hsl(180, 65%, 81%)', description: '#AFEEEE', order: 23},
{optgroup: 'Turquoise', uid: 'turquoiseCharacteristic', name: 'Turquoise', color: 'hsl(174, 72%, 56%)', description: '#40E0D0', order: 24},
{optgroup: 'Turquoise', uid: 'darkTurquoiseCharacteristic', name: 'Dark Turquoise', color: 'hsl(181, 100%, 41%)', description: '#00CED1', order: 25},
{optgroup: 'Green', uid: 'lightGreenCharacteristic', name: 'Light Green', color: 'hsl(120, 75.0%, 75.0%)', description: '#8fef8f', order: 26},
{optgroup: 'Green', uid: 'greenCharacteristic', name: 'Green', color: 'hsl(120, 100%, 50%)', description: '#00ff00', order: 27},
{optgroup: 'Green', uid: 'oliveGreenCharacteristic', name: 'Olive Green', color: 'hsl(60, 100%, 25%)', description: '#7f7f00', order: 28},
{optgroup: 'Green', uid: 'darkGreenCharacteristic', name: 'Dark Green', color: 'hsl(120, 100%, 25.0%)', description: '#007f00', order: 29},
{optgroup: 'Grey', uid: 'whiteCharacteristic', name: 'White', color: 'hsl(0, 0%, 100%)', description: '#ffffff', order: 30},
{optgroup: 'Grey', uid: 'extraLightGreyCharacteristic', name: 'Extra Light Grey', color: 'hsl(0, 0%, 86%)', description: '#DCDCDC', order: 31},
{optgroup: 'Grey', uid: 'lightGreyCharacteristic', name: 'Light Grey', color: 'hsl(0, 0.0%, 75.0%)', description: '#bfbfbf', order: 32},
{optgroup: 'Grey', uid: 'greyCharacteristic', name: 'Grey', color: 'hsl(0, 0%, 50%)', description: '#7f7f7f', order: 33},
{optgroup: 'Grey', uid: 'darkGreyCharacteristic', name: 'Dark grey', color: 'hsl(0, 0%, 34%)', description: '#575757', order: 34},
{optgroup: 'Grey', uid: 'extraDarkGreyCharacteristic', name: 'Extra Dark Grey', color: 'hsl(0, 0%, 25%)', description: '#3f3f3f', order: 35},
{optgroup: 'Grey', uid: 'blackCharacteristic', name: 'Black', color: 'hsl(0, 0%, 18.0%)', description: '#2e2e2e', order: 36}
]AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description,  c.color = updt.color, c.order = updt.order, c.optgroup = updt.optgroup
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.color = updt.color, c.order = updt.order, c.optgroup = updt.optgroup
  WITH c
  MATCH (f:Family {uid:'colourFamily'})
  MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c;

// Data migration
// Replace obsolete colors  by new ones in affected strata
UNWIND [
{old:'ochreCharacteristic', new:'darkYellowCharacteristic'},
{old:'mediumGreenCharacteristic', new:'greenCharacteristic'},
{old:'mediumBlueCharacteristic', new:'blueCharacteristic'},
{old:'mediumGreyCharacteristic', new:'greyCharacteristic'},
{old:'mediumOrangeCharacteristic', new:'orangeCharacteristic'},
{old:'mediumMagentaCharacteristic', new:'magentaCharacteristic'},
{old:'mediumRedCharacteristic', new:'redCharacteristic'},
{old:'mediumBrownCharacteristic', new:'brownCharacteristic'},
{old:'mediumPinkCharacteristic', new:'pinkCharacteristic'},
{old:'mediumYellowCharacteristic', new:'yellowCharacteristic'}
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
'ochreCharacteristic',
'mediumGreenCharacteristic',
'mediumBlueCharacteristic',
'mediumGreyCharacteristic',
'mediumOrangeCharacteristic',
'mediumMagentaCharacteristic',
'mediumRedCharacteristic',
'mediumBrownCharacteristic',
'mediumPinkCharacteristic',
'mediumYellowCharacteristic']
 AS uid
MATCH (c:Characteristic {uid:uid})
DETACH DELETE c;
