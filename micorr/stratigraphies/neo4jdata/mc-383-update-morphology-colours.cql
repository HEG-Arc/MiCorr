:param common_props {version:8, date:'2020-08-31'}

// Adds/updates new colour characteristics generated using MetalPAT_colourFamily.ipynb
UNWIND [
{uid: 'whiteCharacteristic', name: 'White', color: 'hsl(0, 0%, 100%)', description: '#ffffff', order: 1},
{uid: 'redCharacteristic', name: 'Red', color: 'hsl(0, 100%, 50%)', description: '#ff0000', order: 2},
{uid: 'lightRedCharacteristic', name: 'Light Red', color: 'hsl(0, 75.0%, 75.0%)', description: '#ef8f8f', order: 3},
{uid: 'mediumRedCharacteristic', name: 'Medium Red', color: 'hsl(0, 100%, 40.0%)', description: '#cc0000', order: 4},
{uid: 'darkRedCharacteristic', name: 'Dark Red', color: 'hsl(0, 100%, 25.0%)', description: '#7f0000', order: 5},
{uid: 'orangeCharacteristic', name: 'Orange', color: 'hsl(30, 100%, 50%)', description: '#ff7f00', order: 6},
{uid: 'lightOrangeCharacteristic', name: 'Light Orange', color: 'hsl(30, 75.0%, 75.0%)', description: '#efbf8f', order: 7},
{uid: 'mediumOrangeCharacteristic', name: 'Medium Orange', color: 'hsl(30, 100%, 40.0%)', description: '#cc6600', order: 8},
{uid: 'darkOrangeCharacteristic', name: 'Dark Orange', color: 'hsl(30, 100%, 25.0%)', description: '#7f3f00', order: 9},
{uid: 'yellowCharacteristic', name: 'Yellow', color: 'hsl(60, 100%, 50%)', description: '#feff00', order: 10},
{uid: 'lightYellowCharacteristic', name: 'Light Yellow', color: 'hsl(60, 75.0%, 75.0%)', description: '#efef8f', order: 11},
{uid: 'mediumYellowCharacteristic', name: 'Medium Yellow', color: 'hsl(60, 100%, 40.0%)', description: '#cbcc00', order: 12},
{uid: 'darkYellowCharacteristic', name: 'Dark Yellow', color: 'hsl(60, 100%, 25.0%)', description: '#7f7f00', order: 13},
{uid: 'brownCharacteristic', name: 'Brown', color: 'hsl(0, 60%, 40%)', description: '#a32828', order: 14},
{uid: 'lightBrownCharacteristic', name: 'Light Brown', color: 'hsl(0, 45.0%, 60.0%)', description: '#c66b6b', order: 15},
{uid: 'mediumBrownCharacteristic', name: 'Medium Brown', color: 'hsl(0, 60%, 32.0%)', description: '#822020', order: 16},
{uid: 'darkBrownCharacteristic', name: 'Dark Brown', color: 'hsl(0, 60%, 20.0%)', description: '#511414', order: 17},
{uid: 'greenCharacteristic', name: 'Green', color: 'hsl(120, 100%, 50%)', description: '#00ff00', order: 18},
{uid: 'lightGreenCharacteristic', name: 'Light Green', color: 'hsl(120, 75.0%, 75.0%)', description: '#8fef8f', order: 19},
{uid: 'mediumGreenCharacteristic', name: 'Medium Green', color: 'hsl(120, 100%, 40.0%)', description: '#00cc00', order: 20},
{uid: 'darkGreenCharacteristic', name: 'Dark Green', color: 'hsl(120, 100%, 25.0%)', description: '#007f00', order: 21},
{uid: 'blueCharacteristic', name: 'Blue', color: 'hsl(240, 100%, 50%)', description: '#0000ff', order: 22},
{uid: 'lightBlueCharacteristic', name: 'Light Blue', color: 'hsl(240, 75.0%, 75.0%)', description: '#8f8fef', order: 23},
{uid: 'mediumBlueCharacteristic', name: 'Medium Blue', color: 'hsl(240, 100%, 40.0%)', description: '#0000cc', order: 24},
{uid: 'darkBlueCharacteristic', name: 'Dark Blue', color: 'hsl(240, 100%, 25.0%)', description: '#00007f', order: 25},
{uid: 'magentaCharacteristic', name: 'Magenta', color: 'hsl(300, 100%, 50%)', description: '#ff00fe', order: 26},
{uid: 'lightMagentaCharacteristic', name: 'Light Magenta', color: 'hsl(300, 75.0%, 75.0%)', description: '#ef8fef', order: 27},
{uid: 'mediumMagentaCharacteristic', name: 'Medium Magenta', color: 'hsl(300, 100%, 40.0%)', description: '#cc00cb', order: 28},
{uid: 'darkMagentaCharacteristic', name: 'Dark Magenta', color: 'hsl(300, 100%, 25.0%)', description: '#7f007f', order: 29},
{uid: 'pinkCharacteristic', name: 'Pink', color: 'hsl(350, 100%, 88%)', description: '#fec1cc', order: 30},
{uid: 'lightPinkCharacteristic', name: 'Light Pink', color: 'hsl(350, 56.25%, 95%)', description: '#f9ebed', order: 31},
{uid: 'mediumPinkCharacteristic', name: 'Medium Pink', color: 'hsl(350, 100%, 70.4%)', description: '#ff6881', order: 32},
{uid: 'darkPinkCharacteristic', name: 'Dark Pink', color: 'hsl(350, 100%, 44.0%)', description: '#e00025', order: 33},
{uid: 'greyCharacteristic', name: 'Grey', color: 'hsl(0, 0%, 50%)', description: '#7f7f7f', order: 34},
{uid: 'lightGreyCharacteristic', name: 'Light Grey', color: 'hsl(0, 0.0%, 75.0%)', description: '#bfbfbf', order: 35},
{uid: 'mediumGreyCharacteristic', name: 'Medium Grey', color: 'hsl(0, 0%, 40.0%)', description: '#666666', order: 36},
{uid: 'darkGreyCharacteristic', name: 'Dark Grey', color: 'hsl(0, 0%, 25.0%)', description: '#3f3f3f', order: 37},
{uid: 'blackCharacteristic', name: 'Black', color: 'hsl(0, 0%, 18%)', description: '#2e2e2e', order: 38}]
AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description,  c.color = updt.color, c.order = updt.order
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.color = updt.color, c.order = updt.order
  WITH c
  MATCH (f:Family {uid:'colourFamily'})
  MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c;

// TODO Remove unwanted Ochre color (ochreCharacteristic)
// MATCH (c:Characteristic {uid:'ochreCharacteristic'})<-[:IS_CONSTITUTED_BY]-(s) RETURN *
// 21 stratas returned - replace ?
// DETACH DELETE c
