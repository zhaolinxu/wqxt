/*--------------------------
player.js

Functions relating to player
actions and advancement.
--------------------------*/

Game.levelUp = function() {
	Game.combatLog("info","Level up! You are now level <span class='q222'>" + (Game.p_Level+1) + "</span>.");
  var hpUp = Game.RNG(25,30);
	Game.p_MaxHP += hpUp
	Game.combatLog("info","You gained <span class='q222'>" + hpUp + "</span> maximum HP.");
  var strUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_MELEE ? 1 : 0);
	Game.p_Str += strUp;
	Game.combatLog("info","You gained <span class='q222'>" + strUp + "</span> Strength.");
	var dexUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_RANGE ? 1 : 0);
	Game.p_Dex += dexUp;
	Game.combatLog("info","You gained <span class='q222'>" + dexUp + "</span> Dexterity.");
	var intUp = 1 + (Game.p_Weapon[2] == Game.WEAPON_MAGIC ? 1 : 0);
	Game.p_Int += intUp;
	Game.combatLog("info","You gained <span class='q222'>" + intUp + "</span> Intelligence.");
	var conUp = Game.RNG(1,4) == 1 ? 2 : 1;
	Game.p_Con += conUp;
	Game.combatLog("info","You gained <span class='q222'>" + conUp + "</span> Constitution.");
  Game.p_MaxHP += (15 * conUp);
  var statUpChance = Game.powerLevel(Game.BOOST_STATUP);
  if(statUpChance > 0 && Game.RNG(1,100) <= 3*statUpChance) {
    var chosenStat = Game.RNG(1,4);
    switch(chosenStat) {
      case 1:
        Game.p_Str++; Game.combatLog("info","<span class='q222'>Patience and Discipline</span> granted an additional 1 Strength.");
        break;
      case 2:
        Game.p_Dex++; Game.combatLog("info","<span class='q222'>Patience and Discipline</span> granted an additional 1 Dexterity.");
        break;
      case 3:
        Game.p_Int++; Game.combatLog("info","<span class='q222'>Patience and Discipline</span> granted an additional 1 Intelligence.");
        break;
      case 4:
        Game.p_Con++; Game.combatLog("info","<span class='q222'>Patience and Discipline</span> granted an additional 1 Constitution.");
        break;
    }
  }
	Game.p_Level++;
  Game.TRACK_XP_OVERFLOW += Game.p_EXP - Game.p_NextEXP;
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(Game.XP_INIT*Math.pow(Game.XP_MULT,Game.p_Level-1));
  if(Game.p_Level == 50) {
    Game.badgeCheck(Game.BADGE_NO_SPEND);
  }
	Game.p_SkillPoints++;
	Game.combatLog("info","You gained a Stat Point.");
  var SPChance = Game.powerLevel(Game.BOOST_MORESP);
	if(Game.RNG(1,100) <= SPChance) {
		Game.p_SkillPoints++;
		Game.combatLog("info","Your <span class='q222'>Luck of the Draw</span> power granted another Stat Point.");
	}
  Game.p_PP += 1;
	Game.combatLog("info","You gained a Power point.");
  if(Game.RNG(1,100) <= Game.powerLevel(Game.BOOST_MOREPP)) {
    Game.p_PP++;
    Game.combatLog("info","<span class='q222'>Lucky Star</span> granted an additional Power Point.");
  }
  if(Game.p_Level == 5) { Game.bossChance = 1; }
  Game.repopulateShop();
  Game.updatePowers = true;
}
Game.addStat = function(stat, count) {
	while(count > 0 && Game.p_SkillPoints > 0) {
		switch(stat) {
			case Game.STAT_STR:
				Game.p_Str++; Game.POINTS_STR++; Game.POINTS_STR_CURRENT++; if(Game.POINTS_STR >= 100) { Game.giveBadge(Game.BADGE_STR); } break;
        // A Good Offense
			case Game.STAT_DEX:
				Game.p_Dex++; Game.POINTS_DEX++; Game.POINTS_DEX_CURRENT++; if(Game.POINTS_DEX >= 100) { Game.giveBadge(Game.BADGE_DEX); } break;
        // Pinpoint Accuracy
			case Game.STAT_INT:
				Game.p_Int++; Game.POINTS_INT++; Game.POINTS_INT_CURRENT++; if(Game.POINTS_INT >= 100) { Game.giveBadge(Game.BADGE_INT); } break;
        // Bookish Type
			case Game.STAT_CON:
				Game.p_Con++; Game.POINTS_CON++; Game.POINTS_CON_CURRENT++; Game.p_MaxHP += 15; if(Game.POINTS_CON >= 100) { Game.giveBadge(Game.BADGE_CON); } break;
        // Defence of the Ancients
		}
		Game.p_SkillPoints--; count--;
	}
  if((Game.POINTS_STR + Game.POINTS_DEX + Game.POINTS_INT + Game.POINTS_CON) >= 200) { Game.giveBadge(Game.BADGE_TOTAL); }
  // The Only Way is Up
	Game.drawActivePanel();
}
Game.initPlayer = function(level) {
	Game.p_Str = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Dex = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Int = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
	Game.p_Con = Game.RNG(5,7) + Game.RNG(level-1,2*(level-1));
  Game.p_MaxHP = (Game.p_Con * 15) + Game.RNG(25*level,30*level);
	Game.p_HP = Game.p_MaxHP;
	Game.p_EXP = 0;
	Game.p_NextEXP = Math.floor(Game.XP_INIT*Math.pow(Game.XP_MULT,level-1));
	Game.p_SkillPoints = level;
	Game.p_Level = level;
	Game.p_PP = level;
	Game.p_Weapon = Game.makeWeapon(level);
  Game.p_Armour = Game.makeArmour(level);
}
Game.getEnemyName = function(isBoss) {
  if(isBoss) {
    return Game.ZONE_ELITE_NAMES[Game.p_currentZone][Game.RNG(0, Game.ZONE_ELITE_NAMES[Game.p_currentZone].length-1)];
  }
  else {
    return Game.ZONE_ENEMY_NAMES[Game.p_currentZone][Game.RNG(0, Game.ZONE_ENEMY_NAMES[Game.p_currentZone].length-1)];
  }
}
Game.makeEnemy = function(level) {
  var L = Math.min(level, Game.ZONE_MAX_LEVEL[Game.p_currentZone]);
  Game.e_Name = Game.getEnemyName(false);
	Game.e_MaxHP = Game.RNG(80,100) + Game.RNG(25*(L-1),30*(L-1));
	Game.e_MainStat = Game.RNG(5,7) + Game.RNG(L-1,1.5*(L-1));
  var scalingFactor = 0.8+((L-1)*0.03);
  Game.e_MaxHP = Math.floor(Game.e_MaxHP*scalingFactor);
  Game.e_MainStat = Math.floor(Game.e_MainStat*scalingFactor);
  Game.e_HP = Game.e_MaxHP;
  Game.e_Debuff = [];
	Game.e_Level = L;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = false;
  Game.e_ProperName = false;
  Game.e_Weapon = [];
  do {
    Game.e_Weapon = Game.makeWeapon(Game.RNG(1,5) == 1 ? L+1 : L);
  } while(Game.e_Weapon[7] >= Game.QUALITY_GREAT);
  Game.e_Armour = [];
  do {
  Game.e_Armour = Game.makeArmour(Game.RNG(1,5) == 1 ? L+1 : L);
  } while(Game.e_Armour[2] >= Game.QUALITY_GREAT);
}
Game.makeElite = function(level) {
  var L = Math.min(level, Game.ZONE_MAX_LEVEL[Game.p_currentZone]);
  Game.e_Name = Game.getEnemyName(true);
	Game.e_MaxHP = Game.RNG(80,100) + Game.RNG(25*(L-1),30*(L-1));
	Game.e_MainStat = Game.RNG(5,7) + Game.RNG(Math.floor((L-1)*1.5),2*(L-1));
  var scalingFactor = 0.9+((L-1)*0.04);
  Game.e_MaxHP = Math.floor(Game.e_MaxHP*scalingFactor);
  Game.e_MainStat = Math.floor(Game.e_MainStat*scalingFactor);
  Game.e_HP = Game.e_MaxHP;
  Game.e_Debuff = [];
	Game.e_Level = L;
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = true;
  Game.e_ProperName = false;
  Game.e_Weapon = [];
  do {
    Game.e_Weapon = Game.makeWeapon(Game.RNG(1,5) == 1 ? L+1 : L);
  } while(Game.e_Weapon[7] < Game.QUALITY_GREAT);
  Game.e_Armour = [];
  do {
  Game.e_Armour = Game.makeArmour(Game.RNG(1,5) == 1 ? L+1 : L);
  } while(Game.e_Armour[2] < Game.QUALITY_GREAT);
}
Game.makeBoss = function() {
  Game.e_Name = Game.ZONE_BOSSES[Game.p_currentZone][0];
	Game.e_MaxHP = Game.ZONE_BOSSES[Game.p_currentZone][2];
	Game.e_MainStat = Game.ZONE_BOSSES[Game.p_currentZone][3];
  Game.e_HP = Game.e_MaxHP;
  Game.e_Debuff = [];
	Game.e_Level = Game.ZONE_BOSSES[Game.p_currentZone][1];
	Game.e_DebuffStacks = 0;
	Game.e_isBoss = true;
  Game.e_ProperName = true;
  Game.e_Weapon = Game.ZONE_BOSSES[Game.p_currentZone][4];
  Game.e_Armour = Game.ZONE_BOSSES[Game.p_currentZone][5];
}
Game.toggleAutoBattle = function() {
  Game.autoBattle = !Game.autoBattle;
  if(Game.autoBattle) {
    Game.toastNotification("Auto Battle activated.");
    Game.giveBadge(Game.BADGE_AUTOBATTLE); // Aversion to Clicking
    Game.autoBattleTicker = window.setInterval(Game.autoBattleFunc, 200);
  }
  else {
    Game.toastNotification("Auto Battle deactivated.");
    window.clearInterval(Game.autoBattleTicker);
    Game.autoBattleTicker = null;
  }
}
Game.powerLevel = function(power) {
  for(var x = 0; x < Game.p_Powers.length; x++) {
    if(Game.p_Powers[x][0] == power) { return Game.p_Powers[x][1]; }
  }
  return 0;
}
Game.renamePlayer = function() {
  var validPlayerName = false;
  var userPlayerName = "";
  while(!validPlayerName) {
    userPlayerName = prompt("Please provide a new name for yourself.\n\n(Max 20 characters)");
    if(userPlayerName == null) { return 0; }
    if(userPlayerName.length > 20) { alert("The text provided was too long, please try something shorter."); }
    else if(/[<>|]/g.test(userPlayerName)) { alert("The text provided contained invalid characters, please try something else."); }
    else { userPlayerName = userPlayerName.replace(/[<>|]/g,""); validPlayerName = true; }
  }
  Game.p_Name = userPlayerName;
  Game.giveBadge(Game.BADGE_NAME); // The Personal Touch
  if(userPlayerName.toLowerCase() == "psychemaster") {
    Game.giveBadge(Game.BADGE_DEVNAME); // God Complex
  }
  Game.toastNotification("Name has been changed.");
  Game.drawActivePanel();
}

Game.statReset = function() {
  var pointCount = Game.POINTS_STR_CURRENT + Game.POINTS_DEX_CURRENT + Game.POINTS_INT_CURRENT + Game.POINTS_CON_CURRENT;
  var scrapCost = Math.ceil(pointCount/5);
  if(Game.p_Scrap >= scrapCost && scrapCost > 0) {
    if(confirm("Are you sure you wish to reset all your point allocations? This will cost " + scrapCost + " scrap.")) {
      Game.p_Str -= Game.POINTS_STR_CURRENT;
      Game.POINTS_STR -= Game.POINTS_STR_CURRENT;
      Game.POINTS_STR_CURRENT = 0;
      Game.p_Dex -= Game.POINTS_DEX_CURRENT;
      Game.POINTS_DEX -= Game.POINTS_DEX_CURRENT;
      Game.POINTS_DEX_CURRENT = 0;
      Game.p_Int -= Game.POINTS_INT_CURRENT;
      Game.POINTS_INT -= Game.POINTS_INT_CURRENT;
      Game.POINTS_INT_CURRENT = 0;
      Game.p_Con -= Game.POINTS_CON_CURRENT;
      Game.POINTS_CON -= Game.POINTS_CON_CURRENT;
      Game.p_MaxHP -= (15 * Game.POINTS_CON_CURRENT);
      Game.p_HP = Math.min(Game.p_HP, Game.p_MaxHP);
      Game.POINTS_CON_CURRENT = 0;
      Game.p_SkillPoints += pointCount;
      Game.p_Scrap -= scrapCost;
      Game.TRACK_RESETS++;
      Game.toastNotification("Stat points have been reset.");
      Game.drawActivePanel();
    }
  } else if(scrapCost == 0) {
    Game.toastNotification("No stat points have been assigned.");
  } else {
    Game.toastNotification("Not enough scrap to reset stat points (Requires " + scrapCost + ")");
  }
}

document.getElementById("loadedPlayer").style.display = "";