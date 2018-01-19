/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";

/*-----------------------------
inventory.js

Functions for inventory control
and management. Includes store.
-----------------------------*/

// Yes, I'm doing a lot of array slicing in here. Weird things can happen if you pass them around by reference, it's safer this way :)
Game.equipWeapon = function (index) {
  // How do you like my new pointy.
  var currentWep = [], newWep = [];
  currentWep = Game.p_Weapon.slice(0);
  newWep = Game.p_WeaponInventory[index].slice(0);
  Game.p_Weapon = newWep.slice(0);
  Game.p_WeaponInventory[index] = currentWep.slice(0);
  Game.updateInventory = true;
  Game.updateForge = true;
  Game.toastNotification("已装备 <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span>.");
  Game.badgeCheck(Game.BADGE_BOSSGEAR); // Like a Boss
  Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
  Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
  Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
  Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
  Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  Game.drawActivePanel();
};

Game.discardWeapon = function (index) {
  // Don't let them throw me away!
  var thrownWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  Game.toastNotification("<span class='q" + Game.p_WeaponInventory[index][7] + "'>" + thrownWepName + "</span> 被扔掉了。");
  Game.p_WeaponInventory.splice(index, 1);
  Game.updateInventory = true;
  Game.TRACK_ITEM_DISCARDS += 1;
  Game.badgeCheck(Game.BADGE_DISCARDS);
  Game.drawActivePanel();
};

Game.sellWeapon = function (index, loud) {
  var salePrice = 0, soldWepName = '';
  salePrice = Math.floor(25 * Math.pow(1.1, Game.p_WeaponInventory[index][1]) * (1 + 0.05 * Game.powerLevel(Game.SKILL_HAGGLING)));
  salePrice = Math.floor(salePrice * (10 + (Game.p_WeaponInventory[index][7] - Game.QUALITY_NORMAL)) / 10);
  soldWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  if (loud) {
    Game.toastNotification("<span class='q" + Game.p_WeaponInventory[index][7] + "'>" + soldWepName + "</span> 出售获得 " + salePrice + " 种子。");
  }
  Game.p_WeaponInventory.splice(index, 1);
  Game.updateInventory = true;
  Game.p_Currency += salePrice;
  Game.TRACK_ITEM_SALES += 1;
  Game.TRACK_SALE_SEEDS += salePrice;
  Game.drawActivePanel();
  if (!loud) {
    return salePrice;
  }
};

Game.scrapWeapon = function (index, loud) {
  // Breaking things willingly.
  var salePrice = 0, scrappedWepName = '';
  scrappedWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  switch (Game.p_WeaponInventory[index][7]) {
  case Game.QUALITY_AMAZING:
    salePrice = Game.RNG(7, 10);
    break;
  case Game.QUALITY_GREAT:
    salePrice = Game.RNG(4, 6);
    break;
  case Game.QUALITY_GOOD:
    salePrice = Game.RNG(2, 3);
    break;
  case Game.QUALITY_NORMAL:
    salePrice = Game.RNG(1, 2);
    break;
  case Game.QUALITY_POOR:
    salePrice = Game.RNG(0, 1);
    break;
  }
  if (Game.powerLevel(Game.SKILL_DISASSEMBLY) === 1) {
    salePrice += 1;
  }
  if (loud) {
    Game.toastNotification("<span class='q" + Game.p_WeaponInventory[index][7] + "'>" + scrappedWepName + "</span> 转换成 " + salePrice + " 碎片。");
  }
  Game.p_WeaponInventory.splice(index, 1);
  Game.updateInventory = true;
  Game.p_Scrap += salePrice;
  Game.TRACK_ITEM_SCRAPS += 1;
  Game.TRACK_CONVERT_SCRAP += salePrice;
  Game.badgeCheck(Game.BADGE_SCRAPPING);
  Game.drawActivePanel();
  if (!loud) {
    return salePrice;
  }
};

Game.equipArmour = function (index) {
  var currentArm = [], newArm = [];
  currentArm = Game.p_Armour.slice(0);
  newArm = Game.p_ArmourInventory[index].slice(0);
  Game.p_Armour = newArm.slice(0);
  Game.p_ArmourInventory[index] = currentArm.slice(0);
  Game.updateInventory = true;
  Game.updateForge = true;
  Game.toastNotification("已装备 <span class='q" + Game.p_Armour[2] + "'>" + Game.p_Armour[0].split("|")[0] + "</span>.");
  Game.badgeCheck(Game.BADGE_BOSSGEAR); // Like a Boss
  Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
  Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
  Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
  Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
  Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  Game.drawActivePanel();
};

Game.discardArmour = function (index) {
  var thrownArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  Game.toastNotification("<span class='q" + Game.p_ArmourInventory[index][2] + "'>" + thrownArmName + "</span> 被扔掉了");
  Game.p_ArmourInventory.splice(index, 1);
  Game.updateInventory = true;
  Game.TRACK_ITEM_DISCARDS += 1;
  Game.badgeCheck(Game.BADGE_DISCARDS);
  Game.drawActivePanel();
};

Game.sellArmour = function (index, loud) {
  var salePrice = 0, soldArmName = '';
  salePrice = Math.floor(25 * Math.pow(1.1, Game.p_ArmourInventory[index][1]) * (1 + 0.05 * Game.powerLevel(Game.SKILL_HAGGLING)));
  salePrice = Math.floor(salePrice * (10 + (Game.p_ArmourInventory[index][2] - Game.QUALITY_NORMAL)) / 10);
  soldArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  if (loud) {
    Game.toastNotification("<span class='q" + Game.p_ArmourInventory[index][2] + "'>" + soldArmName + "</span> 出售得到 " + salePrice + " 种子。");
  }
  Game.p_ArmourInventory.splice(index, 1);
  Game.updateInventory = true;
  Game.p_Currency += salePrice;
  Game.TRACK_ITEM_SALES += 1;
  Game.TRACK_SALE_SEEDS += salePrice;
  Game.drawActivePanel();
  if (!loud) {
    return salePrice;
  }
};

Game.scrapArmour = function (index, loud) {
  var salePrice = 0, scrappedArmName = '';
  scrappedArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  switch (Game.p_ArmourInventory[index][2]) {
  case Game.QUALITY_AMAZING:
    salePrice = Game.RNG(7, 10);
    break;
  case Game.QUALITY_GREAT:
    salePrice = Game.RNG(4, 6);
    break;
  case Game.QUALITY_GOOD:
    salePrice = Game.RNG(2, 3);
    break;
  case Game.QUALITY_NORMAL:
    salePrice = Game.RNG(1, 2);
    break;
  case Game.QUALITY_POOR:
    salePrice = Game.RNG(0, 1);
    break;
  }
  if (Game.powerLevel(Game.SKILL_DISASSEMBLY) === 1) {
    salePrice += 1;
  }
  if (loud) {
    Game.toastNotification("<span class='q" + Game.p_ArmourInventory[index][2] + "'>" + scrappedArmName + "</span> converted into " + salePrice + " 碎片。");
  }
  Game.p_ArmourInventory.splice(index, 1);
  Game.updateInventory = true;
  Game.p_Scrap += salePrice;
  Game.TRACK_ITEM_SCRAPS += 1;
  Game.TRACK_CONVERT_SCRAP += salePrice;
  Game.badgeCheck(Game.BADGE_SCRAPPING);
  Game.drawActivePanel();
  if (!loud) {
    return salePrice;
  }
};

Game.makeWeapon = function (level) {
  // Returns a weapon as an array with the form
  // [name,level,type,speed,minDmg,maxDmg,dps,quality,decay,[debuffID,debuffName,debuffDuration,debuffStrength]]
  var type = 0, sType = 0, speed = 0, minDmg = 0, maxDmg = 0, dps = 0,
    decay = 0, qualityMult = 1, qualityID = 0, debuff = [], qT = 0,
    base = 0, variance = 0, perLv = 0, name = '';
  type = Game.RNG(Game.WEAPON_MELEE, Game.WEAPON_MAGIC);
  sType = Game.RNG(Game.WSPEED_SLOW, Game.WSPEED_FAST);
  speed = 0;
  minDmg = 0;
  maxDmg = 0;
  dps = 0;
  decay = 50 + 5 * (level - 1);
  qualityMult = 1;
  qualityID = Game.QUALITY_NORMAL;
  debuff = [];
  // Quality generator
  qT = Game.RNG(1, 100);
  if (qT === 1) {
    qualityMult = 1.3;
    qualityID = Game.QUALITY_AMAZING;
  } else if (qT < 6) {
    qualityMult = 1.2;
    qualityID = Game.QUALITY_GREAT;
  } else if (qT < 16) {
    qualityMult = 1.1;
    qualityID = Game.QUALITY_GOOD;
  } else if (qT < 26) {
    qualityMult = 0.9;
    qualityID = Game.QUALITY_POOR;
  } else {
    qualityMult = 1;
    qualityID = Game.QUALITY_NORMAL;
  }
  // Weapon speed
  switch (sType) {
  case Game.WSPEED_FAST:
    speed = Game.RNG(16, 20);
    break;
  case Game.WSPEED_MID:
    speed = Game.RNG(21, 25);
    break;
  case Game.WSPEED_SLOW:
    speed = Game.RNG(26, 30);
    break;
  }
  speed = speed / 10;
  base = 0;
  variance = 0;
  perLv = 0;
  switch (sType) {
  case Game.WSPEED_FAST:
    base = Game.RNG(8, 10);
    perLv = 2;
    variance = 0.3;
    break;
  case Game.WSPEED_MID:
    base = Game.RNG(11, 13);
    perLv = 2.5;
    variance = 0.4;
    break;
  case Game.WSPEED_SLOW:
    base = Game.RNG(14, 16);
    perLv = 3;
    variance = 0.5;
    break;
  }
  name = Game.getWeaponName(type, qualityID, sType);
  // Logic time!
  // Weapon damage = (Base + Bonus based on weapon level +/- Variance based on level) * Quality multiplier
  minDmg = Math.floor((base + ((level - 1) * perLv) - (1 + (variance * (level - 1) / 2))) * qualityMult);
  maxDmg = Math.ceil((base + ((level - 1) * perLv) + (1 + (variance * (level - 1) / 2))) * qualityMult);
  dps = Math.floor((minDmg + maxDmg) / 2 / speed * 100) / 100;
  return [name[0], level, type, speed, minDmg, maxDmg, dps, qualityID, decay, name[1]];
};

Game.makeArmour = function (level) {
  // Returns a piece of armour in the following form:
  // [name,level,quality,durability,[[str1,value],[str2,value],[str3,value]],[[vuln1,value],[vuln2,value]]]
  var x = 0, y = 0, armLevel = 0, armDura = 0, armQuality = 0, qualityPlus = 1, armStrengths = 0,
    armVulns = 0, qT = 0, availableTypes = [], armStrList = [], armVulnList = [], added = false,
    strType = 0, strPower = 0, str = [], vulnType = 0, vulnPower = 0, vuln = [], armName = "";
  armLevel = level;
  armDura = 50 + (5 * (level - 1));
  armQuality = 0;
  qualityPlus = 1;
  armStrengths = 0;
  armVulns = 0;
  qT = Game.RNG(1, 100);
  if (qT === 1) {
    qualityPlus = 4;
    armQuality = Game.QUALITY_AMAZING;
    armStrengths = 3;
    armVulns = 0;
  } else if (qT < 6) {
    qualityPlus = 3;
    armQuality = Game.QUALITY_GREAT;
    armStrengths = 2;
    armVulns = 0;
  } else if (qT < 16) {
    qualityPlus = 2;
    armQuality = Game.QUALITY_GOOD;
    armStrengths = 2;
    armVulns = 1;
  } else if (qT < 26) {
    qualityPlus = 0;
    armQuality = Game.QUALITY_POOR;
    armStrengths = 1;
    armVulns = 2;
  } else {
    qualityPlus = 1;
    armQuality = Game.QUALITY_NORMAL;
    armStrengths = 1;
    armVulns = 1;
  }
  availableTypes = [0, 1, 2];
  armStrList = [];
  armVulnList = [];
  // Add blocking values here
  for (x = 0; x < armStrengths; x += 1) {
    added = false;
    while (!added) {
      // This loop is to ensure that armours don't boost the same stat multiple times.
      strType = Game.RNG(Game.ARMOUR_STR_MELEE, Game.ARMOUR_STR_MAGIC);
      if (availableTypes.indexOf(strType - Game.ARMOUR_STR_MELEE) !== -1) {
        // The bonus values are based off level and quality, with minor variance
        // Variances are small in early game and open up as you gain levels.
        strPower = 1 + Math.floor(qualityPlus + Game.RNG(Math.floor(level / 2), level));
        str = [strType, strPower];
        armStrList.push(str.slice(0));
        availableTypes.splice(availableTypes.indexOf(strType - Game.ARMOUR_STR_MELEE), 1);
        added = true;
      }
    }
  }
  // Now we put holes in it.
  for (y = 0; y < armVulns; y += 1) {
    added = false;
    while (!added) {
      // See above for loop explanation
      vulnType = Game.RNG(Game.ARMOUR_VULN_MELEE, Game.ARMOUR_VULN_MAGIC);
      if (availableTypes.indexOf(vulnType - Game.ARMOUR_VULN_MELEE) !== -1) {
        vulnPower = 1 + Math.floor(qualityPlus + Game.RNG(Math.floor(level / 2), level));
        vuln = [vulnType, vulnPower];
        armVulnList.push(vuln.slice(0));
        availableTypes.splice(availableTypes.indexOf(vulnType - Game.ARMOUR_VULN_MELEE), 1);
        added = true;
      }
    }
  }
  armName = Game.getArmourName(armQuality);
  return [armName, armLevel, armQuality, armDura, armStrList.slice(0), armVulnList.slice(0)];
};

Game.getWeaponName = function (type, quality, speedTier) {
  // The lengths we go to for making names.
  var nameArray = [], debuffArray = [], arrayIndex = 0, qualityState = '', debuff = '', aName = '';
  switch (type) {
    // Weapons are named differently based on how fast their attack is and what type of attack it is.
  case Game.WEAPON_MELEE:
    switch (speedTier) {
    case Game.WSPEED_SLOW:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.slow_melee_special;
        debuffArray = Game.slow_melee_debuffs;
      } else {
        nameArray = Game.slow_melee_generic;
      }
      break;
    case Game.WSPEED_MID:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.mid_melee_special;
        debuffArray = Game.mid_melee_debuffs;
      } else {
        nameArray = Game.mid_melee_generic;
      }
      break;
    case Game.WSPEED_FAST:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.fast_melee_special;
        debuffArray = Game.fast_melee_debuffs;
      } else {
        nameArray = Game.fast_melee_generic;
      }
      break;
    }
    break;
  case Game.WEAPON_RANGE:
    switch (speedTier) {
    case Game.WSPEED_SLOW:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.slow_range_special;
        debuffArray = Game.slow_range_debuffs;
      } else {
        nameArray = Game.slow_range_generic;
      }
      break;
    case Game.WSPEED_MID:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.mid_range_special;
        debuffArray = Game.mid_range_debuffs;
      } else {
        nameArray = Game.mid_range_generic;
      }
      break;
    case Game.WSPEED_FAST:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.fast_range_special;
        debuffArray = Game.fast_range_debuffs;
      } else {
        nameArray = Game.fast_range_generic;
      }
      break;
    }
    break;
  case Game.WEAPON_MAGIC:
    switch (speedTier) {
    case Game.WSPEED_SLOW:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.slow_magic_special;
        debuffArray = Game.slow_magic_debuffs;
      } else {
        nameArray = Game.slow_magic_generic;
      }
      break;
    case Game.WSPEED_MID:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.mid_magic_special;
        debuffArray = Game.mid_magic_debuffs;
      } else {
        nameArray = Game.mid_magic_generic;
      }
      break;
    case Game.WSPEED_FAST:
      if (quality >= Game.QUALITY_GREAT) {
        nameArray = Game.fast_magic_special;
        debuffArray = Game.fast_magic_debuffs;
      } else {
        nameArray = Game.fast_magic_generic;
      }
      break;
    }
    break;
  }
  if (quality >= Game.QUALITY_GREAT) {
    arrayIndex = Game.RNG(0, nameArray.length - 1);
    return [nameArray[arrayIndex], debuffArray[arrayIndex]];
  } else {
    // We get to add a prefix to non-awesome weapons to show their usefulness or lack thereof
    qualityState = Game.weaponQualityDescriptors[quality - Game.QUALITY_POOR];
    if (quality === Game.QUALITY_GOOD) {
      debuff = Game.debuffs_generic[Game.RNG(0, Game.debuffs_generic.length - 1)];
      return [(qualityState[Game.RNG(0, qualityState.length - 1)] + " " + nameArray[Game.RNG(0, nameArray.length - 1)]).trim(), debuff.slice()];
    }
    return [(qualityState[Game.RNG(0, qualityState.length - 1)] + " " + nameArray[Game.RNG(0, nameArray.length - 1)]).trim(), []];
  }
};

Game.getArmourName = function (quality) {
  var qualitySet = '', aName = '';
  if (quality >= Game.QUALITY_GREAT) {
    return Game.armour_special[Game.RNG(0, Game.armour_special.length - 1)];
  } else {
    qualitySet = Game.armourQualityDescriptors[quality - Game.QUALITY_POOR];
    aName = qualitySet[Game.RNG(0, qualitySet.length - 1)] + " " + Game.armour_generic[Game.RNG(0, Game.armour_generic.length - 1)];
    return aName.trim();
  }
};

Game.upgradeWeaponLevel = function (weapon) {
  // We make it better now.
  weapon[1] += 1;
  var qualityMult = 1.0;
  switch (weapon[7]) {
  case Game.QUALITY_POOR:
    qualityMult = 0.9;
    break;
  case Game.QUALITY_GOOD:
    qualityMult = 1.1;
    break;
  case Game.QUALITY_GREAT:
    qualityMult = 1.2;
    break;
  case Game.QUALITY_AMAZING:
    qualityMult = 1.3;
    break;
  }
  switch (weapon[3]) {
  case 1.6:
  case 1.7:
  case 1.8:
  case 1.9:
  case 2.0:
    weapon[4] = Math.floor(weapon[4] + 1.7 * qualityMult);
    weapon[5] = Math.floor(weapon[5] + 2.3 * qualityMult);
    break;
  case 2.1:
  case 2.2:
  case 2.3:
  case 2.4:
  case 2.5:
    weapon[4] = Math.floor(weapon[4] + 2.1 * qualityMult);
    weapon[5] = Math.floor(weapon[5] + 2.9 * qualityMult);
    break;
  case 2.6:
  case 2.7:
  case 2.8:
  case 2.9:
  case 3.0:
    weapon[4] = Math.floor(weapon[4] + 2.5 * qualityMult);
    weapon[5] = Math.floor(weapon[5] + 3.5 * qualityMult);
    break;
  }
  weapon[6] = Math.floor((weapon[4] + weapon[5]) / 2 / weapon[3] * 100) / 100;
  return weapon;
};

Game.upgradeArmourLevel = function (armour) {
  var x = 0, y = 0;
  armour[1] += 1;
  for (x = 0; x < armour[4].length; x += 1) {
    armour[4][x][1] += 1;
  }
  for (y = 0; y < armour[5].length; y += 1) {
    armour[5][y][1] += 1;
  }
  return armour;
};

Game.calculateItemLevelPrice = function (level, quality) {
  var upgradeCost = Math.floor(150 * Math.pow(1.06, level) * (1 - 0.03 * Game.powerLevel(Game.SKILL_BARTERING)));
  upgradeCost = Math.floor(upgradeCost * (10 + (quality - Game.QUALITY_NORMAL)) / 10);
  return upgradeCost;
};

Game.calculateItemQualityPrice = function (quality) {
  return Math.pow(4, (quality - Game.QUALITY_POOR));
};

Game.buyWeapon = function (index) {
  var purchase = [], cost = 0;
  purchase = Game.p_WeaponShopStock[index];
  cost = 2 * Game.calculateItemLevelPrice(purchase[1], purchase[7]);
  if (Game.p_WeaponInventory.length === Game.MAX_INVENTORY) {
    Game.toastNotification("武器仓库已满...");
    return 0;
  }
  if (Game.p_Currency >= cost) {
    Game.p_WeaponInventory.push(purchase);
    Game.p_WeaponShopStock.splice(index, 1);
    Game.p_Currency -= cost;
    Game.toastNotification("已购买 <span class='q" + purchase[7] + "'>" + purchase[0].split("|")[0] + "</span>.");
    Game.giveBadge(Game.BADGE_FIRST_BUY);
    Game.PROGRESS_SPEND += cost;
    Game.badgeCheck(Game.BADGE_SPEND3);
    Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
    Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
    Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
    Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
    Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  } else {
    Game.toastNotification("没有足够的种子...");
  }
  Game.drawActivePanel();
};

Game.buyArmour = function (index) {
  var purchase = [], cost = 0;
  purchase = Game.p_ArmourShopStock[index];
  cost = 2 * Game.calculateItemLevelPrice(purchase[1], purchase[2]);
  if (Game.p_ArmourInventory.length === Game.MAX_INVENTORY) {
    Game.toastNotification("装备仓库已满...");
    return 0;
  }
  if (Game.p_Currency >= cost) {
    Game.p_ArmourInventory.push(purchase);
    Game.p_ArmourShopStock.splice(index, 1);
    Game.p_Currency -= cost;
    Game.toastNotification("已购买 <span class='q" + purchase[2] + "'>" + purchase[0].split("|")[0] + "</span>.");
    Game.giveBadge(Game.BADGE_FIRST_BUY);
    Game.PROGRESS_SPEND += cost;
    Game.badgeCheck(Game.BADGE_SPEND3);
    Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
    Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
    Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
    Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
    Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  } else {
    Game.toastNotification("没有足够的种子...");
  }
  Game.drawActivePanel();
};

Game.buyWeaponLevelUpgrade = function () {
  var upgradeCost = Game.calculateItemLevelPrice(Game.p_Weapon[1], Game.p_Weapon[7]);
  if (Game.p_Currency >= upgradeCost) {
    Game.p_Currency -= upgradeCost;
    Game.upgradeWeaponLevel(Game.p_Weapon);
    Game.toastNotification("武器等级提升");
    Game.TRACK_UPGRADES += 1;
    Game.drawActivePanel();
  } else {
    Game.toastNotification("没有足够的种子...");
  }
  Game.updateForge = true;
};

Game.buyArmourLevelUpgrade = function () {
  var upgradeCost = Game.calculateItemLevelPrice(Game.p_Armour[1], Game.p_Armour[2]);
  if (Game.p_Currency >= upgradeCost) {
    Game.p_Currency -= upgradeCost;
    Game.upgradeArmourLevel(Game.p_Armour);
    Game.toastNotification("装备等级提升");
    Game.TRACK_UPGRADES += 1;
    Game.drawActivePanel();
  } else {
    Game.toastNotification("没有足够的种子...");
  }
  Game.updateForge = true;
};

Game.upgradeWeaponQuality = function (weapon) {
  var baseMin = 0, baseMax = 0, dbIndex = 0, validWeaponName = false, userWeaponName = '',
    validFlavourText = false, userFlavourText = '';
  baseMin = Math.floor(weapon[4] / (10 + (weapon[7] - Game.QUALITY_NORMAL)) * 10);
  baseMax = Math.ceil(weapon[5] / (10 + (weapon[7] - Game.QUALITY_NORMAL)) * 10);
  if (weapon[7] === Game.QUALITY_NORMAL) {
    // Add a random debuff when transitioning from Normal to Good quality
    dbIndex = Game.RNG(0, Game.debuffs_generic.length - 1);
    weapon[9] = Game.debuffs_generic[dbIndex];
  }
  if (weapon[7] === Game.QUALITY_GOOD) {
    validWeaponName = false;
    userWeaponName = "";
    while (!validWeaponName) {
      userWeaponName = prompt("Please provide a name for your upgraded weapon.\n\n(Max 40 characters)");
      if (userWeaponName === null) {
        userWeaponName = "";
      }
      if (userWeaponName.length > 40) {
        alert("The text provided was too long, please try something shorter.");
      } else if (/[<>|]/g.test(userWeaponName)) {
        alert("The text provided contained invalid characters, please try something else.");
      } else {
        userWeaponName = userWeaponName.replace(/[<>|]/g, "");
        validWeaponName = true;
        Game.PROGRESS_NO_NAMES = false;
      }
    }
    validFlavourText = false;
    userFlavourText = "";
    while (!validFlavourText) {
      userFlavourText = prompt("Please provide some flavour text for your upgraded weapon.\n\n(Max 60 characters)");
      if (userFlavourText === null) {
        userFlavourText = "";
      }
      if (userFlavourText.length > 60) {
        alert("The text provided was too long, please try something shorter.");
      } else if (/[<>|]/g.test(userFlavourText)) {
        alert("The text provided contained invalid characters, please try something else.");
      } else {
        userFlavourText = userFlavourText.replace(/[<>|]/g, "");
        validFlavourText = true;
        Game.PROGRESS_NO_NAMES = false;
      }
    }
    if (userWeaponName.trim() === "") {
      Game.giveBadge(Game.BADGE_NO_NAME);
    } // Unimaginative
    if (userFlavourText.trim() === "") {
      Game.giveBadge(Game.BADGE_NO_FLAVOUR);
    } // Lacking in Flavour
    weapon[0] = (userWeaponName.trim() !== "" ? userWeaponName : weapon[0]) + "|" + (userFlavourText.trim() !== "" ? userFlavourText : "I have no flavour.");
  }
  weapon[7] += 1;
  weapon[4] = Math.ceil(baseMin * (10 + (weapon[7] - Game.QUALITY_NORMAL)) / 10);
  weapon[5] = Math.ceil(baseMax * (10 + (weapon[7] - Game.QUALITY_NORMAL)) / 10);
  weapon[6] = Math.floor(((weapon[4] + weapon[5]) / 2 / weapon[3]) * 100) / 100;
  return weapon;
};

Game.buyWeaponQualityUpgrade = function () {
  var scrapCost = Game.calculateItemQualityPrice(Game.p_Weapon[7]);
  if (Game.p_Weapon[7] < Game.QUALITY_AMAZING && Game.p_Scrap >= scrapCost) {
    Game.p_Scrap -= scrapCost;
    Game.upgradeWeaponQuality(Game.p_Weapon);
    Game.toastNotification("武器品阶升级");
    Game.TRACK_UPGRADES += 1;
    Game.drawActivePanel();
  } else {
    if (Game.p_Weapon[7] === Game.QUALITY_AMAZING) {
      Game.toastNotification("武器已经达到了最高的品阶。");
    } else {
      Game.toastNotification("没有足够的碎片...");
    }
  }
  Game.updateForge = true;
};

Game.upgradeArmourQuality = function (armour) {
  var x = 0, availableTypes = [], buffPower = 0, validArmourName = false, userArmourName = '', validFlavourText = false, userFlavourText = '';
  switch (armour[2]) {
  case Game.QUALITY_POOR:
    armour[5].pop();
    break;
  case Game.QUALITY_NORMAL:
    availableTypes = [0, 1, 2];
    availableTypes.splice(availableTypes.indexOf(armour[4][0][0] - Game.ARMOUR_STR_MELEE), 1);
    availableTypes.splice(availableTypes.indexOf(armour[5][0][0] - Game.ARMOUR_VULN_MELEE), 1);
    buffPower = 1 + Math.floor(Game.RNG(Math.floor(armour[1] / 2), armour[1]));
    armour[4].push([availableTypes[0] + Game.ARMOUR_STR_MELEE, buffPower]);
    break;
  case Game.QUALITY_GOOD:
    armour[5].pop();
    validArmourName = false;
    userArmourName = "";
    while (!validArmourName) {
      userArmourName = prompt("Please provide a name for your upgraded armour.\n\n(Max 40 characters)");
      if (userArmourName === null) {
        userArmourName = "";
      }
      if (userArmourName.length > 40) {
        alert("The text provided was too long, please try something shorter.");
      } else if (/[<>|]/g.test(userArmourName)) {
        alert("The text provided contained invalid characters, please try something else.");
      } else {
        userArmourName = userArmourName.replace(/[<>|]/g, "");
        validArmourName = true;
        Game.PROGRESS_NO_NAMES = false;
      }
    }
    validFlavourText = false;
    userFlavourText = "";
    while (!validFlavourText) {
      userFlavourText = prompt("Please provide some flavour text for your upgraded armour.\n\n(Max 60 characters)");
      if (userFlavourText === null) {
        userFlavourText = "";
      }
      if (userFlavourText.length > 60) {
        alert("The text provided was too long, please try something shorter.");
      } else if (/[<>|]/g.test(userFlavourText)) {
        alert("The text provided contained invalid characters, please try something else.");
      } else {
        userFlavourText = userFlavourText.replace(/[<>|]/g, "");
        validFlavourText = true;
        Game.PROGRESS_NO_NAMES = false;
      }
    }
    armour[0] = userArmourName + "|" + userFlavourText;
    if (userArmourName.trim() === "") {
      Game.giveBadge(Game.BADGE_NO_NAME);
    } // Unimaginative
    if (userFlavourText.trim() === "") {
      Game.giveBadge(Game.BADGE_NO_FLAVOUR);
    } // Lacking in Flavour
    armour[0] = (userArmourName.trim() !== "" ? userArmourName : armour[0]) + "|" + (userFlavourText.trim() !== "" ? userFlavourText : "I have no flavour.");
    break;
  case Game.QUALITY_GREAT:
    availableTypes = [0, 1, 2];
    availableTypes.splice(availableTypes.indexOf(armour[4][0][0] - Game.ARMOUR_STR_MELEE), 1);
    availableTypes.splice(availableTypes.indexOf(armour[4][1][0] - Game.ARMOUR_STR_MELEE), 1);
    buffPower = 3 + Math.floor(Game.RNG(Math.floor(armour[1] / 2), armour[1]));
    armour[4].push([availableTypes[0] + Game.ARMOUR_STR_MELEE, buffPower]);
    break;
  }
  armour[2] += 1;
  for (x = 0; x < armour[4].length; x += 1) {
    armour[4][x][1] += 1;
  }
  return armour;
};

Game.buyArmourQualityUpgrade = function () {
  var scrapCost = Game.calculateItemQualityPrice(Game.p_Armour[2]);
  if (Game.p_Armour[2] < Game.QUALITY_AMAZING && Game.p_Scrap >= scrapCost) {
    Game.p_Scrap -= scrapCost;
    Game.upgradeArmourQuality(Game.p_Armour);
    Game.toastNotification("装甲品阶升级");
    Game.TRACK_UPGRADES += 1;
    Game.drawActivePanel();
  } else {
    if (Game.p_Armour[2] === Game.QUALITY_AMAZING) {
      Game.toastNotification("装甲已经达到最高品阶。");
    } else {
      Game.toastNotification("没有足够碎片...");
    }
  }
  Game.updateForge = true;
};

// Let's mop up by combining four functions into one.
Game.automaticInventoryClear = function () {
  // Weapons first
  var i = 0, seedsGained = 0, scrapGained = 0;
  for (i = Game.p_WeaponInventory.length - 1; i >= 0; i -= 1) {
    switch (Game.autoSell_options[Game.p_WeaponInventory[i][7] - Game.QUALITY_POOR]) {
    case "SELL":
      seedsGained += Game.sellWeapon(i, false);
      break;
    case "SCRAP":
      scrapGained += Game.scrapWeapon(i, false);
      break;
    }
  }
  // Now armour
  for (i = Game.p_ArmourInventory.length - 1; i >= 0; i -= 1) {
    switch (Game.autoSell_options[Game.p_ArmourInventory[i][2] - Game.QUALITY_POOR]) {
    case "SELL":
      seedsGained += Game.sellArmour(i, false);
      break;
    case "SCRAP":
      scrapGained += Game.scrapArmour(i, false);
      break;
    }
  }
  Game.toastNotification("库存清理获得 " + prettifyNumber(seedsGained) + " 种子和 " + prettifyNumber(scrapGained) + " 碎片。");
};

// These two don't get called often, because they're only for the lazy who don't sell their stuff.
Game.takeWeapon = function () {
  if (Game.p_WeaponInventory.length < Game.MAX_INVENTORY) {
    Game.p_WeaponInventory.push(Game.last_Weapon.slice(0));
    Game.last_Weapon = [];
  } else {
    Game.toastNotification("武器仓库已满");
  }
  Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
  Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
  Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
  Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
  Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  Game.updateInventory = true;
  Game.drawActivePanel();
};

Game.takeArmour = function () {
  if (Game.p_ArmourInventory.length < Game.MAX_INVENTORY) {
    Game.p_ArmourInventory.push(Game.last_Armour.slice(0));
    Game.last_Armour = [];
  } else {
    Game.toastNotification("装备仓库已满。");
  }
  Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
  Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
  Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
  Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
  Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  Game.updateInventory = true;
  Game.drawActivePanel();
};

Game.reforgeWeapon = function (debuff, isSuperior) {
  var debuffCost = 0, isRandom = false, dbName = '', validDebuffName = false;
  debuffCost = isSuperior ? 2 : 1;
  if (debuff >= Game.DEBUFF_SHRED) {
    debuffCost *= 4;
  }
  if (Game.p_Weapon[7] < Game.QUALITY_GREAT && isSuperior) {
    Game.toastNotification("只有优秀的或传奇的武器，才能获得优越的负面效果。");
  } else if (Game.p_Weapon[7] < Game.QUALITY_GOOD) {
    Game.toastNotification("对于低于“良好”的武器来说，重新锻造是不可用的。");
  } else if (Game.p_Scrap < debuffCost) {
    Game.toastNotification("你负担不起这种重建。");
  } else {
    isRandom = false;
    if (debuff < Game.DEBUFF_SHRED) {
      debuff = Game.RNG(Game.DEBUFF_SHRED, Game.DEBUFF_DISARM);
      isRandom = true;
      Game.PROGRESS_RANDOM_DEBUFFS += 1;
      Game.badgeCheck(Game.BADGE_RANDOM_DEBUFFS); // Rolling the Bones
    }
    dbName = "";
    validDebuffName = false;
    if ((isSuperior || debuff === Game.DEBUFF_MC) && !isRandom) {
      while (!validDebuffName) {
        dbName = prompt("请提供一个新的负面效果名称。保留空白以使用默认值。最多30个字符。 \n\n(选择类型: " + Game.debuff_names[debuff - Game.DEBUFF_SHRED] + ")");
        if (dbName.length > 30) {
          alert("所提供的文本太长，请尽量缩短。");
        } else if (/[<>|]/g.test(dbName)) {
          alert("所提供的文本包含无效字符，请尝试其他内容。");
        } else {
          dbName = dbName.replace(/[<>|]/g, "");
          validDebuffName = true;
        }
      }
    }
    switch (debuff) {
    case 241:
      if (isSuperior) {
        Game.p_Weapon[9] = [241, (dbName.trim() === "" ? "冷酷无情" : dbName), 15, -1];
      } else {
        Game.p_Weapon[9] = [241, "冷酷无情", 10, -1];
      }
      break;
    case 242:
      if (isSuperior) {
        Game.p_Weapon[9] = [242, (dbName.trim() === "" ? "狂暴" : dbName), 15, 70];
      } else {
        Game.p_Weapon[9] = [242, "狂暴", 10, 50];
      }
      break;
    case 243:
      if (isSuperior) {
        Game.p_Weapon[9] = [243, (dbName.trim() === "" ? "嗜血" : dbName), 15, 30];
      } else {
        Game.p_Weapon[9] = [243, "嗜血", 10, 20];
      }
      break;
    case 244:
      if (isSuperior) {
        Game.p_Weapon[9] = [244, (dbName.trim() === "" ? "削弱" : dbName), 15, 25];
      } else {
        Game.p_Weapon[9] = [244, "削弱", 10, 15];
      }
      break;
    case 245:
      Game.p_Weapon[9] = [245, (dbName.trim() === "" ? "魅力" : dbName), 5, -1];
      break;
    case 246:
      if (isSuperior) {
        Game.p_Weapon[9] = [246, (dbName.trim() === "" ? "致伤毒药" : dbName), 15, 30];
      } else {
        Game.p_Weapon[9] = [246, "致伤毒药", 10, 20];
      }
      break;
    case 247:
      if (isSuperior) {
        Game.p_Weapon[9] = [247, (dbName.trim() === "" ? "神经攻击" : dbName), 15, 25];
      } else {
        Game.p_Weapon[9] = [247, "神经攻击", 10, 15];
      }
      break;
    case 248:
      if (isSuperior) {
        Game.p_Weapon[9] = [248, (dbName.trim() === "" ? "与日俱增的恐惧" : dbName), 5, 10];
      } else {
        Game.p_Weapon[9] = [248, "与日俱增的恐惧", 5, 6];
      }
      break;
    case 249:
      if (isSuperior) {
        Game.p_Weapon[9] = [249, (dbName.trim() === "" ? "解除武装" : dbName), 15, -1];
      } else {
        Game.p_Weapon[9] = [249, "解除武装", 10, -1];
      }
      break;
    case 250:
      if (isSuperior) {
        Game.p_Weapon[9] = [250, (dbName.trim() === "" ? "昏睡" : dbName), 15, 10];
      } else {
        Game.p_Weapon[9] = [250, "昏睡", 10, 20];
      }
      break;
    }
    Game.p_Scrap -= debuffCost;
    Game.toastNotification("武器已经重新锻造。");
    Game.TRACK_REFORGES += 1;
    Game.PROGRESS_DEBUFF_SPEND += debuffCost; // Happy Customer
  }
  Game.updateForge = true;
};

Game.repopulateShop = function () {
  Game.repopulateWeaponShop();
  Game.repopulateArmourShop();
};

Game.repopulateWeaponShop = function () {
  var isGreat = false, firstItem = [], nextItem = [], levelCap = 0, x = 1;
  Game.p_WeaponShopStock = [];
  isGreat = false;
  firstItem = [];
  levelCap = Math.min(Game.p_Level, (Game.p_currentZone + 1) * 10);
  while (!isGreat) {
    firstItem = Game.makeWeapon(levelCap);
    if (firstItem[7] >= Game.QUALITY_GREAT) {
      isGreat = true;
    }
  }
  Game.p_WeaponShopStock.push(firstItem);
  for (x = 1; x <= Game.p_ShopStockLimit; x += 1) {
    nextItem = Game.makeWeapon(levelCap);
    while (nextItem[7] < Game.QUALITY_GOOD) {
      nextItem = Game.makeWeapon(levelCap);
    }
    Game.p_WeaponShopStock.push(nextItem);
  }
};

Game.repopulateArmourShop = function () {
  var isGreat = false, firstItem = [], nextItem = [], levelCap = 0, x = 1;
  Game.p_ArmourShopStock = [];
  isGreat = false;
  firstItem = [];
  levelCap = Math.min(Game.p_Level, (Game.p_currentZone + 1) * 10);
  while (!isGreat) {
    firstItem = Game.makeArmour(levelCap);
    if (firstItem[2] >= Game.QUALITY_GREAT) {
      isGreat = true;
    }
  }
  Game.p_ArmourShopStock.push(firstItem);
  for (x = 1; x <= Game.p_ShopStockLimit; x += 1) {
    nextItem = Game.makeArmour(levelCap);
    while (nextItem[2] < Game.QUALITY_GOOD) {
      nextItem = Game.makeArmour(levelCap);
    }
    Game.p_ArmourShopStock.push(nextItem);
  }
};

document.getElementById("loadedInventory").style.display = "";
