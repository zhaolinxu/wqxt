Game = {};

/* Comments
Realm of Decay - An RPG Incremental
Copyright Martin Hayward (Psychemaster) 2014
Version 0.1 beta

Changes in this version:
	Weapon Specials:
		Bloodthirst
		Power Shot
		Wild Magic
	Indicator now appears when the game saves.
	Game auto-saves (after a battle, when the player reaches full health)
TODO: 
	A way to idle:
		Initiate a battle at full health
		After a battle, take enemy weapon if it has better DPS
		Don't assign skill or power points
*/

Game.init = function() {
	//Define some constants we can use later
	this.XP_MULT = 1.116;
	this.XP_RANGEMIN = 1.7;
	this.XP_RANGEMAX = 2.2;
	this.XP_BASE = 15;
	//Player states
	this.STATE_IDLE = 0;
	this.STATE_REPAIR = 1;
	this.STATE_COMBAT = 2;
	//Available boosts
	this.BOOST_REPAIR = 101; // High Maintenance
	this.BOOST_ASPD = 102; // Nimble Fingers
	this.BOOST_HEAL = 103; // Survival Instincts
	this.BOOST_WSPEC = 104; // Keen Eye
	this.BOOST_SKILLPT = 105; // Fortuitous Growth
	this.BOOST_XP = 106; // Fast Learner
	this.BOOST_MELEEDMG = 107; // Brutal Strikes
	this.BOOST_RANGEDMG = 108; // Sniper Training
	this.BOOST_MAGICDMG = 109; // Unleashed Elements
	this.BOOST_MELEEDEF = 110; // Stoneskin
	this.BOOST_RANGEDEF = 111; // Iron Carapace
	this.BOOST_MAGICDEF = 112; // Aetheric Resilience
	this.BOOST_DOUBLE = 113; // Flurry
	this.BOOST_SHIELD = 114; // Divine Shield
	this.BOOST_CONSERVE = 115; // Proper Care
	//Weapon Types
	this.WEAPON_MELEE = 201;
	this.WEAPON_RANGE = 202;
	this.WEAPON_MAGIC = 203;
	//Weapon Speeds
	this.WSPEED_SLOW = 211;
	this.WSPEED_MID = 212;
	this.WSPEED_FAST = 213;
	// Point assignment stats
	this.STAT_STR = 301;
	this.STAT_DEX = 302;
	this.STAT_INT = 303;
	this.STAT_CON = 304;
	// Player variables
	this.p_HP = 0; this.p_MaxHP = 0;
	this.p_Str = 0; this.p_Dex = 0;
	this.p_Int = 0; this.p_Con = 0;
	this.p_EXP = 0; this.p_NextEXP = 0;
	this.p_SkillPoints = 0;
	this.p_Level = 0; this.p_PP = 0; // Power points.
	this.p_Powers = []; // Selected powers.
	this.p_Weapon = []; // Player weapon.
	this.p_State = Game.STATE_IDLE; // Player states
	this.p_specUsed = false;
	this.p_autoSaved = false;
	this.p_RepairInterval; this.p_RepairValue = 0;
	this.p_IdleInterval;
	this.combat_enemyInterval; this.combat_playerInterval;
	// Enemy variables
	this.e_HP = 0; this.e_MaxHP = 0;
	this.e_Str = 0; this.e_Dex = 0;
	this.e_Int = 0; this.e_Level = 0;
	this.e_isBoss = false;
	this.e_Weapon = []; // Enemy weapon
	this.e_DebuffStacks = 0;
	this.last_Weapon = []; // Weapon to take 
	if(!this.load()) {
		this.initPlayer(1);
		this.save();
	}
	if(Game.p_State != Game.STATE_COMBAT) { Game.idleHeal(); }
	this.drawAllTheThings();
}

Game.drawAllTheThings = function() {
	Game.updatePlayerPanel();
	Game.updateEnemyPanel();
	Game.updateCentrePanel();
}

Game.updatePlayerPanel = function() {
	var lv = document.getElementById("p_Level");
	lv.innerHTML = Game.p_Level;
	var exp = document.getElementById("p_EXP");
	exp.innerHTML = Game.p_EXP;
	var nextxp = document.getElementById("p_NextEXP");
	nextxp.innerHTML = Game.p_NextEXP;
	var hp = document.getElementById("p_HP");
	hp.innerHTML = Game.p_HP;
	var maxhp = document.getElementById("p_MaxHP");
	maxhp.innerHTML = Game.p_MaxHP;
	var str = document.getElementById("p_Str");
	str.innerHTML = Game.p_Str;
	var dex = document.getElementById("p_Dex");
	dex.innerHTML = Game.p_Dex;
	var intel = document.getElementById("p_Int");
	intel.innerHTML = Game.p_Int;
	var con = document.getElementById("p_Con");
	con.innerHTML = Game.p_Con;
	// Player weapon
	var w_name = document.getElementById("w_Name");
	w_name.innerHTML = Game.getWeaponName(Game.p_Weapon);
	var w_type = document.getElementById("w_Type");
	switch(Game.p_Weapon[1]) {
		case Game.WEAPON_MELEE:
			w_type.innerHTML = "Melee"; break;
		case Game.WEAPON_RANGE:
			w_type.innerHTML = "Ranged"; break;
		case Game.WEAPON_MAGIC:
			w_type.innerHTML = "Magic"; break;
	}
	var w_speed = document.getElementById("w_Speed");
	w_speed.innerHTML = Game.p_Weapon[3];
	var w_damage = document.getElementById("w_Damage");
	w_damage.innerHTML = Game.p_Weapon[4];
	var w_DPS = document.getElementById("w_DPS");
	w_DPS.innerHTML = Math.floor(Game.p_Weapon[4]/Game.p_Weapon[3]*100)/100;
	var w_decay = document.getElementById("w_Decay");
	var pp = document.getElementById("p_PP");
	pp.innerHTML = Game.p_PP;
	if(Game.p_Weapon[5] >= 0) { w_decay.innerHTML = Game.p_Weapon[5]; }
	else { w_Decay.innerHTML = "N/A"; }
	if(Game.p_SkillPoints > 0 && Game.p_State != Game.STATE_COMBAT) {
		var lvPanel = document.getElementById("levelUpPanel");
		lvPanel.style.display = "";
		var spDisp = document.getElementById("skillPoints");
		spDisp.innerHTML = Game.p_SkillPoints;
	}
	else {
		var lvPanel = document.getElementById("levelUpPanel");
		lvPanel.style.display = "none";
	}
}

Game.updateEnemyPanel = function() {
	switch(Game.p_State) {
		case Game.STATE_IDLE:
			// Vis
			var r_Idle = document.getElementById("right_Idle");
			r_Idle.style.display = "";
			var r_Combat = document.getElementById("right_Combat");
			r_Combat.style.display = "none";
			var r_Repair = document.getElementById("right_Repair");
			r_Repair.style.display = "none";
			break;
		case Game.STATE_COMBAT: 
			// Vis
			var r_Idle = document.getElementById("right_Idle");
			r_Idle.style.display = "none";
			var r_Combat = document.getElementById("right_Combat");
			r_Combat.style.display = "";
			var r_Repair = document.getElementById("right_Repair");
			r_Repair.style.display = "none";
			// Enemy stat panel
			var e_lv = document.getElementById("e_Level");
			e_lv.innerHTML = Game.e_Level;
			var e_hp = document.getElementById("e_HP");
			e_hp.innerHTML = Game.e_HP;
			var e_maxhp = document.getElementById("e_MaxHP");
			e_maxhp.innerHTML = Game.e_MaxHP;
			var e_str = document.getElementById("e_Str");
			e_str.innerHTML = Game.e_Str;
			var e_dex = document.getElementById("e_Dex");
			e_dex.innerHTML = Game.e_Dex;
			var e_intel = document.getElementById("e_Int");
			e_intel.innerHTML = Game.e_Int;
			var e_Debuff = document.getElementById("debuffStackOutput");
			e_Debuff.innerHTML = Game.e_DebuffStacks;
			// Enemy weapon
			var ew_name = document.getElementById("ew_Name");
			ew_name.innerHTML = Game.getWeaponName(Game.e_Weapon);
			var ew_type = document.getElementById("ew_Type");
			switch(Game.e_Weapon[1]) {
				case Game.WEAPON_MELEE:
					ew_type.innerHTML = "Melee"; break;
				case Game.WEAPON_RANGE:
					ew_type.innerHTML = "Ranged"; break;
				case Game.WEAPON_MAGIC:
					ew_type.innerHTML = "Magic"; break;
			}
			var ew_speed = document.getElementById("ew_Speed");
			ew_speed.innerHTML = Game.e_Weapon[3];
			var ew_damage = document.getElementById("ew_Damage");
			ew_damage.innerHTML = Game.e_Weapon[4];
			var ew_DPS = document.getElementById("ew_DPS");
			ew_DPS.innerHTML = Math.floor(Game.e_Weapon[4]/Game.e_Weapon[3]*100)/100;
			break;
		case Game.STATE_REPAIR:
			// Vis
			var r_Idle = document.getElementById("right_Idle");
			r_Idle.style.display = "none";
			var r_Combat = document.getElementById("right_Combat");
			r_Combat.style.display = "none";
			var r_Repair = document.getElementById("right_Repair");
			r_Repair.style.display = "";
			var repTimer = document.getElementById("repairTime");
			repTimer.innerHTML = Game.p_RepairValue;
			break;
	}
	if(Game.last_Weapon.length > 0 && Game.p_State != Game.STATE_COMBAT) { 
		var lastWep = document.getElementById("lastEnemyWeapon");
		lastWep.style.display = "";
		var takeWep = document.getElementById("takeWeapon");
		takeWep.style.display = "";
		var ew_name = document.getElementById("lastw_Name");
		ew_name.innerHTML = Game.getWeaponName(Game.last_Weapon);
		var ew_type = document.getElementById("lastw_Type");
		switch(Game.last_Weapon[1]) {
			case Game.WEAPON_MELEE:
				ew_type.innerHTML = "Melee"; break;
			case Game.WEAPON_RANGE:
				ew_type.innerHTML = "Ranged"; break;
			case Game.WEAPON_MAGIC:
				ew_type.innerHTML = "Magic"; break;
		}
		var ew_speed = document.getElementById("lastw_Speed");
		ew_speed.innerHTML = Game.last_Weapon[3];
		var ew_damage = document.getElementById("lastw_Damage");
		ew_damage.innerHTML = Game.last_Weapon[4];
		var ew_DPS = document.getElementById("lastw_DPS");
		ew_DPS.innerHTML = Math.floor(Game.last_Weapon[4]/Game.last_Weapon[3]*100)/100;
	}
	else {
		var lastWep = document.getElementById("lastEnemyWeapon");
		lastWep.style.display = "none";
		var takeWep = document.getElementById("takeWeapon");
		takeWep.style.display = "none";
	}
}

Game.updateCentrePanel = function() {
	//Available Powers Panel
	var ppp = document.getElementById("availablePowers");
	if(Game.p_PP > 0) {
		ppp.style.display = "";
		for(var x = 0; x < Game.p_Powers.length; x++) {
			var targetControl;
			switch(Game.p_Powers[x]) {
				case Game.BOOST_REPAIR: // High Maintenance
					targetControl = document.getElementById("repair");
					break;
				case Game.BOOST_ASPD: // Nimble Fingers
					targetControl = document.getElementById("aspd");
					break;
				case Game.BOOST_HEAL: // Survival Instincts
					targetControl = document.getElementById("heal");
					break;
				case Game.BOOST_WSPEC: // Keen Eye
					targetControl = document.getElementById("wspec");
					break;
				case Game.BOOST_SKILLPT: // Fortuitous Growth
					targetControl = document.getElementById("skillpt");
					break;
				case Game.BOOST_XP: // Fast Learner
					targetControl = document.getElementById("xp");
					break;
				case Game.BOOST_MELEEDMG: // Brutal Strikes
					targetControl = document.getElementById("meleedmg");
					break;
				case Game.BOOST_RANGEDMG: // Sniper Training
					targetControl = document.getElementById("rangedmg");
					break;
				case Game.BOOST_MAGICDMG:// Unleashed Elements
					targetControl = document.getElementById("magicdmg");
					break;
				case Game.BOOST_MELEEDEF: // Stoneskin
					targetControl = document.getElementById("meleedef");
					break;
				case Game.BOOST_RANGEDEF: // Iron Carapace
					targetControl = document.getElementById("rangedef");
					break;
				case Game.BOOST_MAGICDEF: // Aetheric Resilience
					targetControl = document.getElementById("magicdef");
					break;
				case Game.BOOST_DOUBLE: // Flurry
					targetControl = document.getElementById("double");
					break;
				case Game.BOOST_SHIELD:// Divine Shield
					targetControl = document.getElementById("shield");
					break;
				case Game.BOOST_CONSERVE: // Proper Care
					targetControl = document.getElementById("conserve");
					break;
			}
			targetControl.style.display = "none";
		}	
	} else { ppp.style.display = "none"; }
	//Selected Powers Panel
	var spp = document.getElementById("selectedPowers");
	if(Game.p_Powers.length > 0) {
		spp.style.display = "";
		for(var x = 0; x < Game.p_Powers.length; x++) {
			var targetControl;
			switch(Game.p_Powers[x]) {
				case Game.BOOST_REPAIR: // High Maintenance
					targetControl = document.getElementById("selected_repair");
					break;
				case Game.BOOST_ASPD: // Nimble Fingers
					targetControl = document.getElementById("selected_aspd");
					break;
				case Game.BOOST_HEAL: // Survival Instincts
					targetControl = document.getElementById("selected_heal");
					break;
				case Game.BOOST_WSPEC: // Keen Eye
					targetControl = document.getElementById("selected_wspec");
					break;
				case Game.BOOST_SKILLPT: // Fortuitous Growth
					targetControl = document.getElementById("selected_skillpt");
					break;
				case Game.BOOST_XP: // Fast Learner
					targetControl = document.getElementById("selected_xp");
					break;
				case Game.BOOST_MELEEDMG: // Brutal Strikes
					targetControl = document.getElementById("selected_meleedmg");
					break;
				case Game.BOOST_RANGEDMG: // Sniper Training
					targetControl = document.getElementById("selected_rangedmg");
					break;
				case Game.BOOST_MAGICDMG:// Unleashed Elements
					targetControl = document.getElementById("selected_magicdmg");
					break;
				case Game.BOOST_MELEEDEF: // Stoneskin
					targetControl = document.getElementById("selected_meleedef");
					break;
				case Game.BOOST_RANGEDEF: // Iron Carapace
					targetControl = document.getElementById("selected_rangedef");
					break;
				case Game.BOOST_MAGICDEF: // Aetheric Resilience
					targetControl = document.getElementById("selected_magicdef");
					break;
				case Game.BOOST_DOUBLE: // Flurry
					targetControl = document.getElementById("selected_double");
					break;
				case Game.BOOST_SHIELD:// Divine Shield
					targetControl = document.getElementById("selected_shield");
					break;
				case Game.BOOST_CONSERVE: // Proper Care
					targetControl = document.getElementById("selected_conserve");
					break;
			}
			targetControl.style.display = "";
		}	
	} else { spp.style.display = "none"; }
	// Combat log panel
	var cb = document.getElementById("logBody");
	var cbFrame = document.getElementById("combatLog");
	if(cb.innerHTML == "") { cbFrame.style.display = "none"; }
	else { cbFrame.style.display = ""; }
}

Game.combatLog = function(combatant, message) {
	var d = document.createElement("div");
	d.setAttribute("class",combatant);
	var x = document.createElement("span");
	x.innerHTML = message;
	d.appendChild(x);
	var logBox = document.getElementById("logBody");
	logBox.appendChild(d);
	Game.updateCentrePanel();
}

Game.startRepair = function() {
	if(Game.p_Weapon[5] == (50 + 5*(Game.p_Weapon[0]-1)) || Game.p_Weapon[5] == -1) {
		// Repair not required, do nothing
	}
	else {
		Game.p_State = Game.STATE_REPAIR;
		Game.p_RepairValue = Game.p_Weapon[0];
		if(Game.hasPower(Game.BOOST_HEAL)) {
			Game.p_RepairInterval = window.setInterval(Game.repairTick,800);
		}
		else { Game.p_RepairInterval = window.setInterval(Game.repairTick,1000); }
	}
	Game.updateEnemyPanel();
}

Game.repairTick = function() {
	if(Game.p_RepairValue == 0) {
		Game.p_Weapon[5] = 50 + 5*(Game.p_Weapon[0]-1);
		if(Game.hasPower(Game.BOOST_REPAIR)) { Game.p_Weapon[5]*=2; }
		Game.p_State = Game.STATE_IDLE;
		window.clearInterval(Game.p_RepairInterval);
	}
	else {
		Game.p_RepairValue-=1; 
		Game.p_State = Game.STATE_REPAIR;
	}
	Game.updateEnemyPanel();
}

Game.idleHeal = function() {
	if(Game.p_State != Game.STATE_COMBAT) {
		Game.p_HP = Math.min(Game.p_HP + Game.p_Con,Game.p_MaxHP);
		if(!Game.p_autoSaved && Game.p_HP == Game.p_MaxHP) {
			Game.p_autoSaved = true;
			Game.save();
		}
	}
	if(Game.hasPower(Game.BOOST_HEAL)) {
		Game.p_IdleInterval = window.setTimeout(Game.idleHeal,800);
	}
	else { Game.p_IdleInterval = window.setTimeout(Game.idleHeal,1000); }
	Game.updatePlayerPanel();
}

Game.startCombat = function() {
	if(Game.p_State == Game.STATE_IDLE) {
		if(Game.p_Level >= 5 && Game.RNG(1,100) == 1) {
			Game.makeBoss(Game.p_Level);
		} 
		else {
			Game.makeEnemy(Game.p_Level);
		}
		Game.p_State = Game.STATE_COMBAT;
		if(Game.RNG(1,2) == 1) {
			Game.combat_playerInterval = window.setTimeout(Game.playerCombatTick,100);
			Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick,1100);
		}
		else {
			Game.combat_playerInterval = window.setTimeout(Game.enemyCombatTick,100);
			Game.combat_enemyInterval = window.setTimeout(Game.playerCombatTick,1100);
		}
	}
	var log = document.getElementById("logBody");
	log.innerHTML = "";
	Game.updateEnemyPanel();
}

Game.playerCombatTick = function() {
	if(Game.p_State == Game.STATE_COMBAT) {
		var playerDMG = Game.p_Weapon[4];
		switch(Game.p_Weapon[1]) {
			case Game.WEAPON_MAGIC:
				playerDMG += Math.floor(Game.p_Int/2);
				if(Game.hasPower(Game.BOOST_MAGICDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
				break;
			case Game.WEAPON_RANGE:
				playerDMG += Math.floor(Game.p_Dex/2);
				if(Game.hasPower(Game.BOOST_RANGEDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
				break;
			case Game.WEAPON_MELEE:
				playerDMG += Math.floor(Game.p_Str/2);
				if(Game.hasPower(Game.BOOST_MELEEDMG)) { playerDMG = Math.floor(playerDMG*1.2); }
				break;
		}
		// Decay handling
		if(Game.p_Weapon[5]<0) {
			Game.e_HP = Math.max(Game.e_HP-playerDMG,0);
		}
		else {
			if(Game.p_Weapon[5]>0) {
				if(Game.hasPower(Game.BOOST_CONSERVE) && Game.RNG(1,5) == 1) {
					Game.combatLog("player","<strong>Proper Care</strong> prevented weapon decay.");
				} 
				else { Game.p_Weapon[5]--; }
			}
			else {
				playerDMG = Math.floor(playerDMG/2);
			}
			Game.e_HP = Math.max(Game.e_HP-playerDMG,0);
		}
		Game.updatePlayerPanel();
		Game.combatLog("player","You hit the enemy with your <strong>" + Game.getWeaponName(Game.p_Weapon) + "</strong> for <strong>" + playerDMG + "</strong> damage.");
		// Debuff effect for melee
		if(Game.p_Weapon[1] == Game.WEAPON_MELEE && Game.e_DebuffStacks > 0) {
			var selfHeal = Game.e_DebuffStacks * Game.p_Weapon[0];
			Game.p_HP = Math.min(Game.p_HP + selfHeal, Game.p_MaxHP);
			Game.combatLog("player","Healed <strong>" + selfHeal + "</strong> from Blood Siphon.");
		}
		// Debuff effect for magic
		if(Game.p_Weapon[1] == Game.WEAPON_MAGIC && Game.e_DebuffStacks > 0) {
			var bonusDMG = Game.e_DebuffStacks * Game.p_Weapon[0];
			Game.e_HP = Math.max(Game.e_HP - bonusDMG, 0);
			Game.combatLog("player","&nbsp;Dealt <strong>" + bonusDMG + "</strong> damage from Residual Burn.");
		}
		var debuffApplyChance = 2;
		if(Game.hasPower(Game.BOOST_WSPEC)) { debuffApplyChance++; }
		if(Game.RNG(1,10) <= debuffApplyChance) {
			Game.e_DebuffStacks++;
			switch(Game.p_Weapon[1]) {
				case Game.WEAPON_MAGIC:
					Game.combatLog("player","The enemy suffers from <strong>Residual Burn.</strong>");
					break;
				case Game.WEAPON_RANGE:
					Game.combatLog("player","The enemy suffers from <strong>Infected Wound.</strong>");
					break;
				case Game.WEAPON_MELEE:
					Game.combatLog("player","The enemy suffers from <strong>Blood Siphon.</strong>");
					break;
			}
		}
		if(Game.e_HP > 0) { 
			var timerLength = 1000*Game.p_Weapon[3];
			if(Game.hasPower(Game.BOOST_ASPD)) { timerLength = Math.floor(timerLength*0.8); }
			if(Game.hasPower(Game.BOOST_DOUBLE) && Game.RNG(1,5) == 1) {
				Game.combatLog("player","<strong>Flurry</strong> activated for an additional strike!");
				Game.playerCombatTick();
			}
			else {
				window.clearTimeout(Game.combat_playerInterval);
				Game.combat_playerInterval = window.setTimeout(Game.playerCombatTick,timerLength);
			}
		}
		else { Game.endCombat(); }
	}
	else { window.clearInterval(Game.combat_playerInterval); }
	Game.updateEnemyPanel();
}

Game.enemyCombatTick = function() {
	if(Game.p_State == Game.STATE_COMBAT) {
		var enemyDMG = Game.e_Weapon[4];
		switch(Game.e_Weapon[1]) {
			case Game.WEAPON_MAGIC:
				enemyDMG += Math.floor(Game.e_Int/2);
				if(Game.hasPower(Game.BOOST_MAGICDEF)) { enemyDMG = Math.floor(enemyDMG*0.8); }
				break;
			case Game.WEAPON_RANGE:
				enemyDMG += Math.floor(Game.e_Dex/2);
				if(Game.hasPower(Game.BOOST_RANGEDEF)) { enemyDMG = Math.floor(enemyDMG*0.8); }
				break;
			case Game.WEAPON_MELEE:
				enemyDMG += Math.floor(Game.e_Str/2);
				if(Game.hasPower(Game.BOOST_MELEEDEF)) { enemyDMG = Math.floor(enemyDMG*0.8); }
				break;
		}
		if(Game.hasPower(Game.BOOST_SHIELD) && Game.RNG(1,10) == 1) {
			Game.combatLog("player","Your <strong>Divine Shield</strong> absorbed the damage.");
		} 
		else {
			// Debuff effect for range
			if(Game.p_Weapon[1] == Game.WEAPON_RANGE && Game.e_DebuffStacks > 0) {
				var damageDown = Game.e_DebuffStacks * Game.p_Weapon[0];
				enemyDMG = Math.max(enemyDMG - damageDown,0);
				Game.combatLog("enemy","<strong>" + damageDown + "</strong> prevented by Infected Wound.");
			}
			Game.p_HP = Math.max(Game.p_HP-enemyDMG,0);
			Game.combatLog("enemy","The enemy hits you with their <strong>" + Game.getWeaponName(Game.e_Weapon) + "</strong> for <strong>" + enemyDMG + "</strong> damage.");
		}

		if(Game.p_HP > 0) { Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick,1000*Game.e_Weapon[3]); }
		else { Game.endCombat(); }
	}
	else { window.clearTimeout(Game.combat_enemyInterval); }
	Game.updatePlayerPanel();
}

Game.specialAttack = function() {
	Game.p_specUsed = true;
	switch(Game.p_Weapon[1]) {
		case Game.WEAPON_MELEE:
			// Bloodthirst: Heal 10% per stack
			var healAmount = Math.floor(Game.p_MaxHP/10)*Game.e_DebuffStacks;
			Game.p_HP = Math.min(Game.p_MaxHP, Game.p_HP + healAmount);
			Game.combatLog("player","<strong>Bloodthirst</strong> healed for <strong>" + healAmount + "</strong>.");
			break;
		case Game.WEAPON_RANGE:
			// Power Shot: Deal 10% per stack
			var dmgAmount = Math.floor(Game.e_MaxHP/10)*Game.e_DebuffStacks;
			Game.e_HP = Math.max(0, Game.e_HP - dmgAmount);
			Game.combatLog("player","<strong>Power Shot</strong> hit for <strong>" + dmgAmount + "</strong>.");
			if(Game.e_HP <= 0) { Game.endCombat(); }
			break;
		case Game.WEAPON_MAGIC:
			// Wild Magic: Fire one attack per stack 
			Game.combatLog("player","<strong>Wild Magic</strong> activated!");
			for(var x = Game.e_DebuffStacks; x > 0; x--) { Game.playerCombatTick(); }
			if(Game.e_HP > 0) { Game.combatLog("player","<strong>Wild Magic</strong> ended."); } 
			break;
	}
	Game.e_DebuffStacks = 0;
	Game.p_specUsed = false;
	// Perform a special function based on weapon type and debuff stacks.
}
Game.fleeCombat = function() {
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
	Game.p_State = Game.STATE_IDLE;
	Game.combatLog("","You fled from the battle.");
	Game.drawAllTheThings();
}

Game.endCombat = function() {
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
	Game.p_State = Game.STATE_IDLE;
	if(Game.p_specUsed && Game.p_Weapon[1] == Game.WEAPON_MAGIC) { Game.combatLog("player","<strong>Wild Magic</strong> ended."); }
	if(Game.p_HP > 0) {
		// Player won, give xp and maybe, just maybe, a level.
		Game.combatLog("","You won!");
		Game.last_Weapon = Game.e_Weapon.slice();
		var xpToAdd = Math.floor(Game.XP_BASE+(Game.RNG(Game.XP_RANGEMIN*Game.e_Level,Game.XP_RANGEMAX*Game.e_Level)));
		if(Game.hasPower(Game.BOOST_XP)) { xpToAdd = Math.floor(xpToAdd*1.2); }
		Game.combatLog("","You gained <strong>" + xpToAdd + "</strong> experience.");
		Game.p_EXP += xpToAdd;
		if(Game.p_EXP >= Game.p_NextEXP) {
			Game.levelUp();
		}
	}
	else {
		// Enemy won, dock XP
		Game.combatLog("","You lost...");
		var xpDrop = Math.floor(Game.p_EXP/4);
		Game.combatLog("","You lose <strong>" + xpDrop + "</strong> experience...");
		Game.p_EXP -= xpDrop;
		Game.p_HP = Game.p_MaxHP;
	}
	Game.p_autoSaved = false;
	Game.drawAllTheThings();
}

Game.levelUp = function() {
	Game.combatLog("","Level up! You are now level <strong>" + (Game.p_Level+1) + "</strong>.");
	var hpUp = Game.RNG(25,30);
	Game.p_MaxHP += hpUp
	Game.p_HP = Game.p_MaxHP;
	Game.combatLog("","You gained <strong>" + hpUp + "</strong> HP.")
	var strUp = Game.RNG(1,5) == 1 ? 2 : 1;
	Game.p_Str += strUp;
	Game.combatLog("","You gained <strong>" + strUp + "</strong> Strength.")
	var dexUp = Game.RNG(1,5) == 1 ? 2 : 1;
	Game.p_Dex += dexUp;
	Game.combatLog("","You gained <strong>" + dexUp + "</strong> Dexterity.")
	var intUp = Game.RNG(1,5) == 1 ? 2 : 1;
	Game.p_Int += intUp;
	Game.combatLog("","You gained <strong>" + intUp + "</strong> Intelligence.")
	var conUp = Game.RNG(1,5) == 1 ? 2 : 1;
	Game.p_Con += conUp;
	Game.combatLog("","You gained <strong>" + conUp + "</strong> Constitution.")
	Game.p_Level += 1;
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(100*Math.pow(Game.XP_MULT,Game.p_Level-1));
	Game.p_SkillPoints += 1;
	Game.combatLog("","You gained a skill point.");
	if(Game.hasPower(Game.BOOST_SKILLPT) && Game.RNG(1,5) == 1) { 
		Game.p_SkillPoints++; 
		Game.combatLog("","Your <strong>Fortuitous Growth</strong> granted another skill point!");
	}
	if(Game.p_Level % 5 == 0) {
		Game.p_PP += 1;
		Game.combatLog("","You gained a Power point.");
	}
}
Game.buyPower = function(power) {
	if(Game.p_PP > 0) {
		if(!Game.hasPower(power)) {
			Game.p_Powers.push(power);
			Game.p_PP--;
		}
	}
	Game.updateCentrePanel();
}
Game.takeWeapon = function() {
	Game.p_Weapon = Game.last_Weapon.slice(0);
	Game.last_Weapon = [];
	Game.updatePlayerPanel();
	Game.updateEnemyPanel();
}

Game.addStat = function(stat) {
	if(Game.p_SkillPoints > 0) {
		switch(stat) {
			case Game.STAT_STR:
				Game.p_Str++; break;
			case Game.STAT_DEX:
				Game.p_Dex++; break;
			case Game.STAT_INT:
				Game.p_Int++; break;
			case Game.STAT_CON:
				Game.p_Con++; break;
		}
		Game.p_SkillPoints--;
	}
	Game.updatePlayerPanel();
}

Game.initPlayer = function(level) {
	Game.p_MaxHP = Game.RNG(100,120) + Game.RNG(25*(level-1),30*(level-1));
	Game.p_HP = Game.p_MaxHP;
	Game.p_Str = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Dex = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Int = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Con = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(100*Math.pow(Game.XP_MULT,level-1));
	Game.p_SkillPoints = level;
	Game.p_Level = level;
	Game.p_PP = 0;
	Game.p_Weapon = Game.makeWeapon(level);
}

Game.makeEnemy = function(level) {
	Game.e_MaxHP = Game.RNG(50,60) + Game.RNG(25*(level-1),30*(level-1));
	Game.e_HP = Game.e_MaxHP;
	Game.e_Str = Game.RNG(4,6) + Game.RNG(Math.floor((level-1)*0.5),level-1);
	Game.e_Dex = Game.RNG(4,6) + Game.RNG(Math.floor((level-1)*0.5),level-1);
	Game.e_Int = Game.RNG(4,6) + Game.RNG(Math.floor((level-1)*0.5),level-1);
	Game.e_Level = level;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = false;
	Game.e_Weapon = Game.makeWeapon(Game.RNG(1,5) == 1 ? level+1 : level);
}

Game.makeBoss = function(level) {
	Game.e_MaxHP = Game.RNG(50,60) + Game.RNG(25*(level-1),30*(level-1));
	Game.e_MaxHP *= 2;
	Game.e_HP = Game.e_MaxHP;
	Game.e_Str = Game.RNG(5,7) + Game.RNG(Math.floor((level-1)*1.5),2*(level-1));
	Game.e_Dex = Game.RNG(5,7) + Game.RNG(Math.floor((level-1)*1.5),2*(level-1));
	Game.e_Int = Game.RNG(5,7) + Game.RNG(Math.floor((level-1)*1.5),2*(level-1));
	Game.e_Level = level;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = true;
	Game.e_Weapon = Game.makeWeapon(level+3);
}

Game.reset = function() {
	if(confirm("Are you sure you wish to erase your save? It will be lost permanently...")) {
		window.localStorage.removeItem("gameSave");
		window.location.reload();
	}
}

Game.save = function() {
	var g = JSON.stringify(Game);
	window.localStorage.setItem("gameSave",g);
	var saveToast = document.getElementById("saveToast");
	saveToast.style.display = "";
	window.setTimeout(function() { 	var saveToast = document.getElementById("saveToast"); saveToast.style.display = "none"; },3000);
}

Game.load = function() {
	//localStorage yeeeeee
	var g;
	try {
		g = JSON.parse(window.localStorage.getItem("gameSave"));
	}
	catch(x) {
		g = null;
		console.log("Failed to load save. Is localStorage a thing on this browser?");
	}
	if(g !== null) { 
		Game.p_HP = g.p_HP;
		Game.p_MaxHP = g.p_MaxHP;
		Game.p_Str = g.p_Str;
		Game.p_Dex = g.p_Dex;
		Game.p_Int = g.p_Int;
		Game.p_Con = g.p_Con;
		Game.p_EXP = g.p_EXP;
		Game.p_NextEXP = g.p_NextEXP;
		Game.p_Powers = g.p_Powers;
		Game.p_Level = g.p_Level;
		Game.p_State = g.p_State;
		Game.p_PP = g.p_PP;
		Game.p_SkillPoints = g.p_SkillPoints;
		Game.p_Weapon = g.p_Weapon;
		Game.last_Weapon = g.last_Weapon;
		return true;
	}
	else { return false; }
}

Game.getWeaponName = function(weapon) {
	var ret = "Level " + weapon[0] + " ";
	switch(weapon[1]) {
		case Game.WEAPON_MELEE:
			switch(weapon[2]) {
				case Game.WSPEED_FAST:
					if(weapon[3] < 1.5) { ret += "Shortsword"; }
					else { ret += "Longsword"; }
					break;
				case Game.WSPEED_MID:
					if(weapon[3] < 2.5) { ret += "Hand Axe"; }
					else { ret += "Broad Axe"; }
					break;
				case Game.WSPEED_SLOW:
					if(weapon[3] < 3.5) { ret += "Flail"; }
					else { ret += "Morningstar"; }
					break;
			}
			break;
		case Game.WEAPON_RANGE:
			switch(weapon[2]) {
				case Game.WSPEED_FAST:
					if(weapon[3] < 1.5) { ret += "Throwing Knife"; }
					else { ret += "Throwing Axe"; }
					break;
				case Game.WSPEED_MID:
					if(weapon[3] < 2.5) { ret += "Repeater"; }
					else { ret += "Crossbow"; }
					break;
				case Game.WSPEED_SLOW:
					if(weapon[3] < 3.5) { ret += "Shortbow"; }
					else { ret += "Longbow"; }
					break;
			}
			break;
		case Game.WEAPON_MAGIC:
			switch(weapon[2]) {
				case Game.WSPEED_FAST:
					ret += "Staff of Thunder"; break;
				case Game.WSPEED_MID:
					ret += "Staff of Flame"; break;
				case Game.WSPEED_SLOW:
					ret += "Staff of Frost"; break;
			}
			break;
	}
	return ret;
}

Game.makeWeapon = function(level) {
	// Returns a weapon as an array in the format
	// [level,type,speedBracket,speed,damage,decay]
	var type = Game.RNG(1,3);
	type += 200; // Brings it in line with weapon type constants
	var sType = Game.RNG(1,3);
	sType += 210; // Brings it in line with weapon speed constants
	var speed = 0; 
	var damage = 0;
	var decay = 50 + 5*(level-1);
	switch(type) {
		case Game.WEAPON_MAGIC:
			switch(sType) {
				case Game.WSPEED_FAST:
					damage = Game.RNG(2*level,3*level); 
					break;
				case Game.WSPEED_MID:
					damage = Game.RNG(4*level,7*level); 
					break;
				case Game.WSPEED_SLOW:
					damage = Game.RNG(8*level,12*level); 
					break;
			}
			break;
		default:
			switch(sType) {
				case Game.WSPEED_FAST:
					damage = Game.RNG(3*level,4*level); 
					break;
				case Game.WSPEED_MID:
					damage = Game.RNG(6*level,9*level); 
					break;
				case Game.WSPEED_SLOW:
					damage = Game.RNG(10*level,15*level); 
					break;
			}
	}
	switch(sType) {
		case Game.WSPEED_FAST:
			speed = Game.RNG(10,20); 
			break;
		case Game.WSPEED_MID:
			speed = Game.RNG(20,30); 
			break;
		case Game.WSPEED_SLOW:
			speed = Game.RNG(30,40); 
			break;
	}
	speed = speed/10;
	if(type == Game.WEAPON_MAGIC) { decay = -1; }
	return new Array(level,type,sType,speed,damage,decay);
}

Game.hasPower = function(power) {
	return Game.p_Powers.indexOf(power) >= 0;
}

Game.RNG = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
