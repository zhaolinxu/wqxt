/*-----------------------------
inventory.js

Functions for inventory control
and management. Includes store.
-----------------------------*/

// Yes, I'm doing a lot of array slicing in here. Weird things can happen if you pass them around by reference, it's safer this way :)
Game.equipWeapon = function(index) {
  // How do you like my new pointy.
  var currentWep = Game.p_Weapon.slice(0);
  var newWep = Game.p_WeaponInventory[index].slice(0);
  Game.p_Weapon = newWep.slice(0);
  Game.p_WeaponInventory[index] = currentWep.slice(0);
  Game.updateInventory = true;
  Game.updateForge = true;
  Game.toastNotification("Equipped <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span>.");
  Game.badgeCheck(Game.BADGE_BOSSGEAR); // Like a Boss
  Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
  Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
  Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
  Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
  Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  Game.drawActivePanel();
}
Game.discardWeapon = function(index) {
  // Don't let them throw me away!
  var thrownWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  Game.toastNotification("<span class='q" + Game.p_WeaponInventory[index][7] + "'>" + thrownWepName + "</span> tossed away.");
  Game.p_WeaponInventory.splice(index,1);
  Game.updateInventory = true;
  Game.TRACK_ITEM_DISCARDS++;
  Game.badgeCheck(Game.BADGE_DISCARDS);
  Game.drawActivePanel();
}
Game.sellWeapon = function(index, loud) {
  var salePrice = Math.floor(25*Math.pow(1.1,Game.p_WeaponInventory[index][1])*(1+0.05*Game.powerLevel(Game.BOOST_SELL)));
  salePrice = Math.floor(salePrice*(10+(Game.p_WeaponInventory[index][7]-Game.QUALITY_NORMAL))/10);
  var soldWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  if(loud) { Game.toastNotification("<span class='q" + Game.p_WeaponInventory[index][7] + "'>" + soldWepName + "</span> sold for " + salePrice + " seeds."); }
  Game.p_WeaponInventory.splice(index,1);
  Game.updateInventory = true;
  Game.p_Currency += salePrice;
  Game.TRACK_ITEM_SALES++;
  Game.TRACK_SALE_SEEDS += salePrice;
  Game.drawActivePanel();
  if(!loud) { return salePrice; }
}
Game.scrapWeapon = function(index, loud) {
  // Breaking things willingly.
  var salePrice = 0;
  var scrappedWepName = Game.p_WeaponInventory[index][0].split("|")[0];
  switch(Game.p_WeaponInventory[index][7]) {
    case Game.QUALITY_AMAZING:
      salePrice = Game.RNG(7,10);
      break;
    case Game.QUALITY_GREAT:
      salePrice = Game.RNG(4,6);
      break;
    case Game.QUALITY_GOOD:
      salePrice = Game.RNG(2,3);
      break;
    case Game.QUALITY_NORMAL:
      salePrice = Game.RNG(1,2);
      break;
    case Game.QUALITY_POOR:
      salePrice = Game.RNG(0,1);
      break;
  }
  if(Game.powerLevel(Game.BOOST_MORESCRAP) == 1) { salePrice++; }
  if(loud) { Game.toastNotification("<span class='q" + Game.p_WeaponInventory[index][7] + "'>" + scrappedWepName + "</span> converted into " + salePrice + " scrap."); }
  Game.p_WeaponInventory.splice(index,1);
  Game.updateInventory = true;
  Game.p_Scrap += salePrice;
  Game.TRACK_ITEM_SCRAPS++;
  Game.TRACK_CONVERT_SCRAP += salePrice;
  Game.badgeCheck(Game.BADGE_SCRAPPING);
  Game.drawActivePanel();
  if(!loud) { return salePrice; }
}
Game.equipArmour = function(index) {
  var currentArm = Game.p_Armour.slice(0);
  var newArm = Game.p_ArmourInventory[index].slice(0);
  Game.p_Armour = newArm.slice(0);
  Game.p_ArmourInventory[index] = currentArm.slice(0);
  Game.updateInventory = true;
  Game.updateForge = true;
  Game.toastNotification("Equipped <span class='q" + Game.p_Armour[2] + "'>" + Game.p_Armour[0].split("|")[0] + "</span>.");
  Game.badgeCheck(Game.BADGE_BOSSGEAR); // Like a Boss
  Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
  Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
  Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
  Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
  Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  Game.drawActivePanel();
}
Game.discardArmour = function(index) {
  var thrownArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  Game.toastNotification("<span class='q" + Game.p_ArmourInventory[index][2] + "'>" + thrownArmName + "</span> tossed away.");
  Game.p_ArmourInventory.splice(index,1);
  Game.updateInventory = true;
  Game.TRACK_ITEM_DISCARDS++;
  Game.badgeCheck(Game.BADGE_DISCARDS);
  Game.drawActivePanel();
}
Game.sellArmour = function(index, loud) {
  var salePrice = Math.floor(25*Math.pow(1.1,Game.p_ArmourInventory[index][1])*(1+0.05*Game.powerLevel(Game.BOOST_SELL)));
  salePrice = Math.floor(salePrice*(10+(Game.p_ArmourInventory[index][2]-Game.QUALITY_NORMAL))/10);
  var soldArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  if(loud) { Game.toastNotification("<span class='q" + Game.p_ArmourInventory[index][2] + "'>" + soldArmName + "</span> sold for " + salePrice + " seeds."); }
  Game.p_ArmourInventory.splice(index,1);
  Game.updateInventory = true;
  Game.p_Currency += salePrice;
  Game.TRACK_ITEM_SALES++;
  Game.TRACK_SALE_SEEDS += salePrice;
  Game.drawActivePanel();
  if(!loud) { return salePrice; }
}
Game.scrapArmour = function(index, loud) {
  var salePrice = 0;
  var scrappedArmName = Game.p_ArmourInventory[index][0].split("|")[0];
  switch(Game.p_ArmourInventory[index][2]) {
    case Game.QUALITY_AMAZING:
      salePrice = Game.RNG(7,10);
      break;
    case Game.QUALITY_GREAT:
      salePrice = Game.RNG(4,6);
      break;
    case Game.QUALITY_GOOD:
      salePrice = Game.RNG(2,3);
      break;
    case Game.QUALITY_NORMAL:
      salePrice = Game.RNG(1,2);
      break;
    case Game.QUALITY_POOR:
      salePrice = Game.RNG(0,1);
      break;
  }
  if(Game.powerLevel(Game.BOOST_MORESCRAP) == 1) { salePrice++; }
  if(loud) { Game.toastNotification("<span class='q" + Game.p_ArmourInventory[index][2] + "'>" + scrappedArmName + "</span> converted into " + salePrice + " scrap."); }
  Game.p_ArmourInventory.splice(index,1);
  Game.updateInventory = true;
  Game.p_Scrap += salePrice;
  Game.TRACK_ITEM_SCRAPS++;
  Game.TRACK_CONVERT_SCRAP += salePrice;
  Game.badgeCheck(Game.BADGE_SCRAPPING);
  Game.drawActivePanel();
  if(!loud) { return salePrice; }
}
Game.makeWeapon = function(level) {
	// Returns a weapon as an array with the form
	// [name,level,type,speed,minDmg,maxDmg,dps,quality,decay,[debuffID,debuffName,debuffDuration,debuffStrength]]
	var type = Game.RNG(Game.WEAPON_MELEE,Game.WEAPON_MAGIC);
	var sType = Game.RNG(Game.WSPEED_SLOW, Game.WSPEED_FAST);
	var speed = 0;
	var minDmg = 0; var maxDmg = 0;
	var dps = 0;
	var decay = 50 + 5*(level-1);
	var qualityMult = 1; var qualityID = Game.QUALITY_NORMAL;
  var debuff = [];
	// Quality generator
	var qT = Game.RNG(1,100);
	if(qT == 1) {
		qualityMult = 1.3;
		qualityID = Game.QUALITY_AMAZING;
	} else if(qT < 6) {
		qualityMult = 1.2;
		qualityID = Game.QUALITY_GREAT;
	} else if(qT < 16) {
		qualityMult = 1.1;
		qualityID = Game.QUALITY_GOOD;
	} else if(qT < 26) {
		qualityMult = 0.9;
		qualityID = Game.QUALITY_POOR;
	} else {
		qualityMult = 1;
		qualityID = Game.QUALITY_NORMAL;
	}
	// Weapon speed
	switch(sType) {
		case Game.WSPEED_FAST:
			speed = Game.RNG(16,20);
			break;
		case Game.WSPEED_MID:
			speed = Game.RNG(21,25);
			break;
		case Game.WSPEED_SLOW:
			speed = Game.RNG(26,30);
			break;
	}
	speed = speed/10;
	var base = 0; var variance = 0; var perLv = 0;
	switch(sType) {
		case Game.WSPEED_FAST:
			base = Game.RNG(8,10);
			perLv = 2;
			variance = 0.3;
			break;
		case Game.WSPEED_MID:
			base = Game.RNG(11,13);
			perLv = 2.5;
			variance = 0.4;
			break;
		case Game.WSPEED_SLOW:
			base = Game.RNG(14,16);
			perLv = 3;
			variance = 0.5;
			break;
	}
  var name = Game.getWeaponName(type,qualityID,sType);
  // Logic time!
  // Weapon damage = (Base + Bonus based on weapon level +/- Variance based on level) * Quality multiplier
	minDmg = Math.floor((base + ((level-1)*perLv)-(1+(variance*(level-1)/2)))*qualityMult);
	maxDmg = Math.ceil((base + ((level-1)*perLv)+(1+(variance*(level-1)/2)))*qualityMult);
	dps = Math.floor((minDmg + maxDmg)/2/speed*100)/100;
	return new Array(name[0],level,type,speed,minDmg,maxDmg,dps,qualityID,decay,name[1]);
}
Game.makeArmour = function(level) {
  // Returns a piece of armour in the following form:
  // [name,level,quality,durability,[[str1,value],[str2,value],[str3,value]],[[vuln1,value],[vuln2,value]]]
  var armLevel = level;
  var armDura = 50+(5*(level-1));
  var armQuality = 0;
  var qualityPlus = 1;
  var armStrengths = 0; var armVulns = 0;
  var qT = Game.RNG(1,100);
	if(qT == 1) {
		qualityPlus = 4;	armQuality = Game.QUALITY_AMAZING;
    armStrengths = 3; armVulns = 0;
	} else if(qT < 6) {
		qualityPlus = 3; armQuality = Game.QUALITY_GREAT;
    armStrengths = 2; armVulns = 0;
	} else if(qT < 16) {
		qualityPlus = 2;armQuality = Game.QUALITY_GOOD;
    armStrengths = 2; armVulns = 1;
	} else if(qT < 26) {
		qualityPlus = 0; armQuality = Game.QUALITY_POOR;
    armStrengths = 1; armVulns = 2;
	} else {
		qualityPlus = 1; armQuality = Game.QUALITY_NORMAL;
    armStrengths = 1; armVulns = 1;
	}
  var availableTypes = [0,1,2];
  var armStrList = [];
  var armVulnList = [];
  // Add blocking values here
  for(var x = 0; x < armStrengths; x++) {
    var added = false;
    while(!added) {
      // This loop is to ensure that armours don't boost the same stat multiple times.
      var strType = Game.RNG(Game.ARMOUR_STR_MELEE, Game.ARMOUR_STR_MAGIC);
      if(availableTypes.indexOf(strType - Game.ARMOUR_STR_MELEE) != -1) {
        // The bonus values are based off level and quality, with minor variance
        // Variances are small in early game and open up as you gain levels.
        var strPower = 1 + Math.floor(qualityPlus + Game.RNG(Math.floor(level/2),level));
        var str = [strType, strPower];
        armStrList.push(str.slice(0));
        availableTypes.splice(availableTypes.indexOf(strType - Game.ARMOUR_STR_MELEE),1);
        added = true;
      }
    }
  }
  // Now we put holes in it.
  for(var y = 0; y < armVulns; y++) {
    var added = false;
    while(!added) {
      // See above for loop explanation
      var vulnType = Game.RNG(Game.ARMOUR_VULN_MELEE, Game.ARMOUR_VULN_MAGIC);
      if(availableTypes.indexOf(vulnType - Game.ARMOUR_VULN_MELEE) != -1) {
        var vulnPower = 1 + Math.floor(qualityPlus + Game.RNG(Math.floor(level/2),level));
        var vuln = [vulnType, vulnPower];
        armVulnList.push(vuln.slice(0));
        availableTypes.splice(availableTypes.indexOf(vulnType - Game.ARMOUR_VULN_MELEE),1);
        added = true;
      }
    }
  }
  var armName = Game.getArmourName(armQuality);
  return [armName, armLevel, armQuality, armDura, armStrList.slice(0), armVulnList.slice(0)];
}
Game.getWeaponName = function(type,quality,speedTier) {
  // The lengths we go to for making names.
  var nameArray = [];
  var debuffArray = [];
  switch(type) {
    // Weapons are named differently based on how fast their attack is and what type of attack it is.
    case Game.WEAPON_MELEE:
      switch(speedTier) {
        case Game.WSPEED_SLOW:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.slow_melee_special;
            debuffArray = Game.slow_melee_debuffs;
          } else { nameArray = Game.slow_melee_generic; }
          break;
        case Game.WSPEED_MID:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.mid_melee_special;
            debuffArray = Game.mid_melee_debuffs;
          } else { nameArray = Game.mid_melee_generic; }
          break;
        case Game.WSPEED_FAST:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.fast_melee_special;
            debuffArray = Game.fast_melee_debuffs;
          } else { nameArray = Game.fast_melee_generic; }
          break;
      }
      break;
    case Game.WEAPON_RANGE:
      switch(speedTier) {
        case Game.WSPEED_SLOW:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.slow_range_special;
            debuffArray = Game.slow_range_debuffs;
          } else { nameArray = Game.slow_range_generic; }
          break;
        case Game.WSPEED_MID:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.mid_range_special;
            debuffArray = Game.mid_range_debuffs;
          } else { nameArray = Game.mid_range_generic; }
          break;
        case Game.WSPEED_FAST:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.fast_range_special;
            debuffArray = Game.fast_range_debuffs;
          } else { nameArray = Game.fast_range_generic; }
          break;
      }
      break;
    case Game.WEAPON_MAGIC:
      switch(speedTier) {
        case Game.WSPEED_SLOW:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.slow_magic_special;
            debuffArray = Game.slow_magic_debuffs;
          } else { nameArray = Game.slow_magic_generic; }
          break;
        case Game.WSPEED_MID:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.mid_magic_special;
            debuffArray = Game.mid_magic_debuffs;
          } else { nameArray = Game.mid_magic_generic; }
          break;
        case Game.WSPEED_FAST:
          if(quality>=Game.QUALITY_GREAT) {
            nameArray = Game.fast_magic_special;
            debuffArray = Game.fast_magic_debuffs;
          } else { nameArray = Game.fast_magic_generic; }
          break;
      }
      break;
  }
  if(quality >= Game.QUALITY_GREAT) {
    var arrayIndex = Game.RNG(0,nameArray.length-1);
    return [nameArray[arrayIndex],debuffArray[arrayIndex]];
  } else {
    // We get to add a prefix to non-awesome weapons to show their usefulness or lack thereof
    var qualityState = Game.weaponQualityDescriptors[quality-Game.QUALITY_POOR];
    if(quality == Game.QUALITY_GOOD) {
      var debuff = Game.debuffs_generic[Game.RNG(0,Game.debuffs_generic.length-1)];
      return [(qualityState[Game.RNG(0,qualityState.length-1)] + " " + nameArray[Game.RNG(0,nameArray.length-1)]).trim(),debuff.slice()];
    }
    return [(qualityState[Game.RNG(0,qualityState.length-1)] + " " + nameArray[Game.RNG(0,nameArray.length-1)]).trim(),[]];
  }
}
Game.getArmourName = function(quality) {
  if(quality >= Game.QUALITY_GREAT) {
    return Game.armour_special[Game.RNG(0,Game.armour_special.length-1)];
  }
  else {
    var qualitySet = Game.armourQualityDescriptors[quality-Game.QUALITY_POOR];
    var aName = qualitySet[Game.RNG(0,qualitySet.length-1)] + " " + Game.armour_generic[Game.RNG(0,Game.armour_generic.length-1)];
    return aName.trim();
  }
}
Game.upgradeWeaponLevel = function(weapon) {
  // We make it better now.
  weapon[1]++;
  var qualityMult = 1.0;
  switch(weapon[7]) {
    case Game.QUALITY_POOR:
      qualityMult = 0.9; break;
    case Game.QUALITY_GOOD:
      qualityMult = 1.1; break;
    case Game.QUALITY_GREAT:
      qualityMult = 1.2; break;
    case Game.QUALITY_AMAZING:
      qualityMult = 1.3; break;
  }
  switch(weapon[3]) {
    case 1.6:
    case 1.7:
    case 1.8:
    case 1.9:
    case 2.0:
      weapon[4] = Math.floor(weapon[4]+1.7*qualityMult);
      weapon[5] = Math.floor(weapon[5]+2.3*qualityMult);
      break;
    case 2.1:
    case 2.2:
    case 2.3:
    case 2.4:
    case 2.5:
      weapon[4] = Math.floor(weapon[4]+2.1*qualityMult);
      weapon[5] = Math.floor(weapon[5]+2.9*qualityMult);
      break;
    case 2.6:
    case 2.7:
    case 2.8:
    case 2.9:
    case 3.0:
      weapon[4] = Math.floor(weapon[4]+2.5*qualityMult);
      weapon[5] = Math.floor(weapon[5]+3.5*qualityMult);
      break;
  }
  weapon[6] = Math.floor((weapon[4] + weapon[5])/2/weapon[3]*100)/100;
  return weapon;
}
Game.upgradeArmourLevel = function(armour) {
  armour[1]++;
  for(var x = 0; x < armour[4].length; x++) {
    armour[4][x][1]++;
  }
  for(var y = 0; y < armour[5].length; y++) {
    armour[5][y][1]++;
  }
  return armour;
}
Game.calculateItemLevelPrice = function(level, quality) {
  var upgradeCost = Math.floor(150 * Math.pow(1.06,level) * (1-0.02*Game.powerLevel(Game.BOOST_PRICES)));
  upgradeCost = Math.floor(upgradeCost*(10+(quality-Game.QUALITY_NORMAL))/10);
  return upgradeCost;
}
Game.calculateItemQualityPrice = function(quality) {
   return Math.pow(4,(quality-Game.QUALITY_POOR));
}
Game.buyWeapon = function(index) {
  var purchase = Game.p_WeaponShopStock[index];
  var cost = 2 * Game.calculateItemLevelPrice(purchase[1],purchase[7]);
  if(Game.p_WeaponInventory.length == Game.MAX_INVENTORY) {
    Game.toastNotification("Weapon inventory is full...");
    return 0;
  }
  if(Game.p_Currency >= cost) {
    Game.p_WeaponInventory.push(purchase);
    Game.p_WeaponShopStock.splice(index,1);
    Game.p_Currency -= cost;
    Game.toastNotification("Purchased <span class='q" + purchase[7] + "'>" + purchase[0].split("|")[0] + "</span>.");
    Game.giveBadge(Game.BADGE_FIRST_BUY);
    Game.PROGRESS_SPEND += cost;
    Game.badgeCheck(Game.BADGE_SPEND3);
    Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
    Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
    Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
    Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
    Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  }
  else {
    Game.toastNotification("Not enough seeds...");
  }
  Game.drawActivePanel();
}
Game.buyArmour = function(index) {
  var purchase = Game.p_ArmourShopStock[index];
  var cost = 2 * Game.calculateItemLevelPrice(purchase[1],purchase[2]);
  if(Game.p_ArmourInventory.length == Game.MAX_INVENTORY) {
    Game.toastNotification("Armour inventory is full...");
    return 0;
  }
  if(Game.p_Currency >= cost) {
    Game.p_ArmourInventory.push(purchase);
    Game.p_ArmourShopStock.splice(index,1);
    Game.p_Currency -= cost;
    Game.toastNotification("Purchased <span class='q" + purchase[2] + "'>" + purchase[0].split("|")[0] + "</span>.");
    Game.giveBadge(Game.BADGE_FIRST_BUY);
    Game.PROGRESS_SPEND += cost;
    Game.badgeCheck(Game.BADGE_SPEND3);
    Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
    Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
    Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
    Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
    Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  }
  else {
    Game.toastNotification("Not enough seeds...");
  }
  Game.drawActivePanel();
}
Game.buyWeaponLevelUpgrade = function() {
  var upgradeCost = Game.calculateItemLevelPrice(Game.p_Weapon[1], Game.p_Weapon[7]);
  if(Game.p_Currency >= upgradeCost) {
    Game.p_Currency -= upgradeCost;
    Game.upgradeWeaponLevel(Game.p_Weapon);
    Game.toastNotification("Weapon level upgraded.");
    Game.TRACK_UPGRADES++;
    Game.drawActivePanel();
  }
  else { Game.toastNotification("Not enough seeds..."); }
  Game.updateForge = true;
}
Game.buyArmourLevelUpgrade = function() {
  var upgradeCost = Game.calculateItemLevelPrice(Game.p_Armour[1], Game.p_Armour[2]);
  if(Game.p_Currency >= upgradeCost) {
    Game.p_Currency -= upgradeCost;
    Game.upgradeArmourLevel(Game.p_Armour);
    Game.toastNotification("Armour level upgraded.");
    Game.TRACK_UPGRADES++;
    Game.drawActivePanel();
  }
  else { Game.toastNotification("Not enough seeds..."); }
  Game.updateForge = true;
}
Game.upgradeWeaponQuality = function(weapon) {
  var baseMin = Math.floor(weapon[4]/(10+(weapon[7]-Game.QUALITY_NORMAL))*10);
  var baseMax = Math.ceil(weapon[5]/(10+(weapon[7]-Game.QUALITY_NORMAL))*10);
  if(weapon[7] == Game.QUALITY_NORMAL) {
    // Add a random debuff when transitioning from Normal to Good quality
    var dbIndex = Game.RNG(0,Game.debuffs_generic.length-1);
    weapon[9] = Game.debuffs_generic[dbIndex];
  }
  if(weapon[7] == Game.QUALITY_GOOD) {
    var validWeaponName = false;
    var userWeaponName = "";
    while(!validWeaponName) {
      userWeaponName = prompt("Please provide a name for your upgraded weapon.\n\n(Max 40 characters)");
      if(userWeaponName == null) { userWeaponName = ""; }
      if(userWeaponName.length > 40) { alert("The text provided was too long, please try something shorter."); }
      else if(/[<>|]/g.test(userWeaponName)) { alert("The text provided contained invalid characters, please try something else."); }
      else { userWeaponName = userWeaponName.replace(/[<>|]/g,""); validWeaponName = true; }
    }
    var validFlavourText = false;
    var userFlavourText = "";
    while(!validFlavourText) {
      userFlavourText = prompt("Please provide some flavour text for your upgraded weapon.\n\n(Max 60 characters)");
      if(userFlavourText == null) { userFlavourText = ""; }
      if(userFlavourText.length > 60) { alert("The text provided was too long, please try something shorter."); }
      else if(/[<>|]/g.test(userFlavourText)) { alert("The text provided contained invalid characters, please try something else."); }
      else { userFlavourText = userFlavourText.replace(/[<>|]/g,""); validFlavourText = true; }
    }
    if(userWeaponName.trim() === "") { Game.giveBadge(Game.BADGE_NO_NAME); } // Unimaginative
    if(userFlavourText.trim() === "") { Game.giveBadge(Game.BADGE_NO_FLAVOUR); } // Lacking in Flavour
    weapon[0] = (userWeaponName.trim() !== "" ? userWeaponName : weapon[0]) + "|" + (userFlavourText.trim() !== "" ? userFlavourText : "I have no flavour.");
  }
  weapon[7]++;
  weapon[4] = Math.ceil(baseMin*(10+(weapon[7]-Game.QUALITY_NORMAL))/10);
  weapon[5] = Math.ceil(baseMax*(10+(weapon[7]-Game.QUALITY_NORMAL))/10);
  weapon[6] = Math.floor(((weapon[4]+weapon[5])/2/weapon[3])*100)/100;
  return weapon;
}
Game.buyWeaponQualityUpgrade = function() {
  var scrapCost = Game.calculateItemQualityPrice(Game.p_Weapon[7]);
  if(Game.p_Weapon[7] < Game.QUALITY_AMAZING && Game.p_Scrap >= scrapCost) {
    Game.p_Scrap -= scrapCost;
    Game.upgradeWeaponQuality(Game.p_Weapon);
    Game.toastNotification("Weapon quality upgraded");
    Game.TRACK_UPGRADES++;
    Game.drawActivePanel();
  }
  else {
    if(Game.p_Weapon[7] == Game.QUALITY_AMAZING) { Game.toastNotification("Weapon already at highest quality."); }
    else { Game.toastNotification("Not enough scrap..."); }
  }
  Game.updateForge = true;
}
Game.upgradeArmourQuality = function(armour) {
  switch(armour[2]) {
    case Game.QUALITY_POOR:
      armour[5].pop();
      break;
    case Game.QUALITY_NORMAL:
      var availableTypes = [0,1,2];
      availableTypes.splice(availableTypes.indexOf(armour[4][0][0] - Game.ARMOUR_STR_MELEE),1);
      availableTypes.splice(availableTypes.indexOf(armour[5][0][0] - Game.ARMOUR_VULN_MELEE),1);
      var buffPower = 1 + Math.floor(Game.RNG(Math.floor(armour[1]/2),armour[1]));
      armour[4].push([availableTypes[0]+Game.ARMOUR_STR_MELEE,buffPower]);
      break;
    case Game.QUALITY_GOOD:
      armour[5].pop();
      var validArmourName = false;
      var userArmourName = "";
      while(!validArmourName) {
        userArmourName = prompt("Please provide a name for your upgraded armour.\n\n(Max 40 characters)");
        if(userArmourName == null) { userArmourName = ""; }
        if(userArmourName.length > 40) { alert("The text provided was too long, please try something shorter."); }
        else if(/[<>|]/g.test(userArmourName)) { alert("The text provided contained invalid characters, please try something else."); }
        else { userArmourName = userArmourName.replace(/[<>|]/g,""); validArmourName = true; }
      }
      var validFlavourText = false;
      var userFlavourText = "";
      while(!validFlavourText) {
        userFlavourText = prompt("Please provide some flavour text for your upgraded armour.\n\n(Max 60 characters)");
        if(userFlavourText == null) { userFlavourText = ""; }
        if(userFlavourText.length > 60) { alert("The text provided was too long, please try something shorter."); }
        else if(/[<>|]/g.test(userFlavourText)) { alert("The text provided contained invalid characters, please try something else."); }
        else { userFlavourText = userFlavourText.replace(/[<>|]/g,""); validFlavourText = true; }
      }
      armour[0] = userArmourName + "|" + userFlavourText;
      if(userArmourName.trim() === "") { Game.giveBadge(Game.BADGE_NO_NAME); } // Unimaginative
      if(userFlavourText.trim() === "") { Game.giveBadge(Game.BADGE_NO_FLAVOUR); } // Lacking in Flavour
      armour[0] = (userArmourName.trim() !== "" ? userArmourName : armour[0]) + "|" + (userFlavourText.trim() !== "" ? userFlavourText : "I have no flavour.");
      break;
    case Game.QUALITY_GREAT:
      var availableTypes = [0,1,2];
      availableTypes.splice(availableTypes.indexOf(armour[4][0][0] - Game.ARMOUR_STR_MELEE),1);
      availableTypes.splice(availableTypes.indexOf(armour[4][1][0] - Game.ARMOUR_STR_MELEE),1);
      var buffPower = 3 + Math.floor(Game.RNG(Math.floor(armour[1]/2),armour[1]));
      armour[4].push([availableTypes[0]+Game.ARMOUR_STR_MELEE,buffPower]);
      break;
  }
  armour[2]++;
  for(var x = 0; x < armour[4].length; x++) {
    armour[4][x][1]++;
  }
  return armour;
}
Game.buyArmourQualityUpgrade = function() {
  var scrapCost = Game.calculateItemQualityPrice(Game.p_Armour[2]);
  if(Game.p_Armour[2] < Game.QUALITY_AMAZING && Game.p_Scrap >= scrapCost) {
    Game.p_Scrap -= scrapCost;
    Game.upgradeArmourQuality(Game.p_Armour);
    Game.toastNotification("Armour quality upgraded");
    Game.TRACK_UPGRADES++;
    Game.drawActivePanel();
  }
  else {
    if(Game.p_Armour[2] == Game.QUALITY_AMAZING) { Game.toastNotification("Armour already at highest quality."); }
    else { Game.toastNotification("Not enough scrap..."); }
  }
  Game.updateForge = true;
}
// Let's mop up by combining four functions into one.
Game.automaticInventoryClear = function() {
  // Weapons first
  var seedsGained = 0;
  var scrapGained = 0;
  for(var i = Game.p_WeaponInventory.length-1; i >= 0; i--) {
    switch(Game.autoSell_options[Game.p_WeaponInventory[i][7]-Game.QUALITY_POOR]) {
      case "SELL":
        seedsGained += Game.sellWeapon(i, false); break;
      case "SCRAP":
        scrapGained += Game.scrapWeapon(i, false); break;
    }
  }
  // Now armour
  for(var i = Game.p_ArmourInventory.length-1; i >= 0; i--) {
    switch(Game.autoSell_options[Game.p_ArmourInventory[i][2]-Game.QUALITY_POOR]) {
      case "SELL":
        seedsGained += Game.sellArmour(i, false); break;
      case "SCRAP":
        scrapGained += Game.scrapArmour(i, false); break;
    }
  }
  Game.toastNotification("Inventory cleaning gave " + prettifyNumber(seedsGained) + " seeds and " + prettifyNumber(scrapGained) + " scrap.");
}
// These two don't get called often, because they're only for the lazy who don't sell their stuff.
Game.takeWeapon = function() {
  if(Game.p_WeaponInventory.length < Game.MAX_INVENTORY) {
    Game.p_WeaponInventory.push(Game.last_Weapon.slice(0));
    Game.last_Weapon = [];
  }
  else { Game.toastNotification("Weapon inventory is full."); }
  Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
  Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
  Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
  Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
  Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  Game.updateInventory = true;
	Game.drawActivePanel();
}
Game.takeArmour = function() {
  if(Game.p_ArmourInventory.length < Game.MAX_INVENTORY) {
    Game.p_ArmourInventory.push(Game.last_Armour.slice(0));
    Game.last_Armour = [];
  }
  else { Game.toastNotification("Armour inventory is full."); }
  Game.badgeCheck(Game.BADGE_BLUE); // Blue in the Face
  Game.badgeCheck(Game.BADGE_PURPLE); // Tastes Like Purple
  Game.badgeCheck(Game.BADGE_FULL_WEP); // Weapon Hoarder
  Game.badgeCheck(Game.BADGE_FULL_ARM); // Armour Hoarder
  Game.badgeCheck(Game.BADGE_FULL_AMAZING); // Expensive Tastes
  Game.updateInventory = true;
	Game.drawActivePanel();
}
Game.reforgeWeapon = function(debuff, isSuperior) {
  var debuffCost = isSuperior ? 2 : 1;
  if(debuff >= Game.DEBUFF_SHRED) {
    debuffCost *= 4;
  }
  if(Game.p_Weapon[7] < Game.QUALITY_GREAT && isSuperior) {
    Game.toastNotification("Only Great or Amazing weapons can be given Superior debuffs.");
  }
  else if(Game.p_Weapon[7] < Game.QUALITY_GOOD) {
    Game.toastNotification("Reforging is not available for weapons below 'Good' quality.")
  }
  else if(Game.p_Scrap < debuffCost) {
    Game.toastNotification("You cannot afford this reforge.");
  }
  else {
    var isRandom = false;
    if(debuff < Game.DEBUFF_SHRED) {
      debuff = Game.RNG(Game.DEBUFF_SHRED, Game.DEBUFF_DISARM);
      isRandom = true;
      Game.PROGRESS_RANDOM_DEBUFFS++;
      Game.badgeCheck(Game.BADGE_RANDOM_DEBUFFS); // Rolling the Bones
    }
    var dbName = ""; var validDebuffName = false;
    if((isSuperior || debuff == Game.DEBUFF_MC) && !isRandom) {
       while(!validDebuffName) {
         dbName = prompt("Please provide a new debuff name. Leave blank to use default. Max 30 characters. \n\n(Selected type: " + Game.debuff_names[debuff-Game.DEBUFF_SHRED] + ")");
         if(dbName.length > 30) { alert("The text provided was too long, please try something shorter."); }
         else if(/[<>|]/g.test(dbName)) { alert("The text provided contained invalid characters, please try something else."); }
         else { dbName = dbName.replace(/[<>|]/g,""); validDebuffName = true; }
      }
    }
    switch(debuff) {
      case 241:
        if(isSuperior) { Game.p_Weapon[9] = [241,(dbName.trim() === "" ? "Ruthlessness" : dbName),15,-1]; }
        else { Game.p_Weapon[9] = [241,"Ruthlessness",10,-1]; }
        break;
      case 242:
        if(isSuperior) { Game.p_Weapon[9] = [242,(dbName.trim() === "" ? "Frenzy" : dbName),15,70]; }
        else { Game.p_Weapon[9] = [242,"Frenzy",10,50]; }
        break;
      case 243:
        if(isSuperior) { Game.p_Weapon[9] = [243,(dbName.trim() === "" ? "Bloodthirst" : dbName),15,30]; }
        else { Game.p_Weapon[9] = [243,"Bloodthirst",10,20]; }
        break;
      case 244:
        if(isSuperior) { Game.p_Weapon[9] = [244,(dbName.trim() === "" ? "Cripple" : dbName),15,25]; }
        else { Game.p_Weapon[9] = [244,"Cripple",10,15]; }
        break;
      case 245:
        Game.p_Weapon[9] = [245,(dbName.trim() === "" ? "Charm" : dbName),5,-1];
        break;
      case 246:
        if(isSuperior) { Game.p_Weapon[9] = [246,(dbName.trim() === "" ? "Wound Poison" : dbName),15,30]; }
        else { Game.p_Weapon[9] = [246,"Wound Poison",10,20]; }
        break;
      case 247:
        if(isSuperior) { Game.p_Weapon[9] = [247,(dbName.trim() === "" ? "Nerve Strike" : dbName),15,25]; }
        else { Game.p_Weapon[9] = [247,"Nerve Strike",10,15]; }
        break;
      case 248:
        if(isSuperior) { Game.p_Weapon[9] = [248,(dbName.trim() === "" ? "Mounting Dread" : dbName),5,10]; }
        else { Game.p_Weapon[9] = [248,"Mounting Dread",5,6]; }
        break;
      case 249:
        if(isSuperior) { Game.p_Weapon[9] = [249,(dbName.trim() === "" ? "Disarmed" : dbName),15,-1]; }
        else { Game.p_Weapon[9] = [249,"Disarmed",10,-1]; }
        break;
      case 250:
        if(isSuperior) { Game.p_Weapon[9] = [250,(dbName.trim() === "" ? "Comatose" : dbName),15,10]; }
        else { Game.p_Weapon[9] = [250,"Comatose",10,20]; }
        break;
    }
    Game.p_Scrap -= debuffCost;
    Game.toastNotification("Weapon has been reforged.");
    Game.TRACK_REFORGES++;
    Game.PROGRESS_DEBUFF_SPEND += debuffCost; // Happy Customer
  }
  Game.updateForge = true;
}
Game.repopulateShop = function() {
  Game.repopulateWeaponShop();
  Game.repopulateArmourShop();
}
Game.repopulateWeaponShop = function() {
  Game.p_WeaponShopStock = [];
  var isGreat = false;
  var firstItem = [];
  var levelCap = Math.min(Game.p_Level, (Game.p_currentZone+1)*10);
  while(!isGreat) {
    firstItem = Game.makeWeapon(levelCap);
    if(firstItem[7] >= Game.QUALITY_GREAT) { isGreat = true; }
  }
  Game.p_WeaponShopStock.push(firstItem)
  for(var x = 1; x <= Game.p_ShopStockLimit; x++) {
    var nextItem = Game.makeWeapon(levelCap);
    while(nextItem[7] < Game.QUALITY_GOOD) {
      nextItem = Game.makeWeapon(levelCap);
    }
    Game.p_WeaponShopStock.push(nextItem);
  }
}
Game.repopulateArmourShop = function() {
  Game.p_ArmourShopStock = [];
  var isGreat = false;
  var firstItem = [];
  var levelCap = Math.min(Game.p_Level, (Game.p_currentZone+1)*10);
  while(!isGreat) {
    firstItem = Game.makeArmour(levelCap);
    if(firstItem[2] >= Game.QUALITY_GREAT) { isGreat = true; }
  }
  Game.p_ArmourShopStock.push(firstItem)
  for(var x = 1; x <= Game.p_ShopStockLimit; x++) {
    var nextItem = Game.makeArmour(levelCap);
    while(nextItem[2] < Game.QUALITY_GOOD) {
      nextItem = Game.makeArmour(levelCap);
    }
    Game.p_ArmourShopStock.push(nextItem);
  }
}

document.getElementById("loadedInventory").style.display = "";