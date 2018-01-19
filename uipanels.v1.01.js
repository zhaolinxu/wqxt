/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";
/*---------------------------------
uipanels.js

Functions for the creation of all
the unique UI panels.
----------------------------------*/

Game.createWeaponUIPanel = function (weapon, sourcePanel, itemSlot) {
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
  
  // Need to update this. New panel should be as follows:
  // Condensed panel, consisting of an image of the weapon type (sword, bow or staff) and text indicating the DPS of the weapon, with a border indicating quality and a tooltip containing the weapon's name.
  // Full panel that extends to the right of the weapon.
  var panel, row1, row2, row3, row4, row5, nameSection, iLvlSection, dmgSection, dmgType, speedSection, debuffSection, duraSection, flavourSection, repairSection, repairButton, equipSection, sellSection, scrapSection, discardSection, equipButton, sellButton, scrapButton, discardButton, takeButton, takeSection, buyButton, buySection, levelButton, levelSection, qualityButton, qualitySection, cost;
  panel = document.createElement("table");
  panel.setAttribute("class", "itemPanel");
  row1 = document.createElement("tr");
  row2 = document.createElement("tr");
  row3 = document.createElement("tr");
  row4 = document.createElement("tr");
  row5 = document.createElement("tr");
  nameSection = document.createElement("td");
  nameSection.setAttribute("colspan", "3");
  nameSection.setAttribute("style", "width:75% !important");
  nameSection.innerHTML = "<span class='q" + weapon[7] + "' style='font-size:18px !important;'>" + weapon[0].split("|")[0] + "</span>";
  iLvlSection = document.createElement("td");
  iLvlSection.setAttribute("style", "text-align:right");
  iLvlSection.innerHTML = "等级 " + weapon[1];
  row1.appendChild(nameSection);
  row1.appendChild(iLvlSection);
  panel.appendChild(row1);
  dmgSection = document.createElement("td");
  dmgSection.setAttribute("colspan", "3");
  dmgSection.setAttribute("style", "width:75% !important");
  dmgType = "";
  switch (weapon[2]) {
  case Game.WEAPON_MELEE:
    dmgType = "近战";
    break;
  case Game.WEAPON_RANGE:
    dmgType = "远程";
    break;
  case Game.WEAPON_MAGIC:
    dmgType = "魔法";
    break;
  }
  dmgSection.innerHTML = "<strong>" + weapon[4] + "</strong> - <strong>" + weapon[5] + "</strong> " + dmgType + " 伤害 (" + weapon[6] + " 秒伤害)";
  speedSection = document.createElement("td");
  speedSection.setAttribute("style", "text-align:right");
  speedSection.innerHTML = "速度 " + weapon[3];
  row2.appendChild(dmgSection);
  row2.appendChild(speedSection);
  panel.appendChild(row2);
  debuffSection = document.createElement("td");
  debuffSection.setAttribute("colspan", "3");
  debuffSection.setAttribute("style", "width:75% !important");
  debuffSection.innerHTML = weapon[9].length === 0 ? "" : "<strong>" + weapon[9][1] + "</strong> (" + Game.debuff_names[weapon[9][0] - Game.DEBUFF_SHRED] + ") - " + weapon[9][2] + " sec";
  duraSection = document.createElement("td");
  duraSection.setAttribute("style", "text-align:right");
  if (arraysEqual(weapon, Game.p_Weapon)) {
    duraSection.id = "combat_playerWeaponDurability";
  }
  duraSection.innerHTML = weapon[8] + " 耐久";
  row3.appendChild(debuffSection);
  row3.appendChild(duraSection);
  panel.appendChild(row3);
  flavourSection = document.createElement("td");
  flavourSection.setAttribute("colspan", sourcePanel === "player" ? "3" : "4");
  flavourSection.setAttribute("style", sourcePanel === "player" ? "width:75% !important" : "");
  repairSection = document.createElement("td");
  flavourSection.innerHTML = "<span style='font-style:italic'>" + (weapon[0].split("|").length > 1 ? weapon[0].split("|")[1] : "&nbsp;") + "</span>";
  row4.appendChild(flavourSection);
  if (sourcePanel === "player") {
    repairButton = document.createElement("span");
    repairButton.setAttribute("class", "itemPanelButton");
    repairSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    repairButton.onclick = (function () {
      return function () {
        Game.startRepair();
      };
    }());
    repairButton.innerHTML = "修理";
    repairSection.appendChild(repairButton);
    row4.appendChild(repairSection);
  }
  panel.appendChild(row4);
  if (sourcePanel === "inventory") {
    equipSection = document.createElement("td");
    sellSection = document.createElement("td");
    scrapSection = document.createElement("td");
    discardSection = document.createElement("td");
    equipButton = document.createElement("span");
    equipButton.setAttribute("class", "itemPanelButton");
    equipSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    equipButton.onclick = (function (a) {
      return function () {
        Game.equipWeapon(a);
      };
    }(itemSlot));
    equipButton.innerHTML = "装备";
    equipSection.appendChild(equipButton);
    row5.appendChild(equipSection);
    sellButton = document.createElement("span");
    sellButton.setAttribute("class", "itemPanelButton");
    sellSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    sellButton.onclick = (function (a, b) {
      return function () {
        Game.sellWeapon(a, b);
      };
    }(itemSlot, true));
    sellButton.innerHTML = "出售";
    sellSection.appendChild(sellButton);
    row5.appendChild(sellSection);
    scrapButton = document.createElement("span");
    scrapButton.setAttribute("class", "itemPanelButton");
    scrapSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    scrapButton.onclick = (function (a, b) {
      return function () {
        Game.scrapWeapon(a, b);
      };
    }(itemSlot, true));
    scrapButton.innerHTML = "分解";
    scrapSection.appendChild(scrapButton);
    row5.appendChild(scrapSection);
    discardButton = document.createElement("span");
    discardButton.setAttribute("class", "itemPanelButton");
    discardSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    discardButton.onclick = (function (a) {
      return function () {
        Game.discardWeapon(a);
      };
    }(itemSlot));
    discardButton.innerHTML = "丢弃";
    discardSection.appendChild(discardButton);
    row5.appendChild(discardSection);
    panel.appendChild(row5);
  }
  if (sourcePanel === "enemyInventory") {
    takeButton = document.createElement("span");
    takeSection = document.createElement("td");
    takeSection.setAttribute("colspan", "4");
    takeButton.setAttribute("class", "itemPanelButton");
    takeSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    takeButton.onclick = (function () {
      return function () {
        Game.takeWeapon();
      };
    }());
    takeButton.innerHTML = "装备这个武器";
    takeSection.appendChild(takeButton);
    row5.appendChild(takeSection);
    panel.appendChild(row5);
  }
  if (sourcePanel === "shop") {
    buyButton = document.createElement("span");
    buySection = document.createElement("td");
    buySection.setAttribute("colspan", "4");
    buyButton.setAttribute("class", "itemPanelButton");
    buySection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    buyButton.onclick = (function (a) {
      return function () {
        Game.buyWeapon(a);
      };
    }(itemSlot));
    cost = 2 * Game.calculateItemLevelPrice(weapon[1], weapon[7]);
    buyButton.innerHTML = "购买这个武器消耗 " + cost + " 种子";
    buySection.appendChild(buyButton);
    row5.appendChild(buySection);
    panel.appendChild(row5);
  }
  if (sourcePanel === "forge") {
    levelButton = document.createElement("span");
    levelSection = document.createElement("td");
    levelSection.setAttribute("colspan", "2");
    levelButton.setAttribute("class", "itemPanelButton");
    levelSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    levelButton.onclick = (function (a) {
      return function () {
        Game.buyWeaponLevelUpgrade();
      };
    }());
    levelButton.innerHTML = "提升武器等级需要 " + Game.calculateItemLevelPrice(weapon[1], weapon[7]) + " 种子";
    levelSection.appendChild(levelButton);
    qualityButton = document.createElement("span");
    qualitySection = document.createElement("td");
    qualitySection.setAttribute("colspan", "2");
    qualityButton.setAttribute("class", "itemPanelButton");
    qualitySection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0; width:50% !important");
    qualityButton.onclick = (function (a) {
      return function () {
        Game.buyWeaponQualityUpgrade();
      };
    }());
    qualityButton.innerHTML = (weapon[7] === Game.QUALITY_AMAZING ? "不能提高武器等阶" : "提高武器等阶需要 " + Game.calculateItemQualityPrice(weapon[7]) + " 碎片");
    qualitySection.appendChild(qualityButton);
    row5.appendChild(levelSection);
    row5.appendChild(qualitySection);
    panel.appendChild(row5);
  }
  return panel;
};

Game.createArmourUIPanel = function (armour, sourcePanel, itemSlot) {
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
  iLvlSection.innerHTML = "等级 " + armour[1];
  row1.appendChild(nameSection);
  row1.appendChild(iLvlSection);
  panel.appendChild(row1);
  var effect1Section = document.createElement("td");
  var armourDesc = [];
  for (var x = 0; x < armour[4].length; x++) {
    armourDesc.push(armour[4][x].slice());
  }
  for (var y = 0; y < armour[5].length; y++) {
    armourDesc.push(armour[5][y].slice());
  }
  effect1Section.setAttribute("colspan", "3");
  effect1Section.appendChild(Game.buildArmourEffectString(armourDesc[0]));
  var duraSection = document.createElement("td");
  duraSection.setAttribute("style", "text-align:right");
  if (arraysEqual(armour, Game.p_Armour)) {
    duraSection.id = "combat_playerArmourDurability";
  }
  duraSection.innerHTML += armour[3] + " 耐久";
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
  if (sourcePanel == "player") {
    var repairButton = document.createElement("span");
    repairButton.setAttribute("class", "itemPanelButton");
    repairSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    repairButton.onclick = function () {
      return function () {
        Game.startRepair();
      };
    }();
    repairButton.innerHTML = "修理";
    repairSection.appendChild(repairButton);
    row4.appendChild(repairSection);
  }
  panel.appendChild(row4);
  if (sourcePanel == "inventory") {
    var equipSection = document.createElement("td");
    var sellSection = document.createElement("td");
    var scrapSection = document.createElement("td");
    var discardSection = document.createElement("td");
    var equipButton = document.createElement("span");
    equipButton.setAttribute("class", "itemPanelButton");
    equipSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    equipButton.onclick = function (a) {
      return function () {
        Game.equipArmour(a);
      };
    }(itemSlot);
    equipButton.innerHTML = "装备";
    equipSection.appendChild(equipButton);
    row5.appendChild(equipSection);
    var sellButton = document.createElement("span");
    sellButton.setAttribute("class", "itemPanelButton");
    sellSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    sellButton.onclick = function (a, b) {
      return function () {
        Game.sellArmour(a, b);
      };
    }(itemSlot, true);
    sellButton.innerHTML = "出售";
    sellSection.appendChild(sellButton);
    row5.appendChild(sellSection);
    var scrapButton = document.createElement("span");
    scrapButton.setAttribute("class", "itemPanelButton");
    scrapSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    scrapButton.onclick = function (a, b) {
      return function () {
        Game.scrapArmour(a, b);
      };
    }(itemSlot, true);
    scrapButton.innerHTML = "分解";
    scrapSection.appendChild(scrapButton);
    row5.appendChild(scrapSection);
    var discardButton = document.createElement("span");
    discardButton.setAttribute("class", "itemPanelButton");
    discardSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    discardButton.onclick = function (a) {
      return function () {
        Game.discardArmour(a);
      };
    }(itemSlot);
    discardButton.innerHTML = "丢弃";
    discardSection.appendChild(discardButton);
    row5.appendChild(discardSection);
    panel.appendChild(row5);
  }
  if (sourcePanel == "enemyInventory") {
    var takeButton = document.createElement("span");
    var takeSection = document.createElement("td");
    takeSection.setAttribute("colspan", "4");
    takeButton.setAttribute("class", "itemPanelButton");
    takeSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    takeButton.onclick = function () {
      return function () {
        Game.takeArmour();
      };
    }();
    takeButton.innerHTML = "装备这个盔甲";
    takeSection.appendChild(takeButton);
    row5.appendChild(takeSection);
    panel.appendChild(row5);
  }
  if (sourcePanel == "shop") {
    var buyButton = document.createElement("span");
    var buySection = document.createElement("td");
    buySection.setAttribute("colspan", "4");
    buyButton.setAttribute("class", "itemPanelButton");
    buySection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    var cost = 2 * Game.calculateItemLevelPrice(armour[1], armour[2]);
    buyButton.onclick = function (a) {
      return function () {
        Game.buyArmour(a);
      };
    }(itemSlot);
    buyButton.innerHTML = "买这个盔甲需要 " + cost + " 种子";
    buySection.appendChild(buyButton);
    row5.appendChild(buySection);
    panel.appendChild(row5);
  }
  if (sourcePanel == "forge") {
    var levelButton = document.createElement("span");
    var levelSection = document.createElement("td");
    levelSection.setAttribute("colspan", "2");
    levelButton.setAttribute("class", "itemPanelButton");
    levelSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    levelButton.onclick = function (a) {
      return function () {
        Game.buyArmourLevelUpgrade();
      };
    }();
    levelButton.innerHTML = "提升护甲等级需要 " + Game.calculateItemLevelPrice(armour[1], armour[2]) + " 种子";
    levelSection.appendChild(levelButton);
    var qualityButton = document.createElement("span");
    var qualitySection = document.createElement("td");
    qualitySection.setAttribute("colspan", "2");
    qualityButton.setAttribute("class", "itemPanelButton");
    qualitySection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0; width:50% !important");
    qualityButton.onclick = function (a) {
      return function () {
        Game.buyArmourQualityUpgrade();
      };
    }();
    qualityButton.innerHTML = (armour[2] == Game.QUALITY_AMAZING ? "不能提高装甲品阶。" : "提高装备品阶需要 " + Game.calculateItemQualityPrice(armour[2]) + " 碎片");
    qualitySection.appendChild(qualityButton);
    row5.appendChild(levelSection);
    row5.appendChild(qualitySection);
    panel.appendChild(row5);
  }
  return panel;
}
Game.createPowerUIPanel = function (powerID, rootID, currentLevel, selectable, buyable) {
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
  if (!selectable || (Game.p_SkillPoints === 0 && Game.powerLevel(powerID) === 0)) {
    panel.setAttribute("style", "opacity:0.4;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';");
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
  if (typeof rootID !== undefined && rootID >= 0) {
    var branchSection = document.createElement("td");
    branchSection.setAttribute("colspan", "4");
    branchSection.innerHTML = "<span style='font-style:italic'> - 需要： " + Game.getPowerName(rootID) + "</span>";
    row2.appendChild(branchSection);
    panel.appendChild(row2);
  }
  var effectSection = document.createElement("td");
  effectSection.setAttribute("colspan", "4");
  effectSection.innerHTML = Game.getPowerDesc(powerID);
  row3.appendChild(effectSection);
  panel.appendChild(row3);
  if (currentLevel < Game.getPowerLevelCap(powerID) && selectable && Game.p_SkillPoints > 0 && buyable) {
    var upgradeButton = document.createElement("span");
    var upgradeSection = document.createElement("td");
    upgradeSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    upgradeSection.setAttribute("colspan", "4");
    upgradeButton.setAttribute("class", "itemPanelButton");
    upgradeButton.onclick = function (a) {
      return function () {
        Game.buyPower(a);
      };
    }(powerID);
    upgradeButton.innerHTML = "升级技能";
    upgradeSection.appendChild(upgradeButton);
    row4.appendChild(upgradeSection);
    panel.appendChild(row4);
  }
  return panel;
}
Game.createPlayerCombatPanel = function () {
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
  HPSection.innerHTML = "HP: " + prettifyNumber(Game.p_HP) + " / " + prettifyNumber(Game.p_MaxHP) + " (" + Math.floor(Game.p_HP / Game.p_MaxHP * 10000) / 100 + "%)";
  row2.appendChild(HPSection);
  panel.appendChild(row2);
  if (Game.p_Debuff.length > 0) {
    var debuffSection = document.createElement("td");
    debuffSection.setAttribute("colspan", "4");
    debuffSection.id = "combat_playerDebuff";
    debuffSection.innerHTML = "<strong>Debuff:</strong> " + Game.p_Debuff[1] + "(" + Game.debuff_names[Game.p_Debuff[0] - Game.DEBUFF_SHRED] + ") - " + Game.player_debuffTimer + "s";
    row3.appendChild(debuffSection);
    panel.appendChild(row3);
  }
  if (Game.p_State == Game.STATE_COMBAT) {
    var burstButton = document.createElement("span");
    var burstSection = document.createElement("td");
    burstSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    burstSection.setAttribute("colspan", "2");
    burstButton.setAttribute("class", "itemPanelButton");
    burstButton.onclick = function () {
      return function () {
        Game.burstAttack();
      };
    }();
    burstButton.id = "combat_burstButton";
    burstButton.innerHTML = Game.p_specUsed ? "突发不可用" : (Game.powerLevel(Game.SKILL_WILD_SWINGS) > 0 ? "剧烈波动" : "突发攻击");
    burstSection.appendChild(burstButton);
    row4.appendChild(burstSection);
    var fleeButton = document.createElement("span");
    var fleeSection = document.createElement("td");
    fleeSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    fleeSection.setAttribute("colspan", "2");
    fleeButton.setAttribute("class", "itemPanelButton");
    fleeButton.onclick = function () {
      return function () {
        Game.fleeCombat();
      };
    }();
    fleeButton.innerHTML = "逃离战斗";
    fleeSection.appendChild(fleeButton);
    row4.appendChild(fleeSection);
    panel.appendChild(row4);
  } else {
    var killButton = document.createElement("span");
    var killSection = document.createElement("td");
    killSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
    killSection.setAttribute("colspan", "4");
    killButton.setAttribute("class", "itemPanelButton");
    killButton.onclick = function (x) {
      return function () {
        Game.startCombat(x);
      };
    }(true);
    killButton.innerHTML = "寻找可以杀死的东西";
    killSection.appendChild(killButton);
    row4.appendChild(killSection);
    panel.appendChild(row4);
    if (Game.p_Level >= Game.ZONE_MAX_LEVEL[Game.p_currentZone]) {
      var bossButton = document.createElement("span");
      var bossSection = document.createElement("td");
      bossSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
      bossSection.setAttribute("colspan", "4");
      bossButton.setAttribute("class", "itemPanelButton");
      bossButton.onclick = function (x, y) {
        return function () {
          Game.startCombat(x, y);
        };
      }(true, true);
      bossButton.innerHTML = "进入Boss的巢穴";
      bossSection.appendChild(bossButton);
      row5.appendChild(bossSection);
      panel.appendChild(row5);
    }
  }
  return panel;
}
Game.createEnemyCombatPanel = function () {
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
  nameSection.innerHTML = Game.p_State == Game.STATE_COMBAT ? Game.e_Name : "附近没有敌人";
  var levelSection = document.createElement("td");
  levelSection.setAttribute("style", "text-align:right;");
  levelSection.innerHTML = Game.p_State == Game.STATE_COMBAT ? "等级 " + Game.e_Level : "&nbsp;";
  row1.appendChild(nameSection);
  row1.appendChild(levelSection);
  panel.appendChild(row1);
  var HPSection = document.createElement("td");
  HPSection.setAttribute("colspan", "4");
  HPSection.id = "combat_enemyHealth";
  HPSection.innerHTML = Game.p_State == Game.STATE_COMBAT ? ("血量: " + prettifyNumber(Game.e_HP) + " / " + prettifyNumber(Game.e_MaxHP) + " (" + Math.floor(Game.e_HP / Game.e_MaxHP * 10000) / 100 + "%)") : "精英出现的机会: " + Game.bossChance + "%";
  row2.appendChild(HPSection);
  panel.appendChild(row2);
  if (Game.e_Debuff.length > 0) {
    var debuffSection = document.createElement("td");
    debuffSection.setAttribute("colspan", "4");
    debuffSection.id = "combat_enemyDebuff";
    debuffSection.innerHTML = "<strong>减益效果:</strong> " + Game.e_Debuff[1] + "(" + Game.debuff_names[Game.e_Debuff[0] - Game.DEBUFF_SHRED] + ") - " + Game.enemy_debuffTimer + "s";
    row3.appendChild(debuffSection);
    panel.appendChild(row3);
  }
  return panel;
}
Game.createStatisticPanel = function (name, value, valueID) {
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
  valSection.id = valueID;
  row1.appendChild(nameSection);
  row1.appendChild(valSection);
  panel.appendChild(row1);
  return panel;
}
Game.createZonePanel = function (zoneID, active) {
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
  if (active) {
    panel.setAttribute("style", "width: 600px !important;");
  }
  var row1 = document.createElement("tr");
  var row2 = document.createElement("tr");
  var row3 = document.createElement("tr");
  var nameSection = document.createElement("td");
  nameSection.setAttribute("style", "font-size:18px;font-weight:bold;width:75% !important");
  nameSection.innerHTML = (Game.p_maxZone + 1) >= zoneID ? Game.ZONE_NAMES[zoneID] : "???";
  row1.appendChild(nameSection);
  var levelSection = document.createElement("td");
  levelSection.setAttribute("style", "text-align:right;width:25% !important");
  levelSection.innerHTML = "(" + Game.ZONE_MIN_LEVEL[zoneID] + " - " + Game.ZONE_MAX_LEVEL[zoneID] + ")";
  row1.appendChild(levelSection);
  panel.appendChild(row1);
  if (active) {
    var descSection = document.createElement("td");
    descSection.setAttribute("colspan", 2);
    descSection.innerHTML = Game.p_maxZone >= zoneID ? Game.ZONE_DESCRIPTIONS[zoneID] : "???";
    row2.appendChild(descSection);
    panel.appendChild(row2);
  }
  if (Game.p_currentZone !== zoneID && Game.p_maxZone >= zoneID) {
    var moveSection = document.createElement("td");
    var moveButton = document.createElement("span");
    moveSection.setAttribute("colspan", 2);
    moveSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;");
    moveButton.setAttribute("class", "itemPanelButton");
    moveButton.onclick = function (a) {
      return function () {
        Game.changeZone(a);
      };
    }(zoneID);
    moveButton.innerHTML = "移动到这个区域";
    moveSection.appendChild(moveButton);
    row3.appendChild(moveSection);
    panel.appendChild(row3);
  }
  return panel;
}
Game.createForgePanel = function (debuffID) {
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
  nameSection.setAttribute("colspan", 2)
  nameSection.innerHTML = (debuffID < Game.DEBUFF_SHRED) ? "随机" : Game.debuff_names[debuffID - Game.DEBUFF_SHRED];
  row1.appendChild(nameSection);
  panel.appendChild(row1);
  var descSection = document.createElement("td");
  descSection.setAttribute("colspan", 2);
  descSection.innerHTML = (debuffID < Game.DEBUFF_SHRED) ? "从列出的其他负面状态中随机选择一个。" : Game.debuff_descriptions[debuffID - Game.DEBUFF_SHRED];
  row2.appendChild(descSection);
  panel.appendChild(row2);
  if (debuffID == Game.DEBUFF_MC) {
    var cheapSection = document.createElement("td");
    var cheapButton = document.createElement("span");
    cheapSection.setAttribute("colspan", 2);
    cheapSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
    cheapButton.setAttribute("class", "itemPanelButton");
    cheapButton.onclick = function (a, b) {
      return function () {
        Game.reforgeWeapon(a, b);
      };
    }(debuffID, false);
    cheapButton.innerHTML = "购买正常减益魔法 (4)";
    cheapSection.appendChild(cheapButton);
    row3.appendChild(cheapSection);
    panel.appendChild(row3);
  } else {
    var cheapSection = document.createElement("td");
    var cheapButton = document.createElement("span");
    cheapSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    cheapButton.setAttribute("class", "itemPanelButton");
    cheapButton.onclick = function (a, b) {
      return function () {
        Game.reforgeWeapon(a, b);
      };
    }(debuffID, false);
    cheapButton.innerHTML = "购买正常减益魔法 (" + (debuffID < Game.DEBUFF_SHRED ? 1 : 4) + ")";
    cheapSection.appendChild(cheapButton);
    row3.appendChild(cheapSection);
    var expensiveSection = document.createElement("td");
    var expensiveButton = document.createElement("span");
    expensiveSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:50% !important");
    expensiveButton.setAttribute("class", "itemPanelButton");
    expensiveButton.onclick = function (a, b) {
      return function () {
        Game.reforgeWeapon(a, b);
      };
    }(debuffID, true);
    expensiveButton.innerHTML = "购买高级减益魔法(" + (debuffID < Game.DEBUFF_SHRED ? 2 : 8) + ")";
    expensiveSection.appendChild(expensiveButton);
    row3.appendChild(expensiveSection);
    panel.appendChild(row3);
  }
  return panel;
}
Game.createABOptionPanel = function () {
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
  nameSection.innerHTML = "<strong>自动战斗选项</strong>";
  nameSection.setAttribute("colspan", 3);
  nameSection.setAttribute("style", "width:75% !important");
  row1.appendChild(nameSection);
  var toggleSection = document.createElement("td");
  var toggleButton = document.createElement("span");
  toggleSection.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
  toggleButton.setAttribute("class", "itemPanelButton");
  toggleButton.onclick = function () {
    return function () {
      Game.toggleAutoBattle();
      Game.drawActivePanel()
    };
  }();
  toggleButton.innerHTML = " " + (Game.autoBattle ? "关闭" : "开启");
  toggleSection.appendChild(toggleButton);
  row1.appendChild(toggleSection);
  panel.appendChild(row1);
  var row2 = document.createElement("tr");
  var percentSection = document.createElement("td");
  percentSection.setAttribute("colspan", 4);
  percentSection.setAttribute("style", "text-align:center;vertical-align:middle;text-decoration:underline;");
  percentSection.innerHTML = "逃离战斗健康百分比";
  row2.appendChild(percentSection);
  panel.appendChild(row2);
  var row3 = document.createElement("tr");
  var health5Section = document.createElement("td");
  var health5Button = document.createElement("span");
  if (Game.autoBattle_flee == 5) {
    health5Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  } else {
    health5Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  health5Button.setAttribute("class", "itemPanelButton");
  health5Button.onclick = function () {
    return function () {
      Game.autoBattle_flee = 5;
      Game.drawActivePanel();
    };
  }();
  health5Button.innerHTML = "5%";
  health5Section.appendChild(health5Button);
  row3.appendChild(health5Section);
  var health10Section = document.createElement("td");
  var health10Button = document.createElement("span");
  if (Game.autoBattle_flee == 10) {
    health10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  } else {
    health10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  health10Button.setAttribute("class", "itemPanelButton");
  health10Button.onclick = function () {
    return function () {
      Game.autoBattle_flee = 10;
      Game.drawActivePanel();
    };
  }();
  health10Button.innerHTML = "10%";
  health10Section.appendChild(health10Button);
  row3.appendChild(health10Section);
  var health15Section = document.createElement("td");
  var health15Button = document.createElement("span");
  if (Game.autoBattle_flee == 15) {
    health15Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  } else {
    health15Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  health15Button.setAttribute("class", "itemPanelButton");
  health15Button.onclick = function () {
    return function () {
      Game.autoBattle_flee = 15;
      Game.drawActivePanel();
    };
  }();
  health15Button.innerHTML = "15%";
  health15Section.appendChild(health15Button);
  row3.appendChild(health15Section);
  var health20Section = document.createElement("td");
  var health20Button = document.createElement("span");
  if (Game.autoBattle_flee == 20) {
    health20Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  } else {
    health20Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  health20Button.setAttribute("class", "itemPanelButton");
  health20Button.onclick = function () {
    return function () {
      Game.autoBattle_flee = 20;
      Game.drawActivePanel();
    };
  }();
  health20Button.innerHTML = "20%";
  health20Section.appendChild(health20Button);
  row3.appendChild(health20Section);
  panel.appendChild(row3);
  var row4 = document.createElement("tr");
  var percentSection = document.createElement("td");
  percentSection.setAttribute("colspan", 4);
  percentSection.setAttribute("style", "text-align:center;vertical-align:middle;text-decoration:underline;");
  percentSection.innerHTML = "装备耐久度修复百分比";
  row4.appendChild(percentSection);
  panel.appendChild(row4);
  var row5 = document.createElement("tr");
  var repair5Section = document.createElement("td");
  var repair5Button = document.createElement("span");
  if (Game.autoBattle_repair == 5) {
    repair5Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  } else {
    repair5Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  repair5Button.setAttribute("class", "itemPanelButton");
  repair5Button.onclick = function () {
    return function () {
      Game.autoBattle_repair = 5;
      Game.drawActivePanel();
    };
  }();
  repair5Button.innerHTML = "5%";
  repair5Section.appendChild(repair5Button);
  row5.appendChild(repair5Section);
  var repair10Section = document.createElement("td");
  var repair10Button = document.createElement("span");
  if (Game.autoBattle_repair == 10) {
    repair10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  } else {
    repair10Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  repair10Button.setAttribute("class", "itemPanelButton");
  repair10Button.onclick = function () {
    return function () {
      Game.autoBattle_repair = 10;
      Game.drawActivePanel();
    };
  }();
  repair10Button.innerHTML = "10%";
  repair10Section.appendChild(repair10Button);
  row5.appendChild(repair10Section);
  var repair15Section = document.createElement("td");
  var repair15Button = document.createElement("span");
  if (Game.autoBattle_repair == 15) {
    repair15Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  } else {
    repair15Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  repair15Button.setAttribute("class", "itemPanelButton");
  repair15Button.onclick = function () {
    return function () {
      Game.autoBattle_repair = 15;
      Game.drawActivePanel();
    };
  }();
  repair15Button.innerHTML = "15%";
  repair15Section.appendChild(repair15Button);
  row5.appendChild(repair15Section);
  var repair20Section = document.createElement("td");
  var repair20Button = document.createElement("span");
  if (Game.autoBattle_repair == 20) {
    repair20Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:25% !important");
  } else {
    repair20Section.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:25% !important");
  }
  repair20Button.setAttribute("class", "itemPanelButton");
  repair20Button.onclick = function () {
    return function () {
      Game.autoBattle_repair = 20;
      Game.drawActivePanel();
    };
  }();
  repair20Button.innerHTML = "20%";
  repair20Section.appendChild(repair20Button);
  row5.appendChild(repair20Section);
  panel.appendChild(row5);
  return panel;
}
Game.createASOptionPanel = function () {
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
  nameSection.innerHTML = "<strong>自动卖出选项</strong>";
  nameSection.setAttribute("colspan", 4);
  nameSection.setAttribute("style", "width:100% !important");
  row1.appendChild(nameSection);
  panel.appendChild(row1);
  // Poor Items
  var row2 = document.createElement("tr");
  var poorSection = document.createElement("td");
  poorSection.innerHTML = "<span class='q221'>粗糙的装备</span>";
  poorSection.setAttribute("style", "width:40% !important");
  row2.appendChild(poorSection);
  var poorScrap = document.createElement("td");
  var poorScrapButton = document.createElement("span");
  if (Game.autoSell_options[0] == "SCRAP") {
    poorScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    poorScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  poorScrapButton.setAttribute("class", "itemPanelButton");
  poorScrapButton.onclick = function () {
    return function () {
      Game.autoSell_options[0] = "SCRAP";
      Game.drawActivePanel();
    };
  }();
  poorScrapButton.innerHTML = "分解";
  poorScrap.appendChild(poorScrapButton);
  row2.appendChild(poorScrap);
  var poorSell = document.createElement("td");
  var poorSellButton = document.createElement("span");
  if (Game.autoSell_options[0] == "SELL") {
    poorSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    poorSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  poorSellButton.setAttribute("class", "itemPanelButton");
  poorSellButton.onclick = function () {
    return function () {
      Game.autoSell_options[0] = "SELL";
      Game.drawActivePanel();
    };
  }();
  poorSellButton.innerHTML = "出售";
  poorSell.appendChild(poorSellButton);
  row2.appendChild(poorSell);
  var poorIgnore = document.createElement("td");
  var poorIgnoreButton = document.createElement("span");
  if (Game.autoSell_options[0] == "IGNORE") {
    poorIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    poorIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  poorIgnoreButton.setAttribute("class", "itemPanelButton");
  poorIgnoreButton.onclick = function () {
    return function () {
      Game.autoSell_options[0] = "IGNORE";
      Game.drawActivePanel();
    };
  }();
  poorIgnoreButton.innerHTML = "忽略";
  poorIgnore.appendChild(poorIgnoreButton);
  row2.appendChild(poorIgnore);
  panel.appendChild(row2);
  // Normal Items
  var row3 = document.createElement("tr");
  var normalSection = document.createElement("td");
  normalSection.innerHTML = "<span class='q222'>普通装备</span>";
  normalSection.setAttribute("style", "width:40% !important");
  row3.appendChild(normalSection);
  var normalScrap = document.createElement("td");
  var normalScrapButton = document.createElement("span");
  if (Game.autoSell_options[1] == "SCRAP") {
    normalScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    normalScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  normalScrapButton.setAttribute("class", "itemPanelButton");
  normalScrapButton.onclick = function () {
    return function () {
      Game.autoSell_options[1] = "SCRAP";
      Game.drawActivePanel();
    };
  }();
  normalScrapButton.innerHTML = "分解";
  normalScrap.appendChild(normalScrapButton);
  row3.appendChild(normalScrap);
  var normalSell = document.createElement("td");
  var normalSellButton = document.createElement("span");
  if (Game.autoSell_options[1] == "SELL") {
    normalSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    normalSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  normalSellButton.setAttribute("class", "itemPanelButton");
  normalSellButton.onclick = function () {
    return function () {
      Game.autoSell_options[1] = "SELL";
      Game.drawActivePanel();
    };
  }();
  normalSellButton.innerHTML = "出售";
  normalSell.appendChild(normalSellButton);
  row3.appendChild(normalSell);
  var normalIgnore = document.createElement("td");
  var normalIgnoreButton = document.createElement("span");
  if (Game.autoSell_options[1] == "IGNORE") {
    normalIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    normalIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  normalIgnoreButton.setAttribute("class", "itemPanelButton");
  normalIgnoreButton.onclick = function () {
    return function () {
      Game.autoSell_options[1] = "IGNORE";
      Game.drawActivePanel();
    };
  }();
  normalIgnoreButton.innerHTML = "忽略";
  normalIgnore.appendChild(normalIgnoreButton);
  row3.appendChild(normalIgnore);
  panel.appendChild(row3);
  // Good Items
  var row4 = document.createElement("tr");
  var goodSection = document.createElement("td");
  goodSection.innerHTML = "<span class='q223'>良好准备</span>";
  goodSection.setAttribute("style", "width:40% !important");
  row4.appendChild(goodSection);
  var goodScrap = document.createElement("td");
  var goodScrapButton = document.createElement("span");
  if (Game.autoSell_options[2] == "SCRAP") {
    goodScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    goodScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  goodScrapButton.setAttribute("class", "itemPanelButton");
  goodScrapButton.onclick = function () {
    return function () {
      Game.autoSell_options[2] = "SCRAP";
      Game.drawActivePanel();
    };
  }();
  goodScrapButton.innerHTML = "分解";
  goodScrap.appendChild(goodScrapButton);
  row4.appendChild(goodScrap);
  var goodSell = document.createElement("td");
  var goodSellButton = document.createElement("span");
  if (Game.autoSell_options[2] == "SELL") {
    goodSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    goodSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  goodSellButton.setAttribute("class", "itemPanelButton");
  goodSellButton.onclick = function () {
    return function () {
      Game.autoSell_options[2] = "SELL";
      Game.drawActivePanel();
    };
  }();
  goodSellButton.innerHTML = "出售";
  goodSell.appendChild(goodSellButton);
  row4.appendChild(goodSell);
  var goodIgnore = document.createElement("td");
  var goodIgnoreButton = document.createElement("span");
  if (Game.autoSell_options[2] == "IGNORE") {
    goodIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    goodIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  goodIgnoreButton.setAttribute("class", "itemPanelButton");
  goodIgnoreButton.onclick = function () {
    return function () {
      Game.autoSell_options[2] = "IGNORE";
      Game.drawActivePanel();
    };
  }();
  goodIgnoreButton.innerHTML = "忽略";
  goodIgnore.appendChild(goodIgnoreButton);
  row4.appendChild(goodIgnore);
  panel.appendChild(row4);
  // Great Items
  var row5 = document.createElement("tr");
  var greatSection = document.createElement("td");
  greatSection.innerHTML = "<span class='q224'>优良的准备</span>";
  greatSection.setAttribute("style", "width:40% !important");
  row5.appendChild(greatSection);
  var greatScrap = document.createElement("td");
  var greatScrapButton = document.createElement("span");
  if (Game.autoSell_options[3] == "SCRAP") {
    greatScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    greatScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  greatScrapButton.setAttribute("class", "itemPanelButton");
  greatScrapButton.onclick = function () {
    return function () {
      Game.autoSell_options[3] = "SCRAP";
      Game.drawActivePanel();
    };
  }();
  greatScrapButton.innerHTML = "分解";
  greatScrap.appendChild(greatScrapButton);
  row5.appendChild(greatScrap);
  var greatSell = document.createElement("td");
  var greatSellButton = document.createElement("span");
  if (Game.autoSell_options[3] == "SELL") {
    greatSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    greatSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  greatSellButton.setAttribute("class", "itemPanelButton");
  greatSellButton.onclick = function () {
    return function () {
      Game.autoSell_options[3] = "SELL";
      Game.drawActivePanel();
    };
  }();
  greatSellButton.innerHTML = "出售";
  greatSell.appendChild(greatSellButton);
  row5.appendChild(greatSell);
  var greatIgnore = document.createElement("td");
  var greatIgnoreButton = document.createElement("span");
  if (Game.autoSell_options[3] == "IGNORE") {
    greatIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    greatIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  greatIgnoreButton.setAttribute("class", "itemPanelButton");
  greatIgnoreButton.onclick = function () {
    return function () {
      Game.autoSell_options[3] = "IGNORE";
      Game.drawActivePanel();
    };
  }();
  greatIgnoreButton.innerHTML = "忽略";
  greatIgnore.appendChild(greatIgnoreButton);
  row5.appendChild(greatIgnore);
  panel.appendChild(row5);
  // Amazing Items
  var row6 = document.createElement("tr");
  var amazingSection = document.createElement("td");
  amazingSection.innerHTML = "<span class='q225'>传奇装备</span>";
  amazingSection.setAttribute("style", "width:40% !important");
  row6.appendChild(amazingSection);
  var amazingScrap = document.createElement("td");
  var amazingScrapButton = document.createElement("span");
  if (Game.autoSell_options[4] == "SCRAP") {
    amazingScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    amazingScrap.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  amazingScrapButton.setAttribute("class", "itemPanelButton");
  amazingScrapButton.onclick = function () {
    return function () {
      Game.autoSell_options[4] = "SCRAP";
      Game.drawActivePanel();
    };
  }();
  amazingScrapButton.innerHTML = "分解";
  amazingScrap.appendChild(amazingScrapButton);
  row6.appendChild(amazingScrap);
  var amazingSell = document.createElement("td");
  var amazingSellButton = document.createElement("span");
  if (Game.autoSell_options[4] == "SELL") {
    amazingSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    amazingSell.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  amazingSellButton.setAttribute("class", "itemPanelButton");
  amazingSellButton.onclick = function () {
    return function () {
      Game.autoSell_options[4] = "SELL";
      Game.drawActivePanel();
    };
  }();
  amazingSellButton.innerHTML = "出售";
  amazingSell.appendChild(amazingSellButton);
  row6.appendChild(amazingSell);
  var amazingIgnore = document.createElement("td");
  var amazingIgnoreButton = document.createElement("span");
  if (Game.autoSell_options[4] == "IGNORE") {
    amazingIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;background-color:#003311;width:20% !important");
  } else {
    amazingIgnore.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:20% !important");
  }
  amazingIgnoreButton.setAttribute("class", "itemPanelButton");
  amazingIgnoreButton.onclick = function () {
    return function () {
      Game.autoSell_options[4] = "IGNORE";
      Game.drawActivePanel();
    };
  }();
  amazingIgnoreButton.innerHTML = "忽略";
  amazingIgnore.appendChild(amazingIgnoreButton);
  row6.appendChild(amazingIgnore);
  panel.appendChild(row6);
  return panel;
}
Game.createSavePanel = function () {
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
  saveHeader.setAttribute("colspan", 3);
  saveHeader.setAttribute("style", "width:75% !important");
  saveHeader.innerHTML = "<strong>保存游戏</strong>"
  var saveButton = document.createElement("td");
  var saveActualButton = document.createElement("span");
  saveActualButton.setAttribute("class", "itemPanelButton");
  saveButton.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
  saveActualButton.onclick = function () {
    return function () {
      Game.save(0);
    };
  }();
  saveActualButton.innerHTML = "保存";
  saveButton.appendChild(saveActualButton);
  row1.appendChild(saveHeader);
  row1.appendChild(saveButton);
  panel.appendChild(row1);
  var row2 = document.createElement("tr");
  var saveBlurb = document.createElement("td");
  saveBlurb.setAttribute("colspan", 4);
  saveBlurb.setAttribute("style", "width:100% !important");
  saveBlurb.innerHTML = "不相信自动保存功能吗?这个按钮是给你的!百分百的工作!诚实的!"
  row2.appendChild(saveBlurb);
  panel.appendChild(row2);
  var row3 = document.createElement("tr");
  var resetHeader = document.createElement("td");
  resetHeader.setAttribute("colspan", 3);
  resetHeader.setAttribute("style", "width:75% !important");
  resetHeader.innerHTML = "<strong>重置游戏</strong>"
  var resetButton = document.createElement("td");
  var resetActualButton = document.createElement("span");
  resetActualButton.setAttribute("class", "itemPanelButton");
  resetButton.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
  resetActualButton.onclick = function () {
    return function () {
      Game.reset();
    };
  }();
  resetActualButton.innerHTML = "重置";
  resetButton.appendChild(resetActualButton);
  row3.appendChild(resetHeader);
  row3.appendChild(resetButton);
  panel.appendChild(row3);
  var row4 = document.createElement("tr");
  var resetBlurb = document.createElement("td");
  resetBlurb.setAttribute("colspan", 4);
  resetBlurb.setAttribute("style", "width:100% !important");
  resetBlurb.innerHTML = "想重新开始吗?我们可以做到。按下按钮，我们就会忘记这个游戏之前发生的一切。"
  row4.appendChild(resetBlurb);
  panel.appendChild(row4);
  var row5 = document.createElement("tr");
  var prestigeHeader = document.createElement("td");
  prestigeHeader.setAttribute("colspan", 3);
  prestigeHeader.setAttribute("style", "width:75% !important");
  prestigeHeader.innerHTML = "<strong>声望(NYI)</strong>"
  var prestigeButton = document.createElement("td");
  var prestigeActualButton = document.createElement("span");
  prestigeActualButton.setAttribute("class", "itemPanelButton");
  prestigeButton.setAttribute("style", "text-align:center;vertical-align:middle;border:1px solid #b0b0b0;width:100% !important");
  prestigeActualButton.onclick = function () {
    return function () {
      Game.prestige();
    };
  }();
  prestigeActualButton.innerHTML = "声望";
  prestigeButton.appendChild(prestigeActualButton);
  row5.appendChild(prestigeHeader);
  row5.appendChild(prestigeButton);
  panel.appendChild(row5);
  var row6 = document.createElement("tr");
  var prestigeBlurb = document.createElement("td");
  prestigeBlurb.setAttribute("colspan", 4);
  prestigeBlurb.setAttribute("style", "width:100% !important");
  prestigeBlurb.innerHTML = "碰壁了吗?Boss让你失望了?使用这个方便的按钮，您可以重新开始，并使您的下一次游戏变得更快更容易！"
  row6.appendChild(prestigeBlurb);
  panel.appendChild(row6);
  return panel;
}
Game.createBadgePanel = function (index) {
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
  if (Game.playerBadges.indexOf(Game.BADGE_LIST[index][3]) < 0) {
    panel.setAttribute("style", "opacity:0.4;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';");
  }
  descSection.setAttribute("style", "width:100% !important");
  flavourSection.setAttribute("style", "width:100% !important;font-style:italic;");
  return panel;
}

document.getElementById("loadedUIPanels").style.display = "";