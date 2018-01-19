/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";

Game.badgeCheck = function (badgeID) {
  var a = 0, x = 0, totalSpent = 0, blueCount = 0, purpleCount = 0;
  if (Game.playerBadges.indexOf(badgeID) >= 0) {
    // Badge already earned, don't do anything
    return 0;
  }
  switch (badgeID) {
  case Game.BADGE_AUTOSAVE:
    if (Game.PROGRESS_AUTOSAVE >= 100) {
      Game.giveBadge(Game.BADGE_AUTOSAVE); // We've Got You Covered
    }
    break;
  case Game.BADGE_KEYBINDING:
    if (Game.PROGRESS_KEYBINDING >= 1000) {
      Game.giveBadge(Game.BADGE_KEYBINDING); // Keyboard Cat
    }
    break;
  case Game.BADGE_MANUALBATTLE:
    if (Game.PROGRESS_MANUALBATTLE >= 1000) {
      Game.giveBadge(Game.BADGE_MANUALBATTLE); // Broken Mouse Convention
    }
    break;
  case Game.BADGE_KILLCOUNT:
    if (Game.TRACK_WINS >= 1000) {
      Game.giveBadge(Game.BADGE_KILLCOUNT); // Skullcrusher Mountain
    }
    break;
  case Game.BADGE_UNSTOPPABLE:
    if (Game.TRACK_WIN_STREAK >= 1000) {
      Game.giveBadge(Game.BADGE_UNSTOPPABLE); // The Unstoppable Force
    }
    break;
  case Game.BADGE_BURSTSPAM:
    if (Game.TRACK_BURSTS >= 1000) {
      Game.giveBadge(Game.BADGE_BURSTSPAM); // Manual Labour
    }
    break;
  case Game.BADGE_BOSSGEAR:
    if (Game.p_Weapon[7] >= Game.QUALITY_GREAT && Game.p_Armour[2] >= Game.QUALITY_GREAT) {
      Game.giveBadge(Game.BADGE_BOSSGEAR); // Like a Boss
    }
    break;
  case Game.BADGE_JACKOFTRADES:
    if (Game.TRACK_MELEE_DMG >= 1000000 && Game.TRACK_RANGE_DMG >= 1000000 && Game.TRACK_MAGIC_DMG >= 1000000) {
      Game.giveBadge(Game.BADGE_JACKOFTRADES); // Jack of All Trades
    }
    break;
  case Game.BADGE_POWER:
    totalSpent = 0;
    for (a = 0; a < Game.p_Powers.length; a += 1) {
      totalSpent += Game.p_Powers[a][1];
    }
    if (totalSpent >= 100) {
      Game.giveBadge(Game.BADGE_POWER);
    } // Unlimited Power!
    break;
  case Game.BADGE_RESETS:
    if (Game.TRACK_RESETS >= 100) {
      Game.giveBadge(Game.BADGE_RESETS); // Indecisive
    }
    break;
  case Game.BADGE_RANDOM_DEBUFFS:
    if (Game.PROGRESS_RANDOM_DEBUFFS >= 100) {
      Game.giveBadge(Game.BADGE_RANDOM_DEBUFFS); // Rolling the Bones
    }
    break;
  case Game.BADGE_DEBUFF_SPEND:
    if (Game.PROGRESS_DEBUFF_SPEND >= 100) {
      Game.giveBadge(Game.BADGE_DEBUFF_SPEND); // Happy Customer
    }
    break;
  case Game.BADGE_SPEND1:
  case Game.BADGE_SPEND2:
  case Game.BADGE_SPEND3:
    if (Game.PROGRESS_SPEND >= 1000000) {
      Game.giveBadge(Game.BADGE_SPEND3); // CAPITALISM!
    } else if (Game.PROGRESS_SPEND >= 100000) {
      Game.giveBadge(Game.BADGE_SPEND2); // Sucker
    } else if (Game.PROGRESS_SPEND >= 10000) {
      Game.giveBadge(Game.BADGE_SPEND1); // The Trade Parade
    }
    break;
  case Game.BADGE_NO_SPEND:
    if (Game.PROGRESS_SPEND === 0) {
      Game.giveBadge(Game.BADGE_NO_SPEND); // The Trade Blockade
    }
    break;
  case Game.BADGE_SELLING:
    if (Game.TRACK_SALE_SEEDS >= 1000000) {
      Game.giveBadge(Game.BADGE_SELLING); // Rags to Riches
    }
    break;
  case Game.BADGE_SCRAPPING:
    if (Game.TRACK_CONVERT_SCRAP >= 1000) {
      Game.giveBadge(Game.BADGE_SCRAPPING); // Heavy Metal
    }
    break;
  case Game.BADGE_DISCARDS:
    if (Game.TRACK_ITEM_DISCARDS >= 1000) {
      Game.giveBadge(Game.BADGE_DISCARDS); // Disposable Income
    }
    break;
  case Game.BADGE_BLUE:
    blueCount = 0;
    for (x = 0; x < Game.p_WeaponInventory.length; x += 1) {
      if (Game.p_WeaponInventory[x][7] === Game.QUALITY_GREAT) {
        blueCount += 1;
      }
    }
    for (x = 0; x < Game.p_ArmourInventory.length; x += 1) {
      if (Game.p_ArmourInventory[x][2] === Game.QUALITY_GREAT) {
        blueCount += 1;
      }
    }
    if (blueCount >= 3) {
      Game.giveBadge(Game.BADGE_BLUE);
    }
    break;
  case Game.BADGE_PURPLE:
    purpleCount = 0;
    for (x = 0; x < Game.p_WeaponInventory.length; x += 1) {
      if (Game.p_WeaponInventory[x][7] === Game.QUALITY_AMAZING) {
        purpleCount += 1;
      }
    }
    for (x = 0; x < Game.p_ArmourInventory.length; x += 1) {
      if (Game.p_ArmourInventory[x][2] === Game.QUALITY_AMAZING) {
        purpleCount += 1;
      }
    }
    if (purpleCount >= 3) {
      Game.giveBadge(Game.BADGE_PURPLE);
    }
    break;
  case Game.BADGE_FULL_WEP:
    purpleCount = 0;
    for (x = 0; x < Game.p_WeaponInventory.length; x += 1) {
      if (Game.p_WeaponInventory[x][7] >= Game.QUALITY_GREAT) {
        purpleCount += 1;
      }
    }
    if (purpleCount >= Game.MAX_INVENTORY) {
      Game.giveBadge(Game.BADGE_FULL_WEP);
    }
    break;
  case Game.BADGE_FULL_ARM:
    purpleCount = 0;
    for (x = 0; x < Game.p_ArmourInventory.length; x += 1) {
      if (Game.p_ArmourInventory[x][2] >= Game.QUALITY_GREAT) {
        purpleCount += 1;
      }
    }
    if (purpleCount >= Game.MAX_INVENTORY) {
      Game.giveBadge(Game.BADGE_FULL_ARM);
    }
    break;
  case Game.BADGE_FULL_AMAZING:
    purpleCount = 0;
    for (x = 0; x < Game.p_WeaponInventory.length; x += 1) {
      if (Game.p_WeaponInventory[x][7] === Game.QUALITY_AMAZING) {
        purpleCount += 1;
      }
    }
    for (x = 0; x < Game.p_ArmourInventory.length; x += 1) {
      if (Game.p_ArmourInventory[x][2] === Game.QUALITY_AMAZING) {
        purpleCount += 1;
      }
    }
    if (purpleCount >= (Game.MAX_INVENTORY * 2)) {
      Game.giveBadge(Game.BADGE_FULL_AMAZING);
    }
    break;
  }
};

Game.giveBadge = function (badgeID) {
  if (Game.playerBadges.indexOf(badgeID) >= 0) {
    // Badge already earned, don't do anything
    return 0;
  }
  Game.playerBadges.push(badgeID);
  Game.toastNotification("徽章获得了: " + Game.BADGE_LIST[badgeID - Game.BADGE_NAME][0]);
  Game.updateActivePanel();
};

document.getElementById("loadedBadges").style.display = "";