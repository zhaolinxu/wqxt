Game.buyPower = function(power) {
  if(Game.p_PP > 0) {
    var selectionLevel = Game.powerLevel(power);
    var canUpgrade = true;
    switch(power) {
      case Game.BOOST_ABSORB:
      case Game.BOOST_REFLECT:
      case Game.BOOST_MORESCRAP:
      case Game.BOOST_BONUSDMG:
      case Game.BOOST_NOWEAKNESS:
      case Game.BOOST_OVERFLOW:
      case Game.BOOST_HEALINGPOTION:
      case Game.BOOST_DEBUFFPOTION:
        if(selectionLevel === 1) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
        break;
      case Game.BOOST_SPEED:
      case Game.BOOST_REGEN:
      case Game.BOOST_XP:
      case Game.BOOST_SHIELD:
      case Game.BOOST_CARE:
      case Game.BOOST_CURRENCY:
      case Game.BOOST_MORESP:
      case Game.BOOST_DOUBLE:
      case Game.BOOST_DAMAGE:
      case Game.BOOST_DEFENCE:
      case Game.BOOST_DEBUFF:
      case Game.BOOST_PRICES:
      case Game.BOOST_MULTIPOTION:
        if(selectionLevel === 10) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
        break;
      case Game.BOOST_DEBUFFBURST: {
        if(selectionLevel === 4) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
      }
      default:
        if(selectionLevel === 5) {
          Game.toastNotification("This power is at maximum level.");
          canUpgrade = false;
        }
    }
    if(canUpgrade) {
      switch(power) {
        case Game.BOOST_BROKEN:
          // Hanging by a Thread
          if(Game.powerLevel(Game.BOOST_CARE) < 10) {
            Game.toastNotification("You need maximum level in Proper Care to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_REPAIR) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with High Maintenance.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_REPAIRPOWER) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Master Tinkerer.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_REPAIR:
          // High Maintenance
          if(Game.powerLevel(Game.BOOST_CARE) < 10) {
            Game.toastNotification("You need maximum level in Proper Care to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_BROKEN) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Hanging By A Thread.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_REPAIRPOWER) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Master Tinkerer.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_REPAIRPOWER:
          // High Maintenance
          if(Game.powerLevel(Game.BOOST_CARE) < 10) {
            Game.toastNotification("You need maximum level in Proper Care to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_BROKEN) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Hanging By A Thread.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_REPAIR) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with High Maintenance.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_EXTRA:
          // Cavity Search
          if(Game.powerLevel(Game.BOOST_CURRENCY) < 10) {
            Game.toastNotification("You need maximum level in Pickpocket to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_SCRAP) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Thorough Looting.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_SCRAP:
          // Thorough Looting
          if(Game.powerLevel(Game.BOOST_CURRENCY) < 10) {
            Game.toastNotification("You need maximum level in Pickpocket to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_EXTRA) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Cavity Search.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_CRITDMG:
          // Keener Eye
          if(Game.powerLevel(Game.BOOST_CRIT) < 5) {
            Game.toastNotification("You need maximum level in Keen Eye to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_ENRAGE) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Adrenaline Rush.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_ENRAGE:
          // Adrenaline Rush
          if(Game.powerLevel(Game.BOOST_CRIT) < 5) {
            Game.toastNotification("You need maximum level in Keen Eye to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_CRITDMG) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Keener Eye.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_ABSORB:
          // Absorption Shield
          if(Game.powerLevel(Game.BOOST_SHIELD) < 5) {
            Game.toastNotification("You need maximum level in Divine Shield to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_REFLECT) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Reflective Shield.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_REFLECT:
          // Reflective Shield
          if(Game.powerLevel(Game.BOOST_SHIELD) < 5) {
            Game.toastNotification("You need maximum level in Divine Shield to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_ABSORB) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Absorption Shield.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_MOREPP:
          // Lucky Star
          if(Game.powerLevel(Game.BOOST_MORESP) < 10) {
            Game.toastNotification("You need maximum level in Luck of the Draw to upgrade this power.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_STATUP:
          // Patience and Discipline
          if(Game.powerLevel(Game.BOOST_XP) < 10) {
            Game.toastNotification("You need maximum level in Fast Learner to upgrade this power.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_DBLPOWER:
          // Empowered Flurry
          if(Game.powerLevel(Game.BOOST_DOUBLE) < 10) {
            Game.toastNotification("You need maximum level in Flurry to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_BURST) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Wild Swings.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_FULLHEAL:
          // Will To Live
          if(Game.powerLevel(Game.BOOST_REGEN) < 10) {
            Game.toastNotification("You need maximum level in Survival Instincts to upgrade this power.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_BURST:
          // Wild Swings
          if(Game.powerLevel(Game.BOOST_DOUBLE) < 10) {
            Game.toastNotification("You need maximum level in Flurry to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_DBLPOWER) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Empowered Flurry.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_EXECUTE:
          // Execute
          if(Game.powerLevel(Game.BOOST_DAMAGE) < 10) {
            Game.toastNotification("You need maximum level in Deadly Force to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_BONUSDMG) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Overcharge.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_BONUSDMG:
          // Overcharge
          if(Game.powerLevel(Game.BOOST_DAMAGE) < 10) {
            Game.toastNotification("You need maximum level in Deadly Force to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_EXECUTE) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Execute.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_LASTSTAND:
          // Last Bastion
          if(Game.powerLevel(Game.BOOST_DEFENCE) < 10) {
            Game.toastNotification("You need maximum level in Ancestral Fortitude to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_VENGEANCE) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Vengeance.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_VENGEANCE:
          // Vengeance
          if(Game.powerLevel(Game.BOOST_DEFENCE) < 10) {
            Game.toastNotification("You need maximum level in Ancestral Fortitude to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_LASTSTAND) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Last Bastion.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_FIRST:
          // Sneak Attack
          if(Game.powerLevel(Game.BOOST_SPEED) < 10) {
            Game.toastNotification("You need maximum level in Nimble Fingers to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_PICKPOCKET) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Five-Finger Discount.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_PICKPOCKET:
          // Five-Finger Discount
          if(Game.powerLevel(Game.BOOST_SPEED) < 10) {
            Game.toastNotification("You need maximum level in Nimble Fingers to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_FIRST) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Sneak Attack.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_FASTBURST:
          // Press The Advantage
          if(Game.powerLevel(Game.BOOST_DEBUFF) < 10) {
            Game.toastNotification("You need maximum level in Expose Weakness to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_DEBUFFBURST) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Turn The Tables.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_NOWEAKNESS) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Intuition");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_DEBUFFBURST:
          // Turn The Tables
          if(Game.powerLevel(Game.BOOST_DEBUFF) < 10) {
            Game.toastNotification("You need maximum level in Expose Weakness to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_FASTBURST) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Press The Advantage.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_NOWEAKNESS) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Intuition");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_NOWEAKNESS:
          // Intuition
          if(Game.powerLevel(Game.BOOST_DEBUFF) < 10) {
            Game.toastNotification("You need maximum level in Expose Weakness to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_DEBUFFBURST) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Turn The Tables.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_FASTBURST) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Press The Advantage.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_SELL:
          // Haggling
          if(Game.powerLevel(Game.BOOST_PRICES) < 10) {
            Game.toastNotification("You need maximum level in Bartering to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_MORESCRAP) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Disassembly.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_MORESCRAP:
          // Disassembly
          if(Game.powerLevel(Game.BOOST_PRICES) < 10) {
            Game.toastNotification("You need maximum level in Bartering to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_SELL) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Haggling.");
            canUpgrade = false;
          }
          break;
        case Game.BOOST_HEALINGPOTION:
          // Medic's Intuition
          if(Game.powerLevel(Game.BOOST_MULTIPOTION) < 10) {
            Game.toastNotification("You need maximum level in Brewmaster to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_DEBUFFPOTION) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Saboteur's Intuition.");
            canUpgrade = false;
          }
        case Game.BOOST_DEBUFFPOTION:
          // Saboteur's Intuition
          if(Game.powerLevel(Game.BOOST_MULTIPOTION) < 10) {
            Game.toastNotification("You need maximum level in Brewmaster to upgrade this power.");
            canUpgrade = false;
          } else if(Game.powerLevel(Game.BOOST_HEALINGPOTION) > 0) {
            Game.toastNotification("This power cannot be used in conjunction with Medic's Intuition.");
            canUpgrade = false;
          }
      }
    }
    if(canUpgrade) {
      if(selectionLevel === 0) {
        Game.p_Powers.push(new Array(power, 1));
        var singlePointers = [Game.BOOST_ABSORB, Game.BOOST_REFLECT, Game.BOOST_MORESCRAP, Game.BOOST_BONUSDMG, Game.BOOST_NOWEAKNESS, Game.BOOST_HEALINGPOTION, Game.BOOST_DEBUFFPOTION];
        if(singlePointers.indexOf(power) >= 0) {
          switch(power) {
            case Game.BOOST_ABSORB: Game.giveBadge(Game.BADGE_POWER_ABSORB); break; // Glutton for Punishment
            case Game.BOOST_REFLECT: Game.giveBadge(Game.BADGE_POWER_REFLECT); break; // Return to Sender
            case Game.BOOST_NOWEAKNESS: Game.giveBadge(Game.BADGE_POWER_INTUITION); break; // Discerning Eye
            case Game.BOOST_MORESCRAP: Game.giveBadge(Game.BADGE_POWER_SCRAP); break; // Systematic Deconstruction
            case Game.BOOST_BONUSDMG: Game.giveBadge(Game.BADGE_POWER_OVERCHARGE); break; // Pushing the Limits
            case Game.BOOST_HEALINGPOTION: Game.giveBadge(Game.BADGE_POWER_HEALPOTION); break; // Trust Me, I'm a Doctor
            case Game.BOOST_DEBUFFPOTION: Game.giveBadge(Game.BADGE_POWER_DEBUFFPOTION); break; // Dirty Tactics
          }
        }
      }
      else {
        for(var x = 0; x < Game.p_Powers.length; x++) {
          if(Game.p_Powers[x][0] === power) {
            Game.p_Powers[x][1]++;
            if(Game.p_Powers[x][1] === Game.getPowerLevelCap(power)) {
              switch(power) {
                case Game.BOOST_BROKEN: Game.giveBadge(Game.BADGE_POWER_THREAD); break; // Taking Care of the Careless
                case Game.BOOST_REPAIR: Game.giveBadge(Game.BADGE_POWER_MAINT); break; // Excessive Demands
                case Game.BOOST_REPAIRPOWER: Game.giveBadge(Game.BADGE_POWER_REPAIR); break; // Gnomish Ingenuity
                case Game.BOOST_EXTRA: Game.giveBadge(Game.BADGE_POWER_CAVITY); break; // Latex Glove Fanatic
                case Game.BOOST_SCRAP: Game.giveBadge(Game.BADGE_POWER_LOOTING); break; // Gold Digger
                case Game.BOOST_CRITDMG: Game.giveBadge(Game.BADGE_POWER_KEENER); break; // Commander Keen
                case Game.BOOST_ENRAGE: Game.giveBadge(Game.BADGE_POWER_RUSH); break; // No Rush
                case Game.BOOST_MOREPP: Game.giveBadge(Game.BADGE_POWER_LUCKY); break; // Eight-Leaf Clover
                case Game.BOOST_STATUP: Game.giveBadge(Game.BADGE_POWER_SKILLS); break; // Statuesque
                case Game.BOOST_DBLPOWER: Game.giveBadge(Game.BADGE_POWER_FLURRY); break; // They Told Me It Was Overpowered
                case Game.BOOST_BURST: Game.giveBadge(Game.BADGE_POWER_WILD); break; // Monkeying Around
                case Game.BOOST_FULLHEAL: Game.giveBadge(Game.BADGE_POWER_DYING); break; // No Time for Dying
                case Game.BOOST_EXECUTE: Game.giveBadge(Game.BADGE_POWER_EXECUTE); break; // Butcher's Block
                case Game.BOOST_LASTSTAND: Game.giveBadge(Game.BADGE_POWER_BASTION); break; // Hollow Bastion
                case Game.BOOST_VENGEANCE: Game.giveBadge(Game.BADGE_POWER_REVENGE); break; // Right Back At You
                case Game.BOOST_FIRST: Game.giveBadge(Game.BADGE_POWER_FIRST); break; // Ladies First
                case Game.BOOST_PICKPOCKET: Game.giveBadge(Game.BADGE_POWER_FINGER); break; // Disembodied Finger
                case Game.BOOST_FASTBURST: Game.giveBadge(Game.BADGE_POWER_PRESSURE); break; // Under Pressure
                case Game.BOOST_DEBUFFBURST: Game.giveBadge(Game.BADGE_POWER_TABLES); break; // Table Flipper
                case Game.BOOST_SELL: Game.giveBadge(Game.BADGE_POWER_MARKET); break; // Market Regular
              }
            }
          }
        }
      }
      Game.p_PP--;
      Game.updatePowers = true;
    }
  }
  Game.badgeCheck(Game.BADGE_POWER); // Unlimited Power!
  Game.drawActivePanel();
}
Game.getPowerLevelCap = function(power) {
  switch(power) {
    case Game.BOOST_CARE:
    case Game.BOOST_CURRENCY:
    case Game.BOOST_SHIELD:
    case Game.BOOST_MORESP:
    case Game.BOOST_XP:
    case Game.BOOST_REGEN:
    case Game.BOOST_DOUBLE:
    case Game.BOOST_DAMAGE:
    case Game.BOOST_DEFENCE:
    case Game.BOOST_SPEED:
    case Game.BOOST_DEBUFF:
    case Game.BOOST_PRICES:
    //case Game.BOOST_MULTIPOTION:
      return 10;
    case Game.BOOST_BROKEN:
    case Game.BOOST_REPAIR:
    case Game.BOOST_REPAIRPOWER:
    case Game.BOOST_EXTRA:
    case Game.BOOST_CRIT:
    case Game.BOOST_SCRAP:
    case Game.BOOST_CRITDMG:
    case Game.BOOST_ENRAGE:
    case Game.BOOST_MOREPP:
    case Game.BOOST_STATUP:
    case Game.BOOST_DBLPOWER:
    case Game.BOOST_FULLHEAL:
    case Game.BOOST_BURST:
    case Game.BOOST_EXECUTE:
    case Game.BOOST_LASTSTAND:
    case Game.BOOST_VENGEANCE:
    case Game.BOOST_FIRST:
    case Game.BOOST_PICKPOCKET:
    case Game.BOOST_SELL:
    case Game.BOOST_FASTBURST:
      return 5;
    case Game.BOOST_DEBUFFBURST:
      return 4;
    case Game.BOOST_ABSORB:
    case Game.BOOST_REFLECT:
    case Game.BOOST_MORESCRAP:
    case Game.BOOST_BONUSDMG:
    case Game.BOOST_NOWEAKNESS:
    case Game.BOOST_OVERFLOW:
    //case Game.BOOST_HEALINGPOTION:
    //case Game.BOOST_DEBUFFPOTION:
      return 1;
    default:
      return 0;
  }
}
Game.getPowerName = function(power) {
  switch(power) {
    case Game.BOOST_CARE: return "Proper Care";
    case Game.BOOST_BROKEN: return "Hanging By a Thread";
    case Game.BOOST_REPAIR: return "High Maintenance";
    case Game.BOOST_REPAIRPOWER: return "Master Tinkerer";
    case Game.BOOST_CURRENCY: return "Pickpocket";
    case Game.BOOST_EXTRA: return "Cavity Search";
    case Game.BOOST_SCRAP: return "Thorough Looting";
    case Game.BOOST_CRIT: return "Keen Eye";
    case Game.BOOST_CRITDMG: return "Keener Eye";
    case Game.BOOST_ENRAGE: return "Adrenaline Rush";
    case Game.BOOST_SHIELD: return "Divine Shield";
    case Game.BOOST_ABSORB: return "Absorption Shield";
    case Game.BOOST_REFLECT: return "Reflective Shield";
    case Game.BOOST_MOREPP: return "Lucky Star";
    case Game.BOOST_MORESP: return "Luck of the Draw";
    case Game.BOOST_XP: return "Fast Learner";
    case Game.BOOST_STATUP: return "Patience and Discipline";
    case Game.BOOST_DOUBLE: return "Flurry";
    case Game.BOOST_DBLPOWER: return "Empowered Flurry";
    case Game.BOOST_REGEN: return "Survival Instincts";
    case Game.BOOST_FULLHEAL: return "Will To Live";
    case Game.BOOST_DAMAGE: return "Deadly Force";
    case Game.BOOST_DEFENCE: return "Ancestral Fortitude";
    case Game.BOOST_SPEED: return "Nimble Fingers";
    case Game.BOOST_BURST: return "Wild Swings";
    case Game.BOOST_EXECUTE: return "Execute";
    case Game.BOOST_LASTSTAND: return "Last Bastion";
    case Game.BOOST_VENGEANCE: return "Vengeance";
    case Game.BOOST_FIRST: return "Sneak Attack";
    case Game.BOOST_PICKPOCKET: return "Five-Finger Discount";
    case Game.BOOST_DEBUFF: return "Expose Weakness";
    case Game.BOOST_FASTBURST: return "Press The Advantage";
    case Game.BOOST_DEBUFFBURST: return "Turn The Tables";
    case Game.BOOST_PRICES: return "Bartering";
    case Game.BOOST_SELL: return "Haggling";
    case Game.BOOST_MORESCRAP: return "Disassembly";
    case Game.BOOST_BONUSDMG: return "Overcharge";
    case Game.BOOST_NOWEAKNESS: return "Intuition";
    case Game.BOOST_OVERFLOW: return "Reclaimed Knowledge";
    //case Game.BOOST_MULTIPOTION: return "Brewmaster";
    //case Game.BOOST_HEALINGPOTION: return "Medic's Intuition";
    //case Game.BOOST_DEBUFFPOTION: return "Saboteur's Intuition";
  }
}
Game.getPowerDesc = function(power) {
  switch(power) {
    case Game.BOOST_CARE: return "Grants a 2% chance per rank to ignore each armour or weapon decay occurence in combat.";
    case Game.BOOST_REPAIR: return "Grants a 2% chance per rank to fully repair your equipped weapon and armour after combat.";
    case Game.BOOST_BROKEN: return "Preserves an additional 10% per rank of your weapon's effect when its durability is reduced to zero.";
    case Game.BOOST_REPAIRPOWER: return "Increases the durability restored per repair tick by 20% per rank.";
    case Game.BOOST_CURRENCY: return "Grants an additional 5% gain per rank in seeds earned from combat.";
    case Game.BOOST_EXTRA: return "Grants a 2% chance per rank to triple the amount of seeds gained from combat.";
    case Game.BOOST_SCRAP: return "Grants a 2% chance per rank to salvage a piece of scrap from combat.";
    case Game.BOOST_CRIT: return "Grants a 3% chance per rank to critically strike the target for 50% more damage.";
    case Game.BOOST_CRITDMG: return "Increases the critical strike damage bonus of Keen Eye by 10% per rank.";
    case Game.BOOST_ENRAGE: return "Increases damage dealt by 5% per rank for your next 3 attacks after a critical strike.";
    case Game.BOOST_SHIELD: return "Grants a 1% chance per rank to completely negate the damage of an enemy attack.";
    case Game.BOOST_ABSORB: return "Causes your Divine Shield effect to heal you for the damage you would have taken.";
    case Game.BOOST_REFLECT: return "Causes your Divine Shield effect to deal the damage you would have taken to the enemy.";
    case Game.BOOST_MOREPP: return "Grants a 1% chance per rank to gain an additional Power Point on level up.";
    case Game.BOOST_MORESP: return "Grants a 1% chance per rank to gain an additional Stat Point on level up.";
    case Game.BOOST_XP: return "Grants a 5% increase per rank to experience gained during combat.";
    case Game.BOOST_STATUP: return "Grants a 3% chance per rank to gain an additional point in a random stat on level up.";
    case Game.BOOST_DOUBLE: return "Grants a 2% chance per rank to strike a target again after an attack for 50% damage.";
    case Game.BOOST_DBLPOWER: return "Grants a 4% increase per rank in the damage of Flurry's additional strike.";
    case Game.BOOST_REGEN: return "Grants a 2% per rank increase in health regeneration and equipment repair speeds.";
    case Game.BOOST_FULLHEAL: return "Grants a 2% chance per rank to be restored to full health immediately after combat.";
    case Game.BOOST_DAMAGE: return "Grants a 2% per rank increase to all damage dealt during combat.";
    case Game.BOOST_DEFENCE: return "Grants a 2% per rank reduction to all damage taken during combat.";
    case Game.BOOST_SPEED: return "Grants a 2% decrease per rank in the delay between your attacks.";
    case Game.BOOST_BURST: return "Modifies your Burst Attack to deal a number of 50% damage hits equal to this power's rank plus 1.";
    case Game.BOOST_EXECUTE: return "Grants a 5% chance per rank to instantly kill a target that is below 25% health.";
    case Game.BOOST_LASTSTAND: return "Reduces damage taken by 10% per rank when your health is below 30%.";
    case Game.BOOST_VENGEANCE: return "Grants a 2% chance per rank to return 50% of damage taken to the target.";
    case Game.BOOST_FIRST: return "Increases your chance to attack first by 10% per rank.";
    case Game.BOOST_PICKPOCKET: return "Grants a 1% chance per rank to steal seeds equal to your character level on attack.";
    case Game.BOOST_DEBUFF: return "Grants a 1% increase per rank to the debuff application chance.";
    case Game.BOOST_FASTBURST: return "Lowers the cooldown of Burst Attack by 1 second per rank on debuffed targets.";
    case Game.BOOST_DEBUFFBURST: return "Increases the debuff application rate when using Burst Attack by 20% per rank.";
    case Game.BOOST_PRICES: return "Lowers the cost of item level upgrades and store items by 2% per rank.";
    case Game.BOOST_SELL: return "Increases the amount of seeds received from selling items by 5% per rank.";
    case Game.BOOST_MORESCRAP: return "Guarantees an additional piece of scrap from destroying items.";
    case Game.BOOST_BONUSDMG: return "Increases damage dealt by 25% at the cost of an additional durability point per attack.";
    case Game.BOOST_NOWEAKNESS: return "When using Burst Attack, the enemy's armour resistances are treated as vulnerabilities.";
    case Game.BOOST_OVERFLOW: return "Increases experience gained in combat by up to 50% by draining the experience overflow pool.";
    //case Game.BOOST_MULTIPOTION: return "Grants a 1% chance per rank to ignore the single-use limitation on potions when using one.";
    //case Game.BOOST_HEALINGPOTION: return "Causes your healing potions to restore an additional 10% of your health.";
    //case Game.BOOST_DEBUFFPOTION: return "Causes your debuffing potions to apply the superior version of their respective debuffs.";
  }
}
Game.resetPowers = function() {
    var totalSpent = 0;
    for(var a = 0; a < Game.p_Powers.length; a++) {
      totalSpent += Game.p_Powers[a][1];
    }
    var scrapCost = Math.ceil((totalSpent + Game.p_PP)/3);
    if(Game.p_Scrap < scrapCost) {
      Game.toastNotification("You need " + scrapCost + " scrap to reset your powers.");
      return;
    }
    if(confirm("Are you sure you wish to reset your power point allocation? \n\nThis will cost a total of " + scrapCost + " scrap and cannot be undone.")) {
      Game.p_Powers = [];
      Game.p_PP += totalSpent;
      Game.p_Scrap -= scrapCost;
      Game.toastNotification("Power points have been reset.");
      Game.updatePowers = true;
      Game.TRACK_RESETS++;
      Game.badgeCheck(Game.BADGE_RESETS); // Indecisive
      Game.drawActivePanel();
  }
}

document.getElementById("loadedPowers").style.display = "";