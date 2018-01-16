/*--------------------------
combat.js

Functions relating to combat
and damage calculation.
--------------------------*/

Game.startCombat = function(isManual, isBoss) {
	if(Game.p_State == Game.STATE_IDLE) {
    if(Game.p_repairInterval) {
      window.clearInterval(Game.p_repairInterval);
      Game.p_repairInterval = null;
      Game.toastNotification("Repair interrupted, entering combat...");
    }
    Game.p_Adrenaline = 0; // We don't start combat with an Adrenaline Rush!
    if(isBoss) {
      Game.makeBoss();
      Game.TRIGGER_FLAWLESS_BOSS = true;
      Game.canLoot = false; // We can't take boss items.
    }
    else {
      if(Game.p_Level >= 5 && Game.RNG(1,100) <= Game.bossChance) {
        // I'm going to be an elite!
        Game.makeElite(Game.p_Level);
        Game.bossChance = 0;
        Game.TRIGGER_FLAWLESS = true;
        Game.canLoot = true;
      }
      else {
        // Aww...
        Game.makeEnemy(Game.p_Level);
        Game.TRIGGER_FLAWLESS = true;
        Game.canLoot = true;
      }
    }
		Game.p_State = Game.STATE_COMBAT;
    if(Game.p_HP / Game.p_MaxHP <= 0.25) {
      Game.TRIGGER_SURVIVALIST = true;
    } else {
      Game.TRIGGER_SURVIVALIST = false;
    }
    Game.VAMPIRISM_START_HEALTH = Game.p_HP;
    Game.PROGRESS_LONGFIGHT = 0;
		if(Game.RNG(1,10) <= 5+Game.powerLevel(Game.BOOST_FIRST)) {
      // Pick me pick me!
			Game.combat_playerInterval = window.setTimeout(function() { Game.playerCombatTick(false); },100);
			Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick,1100);
		}
		else {
      // Aww...
			Game.combat_playerInterval = window.setTimeout(Game.enemyCombatTick,100);
			Game.combat_enemyInterval = window.setTimeout(function() { Game.playerCombatTick(false); },1100);
		}
    if(isManual) {
      Game.PROGRESS_MANUAL_BATTLE++;
      Game.badgeCheck(Game.BADGE_MANUAL_BATTLE); // Broken Mouse Convention
    }
	}
  Game.giveBadge(Game.BADGE_FIRSTBLOOD); // Baby Steps
	var log = document.getElementById("logBody");
	log.innerHTML = "";
	Game.drawActivePanel();
}
Game.playerCombatTick = function(isBurst) {
	// Are we in combat?
	if(Game.p_State == Game.STATE_COMBAT) {
		// Sleep check!
    if(Game.getPlayerDebuff()[0] == Game.DEBUFF_SLEEP) {
      // Do nothing - not even set an attack timer.
    } else {
      // Paralysis Check!
      if(Game.getPlayerDebuff()[0] == Game.DEBUFF_PARAHAX && Game.RNG(1,100) <= Game.p_Debuff[3]) {
        // Paralysis happened.
        Game.combatLog("player","<span class='q222'>" + Game.p_Debuff[1] + "</span> prevented you from attacking.");
        Game.TRACK_PARAHAX_IN++;
      }
      else {
        // Stage 0: Execute
        if(Game.e_HP / Game.e_MaxHP < 0.25) {
          if(Game.RNG(1,20) <= Game.powerLevel(Game.BOOST_EXECUTE)) {
            Game.e_HP = 0;
            Game.combatLog("player","<span class='q222'>Execute</span> activated, instantly dealing a killing blow.");
            if(Game.wildSwing) {
              Game.wildSwing = false;
              Game.combatLog("player","<span class='q222'>Wild Swings</span> ended.");
            }
            Game.endCombat();
            return;
          }
        }
        // Stage 1: Base Damage.
        var playerDMG = Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]);
        // Add in primary stat boost to weapon damage.
        switch(Game.p_Weapon[2]) {
          case Game.WEAPON_MAGIC:
            playerDMG += Game.p_Int*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0;
            break;
          case Game.WEAPON_RANGE:
            playerDMG += Game.p_Dex*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0;
            break;
          case Game.WEAPON_MELEE:
            playerDMG += Game.p_Str*Game.WEAPON_BASE_MULT*Game.p_Weapon[3]/3.0;
            break;
        }
        // Stage 2: Percentile Boosts.
        // Deadly Force
        playerDMG *= (1 + 0.02*Game.powerLevel(Game.BOOST_DAMAGE));
        // Keen Eye
        var critChance = 3*Game.powerLevel(Game.BOOST_CRIT);
        var didCrit = false;
        if(Game.RNG(1,100) <= critChance) {
          // Keener Eye
          playerDMG *= (1.5 + 0.1*Game.powerLevel(Game.BOOST_CRITDMG));
          didCrit = true;
          Game.combatLog("player", " - <span class='q222'>Critical hit!</span>");
        }
        if(Game.powerLevel(Game.BOOST_BONUSDMG) > 0) {
          // Overcharge
          playerDMG *= 1.25;
        }
        if(Game.p_Adrenaline > 0) {
          // Adrenaline Rush
          playerDMG *= (1 + 0.05*Game.powerLevel(Game.BOOST_ENRAGE));
          Game.p_Adrenaline--;
          if(Game.p_Adrenaline == 0) {
            Game.combatLog("player", "The <span class='q222'>Adrenaline Rush</span> subsides.");
          }
        }
        else {
          if(Game.powerLevel(Game.BOOST_ENRAGE) > 0 && didCrit) {
            // Activate Adrenaline Rush on crit.
            Game.p_Adrenaline = 3;
            Game.combatLog("player", " - You feel an <span class='q222'>Adrenaline Rush</span>!");
          }
        }
        // Stage 3: Percentile Reductions
        var canDebuff = true;
        if(Game.p_Weapon[8] == 0) {
          // Broken weapon.
          canDebuff = false;
          playerDMG *= (0.25 + 0.1*Game.powerLevel(Game.BOOST_BROKEN));
        }
        if(Game.getPlayerDebuff()[0] == Game.DEBUFF_DISARM) {
          // Disarmed.
          canDebuff = false;
          playerDMG *= 0.5;
        }
        if(Game.wildSwing) {
          // Wind Swings only do half the intended damage.
          playerDMG *= 0.5;
        }
        if(Game.flurryActive) {
          // This is a flurry attack.
          playerDMG *= (0.5 + 0.04*Game.powerLevel(Game.BOOST_DBLPOWER));
        }
        // Stage 4: Mind Control Resolution
        if(Game.getPlayerDebuff()[0] == Game.DEBUFF_MC) {
          playerDMG = Math.floor(playerDMG);
          Game.p_HP = Math.max(Game.p_HP - playerDMG, 0);
          Game.TRACK_CHARM_IN++;
          Game.combatLog("enemy","<span class='q222'>" + Game.p_Debuff[1] + "</span> causes you to attack yourself for <span class='q222'>" + playerDMG + "</span> damage.");
          if(Game.p_HP <= 0) { Game.giveBadge(Game.BADGE_SELF_KILL); } // Punching Mirrors
        }
        else {
          // Stage 5: Armour Effects
          switch(Game.p_Weapon[2]) {
            case Game.WEAPON_MAGIC:
              if(Game.getEnemyDebuff()[0] != Game.DEBUFF_SHRED) {
                for(var a = 0; a < Game.e_Armour[4].length; a++) {
                  if(Game.e_Armour[4][a][0] == Game.ARMOUR_STR_MAGIC) {
                    if(isBurst && Game.powerLevel(Game.BOOST_NOWEAKNESS) > 0) {
                      playerDMG += Game.e_Armour[4][a][1];
                    } else {
                      playerDMG = Math.max(playerDMG-Game.e_Armour[4][a][1],0);
                    }
                  }
                }
              }
              for(var b = 0; b < Game.e_Armour[5].length; b++) {
                if(Game.e_Armour[5][b][0] == Game.ARMOUR_VULN_MAGIC) { playerDMG += Game.e_Armour[5][b][1]; }
              }
              break;
            case Game.WEAPON_RANGE:
              if(Game.getEnemyDebuff()[0] != Game.DEBUFF_SHRED) {
                for(var c = 0; c < Game.e_Armour[4].length; c++) {
                  if(Game.e_Armour[4][c][0] == Game.ARMOUR_STR_RANGE) {
                    if(isBurst && Game.powerLevel(Game.BOOST_NOWEAKNESS) > 0) {
                      playerDMG += Game.e_Armour[4][c][1];
                    } else {
                      playerDMG = Math.max(playerDMG-Game.e_Armour[4][c][1],0);
                    }
                  }
                }
              }
              for(var d = 0; d < Game.e_Armour[5].length; d++) {
                if(Game.e_Armour[5][d][0] == Game.ARMOUR_VULN_RANGE) { playerDMG += Game.e_Armour[5][d][1]; }
              }
              break;
            case Game.WEAPON_MELEE:
              if(Game.getEnemyDebuff()[0] != Game.DEBUFF_SHRED) {
                for(var e = 0; e < Game.e_Armour[4].length; e++) {
                  if(isBurst && Game.e_Armour[4][e][0] == Game.ARMOUR_STR_MELEE) {
                    if(Game.powerLevel(Game.BOOST_NOWEAKNESS) > 0) {
                      playerDMG += Game.e_Armour[4][e][1];
                    } else {
                      playerDMG = Math.max(playerDMG-Game.e_Armour[4][e][1],0);
                    }
                  }
                }
              }
              for(var f = 0; f < Game.e_Armour[5].length; f++) {
                if(Game.e_Armour[5][f][0] == Game.ARMOUR_VULN_MELEE) { playerDMG += Game.e_Armour[5][f][1]; }
              }
              break;
          }
          // Stage 6: Damage Application
          // Floor it, I don't like decimals.
          playerDMG = Math.floor(playerDMG);
          Game.e_HP = Math.max(Game.e_HP - playerDMG, 0);
          Game.TRACK_TOTAL_DMG += playerDMG;
          Game.TRACK_ATTACKS_OUT++;
          Game.TRACK_MAXHIT_OUT = Math.max(Game.TRACK_MAXHIT_OUT, playerDMG);
          Game.badgeCheck(Game.BADGE_JACKOFTRADES); // Jack of All Trades
          switch(Game.p_Weapon[2]) {
            case Game.WEAPON_MELEE:
              Game.TRACK_MELEE_DMG += playerDMG; break;
            case Game.WEAPON_RANGE:
              Game.TRACK_RANGE_DMG += playerDMG; break;
            case Game.WEAPON_MAGIC:
              Game.TRACK_MAGIC_DMG += playerDMG; break;
          }
          Game.updateCombatTab();
          if(Game.getPlayerDebuff()[0] == Game.DEBUFF_DISARM || Game.p_Weapon[8] == 0) {
            // Use the force, applied via the knuckles.
            Game.combatLog("player","You hit " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " with your fists for <span class='q222'>" + playerDMG + "</span> damage.");
          }
          else {
            // Stick 'em with the pointy end.
            Game.combatLog("player","You hit " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " with your <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span> for <span class='q222'>" + playerDMG + "</span> damage.");
            if(Game.RNG(1,50) < Game.powerLevel(Game.BOOST_CARE)) {
              // Proper Care
              Game.combatLog("player"," - <span class='q222'>Proper Care</span> prevented weapon decay.");
            }
            else {
              Game.p_Weapon[8]--;
              if(Game.powerLevel(Game.BOOST_BONUSDMG) > 0) { Game.p_Weapon[8]--; }
              if(Game.p_Weapon[8] <= 0) {
                Game.p_Weapon[8] = 0;
                Game.TRACK_BROKEN_ITEMS++;
                Game.combatLog("player", " - Your <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span> has broken!");
              }
            }
          }
          if(Game.getEnemyDebuff()[0] == Game.DEBUFF_MULTI) {
            // DOUBLE STRIKEU
            var secondStrike = Math.floor(playerDMG * (Game.e_Debuff[3]/100));
            Game.e_HP = Math.max(Game.e_HP - secondStrike, 0);
            Game.combatLog("player"," - <span class='q222'>" + Game.e_Debuff[1] + "</span> allows you to strike again for <span class='q222'>" + secondStrike + "</span> damage.");
          }
          if(Game.getEnemyDebuff()[0] == Game.DEBUFF_SLEEP) {
            // Waking the beast. Maybe.
            if(Game.RNG(1,25) <= Game.e_Debuff[3]) {
              Game.enemy_debuffTimer = 0;
              Game.TRACK_SLEEPBREAK_OUT++;
            }
          }
        }
        // Stage 7: Debuff Application
        var debuffChance = 10 + Game.powerLevel(Game.BOOST_DEBUFF);
        if(isBurst) {
          debuffChance += 20 * Game.powerLevel(Game.BOOST_DEBUFFBURST);
        }
        if(Game.e_Debuff.length > 0) {
           if(Game.getPlayerDebuff()[0] !== Game.DEBUFF_MC) {
             canDebuff = false;
           }
        }
        if( Game.p_Weapon[9].length == 0) { canDebuff = false; }
        var debuffApplied = false;
        if(canDebuff) {
          if(Game.RNG(1,100) <= debuffChance) {
            debuffApplied = true;
            if(Game.getPlayerDebuff()[0] == Game.DEBUFF_MC) {
              Game.p_Debuff = Game.p_Weapon[9].slice();
              Game.combatLog("enemy"," - You suffer from <span class='q222'>" + Game.p_Weapon[9][1] + "</span>.");
              Game.TRACK_DEBUFFS_IN++;
              Game.giveBadge(Game.BADGE_SELF_DEBUFF); // Hoisted By My Own Petard
              Game.player_debuffTimer = Game.p_Weapon[9][2];
              window.clearInterval(Game.player_debuffInterval);
              Game.player_debuffInterval = window.setInterval(Game.playerDebuffTicker,1000);
              if(Game.getPlayerDebuff()[0] == Game.DEBUFF_SLEEP) {
                window.clearInterval(Game.combat_playerInterval);
                Game.combatLog("player","You fall asleep...");
              }
            }
            else {
              Game.e_Debuff = Game.p_Weapon[9].slice();
              Game.combatLog("player"," - " + (Game.e_ProperName ? "" : "The ") + Game.e_Name + " suffers from <span class='q222'>" + Game.p_Weapon[9][1] + "</span>.");
              Game.TRACK_DEBUFFS_OUT++;
              Game.enemy_debuffTimer = Game.p_Weapon[9][2];
              window.clearInterval(Game.enemy_debuffInterval);
              Game.enemy_debuffInterval = window.setInterval(Game.enemyDebuffTicker,1000);
              if(Game.getEnemyDebuff()[0] == Game.DEBUFF_SLEEP) {
                window.clearInterval(Game.combat_enemyInterval);
                Game.combatLog("enemy", (Game.e_ProperName ? "" : "The ") + Game.e_Name + " falls asleep...");
              }
            }
          }
        }
        // Clear the debuff timer so confusion doesn't persist between turns.
        if(Game.getPlayerDebuff()[0] == Game.DEBUFF_MC && !debuffApplied) {
          Game.player_debuffTimer = 0;
        }
          // Stage 8: Miscellaneous Effects
        if(Game.RNG(1,100) <= Game.powerLevel(Game.BOOST_PICKPOCKET)) {
          Game.p_Currency += Game.e_Level;
          Game.combatLog("player","<span class='q222'>Five-Finger Discount</span> allowed you to steal " + Game.e_Level + " seeds.");
        }
      }
      if(Game.e_HP > 0 && Game.p_HP > 0) {
        if(!Game.flurryActive) {
          if(Game.RNG(1,100) <= Game.powerLevel(Game.BOOST_DOUBLE)) {
            Game.flurryActive = true;
            Game.combatLog("player"," - <span class='q222'>Flurry</span> activated for an additional strike!");
            Game.playerCombatTick(isBurst);
          }
        }
        else { Game.flurryActive = false; }
        window.clearTimeout(Game.combat_playerInterval);
        var timerLength = 1000 * Game.p_Weapon[3] * (1 - (0.02*Game.powerLevel(Game.BOOST_SPEED)));
        if(Game.getPlayerDebuff()[0] == Game.DEBUFF_SLOW) {
          timerLength *= (1 + (Game.p_Debuff[3]/100));
        }
        Game.combat_playerInterval = window.setTimeout(function() { Game.playerCombatTick(false); },timerLength);
      }
      else {
        if(Game.wildSwing) {
          Game.wildSwing = false;
          Game.combatLog("player","<span class='q222'>Wild Swings</span> ended.");
        }
        if(isBurst) {
          Game.giveBadge(Game.BADGE_BURSTFINISH); // Coup de Grace
        }
        Game.endCombat();
      }
    }
  }
	else {
		// We're not fighting, stop calling intervals...
		window.clearInterval(Game.combat_playerInterval);
	}
	Game.updateCombatTab();
}
Game.enemyCombatTick = function() {
	// Are we in combat?
	if(Game.p_State == Game.STATE_COMBAT) {
		// Paralysis check!
		if(Game.getEnemyDebuff()[0] == Game.DEBUFF_PARAHAX && Game.RNG(1,100) <= Game.e_Debuff[3]) {
			// Paralysis happened.
			Game.combatLog("enemy","<span class='q222'>" + Game.e_Debuff[1] + "</span> prevented " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " from attacking.");
      Game.TRACK_PARAHAX_OUT++;
		}
		else {
			// Stage 1: Base Damage.
			var enemyDMG = Game.RNG(Game.e_Weapon[4],Game.e_Weapon[5]);
			enemyDMG += Game.e_MainStat*Game.WEAPON_BASE_MULT*Game.e_Weapon[3]/3.0;
			var canDebuff = true;
			// Stage 2: Mind Control Resolution
			if(Game.getEnemyDebuff()[0] == Game.DEBUFF_MC) {
				enemyDMG = Math.floor(enemyDMG);
				Game.e_HP = Math.max(Game.e_HP - enemyDMG, 0);
        Game.TRACK_CHARM_OUT++;
				Game.combatLog("player","<span class='q222'>" + Game.e_Debuff[1] + "</span> causes " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " to attack itself for <span class='q222'>" + enemyDMG + "</span> damage.");
        if(Game.e_HP <= 0) { Game.giveBadge(Game.BADGE_ENEMY_SELF_KILL); } // Assisted Suicide
			}
			else {
				// Stage 3: Percentile Reductions
				// Ancestral Fortitude
				enemyDMG *= (1 - 0.02*Game.powerLevel(Game.BOOST_DEFENCE));
				// Last Bastion
				if(Game.powerLevel(Game.BOOST_LASTSTAND) > 0 && (Game.p_HP / Game.p_MaxHP) <= 0.3) {
					enemyDMG *= (1 - 0.1*Game.powerLevel(Game.BOOST_LASTSTAND));
				}
				// Disarmed
				if(Game.getEnemyDebuff()[0] == Game.DEBUFF_DISARM) {
					enemyDMG *= 0.5;
					canDebuff = false;
				}
				// Stage 4: Armour Effects.
				switch(Game.e_Weapon[2]) {
					case Game.WEAPON_MAGIC:
						if(Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
							for(var a = 0; a < Game.p_Armour[4].length; a++) {
								if(Game.p_Armour[4][a][0] == Game.ARMOUR_STR_MAGIC) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][a][1],0); }
							}
						}
						for(var b = 0; b < Game.p_Armour[5].length; b++) {
							if(Game.p_Armour[5][b][0] == Game.ARMOUR_VULN_MAGIC) { enemyDMG += Game.p_Armour[5][b][1]; }
						}
						break;
					case Game.WEAPON_RANGE:
						if(Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
							for(var c = 0; c < Game.p_Armour[4].length; c++) {
								if(Game.p_Armour[4][c][0] == Game.ARMOUR_STR_RANGE) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][c][1],0); }
							}
						}
						for(var d = 0; d < Game.p_Armour[5].length; d++) {
							if(Game.p_Armour[5][d][0] == Game.ARMOUR_VULN_RANGE) { enemyDMG += Game.p_Armour[5][d][1]; }
						}
						break;
					case Game.WEAPON_MELEE:
						if(Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
							for(var e = 0; e < Game.p_Armour[4].length; e++) {
								if(Game.p_Armour[4][e][0] == Game.ARMOUR_STR_MELEE) { enemyDMG = Math.max(enemyDMG-Game.p_Armour[4][e][1],0); }
							}
						}
						for(var f = 0; f < Game.p_Armour[5].length; f++) {
							if(Game.p_Armour[5][f][0] == Game.ARMOUR_VULN_MELEE) { enemyDMG += Game.p_Armour[5][f][1]; }
						}
						break;
				}
				// Stage 5: Damage Application
				enemyDMG = Math.floor(enemyDMG);
        if(enemyDMG > 0) {
          Game.TRIGGER_FLAWLESS = false;
          Game.TRIGGER_FLAWLESS_BOSS = false;
        }
				// Divine Shield anyone?
				if(Game.RNG(1,100) <= Game.powerLevel(Game.BOOST_SHIELD)) {
          if(Game.p_HP <= enemyDMG) { Game.giveBadge(Game.BADGE_INTERVENTION); } // Divine Intervention
					if(Game.powerLevel(Game.BOOST_REFLECT) == 1) {
						// No, YOU take the hit!
						Game.e_HP = Math.max(Game.e_HP - enemyDMG, 0);
						Game.combatLog("player","Your <span class='q222'>Reflective Shield</span> dealt <span class='q222'>" + enemyDMG + "</span> damage.");
					}
					else if(Game.powerLevel(Game.BOOST_ABSORB) == 1) {
            // Free health is the best kind.
            Game.p_HP = Math.min(Game.p_HP + enemyDMG, Game.p_MaxHP);
            Game.combatLog("player","Your <span class='q222'>Absorption Shield</span> healed you for  <span class='q222'>" + enemyDMG + "</span>.");
          }
          else {
            Game.combatLog("player","Your <span class='q222'>Divine Shield</span> absorbed the damage.");
          }
				}
				else {
					// This may hurt a little.
					Game.p_HP = Math.max(Game.p_HP - enemyDMG, 0);
          Game.TRACK_ATTACKS_IN++;
          Game.TRACK_TOTAL_TAKEN += enemyDMG;
          Game.TRACK_MAXHIT_IN = Math.max(Game.TRACK_MAXHIT_IN, enemyDMG);
          Game.PROGRESS_LONGFIGHT++;
          switch(Game.e_Weapon[2]) {
            case Game.WEAPON_MELEE:
              Game.TRACK_MELEE_TAKEN += enemyDMG; break;
            case Game.WEAPON_RANGE:
              Game.TRACK_RANGE_TAKEN += enemyDMG; break;
            case Game.WEAPON_MAGIC:
              Game.TRACK_MAGIC_TAKEN += enemyDMG; break;
          }
					if(Game.getEnemyDebuff()[0] == Game.DEBUFF_DISARM) {
						Game.combatLog("enemy",(Game.e_ProperName ? "" : "The ") + Game.e_Name + " hits you with their fists for <span class='q222'>" + enemyDMG + "</span> damage.");
					}
					else {
						Game.combatLog("enemy",(Game.e_ProperName ? "" : "The ") + Game.e_Name + " hits you with their <span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> for <span class='q222'>" + enemyDMG + "</span> damage.");
					}
					if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_VENGEANCE)) {
						// You get what you give. Mostly.
						var vengDMG = Math.floor(enemyDMG/2);
						Game.e_HP = Math.max(Game.e_HP-vengDMG,0);
						Game.combatLog("player","Your <span class='q222'>Vengeance</span> effect dealt " + vengDMG + " damage.");
					}
					if(Game.getPlayerDebuff()[0] == Game.DEBUFF_MULTI) {
						var secondDmg = Math.floor(enemyDMG*Game.p_Debuff[3]/100);
						Game.p_HP = Math.max(Game.p_HP-secondDmg,0);
						Game.combatLog("enemy"," - <span class='q222'>" + Game.p_Debuff[1] + "</span> allows " + (Game.e_ProperName ? "" : "the ") + Game.e_Name + " to strike again for <span class='q222'>" + secondDmg + "</span> damage.");
					}
          if(Game.getPlayerDebuff()[0] == Game.DEBUFF_SLEEP) {
            // Waking the beast. Maybe.
            if(Game.RNG(1,25) <= Game.p_Debuff[3]) {
              Game.player_debuffTimer = 0;
              Game.TRACK_SLEEPBREAK_IN++;
            }
          }
					if(Game.p_Armour[3] > 0) {
						if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_CARE)) {
							// My gear is INVINCIBLE!
							Game.combatLog("player"," - <span class='q222'>Proper Care</span> prevented armour decay.");
						}
						else {
							Game.p_Armour[3]--;
							if(Game.p_Armour[3] <= 0) {
                Game.p_Armour[3] = 0;
								Game.combatLog("player", " - Your <span class='q" + Game.p_Armour[2] + "'>" + Game.p_Armour[0].split("|")[0] + "</span> has broken!");
                Game.TRACK_BROKEN_ITEMS++;
							}
						}
					}
				}
			}
			Game.updateCombatTab();
			// Stage 6: Debuff Application
			if(Game.e_Weapon[9].length == 0) {
				canDebuff = false;
			}
			if(Game.p_Debuff.length > 0) {
				if(Game.getEnemyDebuff()[0] !== Game.DEBUFF_MC) {
					canDebuff = false;
				}
			}
			if(canDebuff) {
				if(Game.RNG(1,10) == 1) {
					if(Game.getEnemyDebuff()[0] == Game.DEBUFF_MC) {
						Game.e_Debuff = Game.e_Weapon[9].slice();
						Game.combatLog("player"," - " + (Game.e_ProperName ? "" : "The ") + Game.e_Name + " suffers from <span class='q222'>" + Game.e_Weapon[9][1] + "</span>.");
            Game.TRACK_DEBUFFS_OUT++;
            Game.giveBadge(Game.BADGE_ENEMY_SELF_DEBUFF); // Tarred With Their Own Brush
						Game.enemy_debuffTimer = Game.e_Weapon[9][2];
            window.clearInterval(Game.enemy_debuffInterval);
						Game.enemy_debuffInterval = window.setInterval(Game.enemyDebuffTicker,1000);
            if(Game.getEnemyDebuff()[0] == Game.DEBUFF_SLEEP) {
                window.clearInterval(Game.combat_enemyInterval);
                Game.combatLog("player",(Game.e_ProperName ? "" : "The ") + Game.e_Name + " falls asleep...");
              }
					}
					else {
						Game.p_Debuff = Game.e_Weapon[9].slice();
						Game.combatLog("enemy"," - You suffer from <span class='q222'>" + Game.e_Weapon[9][1] + "</span>.");
            Game.TRACK_DEBUFFS_IN++;
						Game.player_debuffTimer = Game.e_Weapon[9][2];
            window.clearInterval(Game.player_debuffInterval);
						Game.player_debuffInterval = window.setInterval(Game.playerDebuffTicker,1000);
            if(Game.getPlayerDebuff()[0] == Game.DEBUFF_SLEEP) {
                window.clearInterval(Game.combat_playerInterval);
                Game.combatLog("player","You fall asleep...");
              }
					}
				}
			}
			if(Game.getEnemyDebuff()[0] == Game.DEBUFF_MC) {
				Game.enemy_debuffTimer = 0;
			}
		}
		if(Game.e_HP > 0 && Game.p_HP > 0) {
			var mult = 1;
			if(Game.getEnemyDebuff()[0] == Game.DEBUFF_SLOW) {
				mult += (Game.e_Debuff[3] / 100)
			}
			Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick,1000*Game.e_Weapon[3]*mult);
		}
		else {
			Game.endCombat();
		}
  }
	else {
		window.clearInterval(Game.combat_enemyInterval);
	}
	Game.updateCombatTab();
}
Game.burstAttack = function() {
  if(Game.p_specUsed) {
    return;
  }
  if(Game.e_HP > 0) {
    if(Game.getPlayerDebuff()[0] == Game.DEBUFF_SLEEP) {
      Game.toastNotification("You cannot use Burst Attack while sleeping.")
    }
    else {
      Game.p_specUsed = true;
      Game.TRACK_BURSTS++;
      Game.badgeCheck(Game.BADGE_BURSTSPAM); // Manual Labour
      if(Game.powerLevel(Game.BOOST_BURST) > 0) {
        if(Game.e_Debuff !== []) {
          window.setTimeout(function() { Game.p_specUsed = false; },10000-(1000*Game.powerLevel(Game.BOOST_FASTBURST)));
        } else {
          window.setTimeout(function() { Game.p_specUsed = false; },10000);
        }
        Game.combatLog("player","<span class='q222'>Wild Swings</span> activated.");
        Game.wildSwing = true;
        for(var x = Game.powerLevel(Game.BOOST_BURST); x >= 0; x--) {
          Game.playerCombatTick(true);
        }
        if(Game.wildSwing) {
        Game.combatLog("player","<span class='q222'>Wild Swings</span> ended.");
        Game.wildSwing = false;
        }
      }
      else {
        Game.combatLog("player","<span class='q222'>Burst Attack</span> activated.");
        Game.playerCombatTick(true);
      }
      Game.updateCombatTab();
    }
  }
}
Game.fleeCombat = function() {
  if(Game.getPlayerDebuff()[0] !== Game.DEBUFF_SLEEP) {
  // Lots of cleanup of timers and temporary values.
    window.clearTimeout(Game.combat_playerInterval);
    window.clearTimeout(Game.combat_enemyInterval);
    if(Game.enemy_debuffInterval !== null) {
      window.clearInterval(Game.enemy_debuffInterval);
      Game.enemy_debuffInterval = null;
      Game.enemy_debuffTimer = 0; }
    if(Game.player_debuffInterval !== null) {
      window.clearInterval(Game.player_debuffInterval);
      Game.player_debuffInterval = null;
      Game.player_debuffTimer = 0; }
    Game.p_Debuff = [];
    Game.e_Debuff = [];
    Game.p_Adrenaline = 0;
    if(Game.p_Level >= 5) { Game.bossChance++; } // Not even running will save you from eventual boss encounters.
    Game.p_State = Game.STATE_IDLE;
    Game.p_specUsed = false;
    Game.combatLog("info","You fled from the battle.");
    Game.TRACK_ESCAPES++;
    Game.TRACK_WIN_STREAK = 0;
    Game.drawActivePanel();
  }
  else {
    Game.toastNotification("You cannot flee from combat while sleeping.");
  }
}
Game.endCombat = function() {
  // Still lots of cleanup, but some other, more important things too!
	window.clearTimeout(Game.combat_playerInterval);
	window.clearTimeout(Game.combat_enemyInterval);
  if(Game.enemy_debuffInterval !== null) {
    window.clearInterval(Game.enemy_debuffInterval);
    Game.enemy_debuffInterval = null;
    Game.enemy_debuffTimer = 0; }
  if(Game.player_debuffInterval !== null) {
    window.clearInterval(Game.player_debuffInterval);
    Game.player_debuffInterval = null;
    Game.player_debuffTimer = 0; }
  // Wherefore art thou Romeo?
  if(Game.getPlayerDebuff()[0] == Game.DEBUFF_DOT && Game.getEnemyDebuff()[0] == Game.DEBUFF_SLEEP && Game.p_HP <= 0) {
    Game.giveBadge(Game.BADGE_ROMEO); // WHerefore Art Thou, Romeo?
  }
  Game.p_Debuff = [];
  Game.e_Debuff = [];
	Game.p_State = Game.STATE_IDLE;
  Game.p_specUsed = false;
	if(Game.p_HP > 0) {
		// Player won, give xp and maybe, just maybe, a level.
		Game.combatLog("info","You won!");
    if(Game.p_HP / Game.p_MaxHP <= 0.05) {
      Game.giveBadge(Game.BADGE_ALMOSTDEAD); // Living on a Prayer
    }
    if(Game.TRIGGER_SURVIVALIST) {
      Game.giveBadge(Game.BADGE_SURVIVALIST); // The Survivalist
    }
    if(Game.TRIGGER_FLAWLESS) {
      Game.giveBadge(Game.BADGE_FLAWLESS); // Flawless Victory
    }
    if(Game.TRIGGER_FLAWLESS_BOSS) {
      Game.giveBadge(Game.BADGE_FLAWLESS_BOSS); // MC Hammer Special
    }
    if(Game.PROGRESS_LONGFIGHT >= 25) {
      Game.giveBadge(Game.BADGE_LONGFIGHT); // War of Attrition
    }
    if(Game.e_isBoss) { Game.TRACK_BOSS_KILLS++; }
    if(Game.p_HP > Game.VAMPIRISM_START_HEALTH) { Game.giveBadge(Game.BADGE_VAMPIRISM); } // Vampirism
    // Steal their stuff, if you can.
    if(Game.canLoot) {
      if(Game.p_WeaponInventory.length < Game.MAX_INVENTORY) {
        Game.p_WeaponInventory.push(Game.e_Weapon.slice());
        Game.combatLog("info","<span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> added to your inventory.")
      } else {
        Game.last_Weapon = Game.e_Weapon.slice();
        Game.combatLog("info","<span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> could not be taken due to full inventory.")
      }
      if(Game.p_ArmourInventory.length < Game.MAX_INVENTORY) {
        Game.p_ArmourInventory.push(Game.e_Armour.slice());
        Game.combatLog("info","<span class='q" + Game.e_Armour[2] + "'>" + Game.e_Armour[0].split("|")[0] + "</span> added to your inventory.");
      } else {
        Game.last_Armour = Game.e_Armour.slice();
        Game.combatLog("info","<span class='q" + Game.e_Armour[2] + "'>" + Game.e_Armour[0].split("|")[0] + "</span> could not be taken due to full inventory.");
      }
    }
    Game.updateInventory = true; // So we can see our new ill-gotten gains.
    // XP is not a static number. Honest.
		var xpToAdd = Math.floor(Game.XP_BASE+(Game.RNG(Game.XP_RANGEMIN*Game.e_Level,Game.XP_RANGEMAX*Game.e_Level)));
    var currencyToAdd = xpToAdd;
    // More XP? Only if you paid for it in points or boss blood.
    if(!Game.canLoot) { xpToAdd *= 2; }
    else if(Game.e_isBoss) { xpToAdd *= 1.5; }
    xpToAdd = Math.floor(xpToAdd*(1+(0.05*Game.powerLevel(Game.BOOST_XP))));
    var badgeBonus = Math.floor(xpToAdd * (0.02 * Game.playerBadges.length));
		Game.combatLog("info","You gained <span class='q222'>" + xpToAdd + "</span> (<span class='q223'>+" + badgeBonus + "</span>) (<span class='q224'>+" + Game.prestigeLevel + "</span>) experience.");
    // Overflow
    if(Game.powerLevel(Game.BOOST_OVERFLOW) > 0) {
      var bonusXP = Math.floor(Math.min(Game.TRACK_XP_OVERFLOW, xpToAdd / 2));
      xpToAdd += bonusXP;
      Game.TRACK_XP_OVERFLOW -= bonusXP;
      Game.combatLog("info","You gained an additional <span class='q222'>" + bonusXP + "</span> experience from Reclaimed Knowledge.");
    }
    // More seeds? See above.
    if(!Game.canLoot) { currencyToAdd *= 2; }
    else if(Game.e_isBoss) { currencyToAdd *= 1.5; }
		currencyToAdd = Math.floor(currencyToAdd*(1+(0.05*Game.powerLevel(Game.BOOST_CURRENCY))));
    var currencyBadgeBonus = Math.floor(currencyToAdd * (0.02 * Game.playerBadges.length));
    if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_EXTRA)) {
      // Everybody gets seeds!
      currencyToAdd *= 3;
      Game.combatLog("info","<span class='q222'>Cavity Search</span> tripled seed gain!");
    }
    if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_SCRAP)) {
      // Yes, you can have some scrap. It's okay.
      Game.p_Scrap++;
      Game.TRACK_COMBAT_SCRAP++;
      Game.combatLog("info","<span class='q222'>Thorough Looting</span> yielded an extra piece of scrap!");
    }
		Game.combatLog("info","You gained <span class='q222'>" + currencyToAdd + "</span> (<span class='q223'>+" + currencyBadgeBonus + "</span>) (<span class='q224'>+" + Game.prestigeLevel + "</span>) seeds.");
    if(!Game.canLoot) {
      // This was a boss kill - Set maxZone, award badge, drop notification
      var lastmax = Game.p_maxZone;
      Game.p_maxZone = Math.max(Game.p_maxZone, Game.p_currentZone+1);
      Game.giveBadge(Game.BADGE_ZONE1 + Game.p_currentZone);
      Game.combatLog("info","<span class='q222'>" + Game.ZONE_NAMES[Game.p_currentZone] + " cleared!</span>");
      if(Game.p_maxZone > lastmax) { Game.combatLog("info","<span class='q222'>" + Game.ZONE_NAMES[Game.p_maxZone] + " is now open!</span>"); }
    }
		Game.p_EXP += xpToAdd;
    Game.TRACK_XP_GAINED += xpToAdd;
    Game.p_EXP += badgeBonus;
    Game.TRACK_XP_GAINED += badgeBonus;
    Game.p_EXP += Game.prestigeLevel;
    Game.TRACK_XP_GAINED += Game.prestigeLevel;
    Game.p_Currency += currencyToAdd;
    Game.TRACK_COMBAT_SEEDS += currencyToAdd;
    Game.p_Currency += currencyBadgeBonus;
    Game.TRACK_COMBAT_SEEDS += currencyBadgeBonus;
    Game.p_Currency += Game.prestigeLevel;
    Game.TRACK_COMBAT_SEEDS += Game.prestigeLevel;
    if(Game.p_Weapon[8] == 0 && Game.p_Armour[3] == 0) {
      Game.giveBadge(Game.BADGE_NO_GEAR); // Where We're Going, We Don't Need Gear
    }
    if(Game.p_Weapon[8] == 0) {
      Game.giveBadge(Game.BADGE_NO_WEAPON); // Where We're Going, We Don't Need Weapons
    }
    if(Game.p_Armour[3] == 0) {
      Game.giveBadge(Game.BADGE_NO_ARMOUR); // Where We're Going, We Don't Need Armour
    }
		if(Game.p_EXP >= Game.p_NextEXP) {
      // DING
			Game.levelUp();
		}
    if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_REPAIR)) {
      // If this works, nobody will complain about repair timers.
      Game.p_Weapon[8] = 50 + (5*(Game.p_Weapon[1]-1));
      Game.p_Armour[3] = 50 + (5*(Game.p_Armour[1]-1));
      Game.combatLog("info","<span class='q222'>High Maintenance</span> fully repaired your equipment.");
    }
    if(Game.RNG(1,50) <= Game.powerLevel(Game.BOOST_FULLHEAL)) {
      // Cutting out the downtime.
      Game.p_HP = Game.p_MaxHP;
      Game.combatLog("info","<span class='q222'>Will To Live</span> restored you to full health.");
    }
    Game.TRACK_WINS++;
    Game.badgeCheck(Game.BADGE_KILLCOUNT); // Skullcrusher Mountain
    Game.TRACK_WIN_STREAK++;
	}
	else {
		// Enemy won, dock XP
		Game.combatLog("info","You lost...");
		var xpDrop = Math.floor(Game.p_EXP/4);
		Game.combatLog("info","You lose <span class='q222'>" + xpDrop + "</span> experience...");
		Game.p_EXP -= xpDrop;
    Game.TRACK_XP_LOST += xpDrop;
    Game.TRACK_LOSSES++;
    Game.TRACK_WIN_STREAK = 0;
	}
  if(Game.p_Level >= 5) {
    Game.bossChance++;
    Game.TRACK_BOSS_CHANCE = Math.max(Game.bossChance, Game.TRACK_BOSS_CHANCE);
  } // Even if you win, you still get a boss. It's inevitable.
  if(Game.TRACK_BOSS_CHANCE >= 20) {
    Game.giveBadge(Game.BADGE_BOSSCHANCE); // Chasing Shadows
  }
	Game.p_autoSaved = false;
	Game.drawActivePanel();
}
Game.getPlayerDebuff = function() {
  if(Game.p_Debuff.length > 0) { return Game.p_Debuff; }
  else return [0,"",0,0];
}
Game.getEnemyDebuff = function() {
  if(Game.e_Debuff.length > 0) { return Game.e_Debuff; }
  else return [0,"",0,0];
}
Game.playerDebuffTicker = function() {
  if(Game.player_debuffTimer <= 0) {
    Game.combatLog("enemy"," - The effect of <span class='q222'>" + Game.p_Debuff[1] + "</span> faded.");
    if(Game.getPlayerDebuff()[0] == Game.DEBUFF_SLEEP) {
      // Rise and shine buttercup!
      Game.combatLog("player","You wake up!");
      var timerLength = 1000 * Game.p_Weapon[3] * (1 - (0.02*Game.powerLevel(Game.BOOST_SPEED)));
      Game.combat_playerInterval = window.setTimeout(function() { Game.playerCombatTick(false); },timerLength);
    }
    Game.p_Debuff = [];
    window.clearInterval(Game.player_debuffInterval);
  } else {
    Game.player_debuffTimer -= 1;
    switch(Game.p_Debuff[0]) {
      case Game.DEBUFF_DOT:
        // Do the deeps
        var dotDMG = Math.floor(Game.RNG(Game.e_Weapon[4],Game.e_Weapon[5]) * Game.p_Debuff[3] / 100);
        Game.p_HP = Math.max(Game.p_HP - dotDMG, 0);
        Game.TRACK_DOTS_IN += dotDMG;
        Game.combatLog("enemy"," - <span class='q222'>" + Game.p_Debuff[1] + "</span> dealt an additional <span class='q222'>" + dotDMG + "</span> damage.");
        break;
      case Game.DEBUFF_DRAIN:
        // HEALZ YO
        var selfHeal = Math.floor(Game.RNG(Game.e_Weapon[4],Game.e_Weapon[5]) * Game.p_Debuff[3] / 100);
        Game.e_HP = Math.min(Game.e_HP + selfHeal, Game.e_MaxHP);
        Game.TRACK_DRAIN_OUT += selfHeal;
        Game.combatLog("enemy"," - <span class='q222'>" + Game.p_Debuff[1] + "</span> healed the enemy for <span class='q222'>" + selfHeal + "</span>.");
        break;
      case Game.DEBUFF_DOOM:
        // This might hurt a little.
        if(Game.player_debuffTimer === 0) {
          if(Game.RNG(1,50) <= Game.p_Debuff[3]) {
            Game.combatLog("enemy"," - <span class='q222'>" + Game.p_Debuff[1] + "</span> explodes, instantly killing you.");
            Game.p_HP = 0;
            Game.TRACK_DOOM_IN++;
          }
          else {
            var doomDMG = Math.floor(Game.RNG(Game.e_Weapon[4],Game.e_Weapon[5]) * Game.e_Weapon[9][3] / 2);
            Game.combatLog("enemy"," - <span class='q222'>" + Game.p_Debuff[1] + "</span> explodes, dealing <span class='q222'>" + doomDMG + "</span> damage.")
            Game.p_HP = Math.max(Game.p_HP - doomDMG, 0);
          }
        }
        break;
    }
    if(Game.p_HP <= 0) { Game.endCombat(); }
  }
  Game.updateCombatTab();
}
Game.enemyDebuffTicker = function() {
  if(Game.enemy_debuffTimer <= 0) {
    Game.combatLog("player"," - The effect of <span class='q222'>" + Game.e_Debuff[1] + "</span> faded.");
    if(Game.getEnemyDebuff()[0] == Game.DEBUFF_SLEEP) {
      // Oh crap it's coming for us!
      Game.combatLog("enemy", (Game.e_ProperName ? "" : "The ") + Game.e_Name + " wakes up!")
      Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick,1000*Game.e_Weapon[3]);
    }
    Game.e_Debuff = [];
    window.clearInterval(Game.enemy_debuffInterval);
  } else {
    Game.enemy_debuffTimer -= 1;
    switch(Game.e_Debuff[0]) {
      case Game.DEBUFF_DOT:
        // Do the deeps
        var dotDMG = Math.floor(Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]) * Game.e_Debuff[3] / 100);
        Game.e_HP = Math.max(Game.e_HP - dotDMG, 0);
        Game.TRACK_DOTS_OUT += dotDMG;
        Game.combatLog("player"," - <span class='q222'>" + Game.e_Debuff[1] + "</span> dealt an additional <span class='q222'>" + dotDMG + "</span> damage.");
        break;
      case Game.DEBUFF_DRAIN:
        // HEALZ YO
        var selfHeal = Math.floor(Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]) * Game.e_Debuff[3] / 100);
        Game.p_HP = Math.min(Game.p_HP + selfHeal, Game.p_MaxHP);
        Game.TRACK_DRAIN_IN += selfHeal;
        Game.combatLog("player"," - <span class='q222'>" + Game.e_Debuff[1] + "</span> healed you for <span class='q222'>" + selfHeal + "</span>.");
        break;
      case Game.DEBUFF_DOOM:
        // This might hurt a little.
        if(Game.enemy_debuffTimer === 0) {
          if(Game.RNG(1,100) <= Game.e_Debuff[3]) {
            Game.combatLog("player"," - <span class='q222'>" + Game.e_Debuff[1] + "</span> explodes, instantly killing the target.");
            Game.e_HP = 0;
            Game.TRACK_DOOM_OUT++;
          }
          else {
            var doomDMG = Math.floor(Game.RNG(Game.p_Weapon[4],Game.p_Weapon[5]) * Game.p_Weapon[9][3] / 2);
            Game.combatLog("player"," - <span class='q222'>" + Game.e_Debuff[1] + "</span> explodes, dealing <span class='q222'>" + doomDMG + "</span> damage.")
            Game.e_HP = Math.max(Game.e_HP - doomDMG, 0)
          }
        }
        break;
    }
    if(Game.e_HP <= 0) { Game.endCombat(); }
  }
  Game.updateCombatTab();
}
document.getElementById("loadedCombat").style.display = "";