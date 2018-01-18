/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";
/*--------------------------------------
tickers.js

Holds functions relating to idle tickers
(specifically regen and repair)
--------------------------------------*/

Game.startRepair = function () {
  if (Game.p_State !== Game.STATE_COMBAT && !Game.p_repairInterval) {
    Game.toastNotification("Repairing equipment...");
    Game.giveBadge(Game.BADGE_REPAIR);
    Game.p_repairInterval = window.setInterval(Game.repairTick, 1000);
  }
};

Game.repairTick = function () {
  var weaponMax = 0, armourMax = 0, wepRepairAmount = 0, armRepairAmount = 0;
  weaponMax = 50 + 5 * (Game.p_Weapon[1] - 1);
  armourMax = 50 + 5 * (Game.p_Armour[1] - 1);
  wepRepairAmount = (5 + Math.floor(Game.p_Weapon[1] / 3));
  armRepairAmount = (5 + Math.floor(Game.p_Armour[1] / 3));
  wepRepairAmount *= (1 + (0.04 * Game.powerLevel(Game.SKILL_SURVIVAL_INSTINCTS)));
  armRepairAmount *= (1 + (0.04 * Game.powerLevel(Game.SKILL_SURVIVAL_INSTINCTS)));
  wepRepairAmount *= (1 + (0.2 * Game.powerLevel(Game.SKILL_MASTER_TINKERER)));
  armRepairAmount *= (1 + (0.2 * Game.powerLevel(Game.SKILL_MASTER_TINKERER)));
  Game.p_Weapon[8] = Math.min((Game.p_Weapon[8] + Math.floor(wepRepairAmount)), weaponMax);
  Game.p_Armour[3] = Math.min((Game.p_Armour[3] + Math.floor(armRepairAmount)), armourMax);
  if (Game.p_Weapon[8] === weaponMax && Game.p_Armour[3] === armourMax) {
    window.clearInterval(Game.p_repairInterval);
    Game.p_repairInterval = null;
    Game.toastNotification("Equipment repaired.");
  }
  Game.updateInventory = true;
  //Game.drawActivePanel();
  Game.updateActivePanel();
};

Game.idleHeal = function () {
  // Todo: Finish the updateActivePanel function.
  if (Game.p_State !== Game.STATE_COMBAT) {
    Game.p_HP = Math.min(Game.p_HP + Math.ceil(Game.p_Con * (1 + (0.04 * Game.powerLevel(Game.SKILL_SURVIVAL_INSTINCTS)))), Game.p_MaxHP);
    if (!Game.p_autoSaved && Game.p_HP === Game.p_MaxHP && Game.p_State === Game.STATE_IDLE) {
      Game.p_autoSaved = true;
      Game.PROGRESS_AUTOSAVE += 1;
      Game.save(1);
    } else {
      // Game.drawActivePanel();
      Game.updateActivePanel();
    }
  }
  Game.p_IdleInterval = window.setTimeout(Game.idleHeal, 1000);
  Game.updateActivePanel();
};

Game.autoBattleFunc = function () {
  var repairThreshold = 0, weaponMax = 0, armourMax = 0, fleePercent = 0, healthThreshold = 0;
  // TODO: Change these to read from new variables.
  if (Game.p_State === Game.STATE_IDLE) {
    if (Game.p_WeaponInventory.length >= Game.MAX_INVENTORY || Game.p_ArmourInventory.length >= Game.MAX_INVENTORY) {
      Game.automaticInventoryClear();
      if (Game.p_WeaponInventory.length >= Game.MAX_INVENTORY || Game.p_ArmourInventory.length >= Game.MAX_INVENTORY) {
        Game.toggleAutoBattle();
      }
    } else {
      repairThreshold = Game.autoBattle_repair;
      weaponMax = 50 + 5 * (Game.p_Weapon[1] - 1);
      armourMax = 50 + 5 * (Game.p_Armour[1] - 1);
      if ((Game.p_Weapon[8] / weaponMax * 100) < repairThreshold || (Game.p_Armour[3] / armourMax * 100) < repairThreshold) {
        Game.startRepair();
      } else if (Game.p_HP === Game.p_MaxHP) {
        Game.startCombat(false);
      }
    }
  }
  if (Game.p_State === Game.STATE_COMBAT) {
    fleePercent = Game.autoBattle_flee;
    healthThreshold = Math.floor(Game.p_MaxHP / 100 * fleePercent);
    if (Game.p_HP <= healthThreshold && Game.p_HP > 0 && Game.getPlayerDebuff()[0] !== Game.DEBUFF_SLEEP) {
      Game.fleeCombat();
    }
  }
};

document.getElementById("loadedTickers").style.display = "";
