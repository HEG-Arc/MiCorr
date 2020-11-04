:param common_props {version:8, date:'2020-08-31'}

// Adds/updates new colour characteristics generated using MetalPAT_colourFamily.ipynb
UNWIND [
{optgroup: 'Red', uid: 'lightRedCharacteristic', name: 'Light Red', color: 'hsl(0, 75.0%, 75.0%)', description: '#ef8f8f', order: 2} ,
{optgroup: 'Red', uid: 'redCharacteristic', name: 'Red', color: 'hsl(0, 100%, 50%)', description: '#ff0000', order: 3} ,
{optgroup: 'Red', uid: 'darkRedCharacteristic', name: 'Dark Red', color: 'hsl(0, 100%, 25.0%)', description: '#7f0000', order: 4} ,
{optgroup: 'Orange', uid: 'lightOrangeCharacteristic', name: 'Light Orange', color: 'hsl(30, 75.0%, 75.0%)', description: '#efbf8f', order: 5} ,
{optgroup: 'Orange', uid: 'orangeCharacteristic', name: 'Orange', color: 'hsl(30, 100%, 50%)', description: '#ff7f00', order: 6} ,
{optgroup: 'Orange', uid: 'darkOrangeCharacteristic', name: 'Dark Orange', color: 'hsl(30, 100%, 25.0%)', description: '#7f3f00', order: 7} ,
{optgroup: 'Yellow', uid: 'lightYellowCharacteristic', name: 'Light Yellow', color: 'hsl(60, 75.0%, 75.0%)', description: '#efef8f', order: 8} ,
{optgroup: 'Yellow', uid: 'yellowCharacteristic', name: 'Yellow', color: 'hsl(60, 100%, 50%)', description: '#feff00', order: 9} ,
{optgroup: 'Yellow', uid: 'darkYellowCharacteristic', name: 'Dark Yellow', color: 'hsl(60, 100%, 25.0%)', description: '#7f7f00', order: 10} ,
{optgroup: 'Brown', uid: 'lightBrownCharacteristic', name: 'Light Brown', color: 'hsl(0, 45.0%, 60.0%)', description: '#c66b6b', order: 11} ,
{optgroup: 'Brown', uid: 'brownCharacteristic', name: 'Brown', color: 'hsl(0, 60%, 40%)', description: '#a32828', order: 12} ,
{optgroup: 'Brown', uid: 'darkBrownCharacteristic', name: 'Dark Brown', color: 'hsl(0, 60%, 20.0%)', description: '#511414', order: 13} ,
{optgroup: 'Green', uid: 'lightGreenCharacteristic', name: 'Light Green', color: 'hsl(120, 75.0%, 75.0%)', description: '#8fef8f', order: 14} ,
{optgroup: 'Green', uid: 'greenCharacteristic', name: 'Green', color: 'hsl(120, 100%, 50%)', description: '#00ff00', order: 15} ,
{optgroup: 'Green', uid: 'darkGreenCharacteristic', name: 'Dark Green', color: 'hsl(120, 100%, 25.0%)', description: '#007f00', order: 16} ,
{optgroup: 'Blue', uid: 'lightBlueCharacteristic', name: 'Light Blue', color: 'hsl(240, 75.0%, 75.0%)', description: '#8f8fef', order: 17} ,
{optgroup: 'Blue', uid: 'blueCharacteristic', name: 'Blue', color: 'hsl(240, 100%, 50%)', description: '#0000ff', order: 18} ,
{optgroup: 'Blue', uid: 'darkBlueCharacteristic', name: 'Dark Blue', color: 'hsl(240, 100%, 25.0%)', description: '#00007f', order: 19} ,
{optgroup: 'Magenta', uid: 'lightMagentaCharacteristic', name: 'Light Magenta', color: 'hsl(300, 75.0%, 75.0%)', description: '#ef8fef', order: 20} ,
{optgroup: 'Magenta', uid: 'magentaCharacteristic', name: 'Magenta', color: 'hsl(300, 100%, 50%)', description: '#ff00fe', order: 21} ,
{optgroup: 'Magenta', uid: 'darkMagentaCharacteristic', name: 'Dark Magenta', color: 'hsl(300, 100%, 25.0%)', description: '#7f007f', order: 22} ,
{optgroup: 'Pink', uid: 'lightPinkCharacteristic', name: 'Light Pink', color: 'hsl(350, 56.25%, 95%)', description: '#f9ebed', order: 23} ,
{optgroup: 'Pink', uid: 'pinkCharacteristic', name: 'Pink', color: 'hsl(350, 100%, 88%)', description: '#fec1cc', order: 24} ,
{optgroup: 'Pink', uid: 'darkPinkCharacteristic', name: 'Dark Pink', color: 'hsl(350, 100%, 44.0%)', description: '#e00025', order: 25} ,
{optgroup: 'Grey', uid: 'whiteCharacteristic', name: 'White', color: 'hsl(0, 0%, 100%)', description: '#ffffff', order: 26},
{optgroup: 'Grey', uid: 'lightGreyCharacteristic', name: 'Light Grey', color: 'hsl(0, 0.0%, 75.0%)', description: '#bfbfbf', order: 26} ,
{optgroup: 'Grey', uid: 'greyCharacteristic', name: 'Grey', color: 'hsl(0, 0%, 50%)', description: '#7f7f7f', order: 27} ,
{optgroup: 'Grey', uid: 'darkGreyCharacteristic', name: 'Dark Grey', color: 'hsl(0, 0%, 25.0%)', description: '#3f3f3f', order: 28},
{optgroup: 'Grey', uid: 'blackCharacteristic', name: 'Black', color: 'hsl(0, 0%, 18%)', description: '#2e2e2e', order: 38}]
AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description,  c.color = updt.color, c.order = updt.order, c.optgroup = updt.optgroup
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.color = updt.color, c.order = updt.order, c.optgroup = updt.optgroup
  WITH c
  MATCH (f:Family {uid:'colourFamily'})
  MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c;

// TODO Remove unwanted Ochre color (ochreCharacteristic)
// MATCH (c:Characteristic {uid:'ochreCharacteristic'})<-[:IS_CONSTITUTED_BY]-(s) RETURN *
// 21 stratas returned - replace ?
// DETACH DELETE c

//TODO remove unwanted medium colors
-- UNWIND ['mediumRed',
--  'mediumOrange',
--  'mediumYellow',
--  'mediumBrown',
--  'mediumGreen',
--  'mediumBlue',
--  'mediumMagenta',
--  'mediumPink',
--  'mediumGrey']
--  AS color_uid
--  MATCH (c:Characteristic {uid:color_uid})<-[:IS_CONSTITUTED_BY]-(s) RETURN *
-- MATCH (f:Family {uid:'colourFamily'})
--   MERGE (c)-[:BELONGS_TO]->(f)
