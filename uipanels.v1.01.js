/*---------------------------------
uipanels.js

Functions for the creation of all
the unique UI panels.
----------------------------------*/

Game.createWeaponUIPanel = function(weapon, sourcePanel, itemSlot) {
  // And it goes a little something like this:
  //
  // +-------------------------------------+------------+
  // | Item Name                           | Item Level |
  // +-------------------------------------+------------+
  // | Min - Max Damage (DPS)              | Wep Speed  |
  // +-------------------------------------+------------+
  // | Debuff Name and Effect              | Durability |
  // +-------------------------------------+------------+
  // | Flavour Text                        |   Repair   |
  // +------------+-----------+------------+------------+
  // |   Equip    |   Sell    |   Scrap    |  Discard   |
  // +------------+-----------+------------+------------+
  // |            Buy this weapon for X seeds           |
  // +------------------------+-------------------------+
  // |  Increase Item Level   |  Increase Item Quality  |
  // |    (costs X seeds)     |     (costs X scrap)     |
  // +------------------------+-------------------------+
  //
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var row4 = document.createElement("tr");
  var row5 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("colspan", "3");
  nameSection.setAttribute("style", "width:75% !important");
  nameSection.innerHTML = "<span class='q" + weapon[7] + "' style='font-size:18px !important;'>" + weapon[0].split("|")[0] + "</span>";
  var iLvlSection = document.createElement("td");
  iLvlSection.setAttribute("style", "text-align:right");
  iLvlSection.innerHTML = "Level " + weapon[1];
  row1.appendChild(nameSection);
  row1.appendChild(iLvlSection);
  panel.appendChild(row1);
  var dmgSection = document.createElement("td");
  dmgSection.setAttribute("colspan", "3");
  dmgSection.setAttribute("style", "width:75% !important");
  var dmgType = "";
  switch(weapon[2]) {
    case Game.WEAPON_MELEE: dmgType = "Melee"; break;
    case Game.WEAPON_RANGE: dmgType = "Ranged"; break;
    case Game.WEAPON_MAGIC: dmgType = "Magic"; break;
  }
  dmgSection.innerHTML = "<strong>" + weapon[4] + "</strong> - <strong>" + weapon[5] + "</strong> " + dmgType + " damage (" + weapon[6] + " DPS)";
  var speedSection = document.createElement("td");
  speedSection.setAttribute("style", "text-align:right");
  speedSection.innerHTML = "Speed " + weapon[3];
  row2.appendChild(dmgSection);
  row2.appendChild(speedSection);
  panel.appendChild(row2);
  var debuffSection = document.createElement("td");
  debuffSection.setAttribute("colspan", "3");
  debuffSection.setAttribute("style", "width:75% !important");
  debuffSection.innerHTML = weapon[9].length == 0 ? "" : "<strong>" + weapon[9][1] + "</strong> (" + Game.debuff_names[weapon[9][0]-Game.DEBUFF_SHRED] + ") - " + weapon[9][2] + " sec";
  var duraSection = document.createElement("td");
  duraSection.setAttribute("style", "text-align:right");
  if(arraysEqual(weapon, Game.p_Weapon)) {
    duraSection.id = "combat_playerWeaponDurability";
  }
  duraSection.innerHTML = weapon[8] + " uses";
  row3.appendChild(debuffSection);
  row3.appendChild(duraSection);
  panel.appendChild(row3);
  var flavourSection = document.createElement("td");
  flavourSection.setAttribute("colspan", sourcePanel == "player" ? "3" : "4");
  flavourSection.setAttribute("style", sourcePanel == "player" ? "width:75% !important" : "");
  var repairSection = document.createElement("td");
  flavourSection.innerHTML = "<span style='font-style:italic'>" + (weapon[0].split("|").length > 1 ? weapon[0].split("|")[1] : "&nbsp;") + "</span>";
  row4.appendChild(flavourSection);
  if(sourcePanel == "player") {
    var repairButton = document.createElement("span");
    repairButton.setAttribute("class", "itemPanelButton");
    repairSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    repairButton.onclick = function(){ return function() { Game.startRepair(); }; }();
    repairButton.innerHTML= "Repair";
    repairSection.appendChild(repairButton);
    row4.appendChild(repairSection);
  }
  panel.appendChild(row4);
  if(sourcePanel == "inventory") {
    var equipSection = document.createElement("td");
    var sellSection = document.createElement("td");
    var scrapSection = document.createElement("td");
    var discardSection = document.createElement("td");
    var equipButton = document.createElement("span");
    equipButton.setAttribute("class", "itemPanelButton");
    equipSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    equipButton.onclick = function(a){ return function() { Game.equipWeapon(a); }; }(itemSlot);
    equipButton.innerHTML= "Equip";
    equipSection.appendChild(equipButton);
    row5.appendChild(equipSection);
    var sellButton = document.createElement("span");
    sellButton.setAttribute("class", "itemPanelButton");
    sellSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    sellButton.onclick = function(a,b){ return function() { Game.sellWeapon(a,b); }; }(itemSlot, true);
    sellButton.innerHTML= "Sell";
    sellSection.appendChild(sellButton);
    row5.appendChild(sellSection);
    var scrapButton = document.createElement("span");
    scrapButton.setAttribute("class", "itemPanelButton");
    scrapSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    scrapButton.onclick = function(a,b){ return function() { Game.scrapWeapon(a,b); }; }(itemSlot, true);
    scrapButton.innerHTML= "Scrap";
    scrapSection.appendChild(scrapButton);
    row5.appendChild(scrapSection);
    var discardButton = document.createElement("span");
    discardButton.setAttribute("class", "itemPanelButton");
    discardSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    discardButton.onclick = function(a){ return function() { Game.discardWeapon(a); }; }(itemSlot);
    discardButton.innerHTML= "Discard";
    discardSection.appendChild(discardButton);
    row5.appendChild(discardSection);
    panel.appendChild(row5);
  }
  if(sourcePanel == "enemyInventory") {
    var takeButton = document.createElement("span");
    var takeSection = document.createElement("td");
    takeSection.setAttribute("colspan", "4");
    takeButton.setAttribute("class", "itemPanelButton");
    takeSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    takeButton.onclick = function(){ return function() { Game.takeWeapon(); }; }();
    takeButton.innerHTML= "Take this weapon";
    takeSection.appendChild(takeButton);
    row5.appendChild(takeSection);
    panel.appendChild(row5);
  }
  if(sourcePanel == "shop") {
    var buyButton = document.createElement("span");
    var buySection = document.createElement("td");
    buySection.setAttribute("colspan", "4");
    buyButton.setAttribute("class", "itemPanelButton");
    buySection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    buyButton.onclick = function(a){ return function() { Game.buyWeapon(a); }; }(itemSlot);
    var cost = 2 * Game.calculateItemLevelPrice(weapon[1],weapon[7]);
    buyButton.innerHTML= "Buy this weapon for " + cost + " seeds";
    buySection.appendChild(buyButton);
    row5.appendChild(buySection);
    panel.appendChild(row5);
  }
  if(sourcePanel == "forge") {
    var levelButton = document.createElement("span");
    var levelSection = document.createElement("td");
    levelSection.setAttribute("colspan", "2");
    levelButton.setAttribute("class", "itemPanelButton");
    levelSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    levelButton.onclick = function(a){ return function() { Game.buyWeaponLevelUpgrade(); }; }();
    levelButton.innerHTML= "Increase Weapon Level for " + Game.calculateItemLevelPrice(weapon[1], weapon[7]) + " seeds";
    levelSection.appendChild(levelButton);
    var qualityButton = document.createElement("span");
    var qualitySection = document.createElement("td");
    qualitySection.setAttribute("colspan", "2");
    qualityButton.setAttribute("class", "itemPanelButton");
    qualitySection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0; width:50% !important");
    qualityButton.onclick = function(a){ return function() { Game.buyWeaponQualityUpgrade(); }; }();
    qualityButton.innerHTML = (weapon[7] == Game.QUALITY_AMAZING ? "Cannot increase weapon quality." : "Increase Weapon Quality for " + Game.calculateItemQualityPrice(weapon[7]) + " scrap");
    qualitySection.appendChild(qualityButton);
    row5.appendChild(levelSection);
    row5.appendChild(qualitySection);
    panel.appendChild(row5);
  }
  return panel;
}
Game.createArmourUIPanel = function(armour, sourcePanel, itemSlot) {
  // And it goes a little something like this:
  //
  // +-------------------------------------+------------+
  // | Item Name                           | Item Level |
  // +------------------------+------------+------------+
  // | Armour Effect 1                     | Durability |
  // +------------------------+------------+------------+
  // | Armour Effect 2        | Armour Effect 3         |
  // +------------------------+------------+------------+
  // | Flavour Text                        |   Repair   |
  // +------------+-----------+------------+------------+
  // |   Equip    |   Sell    |   Scrap    |  Discard   |
  // +------------+-----------+------------+------------+
  // |            Buy this armour for X seeds           |
  // +------------------------+-------------------------+
  // |  Increase Item Level   |  Increase Item Quality  |
  // |    (costs X seeds)     |     (costs X scrap)     |
  // +------------------------+-------------------------+
  //
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var row4 = document.createElement("tr");
  var row5 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("colspan", "3");
  nameSection.innerHTML = "<span class='q" + armour[2] + "' style='font-size:18px !important;'>" + armour[0].split("|")[0] + "</span>";
  var iLvlSection = document.createElement("td");
  iLvlSection.setAttribute("style", "text-align:right");
  iLvlSection.innerHTML = "Level " + armour[1];
  row1.appendChild(nameSection);
  row1.appendChild(iLvlSection);
  panel.appendChild(row1);
  var effect1Section = document.createElement("td");
  var armourDesc = [];
  for(var x = 0; x < armour[4].length; x++) {
    armourDesc.push(armour[4][x].slice());
  }
  for(var y = 0; y < armour[5].length; y++) {
    armourDesc.push(armour[5][y].slice());
  }
  effect1Section.setAttribute("colspan", "3");
  effect1Section.appendChild(Game.buildArmourEffectString(armourDesc[0]));
  var duraSection = document.createElement("td");
  duraSection.setAttribute("style", "text-align:right");
  if(arraysEqual(armour, Game.p_Armour)) {
    duraSection.id = "combat_playerArmourDurability";
  }
  duraSection.innerHTML += armour[3] + " uses";
  row2.appendChild(effect1Section);
  row2.appendChild(duraSection);
  panel.appendChild(row2);
  var effect2Section = document.createElement("td");
  effect2Section.setAttribute("colspan", "2");
  effect2Section.setAttribute("style", "width:50% !important");
  effect2Section.appendChild(Game.buildArmourEffectString(armourDesc[1]));
  var effect3Section = document.createElement("td");
  effect3Section.setAttribute("colspan", "2");
  effect3Section.setAttribute("style", "width:50% !important");
  effect3Section.appendChild(Game.buildArmourEffectString(armourDesc[2]));
  row3.appendChild(effect2Section);
  row3.appendChild(effect3Section);
  panel.appendChild(row3);
  var flavourSection = document.createElement("td");
  flavourSection.setAttribute("colspan", sourcePanel == "player" ? "3" : "4");
  flavourSection.setAttribute("style", sourcePanel == "player" ? "width:75% !important" : "");
  var repairSection = document.createElement("td");
  flavourSection.innerHTML = "<span style='font-style:italic'>" + (armour[0].split("|").length > 1 ? armour[0].split("|")[1] : "&nbsp;") + "</span>";
  row4.appendChild(flavourSection);
  if(sourcePanel == "player") {
    var repairButton = document.createElement("span");
    repairButton.setAttribute("class", "itemPanelButton");
    repairSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    repairButton.onclick = function(){ return function() { Game.startRepair(); }; }();
    repairButton.innerHTML= "Repair";
    repairSection.appendChild(repairButton);
    row4.appendChild(repairSection);
  }
  panel.appendChild(row4);
  if(sourcePanel == "inventory") {
    var equipSection = document.createElement("td");
    var sellSection = document.createElement("td");
    var scrapSection = document.createElement("td");
    var discardSection = document.createElement("td");
    var equipButton = document.createElement("span");
    equipButton.setAttribute("class", "itemPanelButton");
    equipSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    equipButton.onclick = function(a){ return function() { Game.equipArmour(a); }; }(itemSlot);
    equipButton.innerHTML= "Equip";
    equipSection.appendChild(equipButton);
    row5.appendChild(equipSection);
    var sellButton = document.createElement("span");
    sellButton.setAttribute("class", "itemPanelButton");
    sellSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    sellButton.onclick = function(a,b){ return function() { Game.sellArmour(a,b); }; }(itemSlot, true);
    sellButton.innerHTML= "Sell";
    sellSection.appendChild(sellButton);
    row5.appendChild(sellSection);
    var scrapButton = document.createElement("span");
    scrapButton.setAttribute("class", "itemPanelButton");
    scrapSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    scrapButton.onclick = function(a,b){ return function() { Game.scrapArmour(a,b); }; }(itemSlot, true);
    scrapButton.innerHTML= "Scrap";
    scrapSection.appendChild(scrapButton);
    row5.appendChild(scrapSection);
    var discardButton = document.createElement("span");
    discardButton.setAttribute("class", "itemPanelButton");
    discardSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    discardButton.onclick = function(a){ return function() { Game.discardArmour(a); }; }(itemSlot);
    discardButton.innerHTML= "Discard";
    discardSection.appendChild(discardButton);
    row5.appendChild(discardSection);
    panel.appendChild(row5);
  }
  if(sourcePanel == "enemyInventory") {
    var takeButton = document.createElement("span");
    var takeSection = document.createElement("td");
    takeSection.setAttribute("colspan", "4");
    takeButton.setAttribute("class", "itemPanelButton");
    takeSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    takeButton.onclick = function(){ return function() { Game.takeArmour(); }; }();
    takeButton.innerHTML= "Take this armour";
    takeSection.appendChild(takeButton);
    row5.appendChild(takeSection);
    panel.appendChild(row5);
  }
  if(sourcePanel == "shop") {
    var buyButton = document.createElement("span");
    var buySection = document.createElement("td");
    buySection.setAttribute("colspan", "4");
    buyButton.setAttribute("class", "itemPanelButton");
    buySection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    var cost = 2 * Game.calculateItemLevelPrice(armour[1],armour[2]);
    buyButton.onclick = function(a){ return function() { Game.buyArmour(a); }; }(itemSlot);
    buyButton.innerHTML= "Buy this armour for " + cost + " seeds";
    buySection.appendChild(buyButton);
    row5.appendChild(buySection);
    panel.appendChild(row5);
  }
  if(sourcePanel == "forge") {
    var levelButton = document.createElement("span");
    var levelSection = document.createElement("td");
    levelSection.setAttribute("colspan", "2");
    levelButton.setAttribute("class", "itemPanelButton");
    levelSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    levelButton.onclick = function(a){ return function() { Game.buyArmourLevelUpgrade(); }; }();
    levelButton.innerHTML= "Increase Armour Level for " + Game.calculateItemLevelPrice(armour[1], armour[2]) + " seeds";
    levelSection.appendChild(levelButton);
    var qualityButton = document.createElement("span");
    var qualitySection = document.createElement("td");
    qualitySection.setAttribute("colspan", "2");
    qualityButton.setAttribute("class", "itemPanelButton");
    qualitySection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0; width:50% !important");
    qualityButton.onclick = function(a){ return function() { Game.buyArmourQualityUpgrade(); }; }();
    qualityButton.innerHTML = (armour[2] == Game.QUALITY_AMAZING ? "Cannot increase armour quality." : "Increase Armour Quality for " + Game.calculateItemQualityPrice(armour[2]) + " scrap");
    qualitySection.appendChild(qualityButton);
    row5.appendChild(levelSection);
    row5.appendChild(qualitySection);
    panel.appendChild(row5);
  }
  return panel;
}
Game.createPowerUIPanel = function(powerID, rootID, currentLevel, selectable, buyable) {
  // And it goes a little something like this...
  // +-------------------------------------+------------+
  // | Power Name                          | Investment |
  // +-------------------------------------+------------+
  // | Branching From (if applicable)                   |
  // +--------------------------------------------------+
  // | Power Effect                                     |
  // +--------------------------------------------------+
  // |                Upgrade This Power                |
  // +--------------------------------------------------+
  // this panel will only appear on the Powers tab - so a check of which tab we're on is not required.

  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  if(!selectable || (Game.p_PP === 0 && Game.powerLevel(powerID) === 0)) {
    panel.setAttribute("style","opacity:0.4;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';");
  }
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var row4 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("colspan", "3");
  nameSection.setAttribute("style", "width:75% !important");
  nameSection.innerHTML = "<span style='font-weight:bold;font-size:18px;'>" + Game.getPowerName(powerID) + "</span>";
  var investmentSection = document.createElement("td");
  investmentSection.setAttribute("style", "text-align:right");
  investmentSection.innerHTML = "(" + currentLevel + "/" + Game.getPowerLevelCap(powerID) + ")";
  row1.appendChild(nameSection);
  row1.appendChild(investmentSection);
  panel.appendChild(row1);
  if(typeof rootID !== undefined && rootID >= 0) {
    var branchSection = document.createElement("td");
    branchSection.setAttribute("colspan", "4");
    branchSection.innerHTML = "<span style='font-style:italic'> - Branches from " + Game.getPowerName(rootID) + "</span>";
    row2.appendChild(branchSection);
    panel.appendChild(row2);
  }
  var effectSection = document.createElement("td");
  effectSection.setAttribute("colspan", "4");
  effectSection.innerHTML = Game.getPowerDesc(powerID);
  row3.appendChild(effectSection);
  panel.appendChild(row3);
  if(currentLevel < Game.getPowerLevelCap(powerID) && selectable && Game.p_PP > 0 && buyable) {
    var upgradeButton = document.createElement("span");
    var upgradeSection = document.createElement("td");
    upgradeSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    upgradeSection.setAttribute("colspan", "4");
    upgradeButton.setAttribute("class", "itemPanelButton");
    upgradeButton.onclick = function(a){ return function() { Game.buyPower(a); }; }(powerID);
    upgradeButton.innerHTML = "Upgrade this Power";
    upgradeSection.appendChild(upgradeButton);
    row4.appendChild(upgradeSection);
    panel.appendChild(row4);
  }
  return panel;
}
Game.createPlayerUIPanel = function() {
  // And it goes a little something like this...
  // +-------------------------------------+------------+
  // | Player Name                         | Level XX   |
  // +-------------------------------------+------------+
  // | HP: XXXXX / YYYYY (ZZ.ZZ%)          | Free SP: X |
  // +--------------------------------------------------+
  // | Experience: XXXXX / YYYYY (ZZ.ZZ%)  | Free PP: X |
  // +--------------------------------------------------+
  // |  STR XXX   |  DEX XXX   |  INT XXX  |  CON XXX   |
  // +--------------------------------------------------+
  // |      Scrap: XXXXX       |     Seeds: XXXXX       |
  // +--------------------------------------------------+
  // |       Change Name       |      Reset Stats       |
  // +--------------------------------------------------+

  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var row4 = document.createElement("tr");
  var row5 = document.createElement("tr");
  var row6 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("colspan", "3");
  nameSection.setAttribute("style", "font-size:18px;font-weight:bold;")
  nameSection.innerHTML = Game.p_Name;
  var levelSection = document.createElement("td");
  levelSection.setAttribute("style", "text-align:right;");
  levelSection.innerHTML = "Level " + Game.p_Level;
  levelSection.id = "player_level";
  row1.appendChild(nameSection);
  row1.appendChild(levelSection);
  panel.appendChild(row1);
  var HPSection = document.createElement("td");
  HPSection.setAttribute("colspan", "3");
  HPSection.id = "player_hpmaxhp";
  HPSection.innerHTML = "<strong>HP:</strong> " + prettifyNumber(Game.p_HP) + " / " + prettifyNumber(Game.p_MaxHP) + " (" + Math.floor(Game.p_HP / Game.p_MaxHP * 10000)/100 + "%)";
  var unspentSPSection = document.createElement("td");
  unspentSPSection.id = "player_UISP";
  unspentSPSection.innerHTML = "<strong>Free SP:</strong> " + Game.p_SkillPoints;
  row2.appendChild(HPSection);
  row2.appendChild(unspentSPSection);
  panel.appendChild(row2);
  var XPSection = document.createElement("td");
  XPSection.setAttribute("colspan", "3");
  XPSection.id = "player_xpmaxxp";
  XPSection.innerHTML = "<strong>XP:</strong> " + Game.p_EXP + " / " + Game.p_NextEXP + " (" + Math.floor(Game.p_EXP / Game.p_NextEXP * 10000)/100 + "%)";
  var unspentPPSection = document.createElement("td");
  unspentPPSection.id = "player_UIPP";
  unspentPPSection.innerHTML = "<strong>Free PP:</strong> " + Game.p_PP;
  row3.appendChild(XPSection);
  row3.appendChild(unspentPPSection);
  panel.appendChild(row3);
  var STRSection = document.createElement("td");
  STRSection.id = "player_UIStr";
  STRSection.innerHTML = "<strong>STR:</strong> " + Game.p_Str;
  var DEXSection = document.createElement("td");
  DEXSection.id = "player_UIDex";
  DEXSection.innerHTML = "<strong>DEX:</strong> " + Game.p_Dex;
  var INTSection = document.createElement("td");
  INTSection.id = "player_UIInt";
  INTSection.innerHTML = "<strong>INT:</strong> " + Game.p_Int;
  var CONSection = document.createElement("td");
  CONSection.id = "player_UICon";
  CONSection.innerHTML = "<strong>CON:</strong> " + Game.p_Con;
  row4.appendChild(STRSection);
  row4.appendChild(DEXSection);
  row4.appendChild(INTSection);
  row4.appendChild(CONSection);
  panel.appendChild(row4);
  var seedsSection = document.createElement("td");
  seedsSection.setAttribute("colspan", "2");
  seedsSection.id = "player_UISeeds";
  seedsSection.innerHTML = "<strong>Seeds:</strong> " + Game.p_Currency;
  var scrapSection = document.createElement("td");
  scrapSection.setAttribute("colspan", "2");
  scrapSection.id = "player_UIScrap";
  scrapSection.innerHTML = "<strong>Scrap:</strong> " + Game.p_Scrap;
  row5.appendChild(seedsSection);
  row5.appendChild(scrapSection);
  panel.appendChild(row5);
  var renameButton = document.createElement("span");
  var renameSection = document.createElement("td");
  renameSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
  renameSection.setAttribute("colspan", "2");
  renameButton.setAttribute("class", "itemPanelButton");
  renameButton.onclick = function(){ return function() { Game.renamePlayer(); }; }();
  renameButton.innerHTML = "Rename Character"
  renameSection.appendChild(renameButton);
  var resetSection = document.createElement("td");
  var resetButton = document.createElement("span");
  resetSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
  resetSection.setAttribute("colspan", "2");
  resetButton.setAttribute("class", "itemPanelButton");
  resetButton.onclick = function(){ return function() { Game.statReset(); }; }();
  resetButton.innerHTML = "Reset Stats";
  resetSection.appendChild(resetButton);
  row6.appendChild(renameSection);
  row6.appendChild(resetSection);
  panel.appendChild(row6);
  return panel;
}
Game.createPlayerCombatPanel = function() {
  // And it goes a little something like this...
  // +-------------------------------------+------------+
  // | Player Name                         | Level XX   |
  // +-------------------------------------+------------+
  // | HP: XXXXX / YYYYY (ZZ.ZZ%)                       |
  // +--------------------------------------------------+
  // | Debuff: XXXXX (Y sec)                            |
  // +--------------------------------------------------+
  // |      Burst Attack       |    Flee From Combat    |
  // +--------------------------------------------------+

  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var row4 = document.createElement("tr");
  var row5 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("colspan", "3");
  nameSection.setAttribute("style", "font-size:18px;font-weight:bold;width:75% !important");
  nameSection.id = "combat_playerName";
  nameSection.innerHTML = Game.p_Name;
  var levelSection = document.createElement("td");
  levelSection.setAttribute("style", "text-align:right;");
  levelSection.id = "combat_playerLevel";
  levelSection.innerHTML = "Level " + Game.p_Level;
  row1.appendChild(nameSection);
  row1.appendChild(levelSection);
  panel.appendChild(row1);
  var HPSection = document.createElement("td");
  HPSection.setAttribute("colspan", "4");
  HPSection.id = "combat_playerHP";
  HPSection.innerHTML = "HP: " + prettifyNumber(Game.p_HP) + " / " + prettifyNumber(Game.p_MaxHP) + " (" + Math.floor(Game.p_HP / Game.p_MaxHP * 10000)/100 + "%)";
  row2.appendChild(HPSection);
  panel.appendChild(row2);
  if(Game.p_Debuff.length > 0) {
    var debuffSection = document.createElement("td");
    debuffSection.setAttribute("colspan", "4");
    debuffSection.id = "combat_playerDebuff";
    debuffSection.innerHTML = "<strong>Debuff:</strong> " + Game.p_Debuff[1] + "(" + Game.debuff_names[Game.p_Debuff[0]-Game.DEBUFF_SHRED] + ") - " + Game.player_debuffTimer + "s";
    row3.appendChild(debuffSection);
    panel.appendChild(row3);
  }
  if(Game.p_State == Game.STATE_COMBAT) {
    var burstButton = document.createElement("span");
    var burstSection = document.createElement("td");
    burstSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    burstSection.setAttribute("colspan", "2");
    burstButton.setAttribute("class", "itemPanelButton");
    burstButton.onclick = function(){ return function() { Game.burstAttack(); }; }();
    burstButton.id = "combat_burstButton";
    burstButton.innerHTML = Game.p_specUsed ? "Burst Unavailable" : (Game.powerLevel(Game.BOOST_BURST) > 0 ? "Wild Swings" : "Burst Attack");
    burstSection.appendChild(burstButton);
    row4.appendChild(burstSection);
    var fleeButton = document.createElement("span");
    var fleeSection = document.createElement("td");
    fleeSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    fleeSection.setAttribute("colspan", "2");
    fleeButton.setAttribute("class", "itemPanelButton");
    fleeButton.onclick = function(){ return function() { Game.fleeCombat(); }; }();
    fleeButton.innerHTML = "Flee from Combat";
    fleeSection.appendChild(fleeButton);
    row4.appendChild(fleeSection);
    panel.appendChild(row4);
  }
  else {
    var killButton = document.createElement("span");
    var killSection = document.createElement("td");
    killSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
    killSection.setAttribute("colspan", "4");
    killButton.setAttribute("class", "itemPanelButton");
    killButton.onclick = function(x){ return function() { Game.startCombat(x); }; }(true);
    killButton.innerHTML = "Look for something to kill";
    killSection.appendChild(killButton);
    row4.appendChild(killSection);
    panel.appendChild(row4);
    if(Game.p_Level >= Game.ZONE_MAX_LEVEL[Game.p_currentZone]) {
      var bossButton = document.createElement("span");
      var bossSection = document.createElement("td");
      bossSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
      bossSection.setAttribute("colspan", "4");
      bossButton.setAttribute("class", "itemPanelButton");
      bossButton.onclick = function(x,y){ return function() { Game.startCombat(x,y); }; }(true, true);
      bossButton.innerHTML = "Enter the boss's lair";
      bossSection.appendChild(bossButton);
      row5.appendChild(bossSection);
      panel.appendChild(row5);
    }
  }
  return panel;
}
Game.createEnemyCombatPanel = function() {
  // And it goes a little something like this...
  // +-------------------------------------+------------+
  // | Enemy Name                          | Level XX   |
  // +-------------------------------------+------------+
  // | HP: XXXXX / YYYYY (ZZ.ZZ%)                       |
  // +--------------------------------------------------+
  // | Debuff: XXXXX (Y sec)                            |
  // +--------------------------------------------------+

  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("colspan", "3");
  nameSection.setAttribute("style", "font-size:18px;font-weight:bold;width:75% !important");
  nameSection.innerHTML = Game.p_State == Game.STATE_COMBAT ? Game.e_Name : "No Enemies Nearby";
  var levelSection = document.createElement("td");
  levelSection.setAttribute("style", "text-align:right;");
  levelSection.innerHTML = Game.p_State == Game.STATE_COMBAT ? "Level " + Game.e_Level : "&nbsp;";
  row1.appendChild(nameSection);
  row1.appendChild(levelSection);
  panel.appendChild(row1);
  var HPSection = document.createElement("td");
  HPSection.setAttribute("colspan", "4");
  HPSection.id = "combat_enemyHealth";
  HPSection.innerHTML = Game.p_State == Game.STATE_COMBAT ? ("HP: " + prettifyNumber(Game.e_HP) + " / " + prettifyNumber(Game.e_MaxHP) + " (" + Math.floor(Game.e_HP / Game.e_MaxHP * 10000)/100 + "%)") : "Elite Appearance Chance: " + Game.bossChance + "%";
  row2.appendChild(HPSection);
  panel.appendChild(row2);
   if(Game.e_Debuff.length > 0) {
    var debuffSection = document.createElement("td");
    debuffSection.setAttribute("colspan", "4");
     debuffSection.id = "combat_enemyDebuff";
    debuffSection.innerHTML = "<strong>Debuff:</strong> " + Game.e_Debuff[1] + "(" + Game.debuff_names[Game.e_Debuff[0]-Game.DEBUFF_SHRED] + ") - " + Game.enemy_debuffTimer + "s";
    row3.appendChild(debuffSection);
    panel.appendChild(row3);
  }
  return panel;
}
Game.createStatPointPanel = function() {
  // And it goes a little something like this:
  // +-------------------------------------------+
  // | Stat Upgrade (X points available)         |
  // +-------------------------------------------+
  // | Strength (X)           | +1 STR | +10 STR |
  // +-------------------------------------------+
  // | Dexterity (X)          | +1 DEX | +10 DEX |
  // +-------------------------------------------+
  // | Intelligence (X)       | +1 INT | +10 DEX |
  // +-------------------------------------------+
  // | Constitution (X)       | +1 CON | +10 CON |
  // +-------------------------------------------+
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("colspan", "4");
  nameSection.setAttribute("style","font-size:18px;font-weight:bold;width:100% !important;");
  nameSection.innerHTML = "Stat Points (" + Game.p_SkillPoints + " left)";
  nameSection.id = "player_statPointsLeft"
  row1.appendChild(nameSection);
  panel.appendChild(row1);
  var row2 = document.createElement("tr");
  var strNameSection = document.createElement("td");
  strNameSection.setAttribute("colspan","2");
  strNameSection.setAttribute("style","width:50% !important");
  strNameSection.innerHTML = "<strong>Strength</strong> (" + Game.POINTS_STR_CURRENT + ")";
  var strAdd1Section = document.createElement("td");
  var strAdd1Button = document.createElement("span");
  strAdd1Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  strAdd1Button.setAttribute("class", "itemPanelButton");
  strAdd1Button.onclick = function(a,b){ return function() { Game.addStat(a,b); }; }(Game.STAT_STR,1);
  strAdd1Button.innerHTML = "+1 STR";
  strAdd1Section.appendChild(strAdd1Button);
  var strAdd10Section = document.createElement("td");
  var strAdd10Button = document.createElement("span");
  strAdd10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  strAdd10Button.setAttribute("class", "itemPanelButton");
  strAdd10Button.onclick = function(a,b){ return function() { Game.addStat(a,b); }; }(Game.STAT_STR,10);
  strAdd10Button.innerHTML = "+10 STR";
  strAdd10Section.appendChild(strAdd10Button);
  row2.appendChild(strNameSection);
  row2.appendChild(strAdd1Section);
  row2.appendChild(strAdd10Section);
  panel.appendChild(row2);
  var row3 = document.createElement("tr");
  var dexNameSection = document.createElement("td");
  dexNameSection.setAttribute("colspan","2");
  dexNameSection.setAttribute("style","width:50% !important");
  dexNameSection.innerHTML = "<strong>Dexterity</strong> (" + Game.POINTS_DEX_CURRENT + ")";
  var dexAdd1Section = document.createElement("td");
  var dexAdd1Button = document.createElement("span");
  dexAdd1Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  dexAdd1Button.setAttribute("class", "itemPanelButton");
  dexAdd1Button.onclick = function(a,b){ return function() { Game.addStat(a,b); }; }(Game.STAT_DEX,1);
  dexAdd1Button.innerHTML = "+1 DEX";
  dexAdd1Section.appendChild(dexAdd1Button);
  var dexAdd10Section = document.createElement("td");
  var dexAdd10Button = document.createElement("span");
  dexAdd10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  dexAdd10Button.setAttribute("class", "itemPanelButton");
  dexAdd10Button.onclick = function(a,b){ return function() { Game.addStat(a,b); }; }(Game.STAT_DEX,10);
  dexAdd10Button.innerHTML = "+10 DEX";
  dexAdd10Section.appendChild(dexAdd10Button);
  row3.appendChild(dexNameSection);
  row3.appendChild(dexAdd1Section);
  row3.appendChild(dexAdd10Section);
  panel.appendChild(row3);
  var row4 = document.createElement("tr");
  var intNameSection = document.createElement("td");
  intNameSection.setAttribute("colspan","2");
  intNameSection.setAttribute("style","width:50% !important");
  intNameSection.innerHTML = "<strong>Intelligence</strong> (" + Game.POINTS_INT_CURRENT + ")";
  var intAdd1Section = document.createElement("td");
  var intAdd1Button = document.createElement("span");
  intAdd1Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  intAdd1Button.setAttribute("class", "itemPanelButton");
  intAdd1Button.onclick = function(a,b){ return function() { Game.addStat(a,b); }; }(Game.STAT_INT,1);
  intAdd1Button.innerHTML = "+1 INT";
  intAdd1Section.appendChild(intAdd1Button);
  var intAdd10Section = document.createElement("td");
  var intAdd10Button = document.createElement("span");
  intAdd10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  intAdd10Button.setAttribute("class", "itemPanelButton");
  intAdd10Button.onclick = function(a,b){ return function() { Game.addStat(a,b); }; }(Game.STAT_INT,10);
  intAdd10Button.innerHTML = "+10 INT";
  intAdd10Section.appendChild(intAdd10Button);
  row4.appendChild(intNameSection);
  row4.appendChild(intAdd1Section);
  row4.appendChild(intAdd10Section);
  panel.appendChild(row4);
  var row5 = document.createElement("tr");
  var conNameSection = document.createElement("td");
  conNameSection.setAttribute("colspan","2");
  conNameSection.setAttribute("style","width:50% !important");
  conNameSection.innerHTML = "<strong>Constitution</strong> (" + Game.POINTS_CON_CURRENT + ")";
    var conAdd1Section = document.createElement("td");
  var conAdd1Button = document.createElement("span");
  conAdd1Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  conAdd1Button.setAttribute("class", "itemPanelButton");
  conAdd1Button.onclick = function(a,b){ return function() { Game.addStat(a,b); }; }(Game.STAT_CON,1);
  conAdd1Button.innerHTML = "+1 CON";
  conAdd1Section.appendChild(conAdd1Button);
  var conAdd10Section = document.createElement("td");
  var conAdd10Button = document.createElement("span");
  conAdd10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  conAdd10Button.setAttribute("class", "itemPanelButton");
  conAdd10Button.onclick = function(a,b){ return function() { Game.addStat(a,b); }; }(Game.STAT_CON,10);
  conAdd10Button.innerHTML = "+10 CON";
  conAdd10Section.appendChild(conAdd10Button);
  row5.appendChild(conNameSection);
  row5.appendChild(conAdd1Section);
  row5.appendChild(conAdd10Section);
  panel.appendChild(row5);
  var infoSection = document.createElement("td");
  return panel;
}
Game.createStatisticPanel = function(name, value) {
  // And it goes a little something like this:
  // +-----------------------------------+
  // | Name                    |  Value  |
  // +-----------------------------------+
  var panel = document.createElement("table");
  panel.setAttribute("class", "statisticsPanel");
  var row1 = document.createElement("tr");
  var nameSection = document.createElement("td");
  var valSection = document.createElement("td");
  nameSection.innerHTML = "<strong>" + name + "</strong>";
  nameSection.setAttribute("style", "width:75% !important");
  valSection.innerHTML = prettifyNumber(value);
  valSection.setAttribute("style", "text-align:right;width:25% !important");
  row1.appendChild(nameSection);
  row1.appendChild(valSection);
  panel.appendChild(row1);
  return panel;
}
Game.createZonePanel = function(zoneID, active) {
  // And it goes a little something like this:
  // +-------------------------+
  // | Zone Name | Level Range |
  // +-----------+-------------+
  // | Zone Description        |
  // +-------------------------+
  // | Move To This Zone       |
  // +-------------------------+
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  if(active) {
    panel.setAttribute("style", "width: 600px !important;");
  }
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("style", "font-size:18px;font-weight:bold;width:75% !important");
  nameSection.innerHTML = (Game.p_maxZone+1) >= zoneID ? Game.ZONE_NAMES[zoneID] : "???";
  row1.appendChild(nameSection);
  var levelSection = document.createElement("td");
  levelSection.setAttribute("style", "text-align:right;width:25% !important");
  levelSection.innerHTML = "(" + Game.ZONE_MIN_LEVEL[zoneID] + " - " + Game.ZONE_MAX_LEVEL[zoneID] + ")";
  row1.appendChild(levelSection);
  panel.appendChild(row1);
  if(active) {
    var descSection = document.createElement("td");
    descSection.setAttribute("colspan",2);
    descSection.innerHTML = (Game.p_maxZone+1) >= zoneID ? Game.ZONE_DESCRIPTIONS[zoneID] : "???";
    row2.appendChild(descSection);
    panel.appendChild(row2);
  }
  if(Game.p_currentZone !== zoneID && Game.p_maxZone >= zoneID) {
    var moveSection = document.createElement("td");
    var moveButton = document.createElement("span");
    moveSection.setAttribute("colspan",2);
    moveSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    moveButton.setAttribute("class", "itemPanelButton");
    moveButton.onclick = function(a){ return function() { Game.changeZone(a); }; }(zoneID);
    moveButton.innerHTML = "Move to this Zone";
    moveSection.appendChild(moveButton);
    row3.appendChild(moveSection);
    panel.appendChild(row3);
  }
  return panel;
}
Game.createForgePanel = function(debuffID) {
  // And it goes a little something like this:
  // +---------------------------+
  // | Debuff Name               |
  // +---------------------------+
  // | Debuff Description        |
  // +------------+--------------+
  // | Buy Normal | Buy Superior |
  // +------------+--------------+
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("style", "font-size:18px;font-weight:bold;");
  nameSection.setAttribute("colspan",2)
  nameSection.innerHTML = (debuffID < Game.DEBUFF_SHRED) ? "Random" : Game.debuff_names[debuffID - Game.DEBUFF_SHRED];
  row1.appendChild(nameSection);
  panel.appendChild(row1);
  var descSection = document.createElement("td");
  descSection.setAttribute("colspan",2);
  descSection.innerHTML = (debuffID < Game.DEBUFF_SHRED) ? "Selects a debuff at random from the others listed." : Game.debuff_descriptions[debuffID - Game.DEBUFF_SHRED];
  row2.appendChild(descSection);
  panel.appendChild(row2);
  if(debuffID == Game.DEBUFF_MC) {
    var cheapSection = document.createElement("td");
    var cheapButton = document.createElement("span");
    cheapSection.setAttribute("colspan",2);
    cheapSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
    cheapButton.setAttribute("class", "itemPanelButton");
    cheapButton.onclick = function(a,b){ return function() { Game.reforgeWeapon(a,b); }; }(debuffID, false);
    cheapButton.innerHTML = "Buy Normal Debuff (4)";
    cheapSection.appendChild(cheapButton);
    row3.appendChild(cheapSection);
    panel.appendChild(row3);
  }
  else {
    var cheapSection = document.createElement("td");
    var cheapButton = document.createElement("span");
    cheapSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    cheapButton.setAttribute("class", "itemPanelButton");
    cheapButton.onclick = function(a,b){ return function() { Game.reforgeWeapon(a,b); }; }(debuffID, false);
    cheapButton.innerHTML = "Buy Normal Debuff (" + (debuffID < Game.DEBUFF_SHRED ? 1 : 4) + ")";
    cheapSection.appendChild(cheapButton);
    row3.appendChild(cheapSection);
    var expensiveSection = document.createElement("td");
    var expensiveButton = document.createElement("span");
    expensiveSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    expensiveButton.setAttribute("class", "itemPanelButton");
    expensiveButton.onclick = function(a,b){ return function() { Game.reforgeWeapon(a,b); }; }(debuffID, true);
    expensiveButton.innerHTML = "Buy Superior Debuff (" + (debuffID < Game.DEBUFF_SHRED ? 2 : 8) + ")";
    expensiveSection.appendChild(expensiveButton);
    row3.appendChild(expensiveSection);
    panel.appendChild(row3);
  }
  return panel;
}
Game.createABOptionPanel = function() {
  // And it goes a little something like this:
  // +------------------------------------------+
  // | Autobattle Options              | Toggle |
  // +------------------------------------------+
  // | Percentage of Health to flee from combat |
  // +------------------------------------------+
  // |    5%    |    10%   |    15%   |   20%   |
  // +------------------------------------------+
  // |   Automatic repair threshold durability  |
  // +------------------------------------------+
  // |    5%    |     10%  |    15%   |   20%   |
  // +------------------------------------------+
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.innerHTML = "<strong>Autobattle Options</strong>";
  nameSection.setAttribute("colspan",3);
  nameSection.setAttribute("style","width:75% !important");
  row1.appendChild(nameSection);
  var toggleSection = document.createElement("td");
  var toggleButton = document.createElement("span");
  toggleSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
  toggleButton.setAttribute("class", "itemPanelButton");
  toggleButton.onclick = function(){ return function() { Game.toggleAutoBattle(); Game.drawActivePanel() }; }();
  toggleButton.innerHTML = "Turn " + (Game.autoBattle ? "Off" : "On");
  toggleSection.appendChild(toggleButton);
  row1.appendChild(toggleSection);
  panel.appendChild(row1);
  var row2 = document.createElement("tr");
  var percentSection = document.createElement("td");
  percentSection.setAttribute("colspan",4);
  percentSection.setAttribute("style","text-align:center;vertical-align:middle;text-decoration:underline;");
  percentSection.innerHTML = "Health Percentage to Flee";
  row2.appendChild(percentSection);
  panel.appendChild(row2);
  var row3 = document.createElement("tr");
  var health5Section = document.createElement("td");
  var health5Button = document.createElement("span");
  if(Game.autoBattle_flee == 5) {
    health5Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  }
  else {
    health5Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  health5Button.setAttribute("class", "itemPanelButton");
  health5Button.onclick = function(){ return function() { Game.autoBattle_flee = 5; Game.drawActivePanel(); }; }();
  health5Button.innerHTML = "5%";
  health5Section.appendChild(health5Button);
  row3.appendChild(health5Section);
  var health10Section = document.createElement("td");
  var health10Button = document.createElement("span");
  if(Game.autoBattle_flee == 10) {
    health10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  }
  else {
    health10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  health10Button.setAttribute("class", "itemPanelButton");
  health10Button.onclick = function(){ return function() { Game.autoBattle_flee = 10; Game.drawActivePanel(); }; }();
  health10Button.innerHTML = "10%";
  health10Section.appendChild(health10Button);
  row3.appendChild(health10Section);
  var health15Section = document.createElement("td");
  var health15Button = document.createElement("span");
  if(Game.autoBattle_flee == 15) {
    health15Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  }
  else {
    health15Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  health15Button.setAttribute("class", "itemPanelButton");
  health15Button.onclick = function(){ return function() { Game.autoBattle_flee = 15; Game.drawActivePanel(); }; }();
  health15Button.innerHTML = "15%";
  health15Section.appendChild(health15Button);
  row3.appendChild(health15Section);
  var health20Section = document.createElement("td");
  var health20Button = document.createElement("span");
  if(Game.autoBattle_flee == 20) {
    health20Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  }
  else {
    health20Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  health20Button.setAttribute("class", "itemPanelButton");
  health20Button.onclick = function(){ return function() { Game.autoBattle_flee = 20; Game.drawActivePanel(); }; }();
  health20Button.innerHTML = "20%";
  health20Section.appendChild(health20Button);
  row3.appendChild(health20Section);
  panel.appendChild(row3);
  var row4 = document.createElement("tr");
  var percentSection = document.createElement("td");
  percentSection.setAttribute("colspan",4);
  percentSection.setAttribute("style","text-align:center;vertical-align:middle;text-decoration:underline;");
  percentSection.innerHTML = "Durability Percentage to Repair";
  row4.appendChild(percentSection);
  panel.appendChild(row4);
  var row5 = document.createElement("tr");
  var repair5Section = document.createElement("td");
  var repair5Button = document.createElement("span");
  if(Game.autoBattle_repair == 5) {
    repair5Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  }
  else {
    repair5Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  repair5Button.setAttribute("class", "itemPanelButton");
  repair5Button.onclick = function(){ return function() { Game.autoBattle_repair = 5; Game.drawActivePanel(); }; }();
  repair5Button.innerHTML = "5%";
  repair5Section.appendChild(repair5Button);
  row5.appendChild(repair5Section);
  var repair10Section = document.createElement("td");
  var repair10Button = document.createElement("span");
  if(Game.autoBattle_repair == 10) {
    repair10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  }
  else {
    repair10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  repair10Button.setAttribute("class", "itemPanelButton");
  repair10Button.onclick = function(){ return function() { Game.autoBattle_repair = 10; Game.drawActivePanel(); }; }();
  repair10Button.innerHTML = "10%";
  repair10Section.appendChild(repair10Button);
  row5.appendChild(repair10Section);
  var repair15Section = document.createElement("td");
  var repair15Button = document.createElement("span");
  if(Game.autoBattle_repair == 15) {
    repair15Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  }
  else {
    repair15Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  repair15Button.setAttribute("class", "itemPanelButton");
  repair15Button.onclick = function(){ return function() { Game.autoBattle_repair = 15; Game.drawActivePanel(); }; }();
  repair15Button.innerHTML = "15%";
  repair15Section.appendChild(repair15Button);
  row5.appendChild(repair15Section);
  var repair20Section = document.createElement("td");
  var repair20Button = document.createElement("span");
  if(Game.autoBattle_repair == 20) {
    repair20Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  }
  else {
    repair20Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  repair20Button.setAttribute("class", "itemPanelButton");
  repair20Button.onclick = function(){ return function() { Game.autoBattle_repair = 20; Game.drawActivePanel(); }; }();
  repair20Button.innerHTML = "20%";
  repair20Section.appendChild(repair20Button);
  row5.appendChild(repair20Section);
  panel.appendChild(row5);
  return panel;
}
Game.createASOptionPanel = function() {
  // And it goes a little something like this:
  // +------------------------------------------+
  // | Autosell Options                         |
  // +------------------------------------------+
  // | Poor Items       | SCRAP | SELL | IGNORE |
  // +------------------------------------------+
  // | Normal Items     | SCRAP | SELL | IGNORE |
  // +------------------------------------------+
  // | Good Items       | SCRAP | SELL | IGNORE |
  // +------------------------------------------+
  // | Great Items      | SCRAP | SELL | IGNORE |
  // +------------------------------------------+
  // | Amazing Items    | SCRAP | SELL | IGNORE |
  // +------------------------------------------+
  // autoSell_options = [poor,normal,good,great,amazing];
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.innerHTML = "<strong>Autosell Options</strong>";
  nameSection.setAttribute("colspan",4);
  nameSection.setAttribute("style","width:100% !important");
  row1.appendChild(nameSection);
  panel.appendChild(row1);
  // Poor Items
  var row2 = document.createElement("tr");
  var poorSection = document.createElement("td");
  poorSection.innerHTML = "<span class='q221'>Poor Items</span>";
  poorSection.setAttribute("style", "width:40% !important");
  row2.appendChild(poorSection);
  var poorScrap = document.createElement("td");
  var poorScrapButton = document.createElement("span");
  if(Game.autoSell_options[0] == "SCRAP") {
    poorScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    poorScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  poorScrapButton.setAttribute("class", "itemPanelButton");
  poorScrapButton.onclick = function(){ return function() { Game.autoSell_options[0] = "SCRAP"; Game.drawActivePanel(); }; }();
  poorScrapButton.innerHTML = "Scrap";
  poorScrap.appendChild(poorScrapButton);
  row2.appendChild(poorScrap);
  var poorSell = document.createElement("td");
  var poorSellButton = document.createElement("span");
  if(Game.autoSell_options[0] == "SELL") {
    poorSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    poorSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  poorSellButton.setAttribute("class", "itemPanelButton");
  poorSellButton.onclick = function(){ return function() { Game.autoSell_options[0] = "SELL"; Game.drawActivePanel(); }; }();
  poorSellButton.innerHTML = "Sell";
  poorSell.appendChild(poorSellButton);
  row2.appendChild(poorSell);
  var poorIgnore = document.createElement("td");
  var poorIgnoreButton = document.createElement("span");
  if(Game.autoSell_options[0] == "IGNORE") {
    poorIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    poorIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  poorIgnoreButton.setAttribute("class", "itemPanelButton");
  poorIgnoreButton.onclick = function(){ return function() { Game.autoSell_options[0] = "IGNORE"; Game.drawActivePanel(); }; }();
  poorIgnoreButton.innerHTML = "Ignore";
  poorIgnore.appendChild(poorIgnoreButton);
  row2.appendChild(poorIgnore);
  panel.appendChild(row2);
  // Normal Items
  var row3 = document.createElement("tr");
  var normalSection = document.createElement("td");
  normalSection.innerHTML = "<span class='q222'>Normal Items</span>";
  normalSection.setAttribute("style", "width:40% !important");
  row3.appendChild(normalSection);
  var normalScrap = document.createElement("td");
  var normalScrapButton = document.createElement("span");
  if(Game.autoSell_options[1] == "SCRAP") {
    normalScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    normalScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  normalScrapButton.setAttribute("class", "itemPanelButton");
  normalScrapButton.onclick = function(){ return function() { Game.autoSell_options[1] = "SCRAP"; Game.drawActivePanel(); }; }();
  normalScrapButton.innerHTML = "Scrap";
  normalScrap.appendChild(normalScrapButton);
  row3.appendChild(normalScrap);
  var normalSell = document.createElement("td");
  var normalSellButton = document.createElement("span");
  if(Game.autoSell_options[1] == "SELL") {
    normalSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    normalSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  normalSellButton.setAttribute("class", "itemPanelButton");
  normalSellButton.onclick = function(){ return function() { Game.autoSell_options[1] = "SELL"; Game.drawActivePanel(); }; }();
  normalSellButton.innerHTML = "Sell";
  normalSell.appendChild(normalSellButton);
  row3.appendChild(normalSell);
  var normalIgnore = document.createElement("td");
  var normalIgnoreButton = document.createElement("span");
  if(Game.autoSell_options[1] == "IGNORE") {
    normalIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    normalIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  normalIgnoreButton.setAttribute("class", "itemPanelButton");
  normalIgnoreButton.onclick = function(){ return function() { Game.autoSell_options[1] = "IGNORE"; Game.drawActivePanel(); }; }();
  normalIgnoreButton.innerHTML = "Ignore";
  normalIgnore.appendChild(normalIgnoreButton);
  row3.appendChild(normalIgnore);
  panel.appendChild(row3);
  // Good Items
  var row4 = document.createElement("tr");
  var goodSection = document.createElement("td");
  goodSection.innerHTML = "<span class='q223'>Good Items</span>";
  goodSection.setAttribute("style", "width:40% !important");
  row4.appendChild(goodSection);
  var goodScrap = document.createElement("td");
  var goodScrapButton = document.createElement("span");
  if(Game.autoSell_options[2] == "SCRAP") {
    goodScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    goodScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  goodScrapButton.setAttribute("class", "itemPanelButton");
  goodScrapButton.onclick = function(){ return function() { Game.autoSell_options[2] = "SCRAP"; Game.drawActivePanel(); }; }();
  goodScrapButton.innerHTML = "Scrap";
  goodScrap.appendChild(goodScrapButton);
  row4.appendChild(goodScrap);
  var goodSell = document.createElement("td");
  var goodSellButton = document.createElement("span");
  if(Game.autoSell_options[2] == "SELL") {
    goodSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    goodSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  goodSellButton.setAttribute("class", "itemPanelButton");
  goodSellButton.onclick = function(){ return function() { Game.autoSell_options[2] = "SELL"; Game.drawActivePanel(); }; }();
  goodSellButton.innerHTML = "Sell";
  goodSell.appendChild(goodSellButton);
  row4.appendChild(goodSell);
  var goodIgnore = document.createElement("td");
  var goodIgnoreButton = document.createElement("span");
  if(Game.autoSell_options[2] == "IGNORE") {
    goodIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    goodIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  goodIgnoreButton.setAttribute("class", "itemPanelButton");
  goodIgnoreButton.onclick = function(){ return function() { Game.autoSell_options[2] = "IGNORE"; Game.drawActivePanel(); }; }();
  goodIgnoreButton.innerHTML = "Ignore";
  goodIgnore.appendChild(goodIgnoreButton);
  row4.appendChild(goodIgnore);
  panel.appendChild(row4);
  // Great Items
  var row5 = document.createElement("tr");
  var greatSection = document.createElement("td");
  greatSection.innerHTML = "<span class='q224'>Great Items</span>";
  greatSection.setAttribute("style", "width:40% !important");
  row5.appendChild(greatSection);
  var greatScrap = document.createElement("td");
  var greatScrapButton = document.createElement("span");
  if(Game.autoSell_options[3] == "SCRAP") {
    greatScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    greatScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  greatScrapButton.setAttribute("class", "itemPanelButton");
  greatScrapButton.onclick = function(){ return function() { Game.autoSell_options[3] = "SCRAP"; Game.drawActivePanel(); }; }();
  greatScrapButton.innerHTML = "Scrap";
  greatScrap.appendChild(greatScrapButton);
  row5.appendChild(greatScrap);
  var greatSell = document.createElement("td");
  var greatSellButton = document.createElement("span");
  if(Game.autoSell_options[3] == "SELL") {
    greatSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    greatSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  greatSellButton.setAttribute("class", "itemPanelButton");
  greatSellButton.onclick = function(){ return function() { Game.autoSell_options[3] = "SELL"; Game.drawActivePanel(); }; }();
  greatSellButton.innerHTML = "Sell";
  greatSell.appendChild(greatSellButton);
  row5.appendChild(greatSell);
  var greatIgnore = document.createElement("td");
  var greatIgnoreButton = document.createElement("span");
  if(Game.autoSell_options[3] == "IGNORE") {
    greatIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    greatIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  greatIgnoreButton.setAttribute("class", "itemPanelButton");
  greatIgnoreButton.onclick = function(){ return function() { Game.autoSell_options[3] = "IGNORE"; Game.drawActivePanel(); }; }();
  greatIgnoreButton.innerHTML = "Ignore";
  greatIgnore.appendChild(greatIgnoreButton);
  row5.appendChild(greatIgnore);
  panel.appendChild(row5);
  // Amazing Items
  var row6 = document.createElement("tr");
  var amazingSection = document.createElement("td");
  amazingSection.innerHTML = "<span class='q225'>Amazing Items</span>";
  amazingSection.setAttribute("style", "width:40% !important");
  row6.appendChild(amazingSection);
  var amazingScrap = document.createElement("td");
  var amazingScrapButton = document.createElement("span");
  if(Game.autoSell_options[4] == "SCRAP") {
    amazingScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    amazingScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  amazingScrapButton.setAttribute("class", "itemPanelButton");
  amazingScrapButton.onclick = function(){ return function() { Game.autoSell_options[4] = "SCRAP"; Game.drawActivePanel(); }; }();
  amazingScrapButton.innerHTML = "Scrap";
  amazingScrap.appendChild(amazingScrapButton);
  row6.appendChild(amazingScrap);
  var amazingSell = document.createElement("td");
  var amazingSellButton = document.createElement("span");
  if(Game.autoSell_options[4] == "SELL") {
    amazingSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    amazingSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  amazingSellButton.setAttribute("class", "itemPanelButton");
  amazingSellButton.onclick = function(){ return function() { Game.autoSell_options[4] = "SELL"; Game.drawActivePanel(); }; }();
  amazingSellButton.innerHTML = "Sell";
  amazingSell.appendChild(amazingSellButton);
  row6.appendChild(amazingSell);
  var amazingIgnore = document.createElement("td");
  var amazingIgnoreButton = document.createElement("span");
  if(Game.autoSell_options[4] == "IGNORE") {
    amazingIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  }
  else {
    amazingIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  amazingIgnoreButton.setAttribute("class", "itemPanelButton");
  amazingIgnoreButton.onclick = function(){ return function() { Game.autoSell_options[4] = "IGNORE"; Game.drawActivePanel(); }; }();
  amazingIgnoreButton.innerHTML = "Ignore";
  amazingIgnore.appendChild(amazingIgnoreButton);
  row6.appendChild(amazingIgnore);
  panel.appendChild(row6);
  return panel;
}
Game.createSavePanel = function() {
  // And it goes a little something like this:
  // +------------------------------------------+
  // | Save Game                         | Save |
  // +------------------------------------------+
  // | Don't trust the automatic save feature?  |
  // | This button is for you! Guaranteed to    |
  // | work 100% of the time! Honest!           |
  // +------------------------------------------+
  // | Reset Game                       | Reset |
  // +------------------------------------------+
  // | Fancy a fresh start? We can do that.     |
  // | Just push this button and we'll forget   |
  // | this playthrough ever even happened.     |
  // +------------------------------------------+
  // | Prestige                      | Prestige |
  // +------------------------------------------+
  // | Hitting a brick wall? A boss getting     |
  // | you down? Using this handy function, you |
  // | can start anew and make the next run     |
  // | both faster AND easier!                  |
  // +------------------------------------------+
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var saveHeader = document.createElement("td");
  saveHeader.setAttribute("colspan",3);
  saveHeader.setAttribute("style","width:75% !important");
  saveHeader.innerHTML = "<strong>Save Game</strong>"
  var saveButton = document.createElement("td");
  var saveActualButton = document.createElement("span");
  saveActualButton.setAttribute("class", "itemPanelButton");
  saveButton.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
  saveActualButton.onclick = function(){ return function() { Game.save(0); }; }();
  saveActualButton.innerHTML = "Save";
  saveButton.appendChild(saveActualButton);
  row1.appendChild(saveHeader);
  row1.appendChild(saveButton);
  panel.appendChild(row1);
  var row2 = document.createElement("tr");
  var saveBlurb = document.createElement("td");
  saveBlurb.setAttribute("colspan",4);
  saveBlurb.setAttribute("style","width:100% !important");
  saveBlurb.innerHTML = "Don't trust the automatic save feature? This button is for you! Works 100% of the time! Honest!"
  row2.appendChild(saveBlurb);
  panel.appendChild(row2);
    var row3 = document.createElement("tr");
  var resetHeader = document.createElement("td");
  resetHeader.setAttribute("colspan",3);
  resetHeader.setAttribute("style","width:75% !important");
  resetHeader.innerHTML = "<strong>Reset Game</strong>"
  var resetButton = document.createElement("td");
  var resetActualButton = document.createElement("span");
  resetActualButton.setAttribute("class", "itemPanelButton");
  resetButton.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
  resetActualButton.onclick = function(){ return function() { Game.reset(); }; }();
  resetActualButton.innerHTML = "Reset";
  resetButton.appendChild(resetActualButton);
  row3.appendChild(resetHeader);
  row3.appendChild(resetButton);
  panel.appendChild(row3);
  var row4 = document.createElement("tr");
  var resetBlurb = document.createElement("td");
  resetBlurb.setAttribute("colspan",4);
  resetBlurb.setAttribute("style","width:100% !important");
  resetBlurb.innerHTML = "Fancy a fresh start? We can do that. Push the button and we'll forget this playthrough ever even happened."
  row4.appendChild(resetBlurb);
  panel.appendChild(row4);
  var row5 = document.createElement("tr");
  var prestigeHeader = document.createElement("td");
  prestigeHeader.setAttribute("colspan",3);
  prestigeHeader.setAttribute("style","width:75% !important");
  prestigeHeader.innerHTML = "<strong>Prestige (NYI)</strong>"
  var prestigeButton = document.createElement("td");
  var prestigeActualButton = document.createElement("span");
  prestigeActualButton.setAttribute("class", "itemPanelButton");
  prestigeButton.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
  prestigeActualButton.onclick = function(){ return function() { Game.prestige(); }; }();
  prestigeActualButton.innerHTML = "Prestige";
  prestigeButton.appendChild(prestigeActualButton);
  row5.appendChild(prestigeHeader);
  row5.appendChild(prestigeButton);
  panel.appendChild(row5);
  var row6 = document.createElement("tr");
  var prestigeBlurb = document.createElement("td");
  prestigeBlurb.setAttribute("colspan",4);
  prestigeBlurb.setAttribute("style","width:100% !important");
  prestigeBlurb.innerHTML = "Hitting a brick wall? A boss getting you down? Using this handy button, you can start anew and make your next run both faster AND easier!"
  row6.appendChild(prestigeBlurb);
  panel.appendChild(row6);
  return panel;
}
Game.createBadgePanel = function(index) {
  // And it goes a little something like this...
  // +--------------------+
  // | Badge Name         |
  // +--------------------+
  // | Badge description  |
  // +--------------------+
  // | Badge flavour      |
  // +--------------------+
  var panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  var row1 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.innerHTML = "<strong>" + Game.BADGE_LIST[index][0] + "</strong>";
  nameSection.setAttribute("style", "width:100% !important");
  row1.appendChild(nameSection);
  panel.appendChild(row1);
  var row2 = document.createElement("tr");
  var descSection = document.createElement("td");
  var row3 = document.createElement("tr");
  var flavourSection = document.createElement("td");
  descSection.innerHTML = Game.BADGE_LIST[index][1];
  flavourSection.innerHTML = "\"" + Game.BADGE_LIST[index][2] + "\"";
  row2.appendChild(descSection);
  panel.appendChild(row2);
  row3.appendChild(flavourSection);
  panel.appendChild(row3);
  if(Game.playerBadges.indexOf(Game.BADGE_LIST[index][3]) < 0) {
    panel.setAttribute("style", "opacity:0.4;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';");
  }
  descSection.setAttribute("style", "width:100% !important");
  flavourSection.setAttribute("style", "width:100% !important;font-style:italic;");
  return panel;
}

document.getElementById("loadedUIPanels").style.display = "";