/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";
/*--------------------------
combat.js

Functions relating to combat
and damage calculation.
--------------------------*/

Game.startCombat = function (isManual, isBoss) {
  if (Game.p_State === Game.STATE_IDLE) {
    if (Game.p_repairInterval) {
      window.clearInterval(Game.p_repairInterval);
      Game.p_repairInterval = null;
      Game.toastNotification("维修打断，进入战斗...");
    }
    Game.p_Adrenaline = Game.powerLevel(Game.SKILL_POWER_SURGE); // Only way to enter combat with an Adrenaline Rush is via Power Surge.
    if (Game.powerLevel(Game.SKILL_POWER_SURGE) > 0) {
      Game.combatLog("player", "<span class='q222'>电涌</span> 激活，给予肾上腺素激增的效果 " + Game.powerLevel(Game.SKILL_POWER_SURGE) + " 攻击!");
    }
    if (isBoss) {
      Game.makeBoss();
      Game.TRIGGER_FLAWLESS_BOSS = true;
      Game.canLoot = false; // We can't take boss items.
    } else {
      if (Game.p_Level >= 5 && Game.RNG(1, 100) <= Game.bossChance) {
        // I'm going to be an elite!
        Game.makeElite(Game.p_Level);
        Game.bossChance = 0;
        Game.TRIGGER_FLAWLESS = true;
        Game.canLoot = true;
      } else {
        // Aww...
        Game.makeEnemy(Game.p_Level);
        Game.TRIGGER_FLAWLESS = true;
        Game.canLoot = true;
      }
    }
    Game.p_State = Game.STATE_COMBAT;
    if (Game.p_HP / Game.p_MaxHP <= 0.25) {
      Game.TRIGGER_SURVIVALIST = true;
    } else {
      Game.TRIGGER_SURVIVALIST = false;
    }
    Game.VAMPIRISM_START_HEALTH = Game.p_HP;
    Game.PROGRESS_LONGFIGHT = 0;
    if (Game.RNG(1, 10) <= 5 + Game.powerLevel(Game.SKILL_SNEAK_ATTACK)) {
      // Pick me pick me!
      Game.combat_playerInterval = window.setTimeout(function () {
        Game.playerCombatTick(false);
      }, 100);
      Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick, 1100);
    } else {
      // Aww...
      Game.combat_playerInterval = window.setTimeout(Game.enemyCombatTick, 100);
      Game.combat_enemyInterval = window.setTimeout(function () {
        Game.playerCombatTick(false);
      }, 1100);
    }
    if (isManual) {
      Game.PROGRESS_MANUAL_BATTLE += 1;
      Game.badgeCheck(Game.BADGE_MANUAL_BATTLE); // Broken Mouse Convention
    }
  }
  Game.giveBadge(Game.BADGE_FIRSTBLOOD); // Baby Steps
  var log = document.getElementById("logBody");
  clearElementContent(log);
  Game.drawActivePanel();
};

Game.playerCombatTick = function (isBurst) {
  var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0,
    critChance = 0, didCrit = false, playerDMG = 0, canDebuff = true, secondStrike = 0,
    debuffChance = 0, debuffApplied = false, timerLength = 0;
  // Are we in combat?
  if (Game.p_State === Game.STATE_COMBAT) {
    // Sleep check!
    if (Game.getPlayerDebuff()[0] !== Game.DEBUFF_SLEEP) {
      // Paralysis Check!
      if (Game.getPlayerDebuff()[0] === Game.DEBUFF_PARAHAX && Game.RNG(1, 100) <= Game.p_Debuff[3]) {
        // Paralysis happened.
        Game.combatLog("player", "<span class='q222'>" + Game.p_Debuff[1] + "</span> 阻止你进攻。");
        Game.TRACK_PARAHAX_IN += 1;
      } else {
        // Stage 0: Execute
        if (Game.e_HP / Game.e_MaxHP < 0.25) {
          if (Game.RNG(1, 20) <= Game.powerLevel(Game.SKILL_EXECUTE)) {
            Game.e_HP = 0;
            Game.combatLog("player", "<span class='q222'>处决</span> 激活了, 立即造成必杀一击。");
            if (Game.wildSwing) {
              Game.wildSwing = false;
              Game.combatLog("player", "<span class='q222'>剧烈波动</span> ended.");
            }
            Game.endCombat();
            return;
          }
        }
        // Stage 1: Base Damage.
        playerDMG = Game.RNG(Game.p_Weapon[4], Game.p_Weapon[5]);
        // Add in primary stat boost to weapon damage.
        switch (Game.p_Weapon[2]) {
        case Game.WEAPON_MAGIC:
          playerDMG += Game.p_Int * Game.WEAPON_BASE_MULT * Game.p_Weapon[3] / 3.0;
          break;
        case Game.WEAPON_RANGE:
          playerDMG += Game.p_Dex * Game.WEAPON_BASE_MULT * Game.p_Weapon[3] / 3.0;
          break;
        case Game.WEAPON_MELEE:
          playerDMG += Game.p_Str * Game.WEAPON_BASE_MULT * Game.p_Weapon[3] / 3.0;
          break;
        }
        // Stage 2: Percentile Boosts.
        // Deadly Force
        playerDMG *= (1 + 0.03 * Game.powerLevel(Game.SKILL_DEADLY_FORCE));
        // Keen Eye
        critChance = 300 * Game.powerLevel(Game.SKILL_KEEN_EYE);
        critChance += Math.floor(statValue(Game.p_Dex) * 100);
        didCrit = false;
        if (Game.RNG(1, 10000) <= critChance) {
          // Keener Eye
          playerDMG *= (1.5 + 0.1 * Game.powerLevel(Game.SKILL_KEENER_EYE));
          didCrit = true;
          if (Game.powerLevel(Game.SKILL_BLOODLUST) > 0 && Game.p_specUsed) {
            // Bloodlust activated, reset Burst Attack.
            if (Game.specResetInterval !== null) {
              window.clearInterval(Game.specResetInterval);
              Game.specResetInterval = null;
            }
            Game.p_specUsed = false;
            Game.combatLog("player", "<span class='q222'>嗜血</span> 刷新你的冷却时间 " + Game.powerLevel(Game.SKILL_WILD_SWINGS) > 0 ? "剧烈波动!" : "突发攻击!");
          }
        }
        if (Game.powerLevel(Game.SKILL_OVERCHARGE) > 0) {
          // Overcharge
          playerDMG *= 1.35;
        }
        if (Game.p_Adrenaline > 0) {
          // Adrenaline Rush
          playerDMG *= (1 + 0.05 * Game.powerLevel(Game.SKILL_ADRENALINE_RUSH));
          Game.p_Adrenaline -= 1;
          if (Game.p_Adrenaline === 0) {
            Game.combatLog("player", " <span class='q222'>肾上腺素激增</span> 结束了。");
          }
        } else {
          if (Game.powerLevel(Game.SKILL_ADRENALINE_RUSH) > 0 && didCrit) {
            // Activate Adrenaline Rush on crit.
            Game.p_Adrenaline = 3;
            Game.combatLog("player", " - 你感觉到 <span class='q222'>肾上腺素激增</span>!");
          }
        }
        // Stage 3: Percentile Reductions
        canDebuff = true;
        if (Game.p_Weapon[8] === 0) {
          // Broken weapon.
          canDebuff = false;
          playerDMG *= (0.25 + 0.1 * Game.powerLevel(Game.SKILL_HANGING_BY_A_THREAD));
        }
        if (Game.getPlayerDebuff()[0] === Game.DEBUFF_DISARM) {
          // Disarmed.
          canDebuff = false;
          playerDMG *= 0.5;
        }
        if (Game.wildSwing) {
          // Wind Swings only do half the intended damage.
          playerDMG *= 0.5;
        }
        if (Game.flurryActive) {
          // This is a flurry attack.
          playerDMG *= (0.5 + 0.05 * Game.powerLevel(Game.SKILL_EMPOWERED_FLURRY));
        }
        // Stage 4: Mind Control Resolution
        if (Game.getPlayerDebuff()[0] === Game.DEBUFF_MC) {
          playerDMG = Math.floor(playerDMG);
          Game.p_HP = Math.max(Game.p_HP - playerDMG, 0);
          Game.TRACK_CHARM_IN += 1;
          Game.combatLog("enemy", "<span class='q222'>" + Game.p_Debuff[1] + "</span> 让你攻击自己 <span class='q222'>" + playerDMG + "</span> 伤害。");
          if (Game.p_HP <= 0) {
            Game.giveBadge(Game.BADGE_SELF_KILL);
          } // Punching Mirrors
        } else {
          // Stage 5: Armour Effects
          switch (Game.p_Weapon[2]) {
          case Game.WEAPON_MAGIC:
            if (Game.getEnemyDebuff()[0] !== Game.DEBUFF_SHRED) {
              for (a = 0; a < Game.e_Armour[4].length; a += 1) {
                if (Game.e_Armour[4][a][0] === Game.ARMOUR_STR_MAGIC) {
                  if (isBurst && Game.powerLevel(Game.SKILL_UNDERMINE) > 0) {
                    playerDMG += Game.e_Armour[4][a][1];
                  } else if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_SHIELD_CRUSH)) {
                    Game.combatLog("player", "<span class='q222'>盾牌粉碎</span> 突破敌人的防御!");
                    Game.shieldCrushActive = true;
                    if (Game.powerLevel(Game.SKILL_HOLD_THE_LINE) > 0) {
                      Game.combatLog("player", "Preparing to <span class='q222'>坚持下去</span>!");
                    }
                    if (Game.powerLevel(Game.SKILL_STAND_YOUR_GROUND) > 0) {
                      Game.player_debuffTimer = 0;
                      Game.combatLog("player", "<span class='q222'>Stand Your Ground</span> cleansed your active debuff.");
                    }
                  } else {
                    playerDMG = Math.max(playerDMG - Game.e_Armour[4][a][1], 0);
                  }
                }
              }
            }
            for (b = 0; b < Game.e_Armour[5].length; b += 1) {
              if (Game.e_Armour[5][b][0] === Game.ARMOUR_VULN_MAGIC) {
                playerDMG += Game.e_Armour[5][b][1];
              }
            }
            break;
          case Game.WEAPON_RANGE:
            if (Game.getEnemyDebuff()[0] !== Game.DEBUFF_SHRED) {
              for (c = 0; c < Game.e_Armour[4].length; c += 1) {
                if (Game.e_Armour[4][c][0] === Game.ARMOUR_STR_RANGE) {
                  if (isBurst && Game.powerLevel(Game.SKILL_UNDERMINE) > 0) {
                    playerDMG += Game.e_Armour[4][c][1];
                  } else if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_SHIELD_CRUSH)) {
                    Game.combatLog("player", "<span class='q222'>Shield Crush</span> breached the enemy's defences!");
                    Game.shieldCrushActive = true;
                    if (Game.powerLevel(Game.SKILL_HOLD_THE_LINE) > 0) {
                      Game.combatLog("player", "Preparing to <span class='q222'>Hold The Line</span>!");
                    }
                    if (Game.powerLevel(Game.SKILL_STAND_YOUR_GROUND) > 0) {
                      Game.player_debuffTimer = 0;
                      Game.combatLog("player", "<span class='q222'>Stand Your Ground</span> cleansed your active debuff.");
                    }
                  } else {
                    playerDMG = Math.max(playerDMG - Game.e_Armour[4][c][1], 0);
                  }
                }
              }
            }
            for (d = 0; d < Game.e_Armour[5].length; d += 1) {
              if (Game.e_Armour[5][d][0] === Game.ARMOUR_VULN_RANGE) {
                playerDMG += Game.e_Armour[5][d][1];
              }
            }
            break;
          case Game.WEAPON_MELEE:
            if (Game.getEnemyDebuff()[0] !== Game.DEBUFF_SHRED) {
              for (e = 0; e < Game.e_Armour[4].length; e += 1) {
                if (Game.e_Armour[4][e][0] === Game.ARMOUR_STR_MELEE) {
                  if (isBurst && Game.powerLevel(Game.SKILL_UNDERMINE) > 0) {
                    playerDMG += Game.e_Armour[4][e][1];
                  } else if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_SHIELD_CRUSH)) {
                    Game.combatLog("player", "<span class='q222'>Shield Crush</span> breached the enemy's defences!");
                    Game.shieldCrushActive = true;
                    if (Game.powerLevel(Game.SKILL_HOLD_THE_LINE) > 0) {
                      Game.combatLog("player", "Preparing to <span class='q222'>Hold The Line</span>!");
                    }
                    if (Game.powerLevel(Game.SKILL_STAND_YOUR_GROUND) > 0) {
                      Game.player_debuffTimer = 0;
                      Game.combatLog("player", "<span class='q222'>Stand Your Ground</span> cleansed your active debuff.");
                    }
                  } else {
                    playerDMG = Math.max(playerDMG - Game.e_Armour[4][e][1], 0);
                  }
                }
              }
            }
            for (f = 0; f < Game.e_Armour[5].length; f += 1) {
              if (Game.e_Armour[5][f][0] === Game.ARMOUR_VULN_MELEE) {
                playerDMG += Game.e_Armour[5][f][1];
              }
            }
            break;
          }
          // Stage 7: Damage Application
          // Floor it, I don't like decimals.
          playerDMG = Math.floor(playerDMG);
          Game.e_HP = Math.max(Game.e_HP - playerDMG, 0);
          Game.TRACK_TOTAL_DMG += playerDMG;
          Game.TRACK_ATTACKS_OUT += 1;
          Game.TRACK_MAXHIT_OUT = Math.max(Game.TRACK_MAXHIT_OUT, playerDMG);
          Game.badgeCheck(Game.BADGE_JACKOFTRADES); // Jack of All Trades
          switch (Game.p_Weapon[2]) {
          case Game.WEAPON_MELEE:
            Game.TRACK_MELEE_DMG += playerDMG;
            break;
          case Game.WEAPON_RANGE:
            Game.TRACK_RANGE_DMG += playerDMG;
            break;
          case Game.WEAPON_MAGIC:
            Game.TRACK_MAGIC_DMG += playerDMG;
            break;
          }
          Game.updateCombatTab();
          if (Game.getPlayerDebuff()[0] === Game.DEBUFF_DISARM || Game.p_Weapon[8] === 0) {
            // Use the force, applied via the knuckles.
            Game.combatLog("player", "你攻击了 " + (Game.e_ProperName ? "" : " ") + Game.e_Name + " 用你的拳头造成了 <span class='q222'>" + playerDMG + "</span> 伤害" + (didCrit ? " (暴击)" : "."));
          } else {
            // Stick 'em with the pointy end.
            Game.combatLog("player", "你攻击了 " + (Game.e_ProperName ? "" : " ") + Game.e_Name + " 使用 <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span> 造成了 <span class='q222'>" + playerDMG + "</span> 伤害" + (didCrit ? " (暴击)" : "."));
            if (Game.RNG(1, 100) <= (3 * Game.powerLevel(Game.SKILL_PROPER_CARE))) {
              // Proper Care
              Game.combatLog("player", " - <span class='q222'>适当的照顾</span> 阻止武器耐久降低。");
            } else {
              // Durability loss
              Game.p_Weapon[8] -= 1;
              if (Game.powerLevel(Game.SKILL_OVERCHARGE) > 0) {
                // Extra point of durability loss from Overcharge
                Game.p_Weapon[8] -= 1;
              }
              if (Game.p_Weapon[8] <= 0) {
                Game.p_Weapon[8] = 0;
                Game.TRACK_BROKEN_ITEMS += 1;
                Game.combatLog("player", " - 你的 <span class='q" + Game.p_Weapon[7] + "'>" + Game.p_Weapon[0].split("|")[0] + "</span> 坏掉了!");
              }
            }
          }
          if (Game.getEnemyDebuff()[0] === Game.DEBUFF_MULTI) {
            // DOUBLE STRIKEU
            secondStrike = Math.floor(playerDMG * (Game.e_Debuff[3] / 100));
            Game.e_HP = Math.max(Game.e_HP - secondStrike, 0);
            Game.combatLog("player", " - <span class='q222'>" + Game.e_Debuff[1] + "</span> 允许你再次攻击，造成了 <span class='q222'>" + secondStrike + "</span> 伤害。");
          }
          if (Game.getEnemyDebuff()[0] === Game.DEBUFF_SLEEP) {
            // Waking the beast. Maybe.
            if (Game.RNG(1, 25) <= Game.e_Debuff[3]) {
              Game.enemy_debuffTimer = 0;
              Game.TRACK_SLEEPBREAK_OUT += 1;
            }
          }
        }
        // Stage 7: Debuff Application
        debuffChance = 10 + (2 * Game.powerLevel(Game.SKILL_EXPOSE_WEAKNESS));
        if (isBurst) {
          debuffChance += 20 * Game.powerLevel(Game.SKILL_TURN_THE_TABLES);
        }
        if (Game.e_Debuff.length > 0) {
          if (Game.getPlayerDebuff()[0] !== Game.DEBUFF_MC) {
            if (Game.powerLevel(Game.SKILL_TERMINAL_ILLNESS) === 0) {
              canDebuff = false;
            }
          }
        }
        if (Game.p_Weapon[9].length === 0) {
          canDebuff = false;
        }
        debuffApplied = false;
        if (canDebuff) {
          if (Game.RNG(1, 100) <= debuffChance) {
            debuffApplied = true;
            if (Game.getPlayerDebuff()[0] === Game.DEBUFF_MC) {
              Game.p_Debuff = Game.p_Weapon[9].slice();
              Game.combatLog("enemy", " - 你遭受了 <span class='q222'>" + Game.p_Weapon[9][1] + "</span>.");
              Game.TRACK_DEBUFFS_IN += 1;
              Game.giveBadge(Game.BADGE_SELF_DEBUFF); // Hoisted By My Own Petard
              Game.player_debuffTimer = Game.p_Weapon[9][2];
              window.clearInterval(Game.player_debuffInterval);
              Game.player_debuffInterval = window.setInterval(Game.playerDebuffTicker, 1000);
              if (Game.getPlayerDebuff()[0] === Game.DEBUFF_SLEEP) {
                window.clearInterval(Game.combat_playerInterval);
                Game.combatLog("player", "你陷入了沉睡中...");
              }
            } else {
              Game.e_Debuff = Game.p_Weapon[9].slice();
              Game.combatLog("player", " - " + (Game.e_ProperName ? "" : " ") + Game.e_Name + " 受到 <span class='q222'>" + Game.p_Weapon[9][1] + "</span>.");
              Game.TRACK_DEBUFFS_OUT += 1;
              Game.enemy_debuffTimer = Game.p_Weapon[9][2];
              window.clearInterval(Game.enemy_debuffInterval);
              Game.enemy_debuffInterval = window.setInterval(Game.enemyDebuffTicker, 1000);
              if (Game.getEnemyDebuff()[0] === Game.DEBUFF_SLEEP) {
                window.clearInterval(Game.combat_enemyInterval);
                Game.combatLog("enemy", (Game.e_ProperName ? "" : " ") + Game.e_Name + " 陷入了沉睡中...");
              }
            }
          }
        }
        // Clear the debuff timer so confusion doesn't persist between turns.
        if (Game.getPlayerDebuff()[0] === Game.DEBUFF_MC && !debuffApplied) {
          Game.player_debuffTimer = 0;
        }
        // Stage 8: Miscellaneous Effects
        if (Game.RNG(1, 100) <= Game.powerLevel(Game.SKILL_FIVE_FINGER_DISCOUNT)) {
          Game.p_Currency += Game.e_Level;
          Game.combatLog("player", "<span class='q222'>五指折扣</span> 允许你偷 " + Game.e_Level + " 种子。");
        }
      }
      if (Game.e_HP > 0 && Game.p_HP > 0) {
        if (!Game.flurryActive) {
          if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_FLURRY)) {
            Game.flurryActive = true;
            Game.combatLog("player", " - <span class='q222'>狂乱</span> 激活了1次额外攻击");
            Game.playerCombatTick(isBurst);
          }
        } else {
          Game.flurryActive = false;
        }
        window.clearTimeout(Game.combat_playerInterval);
        timerLength = 1000 * Game.p_Weapon[3] * (1 - (0.03 * Game.powerLevel(Game.SKILL_NIMBLE_FINGERS)));
        if (Game.getPlayerDebuff()[0] === Game.DEBUFF_SLOW) {
          timerLength *= (1 + (Game.p_Debuff[3] / 100));
        }
        if (Game.RNG(1, 10000) <= (100 * statValue(Game.p_Con))) {
          Game.p_HP = Math.min(Game.p_HP + Game.p_Con, Game.p_MaxHP);
          Game.combatLog("player", "你的体质恢复了 <span class='q222'>" + Game.p_Con + "</span> 生命值。");
        }
        Game.combat_playerInterval = window.setTimeout(function () {
          Game.playerCombatTick(false);
        }, timerLength);
      } else {
        if (Game.wildSwing) {
          Game.wildSwing = false;
          Game.combatLog("player", "<span class='q222'>剧烈波动</span> 结束了。");
        }
        if (isBurst) {
          Game.giveBadge(Game.BADGE_BURSTFINISH); // Coup de Grace
        }
        Game.endCombat();
      }
    }
  } else {
    // We're not fighting, stop calling intervals...
    window.clearInterval(Game.combat_playerInterval);
  }
  Game.updateCombatTab();
};

Game.enemyCombatTick = function () {
  var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0,
    enemyDMG = 0, canDebuff = false, didBlock = false, blockRate = 0, blockedDamage = 0, TDMG = 0,
    reflectDMG = 0, vengDMG = 0, secondDmg = 0, mult = 1;
  // Are we in combat?
  if (Game.p_State === Game.STATE_COMBAT) {
    // Paralysis check!
    if (Game.getEnemyDebuff()[0] === Game.DEBUFF_PARAHAX && Game.RNG(1, 100) <= Game.e_Debuff[3]) {
      // Paralysis happened.
      Game.combatLog("enemy", "<span class='q222'>" + Game.e_Debuff[1] + "</span> 防止 " + (Game.e_ProperName ? "" : " ") + Game.e_Name + " 从攻击中。");
      Game.TRACK_PARAHAX_OUT += 1;
    } else if (Game.RNG(1, 10000) <= Math.floor(50 * statValue(Game.p_Int))) {
      // Dodged a bullet
      Game.combatLog("player", "你躲开了攻击。");
      if (Game.p_specUsed && Game.powerLevel(Game.SKILL_ARTFUL_DODGER) > 0) {
        // Artful Dodger
        Game.combatLog("player", "<span class='q222'>狡猾</span> 刷新了你的 突发攻击!");
        window.clearTimeout(Game.specResetInterval);
        Game.specResetInterval = null;
        Game.p_specUsed = false;
      }
    } else {
      // Stage 1: Base Damage.
      enemyDMG = Game.RNG(Game.e_Weapon[4], Game.e_Weapon[5]);
      enemyDMG += Game.e_MainStat * Game.WEAPON_BASE_MULT * Game.e_Weapon[3] / 3.0;
      canDebuff = true;
      // Stage 2: Mind Control Resolution
      if (Game.getEnemyDebuff()[0] === Game.DEBUFF_MC) {
        enemyDMG = Math.floor(enemyDMG);
        Game.e_HP = Math.max(Game.e_HP - enemyDMG, 0);
        Game.TRACK_CHARM_OUT += 1;
        Game.combatLog("player", "<span class='q222'>" + Game.e_Debuff[1] + "</span> 原因 " + (Game.e_ProperName ? "" : " ") + Game.e_Name + " 攻击自己 <span class='q222'>" + enemyDMG + "</span> 伤害。");
        if (Game.e_HP <= 0) {
          Game.giveBadge(Game.BADGE_ENEMY_SELF_KILL);
        } // Assisted Suicide
      } else {
        // Stage 3: Percentile Reductions
        // Ancestral Fortitude
        enemyDMG *= (1 - 0.03 * Game.powerLevel(Game.SKILL_ANCESTRAL_FORTITUDE));
        // Last Bastion
        if (Game.p_HP / Game.p_MaxHP <= 0.3) {
          enemyDMG *= (1 - 0.1 * Game.powerLevel(Game.SKILL_LAST_BASTION));
        }
        // Disarmed
        if (Game.getEnemyDebuff()[0] === Game.DEBUFF_DISARM) {
          enemyDMG *= 0.5;
          canDebuff = false;
        }
        // Stage 4: Armour Effects.
        switch (Game.e_Weapon[2]) {
        case Game.WEAPON_MAGIC:
          if (Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
            for (a = 0; a < Game.p_Armour[4].length; a += 1) {
              if (Game.p_Armour[4][a][0] === Game.ARMOUR_STR_MAGIC) {
                enemyDMG = Math.max(enemyDMG - Math.ceil(Game.p_Armour[4][a][1] * (1 + (0.05 * Game.powerLevel(Game.SKILL_ARMOUR_MASTERY)))), 0);
              }
            }
          }
          for (b = 0; b < Game.p_Armour[5].length; b += 1) {
            if (Game.p_Armour[5][b][0] === Game.ARMOUR_VULN_MAGIC) {
              enemyDMG += Game.p_Armour[5][b][1];
            }
          }
          break;
        case Game.WEAPON_RANGE:
          if (Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
            for (c = 0; c < Game.p_Armour[4].length; c += 1) {
              if (Game.p_Armour[4][c][0] === Game.ARMOUR_STR_RANGE) {
                enemyDMG = Math.max(enemyDMG - Math.ceil(Game.p_Armour[4][c][1] * (1 + (0.05 * Game.powerLevel(Game.SKILL_ARMOUR_MASTERY)))), 0);
              }
            }
          }
          for (d = 0; d < Game.p_Armour[5].length; d += 1) {
            if (Game.p_Armour[5][d][0] === Game.ARMOUR_VULN_RANGE) {
              enemyDMG += Game.p_Armour[5][d][1];
            }
          }
          break;
        case Game.WEAPON_MELEE:
          if (Game.getPlayerDebuff()[0] !== Game.DEBUFF_SHRED && Game.p_Armour[3] > 0) {
            for (e = 0; e < Game.p_Armour[4].length; e += 1) {
              if (Game.p_Armour[4][e][0] === Game.ARMOUR_STR_MELEE) {
                enemyDMG = Math.max(enemyDMG - Math.ceil(Game.p_Armour[4][e][1] * (1 + (0.05 * Game.powerLevel(Game.SKILL_ARMOUR_MASTERY)))), 0);
              }
            }
          }
          for (f = 0; f < Game.p_Armour[5].length; f += 1) {
            if (Game.p_Armour[5][f][0] === Game.ARMOUR_VULN_MELEE) {
              enemyDMG += Game.p_Armour[5][f][1];
            }
          }
          break;
        }
        // Stage 4a: Block
        didBlock = false;
        blockRate = (100 * Game.powerLevel(Game.SKILL_SHIELD_WALL)) + Math.floor(statValue(Game.p_Str) * 100);
        if (Game.RNG(1, 10000) <= blockRate || (Game.powerLevel(Game.SKILL_HOLD_THE_LINE) > 0 && Game.shieldCrushActive)) {
          didBlock = true;
          Game.shieldCrushActive = false;
        }
        // Stage 5: Damage Application
        enemyDMG = Math.floor(enemyDMG);
        if (enemyDMG > 0) {
          Game.TRIGGER_FLAWLESS = false;
          Game.TRIGGER_FLAWLESS_BOSS = false;
        }
        // Divine Shield anyone?
        if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_DIVINE_SHIELD)) {
          if (Game.p_HP <= enemyDMG) {
            Game.giveBadge(Game.BADGE_INTERVENTION);
          } // Divine Intervention
          if (Game.powerLevel(Game.SKILL_REFLECTIVE_SHIELD) === 1) {
            // No, YOU take the hit!
            Game.e_HP = Math.max(Game.e_HP - enemyDMG, 0);
            Game.combatLog("player", "Your <span class='q222'>Reflective Shield</span> dealt <span class='q222'>" + enemyDMG + "</span> damage.");
          } else if (Game.powerLevel(Game.SKILL_ABSORPTION_SHIELD) === 1) {
            // Free health is the best kind.
            Game.p_HP = Math.min(Game.p_HP + enemyDMG, Game.p_MaxHP);
            Game.combatLog("player", "Your <span class='q222'>Absorption Shield</span> healed you for  <span class='q222'>" + enemyDMG + "</span>.");
          } else {
            Game.combatLog("player", "Your <span class='q222'>Divine Shield</span> absorbed the damage.");
          }
        } else {
          // This may hurt a little.
          blockedDamage = 0;
          if (didBlock) {
            TDMG = enemyDMG;
            enemyDMG = Math.floor(enemyDMG * 3 / 4);
            blockedDamage = TDMG - enemyDMG;
          }
          Game.p_HP = Math.max(Game.p_HP - enemyDMG, 0);
          // Second Wind
          if (Game.p_HP === 0 && Game.powerLevel(Game.SKILL_SECOND_WIND) > 0 && Game.secondWindAvailable) {
            Game.secondWindAvailable = false;
            Game.p_HP = Math.floor(Game.p_MaxHP * (0.06 * Game.powerLevel(Game.SKILL_SECOND_WIND)));
            Game.combatLog("player", "<span class='q222'>Second Wind</span> saved you from certain death, restoring <span class='q222'>" + Game.p_HP + "</span> health!");
          }
          Game.TRACK_ATTACKS_IN += 1;
          Game.TRACK_TOTAL_TAKEN += enemyDMG;
          Game.TRACK_MAXHIT_IN = Math.max(Game.TRACK_MAXHIT_IN, enemyDMG);
          Game.PROGRESS_LONGFIGHT += 1;
          switch (Game.e_Weapon[2]) {
          case Game.WEAPON_MELEE:
            Game.TRACK_MELEE_TAKEN += enemyDMG;
            break;
          case Game.WEAPON_RANGE:
            Game.TRACK_RANGE_TAKEN += enemyDMG;
            break;
          case Game.WEAPON_MAGIC:
            Game.TRACK_MAGIC_TAKEN += enemyDMG;
            break;
          }
          if (Game.getEnemyDebuff()[0] === Game.DEBUFF_DISARM) {
            Game.combatLog("enemy", (Game.e_ProperName ? "" : " ") + Game.e_Name + " 第一次攻击了你，并对你造成了 <span class='q222'>" + enemyDMG + "</span> 伤害" + (didBlock ? " (<span class='q222'>" + blockedDamage + "</span> 已格挡)" : "") + ".");
          } else {
            Game.combatLog("enemy", (Game.e_ProperName ? "" : " ") + Game.e_Name + " 攻击了你，使用 <span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> 对你造成了 <span class='q222'>" + enemyDMG + "</span> 伤害" + (didBlock ? " (<span class='q222'>" + blockedDamage + "</span> 已格挡)" : "") + ".");
          }
          if (didBlock && Game.powerLevel(Game.SKILL_EYE_FOR_AN_EYE) > 0) {
            // Eye for an Eye activated, return damage.
            Game.e_HP = Math.max(Game.e_HP - blockedDamage, 0);
            Game.combatLog("player", "<span class='q222'>以眼还眼</span> 对攻击者造成 <span class='q222'>" + blockedDamage + "</span> 伤害");
          }
          if (didBlock && Game.RNG(1, 100) <= Game.powerLevel(Game.SKILL_RIPOSTE)) {
            // Riposte activated, disarm the opponent if we can.
            if (canDebuff) {
              Game.e_Debuff = Game.debuffs_generic[8].slice();
              Game.TRACK_DEBUFFS_OUT += 1;
              Game.enemy_debuffTimer = Game.debuffs_generic[8][2];
              window.clearInterval(Game.enemy_debuffInterval);
              Game.enemy_debuffInterval = window.setInterval(Game.enemyDebuffTicker, 1000);
              Game.combatLog("player", "<span class='q222'>还击</span> 已激活! " + (Game.e_ProperName ? "" : " ") + Game.e_Name + " 受到 <span class='q222'>" + Game.debuffs_generic[8][1] + "</span>.");
            }
          }
          // Bladed Armour
          reflectDMG = Math.floor(enemyDMG * (0.02 * Game.powerLevel(Game.SKILL_BLADED_ARMOUR)));
          if (reflectDMG > 0) {
            Game.e_HP = Math.max(Game.e_HP - reflectDMG, 0);
            Game.combatLog("player", "<span class='q222'>刃状装甲</span> 对攻击者造成了 <span class='q222'>" + reflectDMG + "</span> 伤害。");
          }
          if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_VENGEANCE)) {
            // You get what you give. Mostly.
            vengDMG = Math.floor(enemyDMG / 2);
            Game.e_HP = Math.max(Game.e_HP - vengDMG, 0);
            Game.combatLog("player", "Your <span class='q222'>复仇</span> 效果造成了 " + vengDMG + " 伤害。");
          }
          if (Game.getPlayerDebuff()[0] === Game.DEBUFF_MULTI) {
            secondDmg = Math.floor(enemyDMG * Game.p_Debuff[3] / 100);
            Game.p_HP = Math.max(Game.p_HP - secondDmg, 0);
            Game.combatLog("enemy", " - <span class='q222'>" + Game.p_Debuff[1] + "</span> 允许 " + (Game.e_ProperName ? "" : " ") + Game.e_Name + " 进行二次攻击，造成了 <span class='q222'>" + secondDmg + "</span> 伤害。");
          }
          if (Game.getPlayerDebuff()[0] === Game.DEBUFF_SLEEP) {
            // Waking the beast. Maybe.
            if (Game.RNG(1, 25) <= Game.p_Debuff[3]) {
              Game.player_debuffTimer = 0;
              Game.TRACK_SLEEPBREAK_IN += 1;
            }
          }
          if (Game.p_Armour[3] > 0) {
            if (Game.RNG(1, 100) <= (3 * Game.powerLevel(Game.SKILL_PROPER_CARE))) {
              // My gear is INVINCIBLE!
              Game.combatLog("player", " - <span class='q222'>Proper Care</span> prevented armour decay.");
            } else {
              Game.p_Armour[3] -= 1;
              if (Game.p_Armour[3] <= 0) {
                Game.p_Armour[3] = 0;
                Game.combatLog("player", " - Your <span class='q" + Game.p_Armour[2] + "'>" + Game.p_Armour[0].split("|")[0] + "</span> has broken!");
                Game.TRACK_BROKEN_ITEMS += 1;
              }
            }
          }
        }
      }
      Game.updateCombatTab();
      // Stage 6: Debuff Application
      if (Game.e_Weapon[9].length === 0) {
        canDebuff = false;
      }
      if (Game.p_Debuff.length > 0) {
        if (Game.getEnemyDebuff()[0] !== Game.DEBUFF_MC) {
          canDebuff = false;
        }
      }
      if (canDebuff) {
        if (Game.RNG(1, 10) === 1) {
          if (Game.getEnemyDebuff()[0] === Game.DEBUFF_MC) {
            Game.e_Debuff = Game.e_Weapon[9].slice();
            Game.combatLog("player", " - " + (Game.e_ProperName ? "" : " ") + Game.e_Name + " 遭受了 <span class='q222'>" + Game.e_Weapon[9][1] + "</span>.");
            Game.TRACK_DEBUFFS_OUT += 1;
            Game.giveBadge(Game.BADGE_ENEMY_SELF_DEBUFF); // Tarred With Their Own Brush
            Game.enemy_debuffTimer = Game.e_Weapon[9][2];
            window.clearInterval(Game.enemy_debuffInterval);
            Game.enemy_debuffInterval = window.setInterval(Game.enemyDebuffTicker, 1000);
            if (Game.getEnemyDebuff()[0] === Game.DEBUFF_SLEEP) {
              window.clearInterval(Game.combat_enemyInterval);
              Game.combatLog("player", (Game.e_ProperName ? "" : " ") + Game.e_Name + " 陷入了沉睡...");
            }
          } else {
            Game.p_Debuff = Game.e_Weapon[9].slice();
            Game.combatLog("enemy", " - 你遭受了 <span class='q222'>" + Game.e_Weapon[9][1] + "</span>.");
            Game.TRACK_DEBUFFS_IN += 1;
            Game.player_debuffTimer = Game.e_Weapon[9][2];
            window.clearInterval(Game.player_debuffInterval);
            Game.player_debuffInterval = window.setInterval(Game.playerDebuffTicker, 1000);
            if (Game.getPlayerDebuff()[0] === Game.DEBUFF_SLEEP) {
              window.clearInterval(Game.combat_playerInterval);
              Game.combatLog("player", "你陷入了沉睡...");
            }
          }
        }
      }
      if (Game.getEnemyDebuff()[0] === Game.DEBUFF_MC) {
        Game.enemy_debuffTimer = 0;
      }
    }
    if (Game.e_HP > 0 && Game.p_HP > 0) {
      mult = 1;
      if (Game.getEnemyDebuff()[0] === Game.DEBUFF_SLOW) {
        // Increases delay on next attack
        mult += (Game.e_Debuff[3] / 100);
      }
      Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick, 1000 * Game.e_Weapon[3] * mult);
    } else {
      Game.endCombat();
    }
  } else {
    window.clearInterval(Game.combat_enemyInterval);
  }
  Game.updateCombatTab();
};

Game.burstAttack = function () {
  var x = 0;
  if (Game.p_State === Game.STATE_COMBAT) {
    if (Game.p_specUsed) {
      return;
    }
    if (Game.e_HP > 0) {
      if (Game.getPlayerDebuff()[0] === Game.DEBUFF_SLEEP) {
        Game.toastNotification("昏睡时不能使用突发攻击。");
      } else {
        Game.p_specUsed = true;
        Game.TRACK_BURSTS += 1;
        Game.badgeCheck(Game.BADGE_BURSTSPAM); // Manual Labour
        if (Game.powerLevel(Game.SKILL_WILD_SWINGS) > 0) {
          if (!arraysEqual(Game.e_Debuff, [])) {
            Game.specResetInterval = window.setTimeout(function () {
              Game.p_specUsed = false;
            }, 10000 - (1000 * Game.powerLevel(Game.SKILL_PRESS_THE_ADVANTAGE)));
          } else {
            Game.specResetInterval = window.setTimeout(function () {
              Game.p_specUsed = false;
            }, 10000);
          }
          Game.combatLog("player", "<span class='q222'>剧烈波动</span> activated.");
          Game.wildSwing = true;
          for (x = Game.powerLevel(Game.SKILL_WILD_SWINGS); x >= 0; x -= 1) {
            Game.playerCombatTick(true);
          }
          if (Game.wildSwing) {
            Game.combatLog("player", "<span class='q222'>剧烈波动</span> 结束了.");
            Game.wildSwing = false;
          }
        } else {
          Game.combatLog("player", "<span class='q222'>突发攻击</span> 已激活。");
          Game.playerCombatTick(true);
        }
        Game.updateCombatTab();
      }
    }
  }
};

Game.fleeCombat = function () {
  if (Game.getPlayerDebuff()[0] !== Game.DEBUFF_SLEEP) {
    // Lots of cleanup of timers and temporary values.
    window.clearTimeout(Game.combat_playerInterval);
    window.clearTimeout(Game.combat_enemyInterval);
    if (Game.enemy_debuffInterval !== null) {
      window.clearInterval(Game.enemy_debuffInterval);
      Game.enemy_debuffInterval = null;
      Game.enemy_debuffTimer = 0;
    }
    if (Game.player_debuffInterval !== null) {
      window.clearInterval(Game.player_debuffInterval);
      Game.player_debuffInterval = null;
      Game.player_debuffTimer = 0;
    }
    Game.p_Debuff = [];
    Game.e_Debuff = [];
    Game.p_Adrenaline = 0;
    if (Game.p_Level >= 5) {
      Game.bossChance += 1;
    } // Not even running will save you from eventual boss encounters.
    Game.p_State = Game.STATE_IDLE;
    Game.p_specUsed = false;
    Game.shieldCrushActive = false;
    Game.secondWindAvailable = true;
    if (Game.specResetInterval !== null) {
      window.clearInterval(Game.specResetInterval);
      Game.specResetInterval = null;
    }
    Game.combatLog("info", "你逃离了战斗。");
    Game.TRACK_ESCAPES += 1;
    Game.TRACK_WIN_STREAK = 0;
    Game.drawActivePanel();
  } else {
    Game.toastNotification("你不能在睡觉的时候逃避战斗。");
  }
};

Game.endCombat = function () {
  var xpToAdd = 0, bonusXP = 0, currencyToAdd = 0, badgeBonus = 0, currencyBadgeBonus = 0, lastmax = 0,
    restoredHealth = 0, xpDrop = 0;
  // Still lots of cleanup, but some other, more important things too!
  window.clearTimeout(Game.combat_playerInterval);
  window.clearTimeout(Game.combat_enemyInterval);
  if (Game.enemy_debuffInterval !== null) {
    window.clearInterval(Game.enemy_debuffInterval);
    Game.enemy_debuffInterval = null;
    Game.enemy_debuffTimer = 0;
  }
  if (Game.player_debuffInterval !== null) {
    window.clearInterval(Game.player_debuffInterval);
    Game.player_debuffInterval = null;
    Game.player_debuffTimer = 0;
  }
  // Wherefore art thou Romeo?
  if (Game.getPlayerDebuff()[0] === Game.DEBUFF_DOT && Game.getEnemyDebuff()[0] === Game.DEBUFF_SLEEP && Game.p_HP <= 0) {
    Game.giveBadge(Game.BADGE_ROMEO); // WHerefore Art Thou, Romeo?
  }
  Game.p_Debuff = [];
  Game.e_Debuff = [];
  Game.p_State = Game.STATE_IDLE;
  Game.p_specUsed = false;
  if (Game.specResetInterval !== null) {
    window.clearInterval(Game.specResetInterval);
    Game.specResetInterval = null;
  }
  Game.shieldCrushActive = false;
  Game.secondWindAvailable = true;
  if (Game.p_HP > 0) {
    // Player won, give xp and maybe, just maybe, a level.
    Game.combatLog("info", "你获胜了!");
    if (Game.p_HP / Game.p_MaxHP <= 0.05) {
      Game.giveBadge(Game.BADGE_ALMOSTDEAD); // Living on a Prayer
    }
    if (Game.TRIGGER_SURVIVALIST) {
      Game.giveBadge(Game.BADGE_SURVIVALIST); // The Survivalist
    }
    if (Game.TRIGGER_FLAWLESS) {
      Game.giveBadge(Game.BADGE_FLAWLESS); // Flawless Victory
    }
    if (Game.TRIGGER_FLAWLESS_BOSS) {
      Game.giveBadge(Game.BADGE_FLAWLESS_BOSS); // MC Hammer Special
    }
    if (Game.PROGRESS_LONGFIGHT >= 25) {
      Game.giveBadge(Game.BADGE_LONGFIGHT); // War of Attrition
    }
    if (Game.e_isBoss) {
      Game.TRACK_BOSS_KILLS += 1;
    }
    if (Game.p_HP > Game.VAMPIRISM_START_HEALTH) {
      Game.giveBadge(Game.BADGE_VAMPIRISM);
    } // Vampirism
    // Steal their stuff, if you can.
    if (Game.canLoot) {
      if (Game.p_WeaponInventory.length < Game.MAX_INVENTORY) {
        Game.p_WeaponInventory.push(Game.e_Weapon.slice());
        Game.combatLog("info", "<span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> added to your inventory.");
      } else {
        Game.last_Weapon = Game.e_Weapon.slice();
        Game.combatLog("info", "<span class='q" + Game.e_Weapon[7] + "'>" + Game.e_Weapon[0].split("|")[0] + "</span> could not be taken due to full inventory.");
      }
      if (Game.p_ArmourInventory.length < Game.MAX_INVENTORY) {
        Game.p_ArmourInventory.push(Game.e_Armour.slice());
        Game.combatLog("info", "<span class='q" + Game.e_Armour[2] + "'>" + Game.e_Armour[0].split("|")[0] + "</span> added to your inventory.");
      } else {
        Game.last_Armour = Game.e_Armour.slice();
        Game.combatLog("info", "<span class='q" + Game.e_Armour[2] + "'>" + Game.e_Armour[0].split("|")[0] + "</span> could not be taken due to full inventory.");
      }
    }
    Game.updateInventory = true; // So we can see our new ill-gotten gains.
    // XP is not a static number. Honest.
    xpToAdd = Math.floor(Game.XP_BASE + (Game.RNG(Game.XP_RANGEMIN * Game.e_Level, Game.XP_RANGEMAX * Game.e_Level)));
    currencyToAdd = xpToAdd;
    // More XP? Only if you paid for it in points or boss blood.
    if (!Game.canLoot) {
      xpToAdd *= 2;
    } else if (Game.e_isBoss) {
      xpToAdd *= 1.5;
    }
    xpToAdd = Math.floor(xpToAdd * (1 + (0.05 * Game.powerLevel(Game.SKILL_FAST_LEARNER))));
    badgeBonus = Math.floor(xpToAdd * (0.02 * Game.playerBadges.length));
    Game.combatLog("info", "你获得了 <span class='q222'>" + xpToAdd + "</span> (<span class='q223'>+" + badgeBonus + "</span>) (<span class='q224'>+" + Game.prestigeLevel + "</span>) 经验。");
    // Overflow
    if (Game.powerLevel(Game.SKILL_RECLAIMED_KNOWLEDGE) > 0) {
      bonusXP = Math.floor(Math.min(Game.TRACK_XP_OVERFLOW, xpToAdd / 2));
      xpToAdd += bonusXP;
      Game.TRACK_XP_OVERFLOW -= bonusXP;
      Game.combatLog("info", "你获得了额外的 <span class='q222'>" + bonusXP + "</span> 从回收知识获得的经验。");
    }
    // More seeds? See above.
    if (!Game.canLoot) {
      currencyToAdd *= 2;
    } else if (Game.e_isBoss) {
      currencyToAdd *= 1.5;
    }
    currencyToAdd = Math.floor(currencyToAdd * (1 + (0.05 * Game.powerLevel(Game.SKILL_PICKPOCKET))));
    currencyBadgeBonus = Math.floor(currencyToAdd * (0.02 * Game.playerBadges.length));
    if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_CAVITY_SEARCH)) {
      // Everybody gets seeds!
      currencyToAdd *= 3;
      Game.combatLog("info", "<span class='q222'>空腔搜索</span> 三倍的种子收益!");
    }
    if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_THOROUGH_LOOTING)) {
      // Yes, you can have some scrap. It's okay.
      Game.p_Scrap += 1;
      Game.TRACK_COMBAT_SCRAP += 1;
      Game.combatLog("info", "<span class='q222'>彻底的抢劫</span> 产生了额外的一块碎片。!");
    }
    Game.combatLog("info", "你获得了 <span class='q222'>" + currencyToAdd + "</span> (<span class='q223'>+" + currencyBadgeBonus + "</span>) (<span class='q224'>+" + Game.prestigeLevel + "</span>) 种子。");
    if (!Game.canLoot) {
      // This was a boss kill - Set maxZone, award badge, drop notification
      lastmax = Game.p_maxZone;
      Game.p_maxZone = Math.max(Game.p_maxZone, Game.p_currentZone + 1);
      Game.giveBadge(Game.BADGE_ZONE1 + Game.p_currentZone);
      Game.combatLog("info", "<span class='q222'>" + Game.ZONE_NAMES[Game.p_currentZone] + " 已清理!</span>");
      if (Game.p_maxZone > lastmax) {
        Game.combatLog("info", "<span class='q222'>" + Game.ZONE_NAMES[Game.p_maxZone] + " 现在开启了!</span>");
      }
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
    if (Game.p_Weapon[8] === 0 && Game.p_Armour[3] === 0) {
      Game.giveBadge(Game.BADGE_NO_GEAR); // Where We're Going, We Don't Need Gear
    }
    if (Game.p_Weapon[8] === 0) {
      Game.giveBadge(Game.BADGE_NO_WEAPON); // Where We're Going, We Don't Need Weapons
    }
    if (Game.p_Armour[3] === 0) {
      Game.giveBadge(Game.BADGE_NO_ARMOUR); // Where We're Going, We Don't Need Armour
    }
    if (Game.p_EXP >= Game.p_NextEXP) {
      // DING
      Game.levelUp();
    }
    if (Game.RNG(1, 50) <= Game.powerLevel(Game.SKILL_HIGH_MAINTENANCE)) {
      // If this works, nobody will complain about repair timers.
      Game.p_Weapon[8] = 50 + (5 * (Game.p_Weapon[1] - 1));
      Game.p_Armour[3] = 50 + (5 * (Game.p_Armour[1] - 1));
      Game.combatLog("info", "<span class='q222'>高维护</span> 完全修理你的装备。");
    }
    if (Game.powerLevel(Game.SKILL_VICTORY_RUSH) > 0) {
      // Cutting out the downtime.
      restoredHealth = Math.floor((Game.powerLevel(Game.SKILL_VICTORY_RUSH) * 0.05) * Game.p_MaxHP);
      Game.p_HP = Math.min(Game.p_MaxHP, Game.p_HP + restoredHealth);
      Game.combatLog("info", "<span class='q222'>胜利冲刺</span> 恢复了你 <span class='q222'>" + restoredHealth + "</span> 血量。");
    }
    Game.TRACK_WINS += 1;
    Game.badgeCheck(Game.BADGE_KILLCOUNT); // Skullcrusher Mountain
    Game.TRACK_WIN_STREAK += 1;
  } else {
    // Enemy won, dock XP
    Game.combatLog("info", "你失败了...");
    xpDrop = Math.floor(Game.p_EXP / 4);
    Game.combatLog("info", "你因为失败，掉落了 <span class='q222'>" + xpDrop + "</span> 经验值...");
    Game.p_EXP -= xpDrop;
    Game.TRACK_XP_LOST += xpDrop;
    Game.TRACK_LOSSES += 0;
    Game.TRACK_WIN_STREAK = 0;
  }
  if (Game.p_Level >= 5) {
    Game.bossChance += 1;
    Game.TRACK_BOSS_CHANCE = Math.max(Game.bossChance, Game.TRACK_BOSS_CHANCE);
  } // Even if you win, you still get a boss. It's inevitable.
  if (Game.TRACK_BOSS_CHANCE >= 20) {
    Game.giveBadge(Game.BADGE_BOSSCHANCE); // Chasing Shadows
  }
  Game.p_autoSaved = false;
  Game.drawActivePanel();
};

Game.getPlayerDebuff = function () {
  if (Game.p_Debuff.length > 0) {
    return Game.p_Debuff;
  } else { return [0, "", 0, 0]; }
};

Game.getEnemyDebuff = function () {
  if (Game.e_Debuff.length > 0) {
    return Game.e_Debuff;
  } else { return [0, "", 0, 0]; }
};

Game.playerDebuffTicker = function () {
  var timerLength = 0, dotDMG = 0, selfHeal = 0, doomDMG = 0;
  if (Game.player_debuffTimer <= 0) {
    Game.combatLog("enemy", " - <span class='q222'>" + Game.p_Debuff[1] + "</span> 效果消失了。");
    if (Game.getPlayerDebuff()[0] === Game.DEBUFF_SLEEP) {
      // Rise and shine buttercup!
      Game.combatLog("player", "你醒来了!");
      timerLength = 1000 * Game.p_Weapon[3] * (1 - (0.03 * Game.powerLevel(Game.SKILL_NIMBLE_FINGERS)));
      Game.combat_playerInterval = window.setTimeout(function () {
        Game.playerCombatTick(false);
      }, timerLength);
    }
    Game.p_Debuff = [];
    window.clearInterval(Game.player_debuffInterval);
  } else {
    Game.player_debuffTimer -= 1;
    switch (Game.p_Debuff[0]) {
    case Game.DEBUFF_DOT:
      // Do the deeps
      dotDMG = Math.floor(Game.RNG(Game.e_Weapon[4], Game.e_Weapon[5]) * Game.p_Debuff[3] / 100);
      Game.p_HP = Math.max(Game.p_HP - dotDMG, 0);
      Game.TRACK_DOTS_IN += dotDMG;
      Game.combatLog("enemy", " - <span class='q222'>" + Game.p_Debuff[1] + "</span> 造成额外的 <span class='q222'>" + dotDMG + "</span> 伤害。");
      break;
    case Game.DEBUFF_DRAIN:
      // HEALZ YO
      selfHeal = Math.floor(Game.RNG(Game.e_Weapon[4], Game.e_Weapon[5]) * Game.p_Debuff[3] / 100);
      Game.e_HP = Math.min(Game.e_HP + selfHeal, Game.e_MaxHP);
      Game.TRACK_DRAIN_OUT += selfHeal;
      Game.combatLog("enemy", " - <span class='q222'>" + Game.p_Debuff[1] + "</span> 治愈了敌人 <span class='q222'>" + selfHeal + "</span>.");
      break;
    case Game.DEBUFF_DOOM:
      // This might hurt a little.
      if (Game.player_debuffTimer === 0) {
        if (Game.RNG(1, 50) <= Game.p_Debuff[3]) {
          Game.combatLog("enemy", " - <span class='q222'>" + Game.p_Debuff[1] + "</span> explodes, instantly killing you.");
          Game.p_HP = 0;
          Game.TRACK_DOOM_IN += 1;
        } else {
          doomDMG = Math.floor(Game.RNG(Game.e_Weapon[4], Game.e_Weapon[5]) * Game.e_Weapon[9][3] / 2);
          Game.combatLog("enemy", " - <span class='q222'>" + Game.p_Debuff[1] + "</span> explodes, dealing <span class='q222'>" + doomDMG + "</span> damage.");
          Game.p_HP = Math.max(Game.p_HP - doomDMG, 0);
        }
      }
      break;
    }
    if (Game.p_HP <= 0) {
      Game.endCombat();
    }
  }
  Game.updateCombatTab();
};

Game.enemyDebuffTicker = function () {
  var dotDMG = 0, selfHeal = 0, doomDMG = 0;
  if (Game.enemy_debuffTimer <= 0) {
    Game.combatLog("player", " -  <span class='q222'>" + Game.e_Debuff[1] + "</span> 效果消退了。");
    if (Game.getEnemyDebuff()[0] === Game.DEBUFF_SLEEP) {
      // Oh crap it's coming for us!
      Game.combatLog("enemy", (Game.e_ProperName ? "" : " ") + Game.e_Name + " 醒来了!");
      Game.combat_enemyInterval = window.setTimeout(Game.enemyCombatTick, 1000 * Game.e_Weapon[3]);
    }
    Game.e_Debuff = [];
    window.clearInterval(Game.enemy_debuffInterval);
  } else {
    Game.enemy_debuffTimer -= 1;
    switch (Game.e_Debuff[0]) {
    case Game.DEBUFF_DOT:
      // Do the deeps
      dotDMG = Math.floor(Game.RNG(Game.p_Weapon[4], Game.p_Weapon[5]) * Game.e_Debuff[3] / 100);
      Game.e_HP = Math.max(Game.e_HP - dotDMG, 0);
      Game.TRACK_DOTS_OUT += dotDMG;
      Game.combatLog("player", " - <span class='q222'>" + Game.e_Debuff[1] + "</span> 额外造成 <span class='q222'>" + dotDMG + "</span> 伤害。");
      break;
    case Game.DEBUFF_DRAIN:
      // HEALZ YO
      selfHeal = Math.floor(Game.RNG(Game.p_Weapon[4], Game.p_Weapon[5]) * Game.e_Debuff[3] / 100);
      Game.p_HP = Math.min(Game.p_HP + selfHeal, Game.p_MaxHP);
      Game.TRACK_DRAIN_IN += selfHeal;
      Game.combatLog("player", " - <span class='q222'>" + Game.e_Debuff[1] + "</span> 医治了你 <span class='q222'>" + selfHeal + "</span>.");
      break;
    case Game.DEBUFF_DOOM:
      // This might hurt a little.
      if (Game.enemy_debuffTimer === 0) {
        if (Game.RNG(1, 100) <= Game.e_Debuff[3]) {
          Game.combatLog("player", " - <span class='q222'>" + Game.e_Debuff[1] + "</span> 爆炸，瞬间杀死目标。");
          Game.e_HP = 0;
          Game.TRACK_DOOM_OUT += 1;
        } else {
          doomDMG = Math.floor(Game.RNG(Game.p_Weapon[4], Game.p_Weapon[5]) * Game.p_Weapon[9][3] / 2);
          Game.combatLog("player", " - <span class='q222'>" + Game.e_Debuff[1] + "</span> 爆炸，造成了 <span class='q222'>" + doomDMG + "</span> 伤害。");
          Game.e_HP = Math.max(Game.e_HP - doomDMG, 0);
        }
      }
      break;
    }
    if (Game.e_HP <= 0) {
      Game.endCombat();
    }
  }
  Game.updateCombatTab();
};

document.getElementById("loadedCombat").style.display = "";
