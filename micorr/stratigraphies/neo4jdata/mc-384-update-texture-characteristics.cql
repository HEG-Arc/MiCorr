:param common_props {version:6, date:"2020-08-12"}

/**************************
// MC-384 Texture update and image support
adds all new texture characteristics with image_url support

temp getting img src by exporting google sheet to html [https://docs.google.com/spreadsheets/d/1TAXM1qKFOoqlx5MwpVYnh2dSFWaZyumvk-ohkVOcGew/edit#gid=1581905147]

f=open('MiCorr.html')
content=f.read()
soup=BeautifulSoup(content,'html.parser')
imgs=soup.find_all('img')
for im in imgs:
    ...:     parent_td=im.parent.parent if im.parent.parent.name=='td' else None
    ...:     if parent_td:
    ...:         print(parent_td.previous_sibling.previous_sibling.text,im['src'])

Dishing https://lh5.googleusercontent.com/OjbxPEa4xZc_YncCe7RM3SzrhZN0k5mjfkRVknk9Vk3UqBtLdU0E4sSzgTyols1Rt_-y7JmnxubX6JshjLA4JQQVKV6RXWWI2vNIhs4hWceDfrC9sjeqlQ0O72R7PqZO3RtZ5jhmTw=w126-h123
Flaking https://lh3.googleusercontent.com/vr9yZY_oEuhR5nhmuahX4rWQQtOvVlRg-PAeE2IaCbYgqXvDnm1x1EEvuFRrhmLxNcTPRSR__g1SlUalVG-bWsQs9TUSTuH1AL5NObldMoxAdt0T6JQXZ051cMybyLy9hGnNCR2HjA=w126-h112
Wedges https://lh3.googleusercontent.com/jsgPu7PBzPb1le0GSLN-B47anat1-zwLQbUcnO7Nxc1a8Ynfw0Yb3ibM0vxKd6Jf8UePE_H4JXbASZ_cn4m-UhT71lbcbJlWOE4RQSccpXiOBBp--Y2LC1pxvWbmG1DZC12yO5Io-A=w126-h137
Surface crazing https://lh5.googleusercontent.com/s0Itc5SPXPvI5RgR39MOZi0I6PUNeNI7BDUWV6GSEnnBmbNXtRxAXwLzm578PhGUM9iNX07JdztbLfm43kM29DKRb9SpiCdFbGGAzm4ynOK7RP6pIFfYmXtOS1uG8wJptef3FV0Fvg=w126-h128
Star-shaped cracking https://lh4.googleusercontent.com/0y0Sww61R3c5CkqHoT1JADz3VYUEw2EWGTndn3WfKb--XNC4LZhLHXeneeyf3-e0h7IdAhK7M-b_hIZ7cPp5Y3aJpA9o8pfXB-hy_bTYSJwUZNQnKyllGXyVmWKpqQL7EUcEh8Ok3w=w126-h110
Dendritic https://lh6.googleusercontent.com/FyP0N-Th3gRuKFukmtMQPekDzkTkk4rqsVoqWgZLep7-kvuIVy0tXhyBwC9BHm1TlRKAZdSNhPCAFfyNE-DmsKJbKz7YSqrn0SwjfX0WZbPeS_gJhDmiIizLf6osIuEfGqBLvBUXgA=w126-h119
Drusy aggregate https://lh3.googleusercontent.com/i904_m1OrYim9EZyNZiQ4PDGfeoV8NleF91S1_pBrvGLqI_pKfiNdinc-htQa15MAXxgG5NXIoB4h7jIzUfXvEVvD9X-lUZgM45paGcCPi83H81NhUvog3mOwzGVKDJeOXuG1hdiQw=w126-h107
Géode https://lh6.googleusercontent.com/wmlMDLY_Q1Q4pggxDLKvQ4MuGrToL5YALEBs5jKLQVRfhG7lbEbhlDglSBYpDSjNV0eigOj_eO_68YVX70Nag3qLHBcT-ThfO0wdCW8c5Qj-P8rKyj2COndVtCd84xnuf6lSGiqIiA=w126-h137
Lamellar https://lh3.googleusercontent.com/V6WXsI2qcUrYqUQ9rxv5TzoB2mLdN0OREnWXUbk3iMEu3pelwL7EOSDVt16NQIo9w4SN3qvKey-LyZ5B_jMYls0kvkPRZffbhbjxiaOdnFoA2qizxmmB5CwY7AbiHpVGc0ryHr_-bw=w126-h134
Foliated https://lh4.googleusercontent.com/aL1ihcSMWB5xH-xPdEoF-aQA64jBRspxWCPZhqY4mUTI6iyfP-bhm4KhjK6T7QallyIGxQLFOfJGu-RnBSZUdDZbBydugpVCKGKCp4jQS2hTou_CmJ99Nktw7yn2_BIdSsU05N8Liw=w126-h128
Fibrous https://lh3.googleusercontent.com/bboWl7IRuuQd9FL5Q_u6YQTgqyCRZcd-__v2uvLY9D7WU07k-yEtQFkTVZCn6oSpBiFFJMGYRn9BN57Dn7WS_nypdrmiSYd5zxRLl5d5qQRXt2pKAVCDoCMSdj96nIL0L5g0YB8Eow=w126-h107
Stellated https://lh4.googleusercontent.com/E-vNQvqQtMZwnLMRPfytsxQaM0qt6jAzzpp5PJo4ccMmYmIU_Fw5_52P3l43gSvMqKy2rZkfaKNMODHNwWImoue6fwQN7jmHfXPXug2JpYJMzMbBWjtgZ03ovyZINwsaVNEeSgroWg=w126-h132
Concentric https://lh4.googleusercontent.com/nEwdFT7hC2c4Ll1oI8aZ8vVbtw-lbcWjXT9Bdsl2gqM4XUyjXbTFujOhgi4VSd6b29oJqWAxyePZHKoN_aL-35Z_VsvyQpbSP79H-QILK4MnlLLPm20j_Mv8LM3jp99S6Uz51IWzAg=w126-h108
Banded https://lh3.googleusercontent.com/Mxzty5aqKR5wWrNkfIYwaN74V_OlwuFXWYTpzzH1ghTSieP-aho0cV22cMk-FfGDDAV1Fy5k0-yM9Rv7zc_0A5x82SSSoWXEFJx_cmIyccUzw3IXNYagbvFilAhvj1rbNqbVO-u51w=w126-h106
Botryoidal https://lh3.googleusercontent.com/xA43KIvNJkH5niUyikcCfh7XI9EtNP4xwHW5v1i3MHcHC0rGSC5QwYIcNgv7CHSz9MJWVfSrrsHAdNsW8PnlxdstdyE5GeBLN66Q3SIPrnlbNb0SRQRj5dUrrnfQBF6_8hGDnSkpEg=w126-h109
Reniform https://lh3.googleusercontent.com/nXvRKJdJ_KFA13aUzttXcttqcFB98NKFwM49w3i1OiLlkhZhCgGWSX8V6Cfbtj7jfoETl08rNYJyf8DirEYW9b0b0zRk23BkEZCX299aID-2CLGEvdVj5MCcxRHuEwVsHwSdYoT5CQ=w126-h130
Stalactiform https://lh5.googleusercontent.com/0wQ8ygBXwk8tUE-KVIFq2DGP0UfG5yOHUrUtQz7yWuDMyPnEYPb2dL7nnm70a2CJiuueVvtVKV51JGBUA_4QJwUmh5lThz2nQkLEY2euTEooVhIoGIehb28XEL-_RDqMGzW1b2A-Iw=w126-h134
Globular https://lh5.googleusercontent.com/4S9204hhpo2khAjRGdiCBG_I52NO7iLkzeKsjqlqqs8uorDNK4q71FM2P1tSHrjnPzljtlmdAFkRuX3iAlfbSwyD2zypA-MzVZI-BEI_OF11LqfSx7gFC90gJgniq9oN1O9Q-IjKgw=w126-h146
Granular https://lh6.googleusercontent.com/31wLwVd4-ECmxuvm3qrC-AqwQLJqmdCGiehASXQNO1-xZYEpCIvL1JqUJjPKw6kTNFw69pQsYdqTcUM94cfgPIu5lxqkIPQjwzmKhwdboualf0-wuDHs3j4nV1mB6zWNpq_kfbgeJQ=w126-h128
Massive https://lh5.googleusercontent.com/Ua5DBHBX58l5mjzcS7uS05nhRFzG2tsmBYKIYHq_8bbsXia4OYkfDd5ih-dVu13uFv3pGcsVUVLobx0xYS4yNZ71qyw8T2klwYIGr3fhgeAxbOdSG0PPLVL1QpYmEjAx_sxvD3g_ZA=w126-h131
Powderish https://lh4.googleusercontent.com/leMfZHd9RwkJswH-TUHtnK4zmkv14hcl3nNfCtDiuvz7h18DTLCw2fDfEFUciHMAh0vkWqdaQ3g4En7Ypnw3D5sHkfQSA_NktpQ7a5oNtzWkS_OZiUBG7Mvl3Dim9XfyCWOGaz2LVA=w126-h113
*/

UNWIND [
  {family_uid:"crackingStructureFamily", uid:"noCrackCrackingStructureCharacteristic", name:"no crack", order:1,
   description: "No crack visible at this observation scale."},
  {family_uid:"crackingStructureFamily", uid:"simpleCrackingStructureCharacteristic", name:"simple", order:2,
   description: "Isolated crack."},
  {family_uid:"crackingStructureFamily", uid:"branchedCrackingStructureCharacteristic", name:"branched", order:3,
   description: "Crack separating into several cracks."},
  {family_uid:"crackingStructureFamily", uid:"networkCrackingStructureCharacteristic", name:"network", order:4,
   description: "Cracks distributed over the entire surface observed according to geometrical shapes."},

  {family_uid:"crackingStructureCSFamily", uid:"noCrackCrackingStructureCSCharacteristic", name:"no crack", order:1,
   description: "No crack visible at this observation scale."},
  {family_uid:"crackingStructureCSFamily", uid:"simpleCrackingStructureCSCharacteristic", name:"simple", order:2,
   description: "Isolated crack."},
  {family_uid:"crackingStructureCSFamily", uid:"branchedCrackingStructureCSCharacteristic", name:"branched", order:3,
   description: "Crack separating into several cracks."},
  {family_uid:"crackingStructureCSFamily", uid:"networkCrackingStructureCSCharacteristic", name:"network", order:4,
   description: "Cracks distributed over the entire surface observed according to geometrical shapes."},

  {family_uid:"crackingSurfaceDirectionFamily", uid:"longitudinalSurfaceDirectionCharacteristic", name:"longitudinal", order:1,
   description: "Versus the object geometry."},
  {family_uid:"crackingSurfaceDirectionFamily", uid:"transverseSurfaceDirectionCharacteristic", name:"transverse", order:2,
   description: "Versus the object geometry."},
  {family_uid:"crackingSurfaceDirectionFamily", uid:"obliqueSurfaceDirectionCharacteristic", name:"oblique", order:3,
   description: "Versus the object geometry."},
  {family_uid:"crackingSurfaceDirectionFamily", uid:"circularSurfaceDirectionCharacteristic", name:"circular", order:4,
   description: "Versus the object geometry."},

  {family_uid:"crackingInwardDirectionFamily", uid:"parallelInwardDirectionCharacteristic", name:"parallel", order:1,
   description: "Parallel to the object geometry."},
  {family_uid:"crackingInwardDirectionFamily", uid:"obliqueInwardDirectionCharacteristic", name:"oblique", order:2,
   description: "Oblique to the object geometry."},
  {family_uid:"crackingInwardDirectionFamily", uid:"circularInwardDirectionCharacteristic", name:"perpendicular", order:3,
   description: "Perpendicular to the object geometry."},

  {family_uid:"crackingInwardDirectionCSFamily", uid:"parallelInwardDirectionCSCharacteristic", name:"parallel", order:1,
   description: "Parallel to the object geometry."},
  {family_uid:"crackingInwardDirectionCSFamily", uid:"obliqueInwardDirectionCSCharacteristic", name:"oblique", order:2,
   description: "Oblique to the object geometry."},
  {family_uid:"crackingInwardDirectionCSFamily", uid:"circularInwardDirectionCSCharacteristic", name:"perpendicular", order:3,
   description: "Perpendicular to the object geometry."},

  {f:"crackingWidthFamily", uid:"narrowWidthCharacteristic", name:"narrow", order:1, description:"No crack visible at this observation scale."},
  {f:"crackingWidthFamily", uid:"largeWidthCharacteristic", name:"large", order:2, description:"Larger than the back of a scalpel blade type 11 > 400µm."},

  {f:"crackingWidthFamily", uid:"narrowWidthCharacteristic", name:"narrow", order:1, description:"Thinner than the back of a scalpel blade type 11 < 400µm."},
  {f:"crackingWidthFamily", uid:"largeWidthCharacteristic", name:"large", order:2, description:"Larger than the back of a scalpel blade type 11 > 400µm."},

  {family_uid:"crackingFillingFamily", uid:"emptyFillingCharacteristic", name:"empty", order:1, description:"Cracks with an empty space between the walls."},
  {family_uid:"crackingFillingFamily", uid:"filledFillingCharacteristic", name:"filled", order:2, description:"Cracks in which the space between the walls is filled with another material."},

  {family_uid:"crackingFillingCSFamily", uid:"emptyFillingCSCharacteristic", name:"empty", order:1, description:"Cracks with an empty space between the walls."},
  {family_uid:"crackingFillingCSFamily", uid:"filledFillingCSCharacteristic", name:"filled", order:2, description:"Cracks in which the space between the walls is filled with another material."},

  {family_uid:"crackingEdgesFamily", uid:"sharpEdgesCharacteristic", name:"sharp", order:1, description:"Cracks with fine edges."},
  {family_uid:"crackingEdgesFamily", uid:"roundedEdgesCharacteristic", name:"rounded", order:2, description:"Cracks with rounded edges."},

  {family_uid:"crackingTypeOfCracksFamily", uid:"dishingTypeOfCracksCharacteristic", name:"dishing", order:1,
   description:"Scale separation due to circular cracking.",
   image_url:"https://lh5.googleusercontent.com/OjbxPEa4xZc_YncCe7RM3SzrhZN0k5mjfkRVknk9Vk3UqBtLdU0E4sSzgTyols1Rt_-y7JmnxubX6JshjLA4JQQVKV6RXWWI2vNIhs4hWceDfrC9sjeqlQ0O72R7PqZO3RtZ5jhmTw=w126-h123"},
  {family_uid:"crackingTypeOfCracksFamily", uid:"flakingTypeOfCracksCharacteristic", name:"flaking", order:2,
   description:"Separation of the CP strata from the metal core (CM, M strata) as a result of tangential cracking.",
   image_url:"https://lh3.googleusercontent.com/vr9yZY_oEuhR5nhmuahX4rWQQtOvVlRg-PAeE2IaCbYgqXvDnm1x1EEvuFRrhmLxNcTPRSR__g1SlUalVG-bWsQs9TUSTuH1AL5NObldMoxAdt0T6JQXZ051cMybyLy9hGnNCR2HjA=w126-h112"},
  {family_uid:"crackingTypeOfCracksFamily", uid:"wedgesTypeOfCracksCharacteristic", name:"wedges", order:3,
   description:"Perpendicular radial cracking. May lead to separation into wedge-shaped fragments.",
   image_url:"https://lh3.googleusercontent.com/jsgPu7PBzPb1le0GSLN-B47anat1-zwLQbUcnO7Nxc1a8Ynfw0Yb3ibM0vxKd6Jf8UePE_H4JXbASZ_cn4m-UhT71lbcbJlWOE4RQSccpXiOBBp--Y2LC1pxvWbmG1DZC12yO5Io-A=w126-h137"},
  {family_uid:"crackingTypeOfCracksFamily", uid:"surfaceCrazingTypeOfCracksCharacteristic", name:"surface crazing", order:4,
   description:"Network of perpendicular cracks of variable width covering the entire surface observed",
   image_url:"https://lh5.googleusercontent.com/s0Itc5SPXPvI5RgR39MOZi0I6PUNeNI7BDUWV6GSEnnBmbNXtRxAXwLzm578PhGUM9iNX07JdztbLfm43kM29DKRb9SpiCdFbGGAzm4ynOK7RP6pIFfYmXtOS1uG8wJptef3FV0Fvg=w126-h128"},
  {family_uid:"crackingTypeOfCracksFamily", uid:"starShapedTypeOfCracksCharacteristic", name:"star-shaped cracking", order:5,
   description:"Perpendicular cracks branching from a centre in all directions",
   image_url:"https://lh4.googleusercontent.com/0y0Sww61R3c5CkqHoT1JADz3VYUEw2EWGTndn3WfKb--XNC4LZhLHXeneeyf3-e0h7IdAhK7M-b_hIZ7cPp5Y3aJpA9o8pfXB-hy_bTYSJwUZNQnKyllGXyVmWKpqQL7EUcEh8Ok3w=w126-h110"}
]
AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description, c.order = updt.order, c.image_url = updt.image_url
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.order = updt.order, c.image_url = updt.image_url
  WITH c,updt
  MATCH (f:Family {uid:updt.family_uid})
  MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c;
