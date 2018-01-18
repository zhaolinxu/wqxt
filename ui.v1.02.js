/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";
/*---------------------------------
ui.js

Functions for updating various UI
tabs and panels.
----------------------------------*/

Game.drawActivePanel = function () {
  Game.updateTitleBar();
  switch (Game.activePanel) {
  case "playerTable":
    Game.createPlayerTab();
    break;
  case "combatTable":
    Game.createCombatTab();
    break;
  case "zoneTable":
    Game.createZoneTab();
    break;
  case "skillsTable":
    Game.createSkillsTab();
    break;
  case "inventoryTable":
    Game.createInventoryTab();
    break;
  case "storeTable":
    Game.createForgeTab();
    Game.createShopTab();
    break;
  case "optionsTable":
    Game.createOptionsTab();
    break;
  case "badgeTable":
    Game.createBadgeTab();
    break;
  }
  Game.hideLockedFeatures();
};

Game.updateTitleBar = function () {
  var seeds = {}, scrap = {}, headerSPOut = {}, headerStatOut = {},
    combatIndicator = {}, inventoryIndicator = {}, playerName = {}, enemyName = {}, noEnemy = {},
    playerCurrentHP = {}, playerMaxHP = {}, playerPercentHP = {},
    playerCurrentXP = {}, playerMaxXP = {}, playerPercentXP = {},
    PHB = {}, PHBText = {}, PH_Percent = 0, EHB = {}, EHBText = {}, EH_Percent = {}, Prefix = {};
  seeds = document.getElementById("seedsOut");
  seeds.innerHTML = abbreviateNumber(Game.p_Currency);
  seeds.setAttribute("title", Game.p_Currency);
  scrap = document.getElementById("scrapOut");
  scrap.innerHTML = abbreviateNumber(Game.p_Scrap);
  scrap.setAttribute("title", Game.p_Scrap);
  // Available Skill Points on bar
  headerSPOut = document.getElementById("header_skillPoints");
  if (Game.p_SkillPoints > 0) {
    if (Game.p_SkillPoints > 100) {
      headerSPOut.innerHTML = "&nbsp;" + "!" + "&nbsp;";
    } else {
      headerSPOut.innerHTML = "&nbsp;" + Game.p_SkillPoints + "&nbsp;";
    }
  } else {
    headerSPOut.innerHTML = "";
    headerSPOut.classList.remove("indicator");
  }
  // Available Stat Points on bar
  headerStatOut = document.getElementById("header_statPoints");
  if (Game.p_StatPoints > 0) {
    if (Game.p_StatPoints > 100) {
      headerStatOut.innerHTML = "&nbsp;" + "!" + "&nbsp;";
    } else {
      headerStatOut.innerHTML = "&nbsp;" + Game.p_StatPoints + "&nbsp;";
    }
    headerStatOut.classList.add("indicator");
  } else {
    headerStatOut.innerHTML = "";
    headerStatOut.classList.remove("indicator");
  }
  // Combat indicator
  combatIndicator = document.getElementById("header_combatState");
  if (Game.p_State === Game.STATE_COMBAT) {
    combatIndicator.innerHTML = "&nbsp;" + "!" + "&nbsp;";
    combatIndicator.classList.add("indicator");
  } else {
    combatIndicator.innerHTML = "";
    combatIndicator.classList.remove("indicator");
  }
  // Inventory cap
  inventoryIndicator = document.getElementById("header_inventoryState");
  if (Game.p_WeaponInventory.length === Game.MAX_INVENTORY || Game.p_ArmourInventory.length === Game.MAX_INVENTORY) {
    inventoryIndicator.innerHTML = "&nbsp;" + "!" + "&nbsp;";
    inventoryIndicator.classList.add("indicator");
  } else {
    inventoryIndicator.innerHTML = "";
    inventoryIndicator.classList.remove("indicator");
  }
  // Player's Name
  playerName = document.getElementById("playerNameOut");
  playerName.innerHTML = Game.p_Name + " (Lv. " + Game.p_Level + ")";
  // Enemy Name (if applicable)
  enemyName = document.getElementById("enemyNameOut");
  noEnemy = document.getElementById("noEnemyOut");
  enemyName.innerHTML = Game.p_State === Game.STATE_COMBAT ? "(Lv. " + Game.e_Level + ") " + Game.e_Name : "";
  if (Game.p_State !== Game.STATE_COMBAT) {
    enemyName.classList.add("hiddenElement");
    noEnemy.classList.remove("hiddenElement");
  } else {
    enemyName.classList.remove("hiddenElement");
    noEnemy.classList.add("hiddenElement");
  }
  // Player's Health
  playerCurrentHP = document.getElementById("player_currentHPOut");
  playerCurrentHP.innerHTML = prettifyNumber(Game.p_HP);
  playerMaxHP = document.getElementById("player_maxHPOut");
  playerMaxHP.innerHTML = prettifyNumber(Game.p_MaxHP);
  playerPercentHP = document.getElementById("player_percentHPOut");
  playerPercentHP.innerHTML = Math.floor(Game.p_HP / Game.p_MaxHP * 10000) / 100 + "%";
  // Player's Experience
  if (Game.p_State !== Game.STATE_COMBAT) {
    playerCurrentXP = document.getElementById("player_currentXPOut");
    playerCurrentXP.innerHTML = prettifyNumber(Game.p_EXP);
    playerMaxXP = document.getElementById("player_maxXPOut");
    playerMaxXP.innerHTML = prettifyNumber(Game.p_NextEXP);
    playerPercentXP = document.getElementById("player_percentXPOut");
    playerPercentXP.innerHTML = Math.floor(Game.p_EXP / Game.p_NextEXP * 10000) / 100 + "%";
  } else {
    playerCurrentXP = document.getElementById("player_currentXPOut");
    playerCurrentXP.innerHTML = prettifyNumber(Game.e_HP);
    playerMaxXP = document.getElementById("player_maxXPOut");
    playerMaxXP.innerHTML = prettifyNumber(Game.e_MaxHP);
    playerPercentXP = document.getElementById("player_percentXPOut");
    playerPercentXP.innerHTML = Math.floor(Game.e_HP / Game.e_MaxHP * 10000) / 100 + "%";
  }
  // Bars
  PHB = document.getElementById("player_HPBarOut");
  PHBText = document.getElementById("player_HPBarText");
  PH_Percent = Game.p_HP / Game.p_MaxHP;
  if (PH_Percent < 0.25) {
    PHB.style.background = "#dd0000";
  } else if (PH_Percent < 0.5) {
    PHB.style.background = "#dd7700";
  } else if (PH_Percent < 0.75) {
    PHB.style.background = "#aaaa00";
    //PHBText.classList.add("forceBlackText");
  } else {
    PHB.style.background = "#228822";
  }
  PHB.style.width = (100 * PH_Percent) + "%";
  PHB.style.MozTransition = "width 0.5s";
  PHB.style.WebkitTransition = "width 0.5s";

  EHB = document.getElementById("player_XPBarOut");
  EHBText = document.getElementById("player_XPBarText");
  Prefix = document.getElementById("player_currentXPPrefix");
  if (Game.p_State !== Game.STATE_COMBAT) {
    Prefix.innerHTML = "EXP:";
    EHB.style.display = "";
    EH_Percent = Game.p_EXP / Game.p_NextEXP;
    EHB.style.background = "#0099ff";
    EHB.style.width = (100 * EH_Percent) + "%";
    EHB.style.MozTransition = "width 0.5s";
    EHB.style.WebkitTransition = "width 0.5s";
  } else {
    Prefix.innerHTML = "Enemy HP:";
    EHB.style.display = "";
    EH_Percent = Game.e_HP / Game.e_MaxHP;
    if (EH_Percent < 0.25) {
      EHB.style.background = "#dd0000";
    } else if (EH_Percent < 0.5) {
      EHB.style.background = "#dd7700";
    } else if (EH_Percent < 0.75) {
      EHB.style.background = "#aaaa00";
    } else {
      EHB.style.background = "#228822";
    }
    EHB.style.width = (100 * EH_Percent) + "%";
    EHB.style.MozTransition = "width 0.5s";
    EHB.style.WebkitTransition = "width 0.5s";
  }
};

Game.createPlayerTab = function () {
  var playerEQPanel = {}, statPanel = {}, statAdd = [];
  updateElementIDContent("player_statPointHeaderOut", Game.p_StatPoints);
  updateElementIDContent("player_strPointsBase", Game.p_Str - Game.POINTS_STR_CURRENT);
  updateElementIDContent("player_strPointsAssigned", "+" + Game.POINTS_STR_CURRENT);
  updateElementIDContent("player_statPointBlockChance", Math.floor(statValue(Game.p_Str) * 100) / 100);
  
  updateElementIDContent("player_dexPointsBase", Game.p_Dex - Game.POINTS_DEX_CURRENT);
  updateElementIDContent("player_dexPointsAssigned", "+" + Game.POINTS_DEX_CURRENT);
  updateElementIDContent("player_statPointCritChance", Math.floor(statValue(Game.p_Dex) * 100) / 100);
  
  updateElementIDContent("player_intPointsBase", Game.p_Int - Game.POINTS_INT_CURRENT);
  updateElementIDContent("player_intPointsAssigned", "+" + Game.POINTS_INT_CURRENT);
  updateElementIDContent("player_statPointDodgeChance", Math.floor(statValue(Game.p_Int) * 50) / 100);
  
  updateElementIDContent("player_conPointsBase", Game.p_Con - Game.POINTS_CON_CURRENT);
  updateElementIDContent("player_conPointsAssigned", "+" + Game.POINTS_CON_CURRENT);
  updateElementIDContent("player_statPointHealChance", Math.floor(statValue(Game.p_Con) * 100) / 100);
  
  statAdd = document.getElementsByClassName("statAddButtons");
  Array.prototype.filter.call(statAdd, function (e) {
    if (Game.p_StatPoints > 0) {
      e.classList.remove("hiddenElement");
    } else {
      e.classList.add("hiddenElement");
    }
  });
  
  playerEQPanel = document.getElementById("playerEquipmentPanel");
  playerEQPanel.innerHTML = "";
  playerEQPanel.appendChild(Game.createWeaponUIPanel(Game.p_Weapon, "player"));
  playerEQPanel.appendChild(Game.createArmourUIPanel(Game.p_Armour, "player"));
  
  // Offense section
  updateElementIDContent("player_statTotalDMG", prettifyNumber(Game.TRACK_TOTAL_DMG));
  updateElementIDContent("player_statAttacks", prettifyNumber(Game.TRACK_ATTACKS_OUT));
  updateElementIDContent("player_statMeleeOut", prettifyNumber(Game.TRACK_MELEE_DMG));
  updateElementIDContent("player_statRangedOut", prettifyNumber(Game.TRACK_RANGE_DMG));
  updateElementIDContent("player_statMagicOut", prettifyNumber(Game.TRACK_MAGIC_DMG));
  updateElementIDContent("player_statBiggestHitOut", prettifyNumber(Game.TRACK_MAXHIT_OUT));
  updateElementIDContent("player_statBursts", prettifyNumber(Game.TRACK_BURSTS));
  updateElementIDContent("player_statDebuffsOut", prettifyNumber(Game.TRACK_DEBUFFS_OUT));
  updateElementIDContent("player_statDoomKills", prettifyNumber(Game.TRACK_DOOM_OUT));
  updateElementIDContent("player_statSleepBreaksOut", prettifyNumber(Game.TRACK_SLEEPBREAK_OUT));
  updateElementIDContent("player_statEnemyHealthDrained", prettifyNumber(Game.TRACK_DRAIN_IN));
  updateElementIDContent("player_statDoTDamageOut", prettifyNumber(Game.TRACK_DOTS_OUT));
  updateElementIDContent("player_statConfusionOut", prettifyNumber(Game.TRACK_CHARM_OUT));
  updateElementIDContent("player_statParahaxOut", prettifyNumber(Game.TRACK_PARAHAX_OUT));
  
  // Defense section
  updateElementIDContent("player_statTotalDMGTaken", prettifyNumber(Game.TRACK_TOTAL_TAKEN));
  updateElementIDContent("player_statAttacksTaken", prettifyNumber(Game.TRACK_ATTACKS_IN));
  updateElementIDContent("player_statMeleeIn", prettifyNumber(Game.TRACK_MELEE_TAKEN));
  updateElementIDContent("player_statRangedIn", prettifyNumber(Game.TRACK_RANGE_TAKEN));
  updateElementIDContent("player_statMagicIn", prettifyNumber(Game.TRACK_MAGIC_TAKEN));
  updateElementIDContent("player_statBiggestHitIn", prettifyNumber(Game.TRACK_MAXHIT_IN));
  updateElementIDContent("player_statDebuffsIn", prettifyNumber(Game.TRACK_DEBUFFS_IN));
  updateElementIDContent("player_statDoomDeaths", prettifyNumber(Game.TRACK_DOOM_IN));
  updateElementIDContent("player_statSleepBreaksIn", prettifyNumber(Game.TRACK_SLEEPBREAK_IN));
  updateElementIDContent("player_statPlayerHealthDrained", prettifyNumber(Game.TRACK_DRAIN_OUT));
  updateElementIDContent("player_statDoTDamageIn", prettifyNumber(Game.TRACK_DOTS_IN));
  updateElementIDContent("player_statConfusionIn", prettifyNumber(Game.TRACK_CHARM_IN));
  updateElementIDContent("player_statParahaxIn", prettifyNumber(Game.TRACK_PARAHAX_IN));
  
  // Statistics outputs. There's going to be a LOT of these.
  statPanel = document.getElementById("statsOut");
  statPanel.innerHTML = "";
  statPanel.appendChild(Game.createStatisticPanel("Battles Won", Game.TRACK_WINS, "player_stat11"));
  statPanel.appendChild(Game.createStatisticPanel("Battles Lost", Game.TRACK_LOSSES, "player_stat12"));
  statPanel.appendChild(Game.createStatisticPanel("Battles Fled", Game.TRACK_ESCAPES, "player_stat13"));
  statPanel.appendChild(Game.createStatisticPanel("Current Win Streak", Game.TRACK_WIN_STREAK, "player_stat14"));
  statPanel.appendChild(Game.createStatisticPanel("Elites / Bosses Defeated", Game.TRACK_BOSS_KILLS, "player_stat16"));
  statPanel.appendChild(Game.createStatisticPanel("Highest Elite Chance", Game.TRACK_BOSS_CHANCE + "%", "player_stat17"));
  statPanel.appendChild(Game.createStatisticPanel("Total Experience Gained", Game.TRACK_XP_GAINED, "player_stat20"));
  statPanel.appendChild(Game.createStatisticPanel("Experience Lost", Game.TRACK_XP_LOST, "player_stat21"));
  statPanel.appendChild(Game.createStatisticPanel("Experience Overflow Pool", Game.TRACK_XP_OVERFLOW, "player_stat22"));
  statPanel.appendChild(Game.createStatisticPanel("Item Upgrades Bought", Game.TRACK_UPGRADES, "player_stat23"));
  statPanel.appendChild(Game.createStatisticPanel("Reforges Bought", Game.TRACK_REFORGES, "player_stat24"));
  statPanel.appendChild(Game.createStatisticPanel("Skill/Stat Point Resets", Game.TRACK_RESETS, "player_stat25"));
  statPanel.appendChild(Game.createStatisticPanel("Items Sold", Game.TRACK_ITEM_SALES, "player_stat26"));
  statPanel.appendChild(Game.createStatisticPanel("Items Scrapped", Game.TRACK_ITEM_SCRAPS, "player_stat27"));
  statPanel.appendChild(Game.createStatisticPanel("Items Discarded", Game.TRACK_ITEM_DISCARDS, "player_stat28"));
  statPanel.appendChild(Game.createStatisticPanel("Items Broken in Combat", Game.TRACK_BROKEN_ITEMS, "player_stat29"));
  statPanel.appendChild(Game.createStatisticPanel("Seeds Gained from Combat", Game.TRACK_COMBAT_SEEDS, "player_stat30"));
  statPanel.appendChild(Game.createStatisticPanel("Seeds Gained from Sales", Game.TRACK_SALE_SEEDS, "player_stat31"));
  statPanel.appendChild(Game.createStatisticPanel("Scrap Gained from Combat", Game.TRACK_COMBAT_SCRAP, "player_stat32"));
  statPanel.appendChild(Game.createStatisticPanel("Scrap Gained from Conversion", Game.TRACK_CONVERT_SCRAP, "player_stat33"));
  statPanel.appendChild(Game.createStatisticPanel("Potions Used", Game.TRACK_POTIONS_USED, "player_stat48"));
  statPanel.appendChild(Game.createStatisticPanel("Badges Earned", Game.playerBadges.length, "player_stat49"));
  statPanel.appendChild(Game.createStatisticPanel("Prestige Level", Game.prestigeLevel, "player_stat50"));
};

Game.createCombatTab = function () {
  var playerCombatPanel, enemyCombatPanel,
    playerCombatWeaponPanel, playerCombatArmourPanel,
    enemyCombatWeaponPanel, enemyCombatArmourPanel;
  playerCombatPanel = document.getElementById("playerCombatPanel");
  playerCombatPanel.innerHTML = "";
  playerCombatPanel.appendChild(Game.createPlayerCombatPanel());
  enemyCombatPanel = document.getElementById("enemyCombatPanel");
  enemyCombatPanel.innerHTML = "";
  enemyCombatPanel.appendChild(Game.createEnemyCombatPanel());
  playerCombatWeaponPanel = document.getElementById("playerCombatWeaponPanel");
  playerCombatWeaponPanel.innerHTML = "";
  playerCombatWeaponPanel.appendChild(Game.createWeaponUIPanel(Game.p_Weapon, "combat"));
  playerCombatArmourPanel = document.getElementById("playerCombatArmourPanel");
  playerCombatArmourPanel.innerHTML = "";
  playerCombatArmourPanel.appendChild(Game.createArmourUIPanel(Game.p_Armour, "combat"));
  enemyCombatWeaponPanel = document.getElementById("enemyCombatWeaponPanel");
  enemyCombatArmourPanel = document.getElementById("enemyCombatArmourPanel");
  if (Game.p_State === Game.STATE_COMBAT) {
    enemyCombatWeaponPanel.innerHTML = "";
    enemyCombatWeaponPanel.appendChild(Game.createWeaponUIPanel(Game.e_Weapon, "combat"));
    enemyCombatArmourPanel.innerHTML = "";
    enemyCombatArmourPanel.appendChild(Game.createArmourUIPanel(Game.e_Armour, "combat"));
  } else {
    enemyCombatWeaponPanel.innerHTML = "";
    enemyCombatArmourPanel.innerHTML = "";
  }
};

Game.createZoneTab = function () {
  var cz, zl, x;
  cz = document.getElementById("currentZone");
  cz.innerHTML = "";
  cz.appendChild(Game.createZonePanel(Game.p_currentZone, true));
  zl = document.getElementById("zoneList");
  zl.innerHTML = "";
  for (x = 0; x < Game.ZONE_MIN_LEVEL.length; x += 1) {
    zl.appendChild(Game.createZonePanel(x));
  }
};

Game.createSkillsTab = function () {
  //The Skills Panel
  //This bit is important - we set in other functions whether the power panel needs rebuilding, because mass DOM changes cause lag problems when they're done once a second.
  var avail, avail2, powerPointCounter, offensePane, defensePane, supportPane, specialPane,
    x, y, purchasedPowers, available, viewable, subsidiary, basePower, powerPane;
  if (Game.updateSkills) {
    avail = document.getElementById("availableSkills");
    avail.style.display = Game.p_SkillPoints === 0 ? "none" : "";
    avail2 = document.getElementById("availableSkillsHeader");
    avail2.style.display = Game.p_SkillPoints === 0 ? "none" : "";
    powerPointCounter = document.getElementById("powerPointsOut");
    powerPointCounter.innerHTML = Game.p_SkillPoints;
    // Clear the panes
    offensePane = document.getElementById("available_area_offense");
    offensePane.innerHTML = "";
    defensePane = document.getElementById("available_area_defense");
    defensePane.innerHTML = "";
    supportPane = document.getElementById("available_area_support");
    supportPane.innerHTML = "";
    specialPane = document.getElementById("available_area_special");
    specialPane.innerHTML = "";
    for (x = 0; x < Game.SKILL_LIST.length; x += 1) {
      available = true;
      viewable = true;
      subsidiary = false;
      basePower = -1;
      // Step 1: Determine if this is a subsidiary power.
      if (Game.SKILL_LIST[x][2].toString().length > 3) {
        //SKILL_LIST[x][2] is the constant for the power. If it's more than 3 chars long, it's a subsidiary!
        // Now... we check the level of the base power!
        subsidiary = true;
        basePower = Math.floor(Game.SKILL_LIST[x][2] / 10);
        if (Game.powerLevel(basePower) !== Game.getPowerLevelCap(basePower)) {
          // The base power isn't capped, we can't buy this
          available = false;
          viewable = false;
        }
        if (Game.SKILL_LIST[x][2] === Game.SKILL_ABSORPTION_SHIELD) {
          if (Game.powerLevel(Game.SKILL_REFLECTIVE_SHIELD) > 0) {
            available = false;
          }
        }
        if (Game.SKILL_LIST[x][2] === Game.SKILL_REFLECTIVE_SHIELD) {
          if (Game.powerLevel(Game.SKILL_ABSORPTION_SHIELD) > 0) {
            available = false;
          }
        }
      }
      if (Game.powerLevel(Game.SKILL_LIST[x][2]) === Game.getPowerLevelCap(Game.SKILL_LIST[x][2])) {
        viewable = false;
      }
      if (viewable) {
        powerPane = null;
        switch (Game.SKILL_LIST[x][2].toString().substring(0, 3)) {
        case "101":
          powerPane = offensePane;
          break;
        case "102":
          powerPane = defensePane;
          break;
        case "103":
          powerPane = supportPane;
          break;
        case "104":
          powerPane = specialPane;
          break;
        }
        powerPane.appendChild(Game.createPowerUIPanel(Game.SKILL_LIST[x][2], basePower, Game.powerLevel(Game.SKILL_LIST[x][2]), available, true));
      }
    }
    purchasedPowers = document.getElementById("purchased_area");
    purchasedPowers.innerHTML = "";
    for (y = 0; y < Game.p_Powers.length; y += 1) {
      purchasedPowers.appendChild(Game.createPowerUIPanel(Game.p_Powers[y][0], -1, Game.p_Powers[y][1], true, false));
    }
    Game.updateSkills = false;
  }
};

Game.createInventoryTab = function () {
  var invPanel, x, y;
  if (Game.updateInventory) {
    invPanel = document.getElementById("weaponOut");
    invPanel.innerHTML = "";
    if (Game.p_WeaponInventory.length > 0) {
      document.getElementById("weaponCache").style.display = "";
    } else {
      document.getElementById("weaponCache").style.display = "none";
    }
    for (x = 0; x < Game.p_WeaponInventory.length; x += 1) {
      // Table row
      invPanel.appendChild(Game.createWeaponUIPanel(Game.p_WeaponInventory[x], "inventory", x));
    }
    // Armour panel
    invPanel = document.getElementById("armourOut");
    invPanel.innerHTML = "";
    if (Game.p_ArmourInventory.length > 0) {
      document.getElementById("armourCache").style.display = "";
    } else {
      document.getElementById("armourCache").style.display = "none";
    }
    for (y = 0; y < Game.p_ArmourInventory.length; y += 1) {
      invPanel.appendChild(Game.createArmourUIPanel(Game.p_ArmourInventory[y], "inventory", y));
    }
    // Enemy loot panel
    invPanel = document.getElementById("enemyInvOut");
    invPanel.innerHTML = "";
    if (Game.last_Weapon.length > 0 || Game.last_Armour.length > 0) {
      document.getElementById("enemyItems").style.display = "";
    } else {
      document.getElementById("enemyItems").style.display = "none";
    }
    if (Game.last_Weapon.length > 0) {
      invPanel.appendChild(Game.createWeaponUIPanel(Game.last_Weapon, "enemyInventory"));
    }
    if (Game.last_Armour.length > 0) {
      invPanel.appendChild(Game.createArmourUIPanel(Game.last_Armour, "enemyInventory"));
    }
    Game.updateInventory = false;
  }
};

Game.createForgeTab = function () {
  var wPanelOut, aPanelOut, reforgePanelOut, x;
  if (Game.updateForge) {
    wPanelOut = document.getElementById("weaponPanelOut");
    wPanelOut.innerHTML = "";
    wPanelOut.appendChild(Game.createWeaponUIPanel(Game.p_Weapon, "forge"));
    aPanelOut = document.getElementById("armourPanelOut");
    aPanelOut.innerHTML = "";
    wPanelOut.appendChild(Game.createArmourUIPanel(Game.p_Armour, "forge"));
    reforgePanelOut = document.getElementById("debuffList");
    reforgePanelOut.innerHTML = "";
    for (x = -1; x < 10; x += 1) {
      reforgePanelOut.appendChild(Game.createForgePanel(Game.DEBUFF_SHRED + x));
    }
  }
  Game.updateForge = false;
};

Game.createShopTab = function () {
  var sw, sa, x;
  sw = document.getElementById("storeWeapons");
  sw.innerHTML = "";
  for (x = 0; x < Game.p_WeaponShopStock.length; x += 1) {
    sw.appendChild(Game.createWeaponUIPanel(Game.p_WeaponShopStock[x], "shop", x));
  }
  sa = document.getElementById("storeArmour");
  sa.innerHTML = "";
  for (x = 0; x < Game.p_ArmourShopStock.length; x += 1) {
    sa.appendChild(Game.createArmourUIPanel(Game.p_ArmourShopStock[x], "shop", x));
  }
};

Game.createOptionsTab = function () {
  var abHook = {}, asHook = {}, saveHook = {};
  abHook = document.getElementById("autoBattleHook");
  abHook.innerHTML = "";
  abHook.appendChild(Game.createABOptionPanel());
  asHook = document.getElementById("autoSellHook");
  asHook.innerHTML = "";
  asHook.appendChild(Game.createASOptionPanel());
  saveHook = document.getElementById("saveHook");
  saveHook.innerHTML = "";
  saveHook.appendChild(Game.createSavePanel());
};

Game.createBadgeTab = function () {
  var x = 0, badgePanel = {};
  badgePanel = document.getElementById("badgeList");
  badgePanel.innerHTML = "";
  for (x = 0; x < Game.BADGE_LIST.length; x += 1) {
    badgePanel.appendChild(Game.createBadgePanel(x));
  }
};

Game.combatLog = function (combatant, message) {
  var d, x, ct, logBox;
  d = document.createElement("div");
  d.setAttribute("class", combatant);
  x = document.createElement("span");
  ct = new Date();
  x.innerHTML = message;
  d.appendChild(x);
  logBox = document.getElementById("logBody");
  logBox.appendChild(d);
};

Game.showPanel = function (panelID) {
  var panelList, initPanel, x, tabHeader;
  panelList = document.getElementsByClassName("rootTable");
  initPanel = document.getElementById("initTable");
  for (x = 0; x < panelList.length; x += 1) {
    if (panelList[x].id !== "initTable" && panelList[x].id === panelID) {
      panelList[x].style.display = "";
      tabHeader = document.getElementById(panelList[x].id.slice(0, -2));
      tabHeader.classList.add("selectedTab");
    } else if (panelList[x].id !== "initTable" && panelList[x].id.match(/(\w+)Table/g) !== null) {
      panelList[x].style.display = "none";
      tabHeader = document.getElementById(panelList[x].id.slice(0, -2));
      tabHeader.classList.remove("selectedTab");
    }
  }
  Game.activePanel = panelID;
  initPanel.style.display = "none";
  switch (panelID) {
  case "inventoryTable":
    Game.updateInventory = true;
    break;
  case "powersTable":
    Game.updateSkills = true;
    break;
  case "forgeTable":
    Game.updateForge = true;
    break;
  }
  Game.drawActivePanel();
};

Game.toastNotification = function (message) {
  Game.toastQueue.push(message);
  if (Game.toastTimer === null) {
    Game.showMessage();
  }
};

Game.showMessage = function () {
  var toastFrame, toast;
  toastFrame = document.getElementById("saveToast");
  if (Game.toastQueue.length === 0) {
    toastFrame.style.display = "none";
    window.clearTimeout(Game.toastTimer);
    Game.toastTimer = null;
  } else {
    toast = document.getElementById("toastContent");
    toast.innerHTML = Game.toastQueue.shift();
    toastFrame.style.display = "";
    Game.toastTimer = window.setTimeout(Game.showMessage, 2000);
  }
};

Game.buildArmourEffectString = function (effect) {
  var returnBlock = document.createElement("span");
  if (effect === undefined) {
    returnBlock.setAttribute("style", "");
    returnBlock.innerHTML = "&nbsp;";
    return returnBlock;
  }
  switch (effect[0]) {
  case Game.ARMOUR_STR_MELEE:
    returnBlock.setAttribute("style", "color:#33cc33;");
    returnBlock.innerHTML = "+" + effect[1] + " Melee Resist";
    break;
  case Game.ARMOUR_STR_RANGE:
    returnBlock.setAttribute("style", "color:#33cc33;");
    returnBlock.innerHTML = "+" + effect[1] + " Range Resist";
    break;
  case Game.ARMOUR_STR_MAGIC:
    returnBlock.setAttribute("style", "color:#33cc33;");
    returnBlock.innerHTML = "+" + effect[1] + " Magic Resist";
    break;
  case Game.ARMOUR_VULN_MELEE:
    returnBlock.setAttribute("style", "color:red;");
    returnBlock.innerHTML = "-" + effect[1] + " Melee Resist";
    break;
  case Game.ARMOUR_VULN_RANGE:
    returnBlock.setAttribute("style", "color:red;");
    returnBlock.innerHTML = "-" + effect[1] + " Range Resist";
    break;
  case Game.ARMOUR_VULN_MAGIC:
    returnBlock.setAttribute("style", "color:red;");
    returnBlock.innerHTML = "-" + effect[1] + " Magic Resist";
    break;
  default:
    returnBlock.setAttribute("style", "");
    returnBlock.innerHTML = "&nbsp;";
    break;
  }
  return returnBlock;
};

Game.updateActivePanel = function () {
  // This function is for direct updating of panels on certain frequently updated screens, which results in less CPU usage and more responsive UI on all screens (regenerating the UI causes weird problems with clicking buttons, manual updates are usually tied to button presses, but the idle ticker is the biggest problem...)
  Game.updateTitleBar();
  switch (Game.activePanel) {
  case "combatTable":
    Game.updateCombatTab();
    break;
  case "playerTable":
    Game.updatePlayerTab();
    break;
  }
  Game.hideLockedFeatures();
};

Game.updateCombatTab = function () {
  // Player Panel
  updateElementIDContent("combat_playerName", Game.p_Name);
  
  updateElementIDContent("combat_playerLevel", "Level " + Game.p_Level);
  
  updateElementIDContent("combat_playerHP", "HP: " + prettifyNumber(Game.p_HP) + " / " + prettifyNumber(Game.p_MaxHP) + " (" + Math.floor(Game.p_HP / Game.p_MaxHP * 10000) / 100 + "%)");
  
  updateElementIDContent("combat_playerDebuff", "<strong>Debuff:</strong> " + Game.p_Debuff[1] + "(" + Game.debuff_names[Game.p_Debuff[0] - Game.DEBUFF_SHRED] + ") - " + Game.player_debuffTimer + "s");
  
  updateElementIDContent("combat_burstButton", Game.p_specUsed ? "Burst Unavailable" : (Game.powerLevel(Game.SKILL_WILD_SWINGS) > 0 ? "Wild Swings" : "Burst Attack"));
  
  updateElementIDContent("combat_playerWeaponDurability", Game.p_Weapon[8] + " uses");

  updateElementIDContent("combat_playerArmourDurability", Game.p_Armour[3] + " uses");
  
  // Enemy Panel
  updateElementIDContent("combat_enemyHealth", Game.p_State === Game.STATE_COMBAT ? ("HP: " + prettifyNumber(Game.e_HP) + " / " + prettifyNumber(Game.e_MaxHP) + " (" + Math.floor(Game.e_HP / Game.e_MaxHP * 10000) / 100 + "%)") : "Elite Appearance Chance: " + Game.bossChance + "%");

  updateElementIDContent("combat_enemyDebuff", "<strong>Debuff:</strong> " + Game.e_Debuff[1] + "(" + Game.debuff_names[Game.e_Debuff[0] - Game.DEBUFF_SHRED] + ") - " + Game.enemy_debuffTimer + "s");

  Game.updateTitleBar();
};

Game.updatePlayerTab = function () {
  // TODO: Fill
  // This tab uses the following controls - updatable items in brackets:
  // Player UI Panel (level, hp, max hp, xp, xp to level, sp, pp, str, dex, int, con, seeds, scrap)
  var playerWeaponDurability, playerArmourDurability, statAdd;
  updateElementIDContent("player_statPointHeaderOut", Game.p_StatPoints);
  
  updateElementIDContent("player_strPointsBase", Game.p_Str - Game.POINTS_STR_CURRENT);
  updateElementIDContent("player_strPointsAssigned", "+" + Game.POINTS_STR_CURRENT);
  updateElementIDContent("player_statPointBlockChance", Math.floor(statValue(Game.p_Str) * 100) / 100);
  
  updateElementIDContent("player_dexPointsBase", Game.p_Dex - Game.POINTS_DEX_CURRENT);
  updateElementIDContent("player_dexPointsAssigned", "+" + Game.POINTS_DEX_CURRENT);
  updateElementIDContent("player_statPointCritChance", Math.floor(statValue(Game.p_Dex) * 100) / 100);
  
  updateElementIDContent("player_intPointsBase", Game.p_Int - Game.POINTS_INT_CURRENT);
  updateElementIDContent("player_intPointsAssigned", "+" + Game.POINTS_INT_CURRENT);
  updateElementIDContent("player_statPointDodgeChance", Math.floor(statValue(Game.p_Int) * 50) / 100);
  
  updateElementIDContent("player_conPointsBase", Game.p_Con - Game.POINTS_CON_CURRENT);
  updateElementIDContent("player_conPointsAssigned", "+" + Game.POINTS_CON_CURRENT);
  updateElementIDContent("player_statPointHealChance", Math.floor(statValue(Game.p_Con) * 100) / 100);
  
  statAdd = document.getElementsByClassName("statAddButtons");
  Array.prototype.filter.call(statAdd, function (e) {
    if (Game.p_StatPoints > 0) {
      e.classList.remove("hiddenElement");
    } else {
      e.classList.add("hiddenElement");
    }
  });
  
  // Offense section
  updateElementIDContent("player_statTotalDMG", prettifyNumber(Game.TRACK_TOTAL_DMG));
  updateElementIDContent("player_statAttacks", prettifyNumber(Game.TRACK_ATTACKS_OUT));
  updateElementIDContent("player_statMeleeOut", prettifyNumber(Game.TRACK_MELEE_DMG));
  updateElementIDContent("player_statRangedOut", prettifyNumber(Game.TRACK_RANGE_DMG));
  updateElementIDContent("player_statMagicOut", prettifyNumber(Game.TRACK_MAGIC_DMG));
  updateElementIDContent("player_statBiggestHitOut", prettifyNumber(Game.TRACK_MAXHIT_OUT));
  updateElementIDContent("player_statBursts", prettifyNumber(Game.TRACK_BURSTS));
  updateElementIDContent("player_statDebuffsOut", prettifyNumber(Game.TRACK_DEBUFFS_OUT));
  updateElementIDContent("player_statDoomKills", prettifyNumber(Game.TRACK_DOOM_OUT));
  updateElementIDContent("player_statSleepBreaksOut", prettifyNumber(Game.TRACK_SLEEPBREAK_OUT));
  updateElementIDContent("player_statEnemyHealthDrained", prettifyNumber(Game.TRACK_DRAIN_IN));
  updateElementIDContent("player_statDoTDamageOut", prettifyNumber(Game.TRACK_DOTS_OUT));
  updateElementIDContent("player_statConfusionOut", prettifyNumber(Game.TRACK_CHARM_OUT));
  updateElementIDContent("player_statParahaxOut", prettifyNumber(Game.TRACK_PARAHAX_OUT));
  
  // Defense section
  updateElementIDContent("player_statTotalDMGTaken", prettifyNumber(Game.TRACK_TOTAL_TAKEN));
  updateElementIDContent("player_statAttacksTaken", prettifyNumber(Game.TRACK_ATTACKS_IN));
  updateElementIDContent("player_statMeleeIn", prettifyNumber(Game.TRACK_MELEE_TAKEN));
  updateElementIDContent("player_statRangedIn", prettifyNumber(Game.TRACK_RANGE_TAKEN));
  updateElementIDContent("player_statMagicIn", prettifyNumber(Game.TRACK_MAGIC_TAKEN));
  updateElementIDContent("player_statBiggestHitIn", prettifyNumber(Game.TRACK_MAXHIT_IN));
  updateElementIDContent("player_statDebuffsIn", prettifyNumber(Game.TRACK_DEBUFFS_IN));
  updateElementIDContent("player_statSleepBreaksIn", prettifyNumber(Game.TRACK_SLEEPBREAK_IN));
  updateElementIDContent("player_statDoomDeaths", prettifyNumber(Game.TRACK_DOOM_IN));
  updateElementIDContent("player_statPlayerHealthDrained", prettifyNumber(Game.TRACK_DRAIN_OUT));
  updateElementIDContent("player_statDoTDamageIn", prettifyNumber(Game.TRACK_DOTS_IN));
  updateElementIDContent("player_statConfusionIn", prettifyNumber(Game.TRACK_CHARM_IN));
  updateElementIDContent("player_statParahaxIn", prettifyNumber(Game.TRACK_PARAHAX_IN));
  
  // Tracking panel values
  // Modify this so that we don't have to redraw the panels every time.
  updateElementIDContent("player_stat11", Game.TRACK_WINS);
  updateElementIDContent("player_stat12", Game.TRACK_LOSSES);
  updateElementIDContent("player_stat13", Game.TRACK_ESCAPES);
  updateElementIDContent("player_stat14", Game.TRACK_WIN_STREAK);
  updateElementIDContent("player_stat16", Game.TRACK_BOSS_KILLS);
  updateElementIDContent("player_stat17", Game.TRACK_BOSS_CHANCE + "%");
  updateElementIDContent("player_stat20", Game.TRACK_XP_GAINED);
  updateElementIDContent("player_stat21", Game.TRACK_XP_LOST);
  updateElementIDContent("player_stat22", Game.TRACK_XP_OVERFLOW);
  updateElementIDContent("player_stat23", Game.TRACK_UPGRADES);
  updateElementIDContent("player_stat24", Game.TRACK_REFORGES);
  updateElementIDContent("player_stat25", Game.TRACK_RESETS);
  updateElementIDContent("player_stat26", Game.TRACK_ITEM_SALES);
  updateElementIDContent("player_stat27", Game.TRACK_ITEM_SCRAPS);
  updateElementIDContent("player_stat28", Game.TRACK_ITEM_DISCARDS);
  updateElementIDContent("player_stat29", Game.TRACK_BROKEN_ITEMS);
  updateElementIDContent("player_stat30", Game.TRACK_COMBAT_SEEDS);
  updateElementIDContent("player_stat31", Game.TRACK_SALE_SEEDS);
  updateElementIDContent("player_stat32", Game.TRACK_COMBAT_SCRAP);
  updateElementIDContent("player_stat33", Game.TRACK_CONVERT_SCRAP);
  updateElementIDContent("player_stat48", Game.TRACK_POTIONS_USED);
  updateElementIDContent("player_stat49", Game.playerBadges.length);
  updateElementIDContent("player_stat50", Game.prestigeLevel);
  
  // Player Weapon (Durability)
  playerWeaponDurability = document.getElementById("combat_playerWeaponDurability");
  if (playerWeaponDurability !== null) {
    playerWeaponDurability.innerHTML = Game.p_Weapon[8] + " uses";
  }
  // Player Armour (Durability)
  playerArmourDurability = document.getElementById("combat_playerArmourDurability");
  if (playerArmourDurability !== null) {
    playerArmourDurability.innerHTML = Game.p_Armour[3] + " uses";
  }
};

Game.hideLockedFeatures = function () {
  if ((Game.TRACK_COMBAT_SEEDS + Game.TRACK_SALE_SEEDS) < 100 && (Game.TRACK_ITEM_SCRAPS + Game.TRACK_COMBAT_SCRAP) < 1) {
    document.getElementById("storeTab").classList.add("hiddenElement");
  } else {
    document.getElementById("storeTab").classList.remove("hiddenElement");
  }
  if (Game.p_SkillPoints === 0 && Game.p_Powers.length === 0) {
    document.getElementById("skillsTab").classList.add("hiddenElement");
  } else {
    document.getElementById("skillsTab").classList.remove("hiddenElement");
  }
  if (Game.p_maxZone < 1) {
    document.getElementById("zoneTab").classList.add("hiddenElement");
  } else {
    document.getElementById("zoneTab").classList.remove("hiddenElement");
  }
  if (Game.p_WeaponInventory.length === 0 && Game.p_ArmourInventory.length === 0 && Game.TRACK_ITEM_SALES === 0 && Game.TRACK_ITEM_SCRAPS === 0 && Game.TRACK_ITEM_DISCARDS === 0) {
    document.getElementById("inventoryTab").classList.add("hiddenElement");
  } else {
    document.getElementById("inventoryTab").classList.remove("hiddenElement");
  }
  if (Game.playerBadges.length < 1) {
    document.getElementById("badgeTab").classList.add("hiddenElement");
  } else {
    document.getElementById("badgeTab").classList.remove("hiddenElement");
  }
};

document.getElementById("loadedUI").style.display = "";
