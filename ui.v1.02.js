/*---------------------------------
ui.js

Functions for updating various UI
tabs and panels.
----------------------------------*/

Game.drawActivePanel = function() {
  Game.updateTitleBar();
  switch(Game.activePanel) {
    case "playerTable":
      Game.createPlayerTab(); break;
    case "combatTable":
      Game.createCombatTab(); break;
    case "zoneTable":
      Game.createZoneTab(); break;
    case "powersTable":
      Game.createPowersTab(); break;
    case "inventoryTable":
      Game.createInventoryTab(); break;
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
}
Game.updateTitleBar = function() {
  var seeds = document.getElementById("seedsOut");
  seeds.innerHTML = abbreviateNumber(Game.p_Currency);
  seeds.setAttribute("title", Game.p_Currency);
  var scrap = document.getElementById("scrapOut");
  scrap.innerHTML = abbreviateNumber(Game.p_Scrap);
  scrap.setAttribute("title", Game.p_Scrap);
}
Game.createPlayerTab = function() {
  var playerInfoPanel = document.getElementById("playerInfoPanel");
  playerInfoPanel.innerHTML = "";
  playerInfoPanel.appendChild(Game.createPlayerUIPanel());
  if(Game.p_SkillPoints > 0) {
    playerInfoPanel.appendChild(Game.createStatPointPanel());
  }
  var playerEQPanel = document.getElementById("playerEquipmentPanel");
  playerEQPanel.innerHTML = "";
  playerEQPanel.appendChild(Game.createWeaponUIPanel(Game.p_Weapon, "player"));
  playerEQPanel.appendChild(Game.createArmourUIPanel(Game.p_Armour, "player"));
  // Statistics outputs. There's going to be a LOT of these.
  var statPanel = document.getElementById("statsOut");
  statPanel.innerHTML = "";
  statPanel.appendChild(Game.createStatisticPanel("Total Damage Dealt", Game.TRACK_TOTAL_DMG));
  statPanel.appendChild(Game.createStatisticPanel("Melee Damage Dealt", Game.TRACK_MELEE_DMG));
  statPanel.appendChild(Game.createStatisticPanel("Ranged Damage Dealt", Game.TRACK_RANGE_DMG));
  statPanel.appendChild(Game.createStatisticPanel("Magic Damage Dealt", Game.TRACK_MAGIC_DMG));
  statPanel.appendChild(Game.createStatisticPanel("Total Damage Taken", Game.TRACK_TOTAL_TAKEN));
  statPanel.appendChild(Game.createStatisticPanel("Melee Damage Taken", Game.TRACK_MELEE_TAKEN));
  statPanel.appendChild(Game.createStatisticPanel("Ranged Damage Taken", Game.TRACK_RANGE_TAKEN));
  statPanel.appendChild(Game.createStatisticPanel("Magic Damage Taken", Game.TRACK_MAGIC_TAKEN));
  statPanel.appendChild(Game.createStatisticPanel("Attacks Used", Game.TRACK_ATTACKS_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Attacks Taken", Game.TRACK_ATTACKS_IN));
  statPanel.appendChild(Game.createStatisticPanel("Battles Won", Game.TRACK_WINS));
  statPanel.appendChild(Game.createStatisticPanel("Battles Lost", Game.TRACK_LOSSES));
  statPanel.appendChild(Game.createStatisticPanel("Battles Fled", Game.TRACK_ESCAPES));
  statPanel.appendChild(Game.createStatisticPanel("Current Win Streak", Game.TRACK_WIN_STREAK));
  statPanel.appendChild(Game.createStatisticPanel("Burst Attacks Used", Game.TRACK_BURSTS));
  statPanel.appendChild(Game.createStatisticPanel("Elites / Bosses Defeated", Game.TRACK_BOSS_KILLS));
  statPanel.appendChild(Game.createStatisticPanel("Highest Elite Chance", Game.TRACK_BOSS_CHANCE + "%"));
  statPanel.appendChild(Game.createStatisticPanel("Largest Hit Dealt", Game.TRACK_MAXHIT_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Largest Hit Taken", Game.TRACK_MAXHIT_IN));
  statPanel.appendChild(Game.createStatisticPanel("Total Experience Gained", Game.TRACK_XP_GAINED));
  statPanel.appendChild(Game.createStatisticPanel("Experience Lost", Game.TRACK_XP_LOST));
  statPanel.appendChild(Game.createStatisticPanel("Experience Overflow Pool", Game.TRACK_XP_OVERFLOW));
  statPanel.appendChild(Game.createStatisticPanel("Item Upgrades Bought", Game.TRACK_UPGRADES));
  statPanel.appendChild(Game.createStatisticPanel("Reforges Bought", Game.TRACK_REFORGES));
  statPanel.appendChild(Game.createStatisticPanel("Power/Stat Point Resets", Game.TRACK_RESETS));
  statPanel.appendChild(Game.createStatisticPanel("Items Sold", Game.TRACK_ITEM_SALES));
  statPanel.appendChild(Game.createStatisticPanel("Items Scrapped", Game.TRACK_ITEM_SCRAPS));
  statPanel.appendChild(Game.createStatisticPanel("Items Discarded", Game.TRACK_ITEM_DISCARDS));
  statPanel.appendChild(Game.createStatisticPanel("Items Broken in Combat", Game.TRACK_BROKEN_ITEMS));
  statPanel.appendChild(Game.createStatisticPanel("Seeds Gained from Combat", Game.TRACK_COMBAT_SEEDS));
  statPanel.appendChild(Game.createStatisticPanel("Seeds Gained from Sales", Game.TRACK_SALE_SEEDS));
  statPanel.appendChild(Game.createStatisticPanel("Scrap Gained from Combat", Game.TRACK_COMBAT_SCRAP));
  statPanel.appendChild(Game.createStatisticPanel("Scrap Gained from Conversion", Game.TRACK_CONVERT_SCRAP));
  statPanel.appendChild(Game.createStatisticPanel("Debuffs Applied", Game.TRACK_DEBUFFS_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Debuffs Suffered", Game.TRACK_DEBUFFS_IN));
  statPanel.appendChild(Game.createStatisticPanel("Successful Dooms Used", Game.TRACK_DOOM_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Successful Dooms Suffered", Game.TRACK_DOOM_IN));
  statPanel.appendChild(Game.createStatisticPanel("Enemies Awoken from Sleep", Game.TRACK_SLEEPBREAK_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Times Awoken from Sleep", Game.TRACK_SLEEPBREAK_IN));
  statPanel.appendChild(Game.createStatisticPanel("Health Drained from Enemies", Game.TRACK_DRAIN_IN));
  statPanel.appendChild(Game.createStatisticPanel("Health Drained by Enemies", Game.TRACK_DRAIN_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Damage Dealt with DoTs", Game.TRACK_DOTS_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Damage Taken from DoTs", Game.TRACK_DOTS_IN));
  statPanel.appendChild(Game.createStatisticPanel("Times Confused", Game.TRACK_CHARM_IN));
  statPanel.appendChild(Game.createStatisticPanel("Enemies Confused", Game.TRACK_CHARM_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Your Hits Lost to Paralysis", Game.TRACK_PARAHAX_IN));
  statPanel.appendChild(Game.createStatisticPanel("Enemy Hits Lost to Paralysis", Game.TRACK_PARAHAX_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Potions Used", Game.TRACK_POTIONS_USED));
  statPanel.appendChild(Game.createStatisticPanel("Badges Earned", Game.playerBadges.length));
  statPanel.appendChild(Game.createStatisticPanel("Prestige Level", Game.prestigeLevel));
}
Game.createCombatTab = function() {
  var playerCombatPanel = document.getElementById("playerCombatPanel");
  playerCombatPanel.innerHTML = "";
  playerCombatPanel.appendChild(Game.createPlayerCombatPanel());
  var enemyCombatPanel = document.getElementById("enemyCombatPanel");
  enemyCombatPanel.innerHTML = "";
  enemyCombatPanel.appendChild(Game.createEnemyCombatPanel());
  var playerCombatWeaponPanel = document.getElementById("playerCombatWeaponPanel");
  playerCombatWeaponPanel.innerHTML = "";
  playerCombatWeaponPanel.appendChild(Game.createWeaponUIPanel(Game.p_Weapon, "combat"));
  var playerCombatArmourPanel = document.getElementById("playerCombatArmourPanel");
  playerCombatArmourPanel.innerHTML = "";
  playerCombatArmourPanel.appendChild(Game.createArmourUIPanel(Game.p_Armour, "combat"));
  var enemyCombatWeaponPanel = document.getElementById("enemyCombatWeaponPanel");
  var enemyCombatArmourPanel = document.getElementById("enemyCombatArmourPanel");
  if(Game.p_State == Game.STATE_COMBAT) {
    enemyCombatWeaponPanel.innerHTML = "";
    enemyCombatWeaponPanel.appendChild(Game.createWeaponUIPanel(Game.e_Weapon, "combat"));
    enemyCombatArmourPanel.innerHTML = "";
    enemyCombatArmourPanel.appendChild(Game.createArmourUIPanel(Game.e_Armour, "combat"));
  }
  else {
    enemyCombatWeaponPanel.innerHTML = "";
    enemyCombatArmourPanel.innerHTML = "";
  }

  // Some logic
  // 100 to 75%: Green
  // 75 to 50%: Yellow
  // 50 to 25%: Orange
  // 25 to 0%: Red
  var PHB = document.getElementById("playerHPBar");
  var PH_Percent = Game.p_HP/Game.p_MaxHP;
  if(PH_Percent < 0.25) { PHB.style.background = "#dd0000"; }
  else if(PH_Percent < 0.5) { PHB.style.background = "#dd7700"; }
  else if(PH_Percent < 0.75) { PHB.style.background = "#dddd00"; }
  else { PHB.style.background = "#33cc33"; }
  PHB.style.width = (100 * PH_Percent) + "%";
  var EHB = document.getElementById("enemyHPBar");
  if(Game.p_State !== Game.STATE_COMBAT) { EHB.style.display = "none"; }
  else {
    EHB.style.display = "";
    var EH_Percent = Game.e_HP/Game.e_MaxHP;
    if(EH_Percent < 0.25) { EHB.style.background = "#dd0000"; }
    else if(EH_Percent < 0.5) { EHB.style.background = "#dd7700"; }
    else if(EH_Percent < 0.75) { EHB.style.background = "#dddd00"; }
    else { EHB.style.background = "#33cc33"; }
    EHB.style.width = (100 * EH_Percent) + "%";
  }
}
Game.createZoneTab = function() {
  var cz = document.getElementById("currentZone");
  cz.innerHTML = "";
  cz.appendChild(Game.createZonePanel(Game.p_currentZone,true));
  var zl = document.getElementById("zoneList");
  zl.innerHTML = "";
  for(var x = 0; x < Game.ZONE_MIN_LEVEL.length; x++) {
    zl.appendChild(Game.createZonePanel(x));
  }
}
Game.createPowersTab = function() {
  //The Powers Panel
  //This bit is important - we set in other functions whether the power panel needs rebuilding, because mass DOM changes cause lag problems when they're done once a second.
  if(Game.updatePowers) {
    var avail = document.getElementById("availablePowers");
    avail.style.display = Game.p_PP == 0 ? "none" : "";
    var avail2 = document.getElementById("availablePowersHeader");
    avail2.style.display = Game.p_PP == 0 ? "none" : "";
    var powerPointCounter = document.getElementById("powerPointsOut");
    powerPointCounter.innerHTML = Game.p_PP;
    var powerPane = document.getElementById("available_area");
    powerPane.innerHTML = "";
    for(var x = 0; x < Game.powerList.length; x++) {
      var available = true;
      var viewable = true;
      var subsidiary = false;
      var basePower = -1;
      // Step 1: Determine if this is a subsidiary power.
      if(Game.powerList[x][2].toString().length > 3) {
        //powerList[x][2] is the constant for the power. If it's more than 3 chars long, it's a subsidiary!
        // Now... we check the level of the base power!
        subsidiary = true;
        basePower = Math.floor(Game.powerList[x][2] / 10);
        if(Game.powerLevel(basePower) != Game.getPowerLevelCap(basePower)) {
          // The base power isn't capped, we can't buy this
          available = false;
          viewable = false;
        }
        //OK, finally we check the other subsidiary powers on the same level (if there's any)
        for(var z = 0; z < Game.powerList.length; z++) {
          // If they're related to this power...
          if(Math.floor(Game.powerList[z][2] / 10) == basePower) {
            // ...and they're not this power...
            if(Game.powerList[x][2] != Game.powerList[z][2]) {
              // ...and their level is above zero...
              if(Game.powerLevel(Game.powerList[z][2]) > 0) {
                // we can't buy this one!
                available = false;
              }
            }
          }
        }
      }
      if(viewable) {
        powerPane.appendChild(Game.createPowerUIPanel(Game.powerList[x][2], basePower, Game.powerLevel(Game.powerList[x][2]), available, true));
      }
    }
    var purchasedPowers = document.getElementById("purchased_area");
    purchasedPowers.innerHTML = "";
    for(var y = 0; y < Game.p_Powers.length; y++) {
      purchasedPowers.appendChild(Game.createPowerUIPanel(Game.p_Powers[y][0], -1, Game.p_Powers[y][1], true, false));
    }
    Game.updatePowers = false;
  }
}
Game.createInventoryTab = function() {
  if(Game.updateInventory) {
    var invPanel = document.getElementById("weaponOut");
    invPanel.innerHTML = "";
    if(Game.p_WeaponInventory.length > 0) { document.getElementById("weaponCache").style.display = ""; }
    else { document.getElementById("weaponCache").style.display = "none"; }
    for(var x = 0; x < Game.p_WeaponInventory.length; x++) {
      // Table row
      invPanel.appendChild(Game.createWeaponUIPanel(Game.p_WeaponInventory[x],"inventory",x));
    }
    // Armour panel
    invPanel = document.getElementById("armourOut");
    invPanel.innerHTML = "";
    if(Game.p_ArmourInventory.length > 0) { document.getElementById("armourCache").style.display = ""; }
    else { document.getElementById("armourCache").style.display = "none"; }
    for(var y = 0; y < Game.p_ArmourInventory.length; y++) {
      invPanel.appendChild(Game.createArmourUIPanel(Game.p_ArmourInventory[y],"inventory",y));
    }
    // Enemy loot panel
    invPanel = document.getElementById("enemyInvOut");
    invPanel.innerHTML = "";
    if(Game.last_Weapon.length > 0 || Game.last_Armour.length > 0) {
      document.getElementById("enemyItems").style.display = "";
    }
    else { document.getElementById("enemyItems").style.display = "none";
    }
    if(Game.last_Weapon.length > 0) {
      invPanel.appendChild(Game.createWeaponUIPanel(Game.last_Weapon,"enemyInventory"));
    }
    if(Game.last_Armour.length > 0) {
      invPanel.appendChild(Game.createArmourUIPanel(Game.last_Armour,"enemyInventory"));
    }
    Game.updateInventory = false;
  }
}
Game.createForgeTab = function() {
  if(Game.updateForge) {
    var wPanelOut = document.getElementById("weaponPanelOut");
    wPanelOut.innerHTML = "";
    wPanelOut.appendChild(Game.createWeaponUIPanel(Game.p_Weapon, "forge"));
    var aPanelOut = document.getElementById("armourPanelOut");
    aPanelOut.innerHTML = "";
    wPanelOut.appendChild(Game.createArmourUIPanel(Game.p_Armour, "forge"));
    var reforgePanelOut = document.getElementById("debuffList");
    reforgePanelOut.innerHTML = "";
    for(var x = -1; x < 10; x++) {
      reforgePanelOut.appendChild(Game.createForgePanel(Game.DEBUFF_SHRED + x));
    }
  }
  Game.updateForge = false;
}
Game.createShopTab = function() {
  var sw = document.getElementById("storeWeapons");
  sw.innerHTML = "";
  for(var x = 0; x < Game.p_WeaponShopStock.length; x++) {
    sw.appendChild(Game.createWeaponUIPanel(Game.p_WeaponShopStock[x], "shop", x));
  }
  var sa = document.getElementById("storeArmour");
  sa.innerHTML = "";
  for(var x = 0; x < Game.p_ArmourShopStock.length; x++) {
    sa.appendChild(Game.createArmourUIPanel(Game.p_ArmourShopStock[x], "shop", x));
  }
}
Game.createOptionsTab = function() {
  var abHook = document.getElementById("autoBattleHook");
  abHook.innerHTML = "";
  abHook.appendChild(Game.createABOptionPanel());
  var asHook = document.getElementById("autoSellHook");
  asHook.innerHTML = "";
  asHook.appendChild(Game.createASOptionPanel());
  var saveHook = document.getElementById("saveHook");
  saveHook.innerHTML = "";
  saveHook.appendChild(Game.createSavePanel());
}
Game.createBadgeTab = function() {
  var badgePanel = document.getElementById("badgeList");
  badgePanel.innerHTML = "";
  for(var x = 0; x < Game.BADGE_LIST.length; x++) {
    badgePanel.appendChild(Game.createBadgePanel(x));
  }
}
Game.combatLog = function(combatant, message) {
	var d = document.createElement("div");
	d.setAttribute("class",combatant);
	var x = document.createElement("span");
  var ct = new Date();
  x.innerHTML = message;
  //x.innerHTML = "<span style='font-weight:bold;'>[" + Game.padLeft(ct.getHours(),2) + ":" + Game.padLeft(ct.getMinutes(),2) + ":" + Game.padLeft(ct.getSeconds(),2) + "]</span> " + message;
	d.appendChild(x);
	var logBox = document.getElementById("logBody");
	logBox.appendChild(d);
}
Game.showPanel = function(panelID) {
	var panelList = document.getElementsByTagName("table");
  var initPanel = document.getElementById("initTable");
	for(var x = 0; x < panelList.length; x++) {
		if(panelList[x].id !== "initTable" && panelList[x].id == panelID) {
			panelList[x].style.display = "";
      var tabHeader = document.getElementById(panelList[x].id.slice(0,-2));
      tabHeader.style.backgroundColor = "#991010";
      tabHeader.style.color = "#ffffff";
      tabHeader.style.fontWeight = "bold";
		}
		else if(panelList[x].id !== "initTable" && panelList[x].id.match(/(\w+)Table/g) !== null) {
			panelList[x].style.display = "none";
      var tabHeader = document.getElementById(panelList[x].id.slice(0,-2));
      tabHeader.style.backgroundColor = "";
      tabHeader.style.color = "";
      tabHeader.style.fontWeight = "";
		}
	}
  Game.activePanel = panelID;
  initPanel.style.display = "none";
  switch(panelID) {
    case "inventoryTable": Game.updateInventory = true; break;
    case "powersTable": Game.updatePowers = true; break;
    case "forgeTable": Game.updateForge = true; break;
  }
  Game.drawActivePanel();
}
Game.toastNotification = function(message) {
	Game.toastQueue.push(message);
	if(Game.toastTimer == null) {
		Game.showMessage();
	}
}
Game.showMessage = function() {
  var toastFrame = document.getElementById("saveToast");
  if(Game.toastQueue.length == 0) {
		toastFrame.style.display = "none";
    window.clearTimeout(Game.toastTimer);
    Game.toastTimer = null;
	}
  else {
    var toast = document.getElementById("toastContent");
    toast.innerHTML = Game.toastQueue.shift()
    toastFrame.style.display = "";
    Game.toastTimer = window.setTimeout(Game.showMessage, 2000);
  }
}
Game.buildArmourEffectString = function(effect) {
  var returnBlock = document.createElement("span");
  if(effect === undefined) {
    returnBlock.setAttribute("style","");
    returnBlock.innerHTML = "&nbsp;";
    return returnBlock;
  }
  switch(effect[0]) {
    case Game.ARMOUR_STR_MELEE:
      returnBlock.setAttribute("style","color:#33cc33;");
      returnBlock.innerHTML = "+" + effect[1] + " Melee Resist";
      break;
    case Game.ARMOUR_STR_RANGE:
      returnBlock.setAttribute("style","color:#33cc33;");
      returnBlock.innerHTML = "+" + effect[1] + " Range Resist";
      break;
    case Game.ARMOUR_STR_MAGIC:
      returnBlock.setAttribute("style","color:#33cc33;");
      returnBlock.innerHTML = "+" + effect[1] + " Magic Resist";
      break;
    case Game.ARMOUR_VULN_MELEE:
      returnBlock.setAttribute("style","color:red;");
      returnBlock.innerHTML = "-" + effect[1] + " Melee Resist";
      break;
    case Game.ARMOUR_VULN_RANGE:
      returnBlock.setAttribute("style","color:red;");
      returnBlock.innerHTML = "-" + effect[1] + " Range Resist";
      break;
    case Game.ARMOUR_VULN_MAGIC:
      returnBlock.setAttribute("style","color:red;");
      returnBlock.innerHTML = "-" + effect[1] + " Magic Resist";
      break;
    default:
      returnBlock.setAttribute("style","");
      returnBlock.innerHTML = "&nbsp;";
      break;
  }
  return returnBlock;
}
Game.updateActivePanel = function() {
  // This function is for direct updating of panels on certain frequently updated screens, which results in less CPU usage and more responsive UI on all screens (regenerating the UI causes weird problems with clicking buttons, manual updates are usually tied to button presses, but the idle ticker is the biggest problem...)
  Game.updateTitleBar();
  switch(Game.activePanel) {
    case "combatTable":
      Game.updateCombatTab(); break;
    case "playerTable":
      Game.updatePlayerTab(); break;
  }
}
Game.updateCombatTab = function() {
  // Player Panel
  var playerName = document.getElementById("combat_playerName");
  if(playerName !== null) { playerName.innerHTML = Game.p_Name; }
  var playerLevel = document.getElementById("combat_playerLevel");
  if(playerLevel !== null) { playerLevel.innerHTML = "Level " + Game.p_Level; }
  var playerHP = document.getElementById("combat_playerHP");
  if(playerHP !== null) { playerHP.innerHTML = "HP: " + prettifyNumber(Game.p_HP) + " / " + prettifyNumber(Game.p_MaxHP) + " (" + Math.floor(Game.p_HP / Game.p_MaxHP * 10000)/100 + "%)"; }
  var playerDebuff = document.getElementById("combat_playerDebuff");
  if(playerDebuff !== null) { playerDebuff.innerHTML = "<strong>Debuff:</strong> " + Game.p_Debuff[1] + "(" + Game.debuff_names[Game.p_Debuff[0]-Game.DEBUFF_SHRED] + ") - " + Game.player_debuffTimer + "s"; }
  var playerBurst = document.getElementById("combat_burstButton");
  if(playerBurst !== null) { playerBurst.innerHTML = Game.p_specUsed ? "Burst Unavailable" : (Game.powerLevel(Game.BOOST_BURST) > 0 ? "Wild Swings" : "Burst Attack"); }
  // Player Weapon (Durability)
  var playerWeaponDurability = document.getElementById("combat_playerWeaponDurability");
  if(playerWeaponDurability !== null) { playerWeaponDurability.innerHTML = Game.p_Weapon[8] + " uses"; }
  // Player Armour (Durability)
  var playerArmourDurability = document.getElementById("combat_playerArmourDurability");
  if(playerArmourDurability !== null) { playerArmourDurability.innerHTML = Game.p_Armour[3] + " uses"; }
  // Enemy Panel
  //  - Enemy HP
  var enemyHP = document.getElementById("combat_enemyHealth");
  if(enemyHP !== null) { enemyHP.innerHTML = Game.p_State == Game.STATE_COMBAT ? ("HP: " + prettifyNumber(Game.e_HP) + " / " + prettifyNumber(Game.e_MaxHP) + " (" + Math.floor(Game.e_HP / Game.e_MaxHP * 10000)/100 + "%)") : "Elite Appearance Chance: " + Game.bossChance + "%"; }
  //  - Enemy Debuff
  var enemyDebuff = document.getElementById("combat_enemyDebuff");
  if(enemyDebuff !== null) { enemyDebuff.innerHTML = "<strong>Debuff:</strong> " + Game.e_Debuff[1] + "(" + Game.debuff_names[Game.e_Debuff[0]-Game.DEBUFF_SHRED] + ") - " + Game.enemy_debuffTimer + "s"; }
  // HP Bars
  var PHB = document.getElementById("playerHPBar");
  var PH_Percent = Game.p_HP/Game.p_MaxHP;
  if(PH_Percent < 0.25) { PHB.style.background = "#dd0000"; }
  else if(PH_Percent < 0.5) { PHB.style.background = "#dd7700"; }
  else if(PH_Percent < 0.75) { PHB.style.background = "#dddd00"; }
  else { PHB.style.background = "#33cc33"; }
  PHB.style.MozTransition = "width 0.5s";
  PHB.style.WebkitTransition = "width 0.5s";
  PHB.style.width = (100 * PH_Percent) + "%";
  var EHB = document.getElementById("enemyHPBar");
  if(Game.p_State !== Game.STATE_COMBAT) { EHB.style.display = "none"; }
  else {
    EHB.style.display = "";
    var EH_Percent = Game.e_HP/Game.e_MaxHP;
    if(EH_Percent < 0.25) { EHB.style.background = "#dd0000"; }
    else if(EH_Percent < 0.5) { EHB.style.background = "#dd7700"; }
    else if(EH_Percent < 0.75) { EHB.style.background = "#dddd00"; }
    else { EHB.style.background = "#33cc33"; }
    EHB.style.MozTransition = "width 0.5s";
    EHB.style.WebkitTransition = "width 0.5s";
    EHB.style.width = (100 * EH_Percent) + "%";
  }
}
Game.updatePlayerTab = function() {
  // TODO: Fill
  // This tab uses the following controls - updatable items in brackets:
  // Player UI Panel (level, hp, max hp, xp, xp to level, sp, pp, str, dex, int, con, seeds, scrap)
  var levelSection = document.getElementById("player_level");
  levelSection.innerHTML = "Level " + Game.p_Level;
  var HPSection = document.getElementById("player_hpmaxhp");
  HPSection.innerHTML = "<strong>HP:</strong> " + prettifyNumber(Game.p_HP) + " / " + prettifyNumber(Game.p_MaxHP) + " (" + Math.floor(Game.p_HP / Game.p_MaxHP * 10000)/100 + "%)";
  var XPSection = document.getElementById("player_xpmaxxp");
  XPSection.innerHTML = "<strong>XP:</strong> " + Game.p_EXP + " / " + Game.p_NextEXP + " (" + Math.floor(Game.p_EXP / Game.p_NextEXP * 10000)/100 + "%)";
  var STRSection = document.getElementById("player_UIStr");
  STRSection.innerHTML = "<strong>STR:</strong> " + Game.p_Str;
  var DEXSection = document.getElementById("player_UIDex");
  DEXSection.innerHTML = "<strong>DEX:</strong> " + Game.p_Dex;
  var INTSection = document.getElementById("player_UIInt");
  INTSection.innerHTML = "<strong>INT:</strong> " + Game.p_Int;
  var CONSection = document.getElementById("player_UICon");
  CONSection.innerHTML = "<strong>CON:</strong> " + Game.p_Con;
  var unspentSPSection = document.getElementById("player_UISP");
  unspentSPSection.innerHTML = "<strong>Free SP:</strong> " + Game.p_SkillPoints;
  var unspentPPSection = document.getElementById("player_UIPP");
  unspentPPSection.innerHTML = "<strong>Free PP:</strong> " + Game.p_PP;
  var seedsSection = document.getElementById("player_UISeeds");
  seedsSection.innerHTML = "<strong>Seeds:</strong> " + Game.p_Currency;
  var scrapSection = document.getElementById("player_UIScrap");
  scrapSection.innerHTML = "<strong>Scrap:</strong> " + Game.p_Scrap;
  // Stat Point Panel (available points)
  var statPointPanel = document.getElementById("player_statPointsLeft");
  if(statPointPanel !== null) { statPointPanel.innerHTML = "Stat Points (" + Game.p_SkillPoints + " left)"; }
  // Tracking panel values
  var statPanel = document.getElementById("statsOut");
  statPanel.innerHTML = "";
  statPanel.appendChild(Game.createStatisticPanel("Total Damage Dealt", Game.TRACK_TOTAL_DMG));
  statPanel.appendChild(Game.createStatisticPanel("Melee Damage Dealt", Game.TRACK_MELEE_DMG));
  statPanel.appendChild(Game.createStatisticPanel("Ranged Damage Dealt", Game.TRACK_RANGE_DMG));
  statPanel.appendChild(Game.createStatisticPanel("Magic Damage Dealt", Game.TRACK_MAGIC_DMG));
  statPanel.appendChild(Game.createStatisticPanel("Total Damage Taken", Game.TRACK_TOTAL_TAKEN));
  statPanel.appendChild(Game.createStatisticPanel("Melee Damage Taken", Game.TRACK_MELEE_TAKEN));
  statPanel.appendChild(Game.createStatisticPanel("Ranged Damage Taken", Game.TRACK_RANGE_TAKEN));
  statPanel.appendChild(Game.createStatisticPanel("Magic Damage Taken", Game.TRACK_MAGIC_TAKEN));
  statPanel.appendChild(Game.createStatisticPanel("Attacks Used", Game.TRACK_ATTACKS_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Attacks Taken", Game.TRACK_ATTACKS_IN));
  statPanel.appendChild(Game.createStatisticPanel("Battles Won", Game.TRACK_WINS));
  statPanel.appendChild(Game.createStatisticPanel("Battles Lost", Game.TRACK_LOSSES));
  statPanel.appendChild(Game.createStatisticPanel("Battles Fled", Game.TRACK_ESCAPES));
  statPanel.appendChild(Game.createStatisticPanel("Current Win Streak", Game.TRACK_WIN_STREAK));
  statPanel.appendChild(Game.createStatisticPanel("Burst Attacks Used", Game.TRACK_BURSTS));
  statPanel.appendChild(Game.createStatisticPanel("Elites / Bosses Defeated", Game.TRACK_BOSS_KILLS));
  statPanel.appendChild(Game.createStatisticPanel("Highest Elite Chance", Game.TRACK_BOSS_CHANCE + "%"));
  statPanel.appendChild(Game.createStatisticPanel("Largest Hit Dealt", Game.TRACK_MAXHIT_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Largest Hit Taken", Game.TRACK_MAXHIT_IN));
  statPanel.appendChild(Game.createStatisticPanel("Total Experience Gained", Game.TRACK_XP_GAINED));
  statPanel.appendChild(Game.createStatisticPanel("Experience Lost", Game.TRACK_XP_LOST));
  statPanel.appendChild(Game.createStatisticPanel("Experience Overflow Pool", Game.TRACK_XP_OVERFLOW));
  statPanel.appendChild(Game.createStatisticPanel("Item Upgrades Bought", Game.TRACK_UPGRADES));
  statPanel.appendChild(Game.createStatisticPanel("Reforges Bought", Game.TRACK_REFORGES));
  statPanel.appendChild(Game.createStatisticPanel("Power/Stat Point Resets", Game.TRACK_RESETS));
  statPanel.appendChild(Game.createStatisticPanel("Items Sold", Game.TRACK_ITEM_SALES));
  statPanel.appendChild(Game.createStatisticPanel("Items Scrapped", Game.TRACK_ITEM_SCRAPS));
  statPanel.appendChild(Game.createStatisticPanel("Items Discarded", Game.TRACK_ITEM_DISCARDS));
  statPanel.appendChild(Game.createStatisticPanel("Items Broken in Combat", Game.TRACK_BROKEN_ITEMS));
  statPanel.appendChild(Game.createStatisticPanel("Seeds Gained from Combat", Game.TRACK_COMBAT_SEEDS));
  statPanel.appendChild(Game.createStatisticPanel("Seeds Gained from Sales", Game.TRACK_SALE_SEEDS));
  statPanel.appendChild(Game.createStatisticPanel("Scrap Gained from Combat", Game.TRACK_COMBAT_SCRAP));
  statPanel.appendChild(Game.createStatisticPanel("Scrap Gained from Conversion", Game.TRACK_CONVERT_SCRAP));
  statPanel.appendChild(Game.createStatisticPanel("Debuffs Applied", Game.TRACK_DEBUFFS_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Debuffs Suffered", Game.TRACK_DEBUFFS_IN));
  statPanel.appendChild(Game.createStatisticPanel("Successful Dooms Used", Game.TRACK_DOOM_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Successful Dooms Suffered", Game.TRACK_DOOM_IN));
  statPanel.appendChild(Game.createStatisticPanel("Enemies Awoken from Sleep", Game.TRACK_SLEEPBREAK_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Times Awoken from Sleep", Game.TRACK_SLEEPBREAK_IN));
  statPanel.appendChild(Game.createStatisticPanel("Health Drained from Enemies", Game.TRACK_DRAIN_IN));
  statPanel.appendChild(Game.createStatisticPanel("Health Drained by Enemies", Game.TRACK_DRAIN_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Damage Dealt with DoTs", Game.TRACK_DOTS_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Damage Taken from DoTs", Game.TRACK_DOTS_IN));
  statPanel.appendChild(Game.createStatisticPanel("Times Confused", Game.TRACK_CHARM_IN));
  statPanel.appendChild(Game.createStatisticPanel("Enemies Confused", Game.TRACK_CHARM_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Your Hits Lost to Paralysis", Game.TRACK_PARAHAX_IN));
  statPanel.appendChild(Game.createStatisticPanel("Enemy Hits Lost to Paralysis", Game.TRACK_PARAHAX_OUT));
  statPanel.appendChild(Game.createStatisticPanel("Potions Used", Game.TRACK_POTIONS_USED));
  statPanel.appendChild(Game.createStatisticPanel("Badges Earned", Game.playerBadges.length));
  statPanel.appendChild(Game.createStatisticPanel("Prestige Level", Game.prestigeLevel));
  // Player Weapon (Durability)
  var playerWeaponDurability = document.getElementById("combat_playerWeaponDurability");
  if(playerWeaponDurability !== null) { playerWeaponDurability.innerHTML = Game.p_Weapon[8] + " uses"; }
  // Player Armour (Durability)
  var playerArmourDurability = document.getElementById("combat_playerArmourDurability");
  if(playerArmourDurability !== null) { playerArmourDurability.innerHTML = Game.p_Armour[3] + " uses"; }
}
document.getElementById("loadedUI").style.display = "";