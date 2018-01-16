/*--------------------------------------
tickers.js

Holds functions relating to idle tickers
(specifically regen and repair)
--------------------------------------*/

Game.startRepair = function() {
  if(Game.p_State !== Game.STATE_COMBAT && !Game.p_repairInterval) {
    Game.toastNotification("Repairing equipment...");
    Game.giveBadge(Game.BADGE_REPAIR);
    Game.p_repairInterval = window.setInterval(Game.repairTick,1000-(20*Game.powerLevel(Game.BOOST_REGEN)));
  }
}
Game.repairTick = function() {
  var weaponMax = 50 + 5*(Game.p_Weapon[1]-1);
  var armourMax = 50 + 5*(Game.p_Armour[1]-1);
  var wepRepairAmount = (5 + Math.floor(Game.p_Weapon[1] / 3));
  var armRepairAmount = (5 + Math.floor(Game.p_Armour[1] / 3));
  wepRepairAmount += (0.2 * Game.powerLevel(Game.BOOST_REPAIRPOWER));
  armRepairAmount += (0.2 * Game.powerLevel(Game.BOOST_REPAIRPOWER));
  Game.p_Weapon[8] = Math.min((Game.p_Weapon[8] + wepRepairAmount), weaponMax);
  Game.p_Armour[3] = Math.min((Game.p_Armour[3] + armRepairAmount), armourMax);
  if(Game.p_Weapon[8] === weaponMax && Game.p_Armour[3] === armourMax) {
    window.clearInterval(Game.p_repairInterval);
    Game.p_repairInterval = null;
    Game.toastNotification("Equipment repaired.");
  }
  Game.updateInventory = true;
  Game.drawActivePanel();
}
Game.idleHeal = function() {
  // Todo: Finish the updateActivePanel function.
	if(Game.p_State != Game.STATE_COMBAT) {
		Game.p_HP = Math.min(Game.p_HP + Game.p_Con,Game.p_MaxHP);
		if(!Game.p_autoSaved && Game.p_HP == Game.p_MaxHP && Game.p_State == Game.STATE_IDLE) {
			Game.p_autoSaved = true;
      Game.PROGRESS_AUTOSAVE++;
			Game.save(1);
		}
    else {
     // Game.drawActivePanel();
      Game.updateActivePanel();
    }
	}
  Game.p_IdleInterval = window.setTimeout(Game.idleHeal,1000-(20*Game.powerLevel(Game.BOOST_REGEN)));
	Game.drawActivePanel();
  Game.updateActivePanel();
}
Game.autoBattleFunc = function() {
  // TODO: Change these to read from new variables.
  if(Game.p_State == Game.STATE_IDLE) {
    if(Game.p_WeaponInventory.length >= Game.MAX_INVENTORY || Game.p_ArmourInventory.length >= Game.MAX_INVENTORY) {
      Game.automaticInventoryClear();
      if(Game.p_WeaponInventory.length >= Game.MAX_INVENTORY || Game.p_ArmourInventory.length >= Game.MAX_INVENTORY) { Game.toggleAutoBattle(); }
    }
    else {
    var repairThreshold = Game.autoBattle_repair;
    var weaponMax = 50 + 5*(Game.p_Weapon[1]-1);
    var armourMax = 50 + 5*(Game.p_Armour[1]-1);
    if((Game.p_Weapon[8]/weaponMax*100) < repairThreshold || (Game.p_Armour[3]/armourMax*100) < repairThreshold) { Game.startRepair(); }
    else if(Game.p_HP == Game.p_MaxHP) { Game.startCombat(false); }
    }
  }
  if(Game.p_State == Game.STATE_COMBAT) {
    var fleePercent = Game.autoBattle_flee;
    var healthThreshold = Math.floor(Game.p_MaxHP / 100 * fleePercent);
    if(Game.p_HP <= healthThreshold && Game.p_HP > 0 && Game.getPlayerDebuff()[0] !== Game.DEBUFF_SLEEP) { Game.fleeCombat(); }
  }
}

document.getElementById("loadedTickers").style.display = "";