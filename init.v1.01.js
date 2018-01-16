Game = {};
/*
Stuff left to do for MVP:

Add in the ability to buy potions:
 - Potions come in two main types: healing potions and debuff potions.
 - Healing potions restore a set percentage of the player's health when used.
   - Lesser Healing Potion restores 20% of the player's health
   - Healing Potion restores 30% of the player's health
   - Greater Healing Potion restores 40% of the player's health
 - Debuff potions instantly apply the respective debuffs to their victims, overwriting any existing weapon debuff.
   - Each potion applies the base version of the debuff (as if it were generated on a Good quality weapon)
 - A debuff potion must be equipped before it can be used in an encounter.
 - Only one potion can be used per encounter.
 - A new 10 point base power, Brewmaster, will be added that provides a 1% chance per rank to ignore the single-use lockout for potions when using one.
 - A pair of single point powers will be added to boost the effectiveness of healing (Medic's Intuition) or debuff (Saboteur's Intuition) potions. Both of these powers will branch from Brewmaster.
   - Healing potions heal for 10% more when boosted by Medic's Intuition
   - Debuff potions apply superior debuffs when boosted by Saboteur's Intuition

Possible updates:

Tweaks for the strength of bosses
 - Requires a lot of playtesting. The power of the player character can vary a lot, making bosses incredibly easy or difficult. This may end up being implemented in a future patch rather than for 1.0

Automatic Stat Point Assignment
 - Automatically use stat points on level up, based on equipped weapon. Turned off by default. Part of the autobattle system.

Update strategy
 - Adjust loading algorithm for future patches so a full save clear isn't required, by checking the save version when attempting to load newly added parameters, or converting existing parameters to new formats where applicable.

Boss Buffs and Debuffs
 - Bosses and some elites should be able to give themselves buffs that have various effects on the user (and possibly cause issues for the player)

95 of 98 badges implemented.
3 of 98 badges rely on non-existent mechanics

*/
Game.init = function() {
	//Define some constants we can use later
  this.GAME_VERSION = 10; // Used to purge older saves between major version changes, don't change this value unless you're also making a change that modifies what is saved or loaded.
  // The experience curve
	this.XP_MULT = 1.05;
	this.XP_RANGEMIN = 3.0;
	this.XP_RANGEMAX = 4.0;
	this.XP_BASE = 40;
	this.XP_INIT = 128;
  this.WEAPON_BASE_MULT = 0.6; // Multiplier for main stat to apply to damage dealt.
	//Player states
	this.STATE_IDLE = 0;
	this.STATE_REPAIR = 1;
	this.STATE_COMBAT = 2;
  //Player Powers
  this.BOOST_CARE = 101; // Proper Care
  this.BOOST_BROKEN = 1011; // Hanging By a Thread
  this.BOOST_REPAIR = 1012; // High Maintenance
  this.BOOST_REPAIRPOWER = 1013; // Master Tinkerer
  this.BOOST_CURRENCY = 102; // Pickpocket
  this.BOOST_EXTRA = 1021; // Cavity Search
  this.BOOST_SCRAP = 1022; // Thorough Looting
  this.BOOST_CRIT = 103; // Keen Eye
  this.BOOST_CRITDMG = 1031; // Keener Eye
  this.BOOST_ENRAGE = 1032; // Adrenaline Rush
  this.BOOST_SHIELD = 104; // Divine Shield
  this.BOOST_ABSORB = 1041; // Absorption Shield
  this.BOOST_REFLECT = 1042; // Reflective Shield
  this.BOOST_MORESP = 105; // Luck of the Draw
  this.BOOST_MOREPP = 1051; // Lucky Star
  this.BOOST_XP = 106; // Fast Learner
  this.BOOST_STATUP = 1061; // Patience and Discipline
  this.BOOST_DOUBLE = 107; // Flurry
  this.BOOST_DBLPOWER = 1071; // Empowered Flurry
  this.BOOST_BURST = 1072; // Wild Swings
  this.BOOST_REGEN = 108; // Survival Instincts
  this.BOOST_FULLHEAL = 1081; // Will To Live
  // this.BOOST_DYING = 1082; // Down But Not Out
  this.BOOST_DAMAGE = 109; // Deadly Force
  this.BOOST_EXECUTE = 1091; // Execute
  this.BOOST_BONUSDMG = 1092; // Overcharge
  this.BOOST_DEFENCE = 110; // Ancestral Fortitude
  this.BOOST_LASTSTAND = 1101; // Last Bastion
  this.BOOST_VENGEANCE = 1102; // Vengeance
  this.BOOST_SPEED = 111; // Nimble Fingers
  this.BOOST_FIRST = 1111; // Sneak Attack
  this.BOOST_PICKPOCKET = 1112; // Five-Finger Discount
  this.BOOST_DEBUFF = 112; // Expose Weakness
  this.BOOST_FASTBURST = 1121; // Press The Advantage
  this.BOOST_DEBUFFBURST = 1122; // Turn The Tables
  this.BOOST_NOWEAKNESS = 1123; // Commander's Intuition
  this.BOOST_PRICES = 113; // Bartering
  this.BOOST_SELL = 1131; // Haggling
  this.BOOST_MORESCRAP = 1132; // Disassembly
  this.BOOST_OVERFLOW = 114; // Reclaimed Knowledge
  this.BOOST_MULTIPOTION = 115; // Brewmaster
  this.BOOST_HEALINGPOTION = 1151; // Medic's Intuition
  this.BOOST_DEBUFFPOTION = 1152; // Saboteur's Intuition
	//Weapon Types
	this.WEAPON_MELEE = 201;
	this.WEAPON_RANGE = 202;
	this.WEAPON_MAGIC = 203;
	//Weapon Speeds
	this.WSPEED_SLOW = 211; // 2.6 to 3.0 seconds
	this.WSPEED_MID = 212; // 2.1 to 2.5 seconds
	this.WSPEED_FAST = 213; // 1.6 to 2.0 seconds
  // Armour strengths
  this.ARMOUR_STR_MELEE = 231;
  this.ARMOUR_STR_RANGE = 232;
  this.ARMOUR_STR_MAGIC = 233;
  // Armour vulnerabilities
  this.ARMOUR_VULN_MELEE = 234;
  this.ARMOUR_VULN_RANGE = 235;
  this.ARMOUR_VULN_MAGIC = 236;
  // Debuff types
  this.DEBUFF_SHRED = 241; // Negates opponent's armour
  this.DEBUFF_MULTI = 242; // Delivers a second attack with each hit
  this.DEBUFF_DRAIN = 243; // Restores a percentage of damage dealt as health
  this.DEBUFF_SLOW = 244; // Lowers the enemy's attack speed
  this.DEBUFF_MC = 245; // Causes the enemy's next attack to hit themselves
  this.DEBUFF_DOT = 246; // Deals an arbitrary amount of extra damage
  this.DEBUFF_PARAHAX = 247; // May cause the enemy to be unable to attack
  this.DEBUFF_DOOM = 248; // Kills the enemy instantly
  this.DEBUFF_DISARM = 249; // Negates opponent's weapon
  this.DEBUFF_SLEEP = 250; // Renders victim unable to act. Can be broken with damage.
	// Item Quality
	this.QUALITY_POOR = 221;
	this.QUALITY_NORMAL = 222;
	this.QUALITY_GOOD = 223;
	this.QUALITY_GREAT = 224;
	this.QUALITY_AMAZING = 225;
  this.QUALITY_LEGENDARY = 226;
	// Point assignment stats
	this.STAT_STR = 301;
	this.STAT_DEX = 302;
	this.STAT_INT = 303;
	this.STAT_CON = 304;
  // Point assignment tracking
  this.POINTS_STR = 0;
  this.POINTS_DEX = 0;
  this.POINTS_INT = 0;
  this.POINTS_CON = 0;
  this.POINTS_STR_CURRENT = 0;
  this.POINTS_DEX_CURRENT = 0;
  this.POINTS_INT_CURRENT = 0;
  this.POINTS_CON_CURRENT = 0;
  // Statistics tracking
  this.TRACK_TOTAL_DMG = 0;
  this.TRACK_MELEE_DMG = 0;
  this.TRACK_RANGE_DMG = 0;
  this.TRACK_MAGIC_DMG = 0;
  this.TRACK_TOTAL_TAKEN = 0;
  this.TRACK_MELEE_TAKEN = 0;
  this.TRACK_MAGIC_TAKEN = 0;
  this.TRACK_RANGE_TAKEN = 0;
  this.TRACK_ATTACKS_OUT = 0;
  this.TRACK_ATTACKS_IN = 0;
  this.TRACK_WINS = 0;
  this.TRACK_LOSSES = 0;
  this.TRACK_ESCAPES = 0;
  this.TRACK_WIN_STREAK = 0;
  this.TRACK_BURSTS = 0;
  this.TRACK_BOSS_KILLS = 0;
  this.TRACK_BOSS_CHANCE = 0;
  this.TRACK_MAXHIT_IN = 0;
  this.TRACK_MAXHIT_OUT = 0;
  this.TRACK_XP_GAINED = 0;
  this.TRACK_XP_LOST = 0;
  this.TRACK_XP_OVERFLOW = 0;
  this.TRACK_UPGRADES = 0;
  this.TRACK_REFORGES = 0;
  this.TRACK_RESETS = 0;
  this.TRACK_ITEM_SALES = 0;
  this.TRACK_ITEM_SCRAPS = 0;
  this.TRACK_ITEM_DISCARDS = 0;
  this.TRACK_BROKEN_ITEMS = 0;
  this.TRACK_COMBAT_SEEDS = 0;
  this.TRACK_SALE_SEEDS = 0;
  this.TRACK_COMBAT_SCRAP = 0;
  this.TRACK_CONVERT_SCRAP = 0;
  this.TRACK_DEBUFFS_OUT = 0;
  this.TRACK_DEBUFFS_IN = 0;
  this.TRACK_DOOM_IN = 0;
  this.TRACK_DOOM_OUT = 0;
  this.TRACK_SLEEPBREAK_IN = 0;
  this.TRACK_SLEEPBREAK_OUT = 0;
  this.TRACK_DRAIN_IN = 0;
  this.TRACK_DRAIN_OUT = 0;
  this.TRACK_DOTS_IN = 0;
  this.TRACK_DOTS_OUT = 0;
  this.TRACK_CHARM_IN = 0;
  this.TRACK_CHARM_OUT = 0;
  this.TRACK_PARAHAX_IN = 0;
  this.TRACK_PARAHAX_OUT = 0;
  this.TRACK_POTIONS_USED = 0;
  // Badge constants and progress trackers
  this.BADGE_NAME = 2001; // The Personal Touch
  this.BADGE_DEVNAME = 2002; // God Complex
  this.BADGE_AUTOSAVE = 2003; // We've Got You Covered
  this.PROGRESS_AUTOSAVE = 0;
  this.BADGE_MANUALSAVE = 2004; // Trust Issues
  this.BADGE_AUTOBATTLE = 2005; // Aversion to Clicking
  this.BADGE_KEYBINDING = 2006; // Keyboard Cat
  this.PROGRESS_KEYBINDING = 0;
  this.BADGE_MANUAL_BATTLE = 2007; // Broken Mouse Convention
  this.PROGRESS_MANUAL_BATTLE = 0;
  this.BADGE_PRESTIGE = 2008; // What Does This Button Do?
  this.BADGE_FIRSTBLOOD = 2009; // Baby Steps
  this.BADGE_KILLCOUNT = 2010; // Skullcrusher Mountain
  this.BADGE_BOSSGEAR = 2011; // Like a Boss
  this.BADGE_JACKOFTRADES = 2012; // Jack of All Trades
  this.BADGE_BURSTFINISH = 2013; // Coup de Grace
  this.BADGE_BURSTSPAM = 2014; // Manual Labour
  this.BADGE_ALMOSTDEAD = 2015; // Living on a Prayer
  this.BADGE_SURVIVALIST = 2016; // The Survivalist
  this.TRIGGER_SURVIVALIST = false;
  this.BADGE_FLAWLESS = 2017; // Flawless Victory
  this.TRIGGER_FLAWLESS = false;
  this.BADGE_FLAWLESS_BOSS = 2018; // MC Hammer Special
  this.TRIGGER_FLAWLESS_BOSS = false;
  this.BADGE_LONGFIGHT = 2019; // War of Attrition
  this.PROGRESS_LONGFIGHT = 0;
  this.BADGE_UNSTOPPABLE = 2020; // The Unstoppable Force
  this.BADGE_POTIONS_USED = 2021; // Alchemical Bombardment
  this.BADGE_SELF_DEBUFF = 2022; // Hoisted By My Own Petard
  this.BADGE_SELF_KILL = 2023; // Punching Mirrors
  this.BADGE_ENEMY_SELF_DEBUFF = 2024; // Tarred With Their Own Brush
  this.BADGE_ENEMY_SELF_KILL = 2025; // Here, Let Me Help You
  this.BADGE_VAMPIRISM = 2026; // Vampirism
  this.VAMPIRISM_START_HEALTH = 0;
  this.BADGE_ROMEO = 2027; // Wherefore Art Thou, Romeo?
  this.BADGE_INTERVENTION = 2028; // Divine Intervention
  this.BADGE_NO_WEAPON = 2029; // Where We're Going, We Don't Need Weapons
  this.BADGE_NO_ARMOUR = 2030; // Where We're Going, We Don't Need Armour
  this.BADGE_NO_GEAR = 2031; // Where We're Going, We Don't Need Gear
  // This next set all relate to specific powers
  this.BADGE_POWER_THREAD = 2032; // Taking Care of the Careless (Hanging By a Thread)
  this.BADGE_POWER_MAINT = 2033; // Excessive Demands (High Maintenance)
  this.BADGE_POWER_REPAIR = 2034; // Gnomish Ingenuity (Master Tinkerer)
  this.BADGE_POWER_CAVITY = 2035; // Latex Glove Fanatic (Cavity Search)
  this.BADGE_POWER_LOOTING = 2036; // Gold Digger (Thorough Looting)
  this.BADGE_POWER_KEENER = 2037; // Commander Keen (Keener Eye)
  this.BADGE_POWER_RUSH = 2038; // No Rush (Adrenaline Rush)
  this.BADGE_POWER_ABSORB = 2039; // Glutton for Punishment (Absorption Shield)
  this.BADGE_POWER_REFLECT = 2040; // Return to Sender (Reflective Shield)
  this.BADGE_POWER_LUCKY = 2041; // Eight-Leaf Clover (Lucky Star)
  this.BADGE_POWER_SKILLS = 2042; // Statuesque (Patience and Discipline)
  this.BADGE_POWER_FLURRY = 2043; // They Told Me It Was Overpowered (Empowered Flurry)
  this.BADGE_POWER_WILD = 2044; // Monkeying Around (Wild Swings)
  this.BADGE_POWER_DYING = 2045; // No Time for Dying (Will to Live)
  this.BADGE_POWER_EXECUTE = 2046; // Butcher's Block (Execute)
  this.BADGE_POWER_OVERCHARGE = 2047; // Pushing the Limits (Overcharge)
  this.BADGE_POWER_BASTION = 2048; // Hollow Bastion (Last Bastion)
  this.BADGE_POWER_REVENGE = 2049; // Right Back at You (Vengeance)
  this.BADGE_POWER_FIRST = 2050; // Ladies First (Sneak Attack)
  this.BADGE_POWER_FINGER = 2051; // Disembodied Finger (Five-Finger Discount)
  this.BADGE_POWER_PRESSURE = 2052; // Under Pressure (Press the Advantage)
  this.BADGE_POWER_TABLES = 2053; // Table Flipper (Turn the Tables)
  this.BADGE_POWER_INTUITION = 2054; // Discerning Eye (Intuition)
  this.BADGE_POWER_MARKET = 2055; // Market Regular (Haggling)
  this.BADGE_POWER_SCRAP = 2056; // Systematic Deconstruction (Disassembly)
  this.BADGE_POWER_HEALPOTION = 2057; // Trust Me, I'm a Doctor (Medic's Intuition)
  this.BADGE_POWER_DEBUFFPOTION = 2058; // Dirty Tactics (Saboteur's Intuition)
  // End of the power block
  this.BADGE_STR = 2059; // A Good Offense
  this.BADGE_DEX = 2060; // Pinpoint Accuracy
  this.BADGE_INT = 2061; // Bookish Type
  this.BADGE_CON = 2062; // Defence of the Ancients
  this.BADGE_TOTAL = 2063; // The Only Way is Up
  this.BADGE_POWER = 2064; // Unlimited Power!
  this.BADGE_RESETS = 2065; // Indecisive
  this.BADGE_RANDOM_DEBUFFS = 2066; // Rolling the Bones
  this.PROGRESS_RANDOM_DEBUFFS = 0;
  this.BADGE_DEBUFF_SPEND = 2067; // Happy Customer
  this.PROGRESS_DEBUFF_SPEND = 0;
  this.BADGE_NO_NAME = 2068; // Unimaginative
  this.BADGE_NO_FLAVOUR = 2069; // Lacking in Flavour
  this.BADGE_FIRST_BUY = 2070; // Broken In
  this.BADGE_SPEND1 = 2071; // The Trade Parade
  this.BADGE_SPEND2 = 2072; // Sucker
  this.BADGE_SPEND3 = 2073; // CAPITALISM!
  this.PROGRESS_SPEND = 0;
  this.BADGE_NO_SPEND = 2074; // The Trade Blockade
  this.BADGE_SELLING = 2075; // Rags to Riches
  this.BADGE_SCRAPPING = 2076; // Heavy Metal
  this.BADGE_DISCARDS = 2077; // Disposable Income
  this.BADGE_REPAIR = 2078; // A Habit is Born
  this.BADGE_BLUE = 2079; // Blue in the Face
  this.BADGE_PURPLE = 2080; // Tastes like Purple
  this.BADGE_FULL_INV = 2081; // Full House
  this.BADGE_FULL_WEP = 2082; // Weapon Hoarder
  this.BADGE_FULL_ARM = 2083; // Armour Hoarder
  this.BADGE_FULL_POT = 2084; // Potion Hoarder
  this.BADGE_FULL_AMAZING = 2085; // Expensive Tastes
  this.BADGE_BOSSCHANCE = 2086; // Chasing Shadows
  // Boss kill badges
  this.BADGE_ZONE1 = 2087; // Trolling the Troll
  this.BADGE_ZONE2 = 2088; // Calm Down Dear
  this.BADGE_ZONE3 = 2089; // Time For A Shower
  this.BADGE_ZONE4 = 2090; // All Change, Please
  this.BADGE_ZONE5 = 2091; // Outgrown
  this.BADGE_ZONE6 = 2092; // Problem Solved
  this.BADGE_ZONE7 = 2093; // Beyond Divinity
  this.BADGE_ZONE8 = 2094; // Surpassing The Master
  this.BADGE_ZONE9 = 2095; // Feeling Broody
  this.BADGE_ZONE10 = 2096; // Coming To A Point
  this.BADGE_ZONE11 = 2097; // Too Hot To Handle
  this.BADGE_ZONE12 = 2098; // A Long Way Down
	// Player variables
  this.MAX_INVENTORY = 18;
  this.p_Name = "Generic Player Name";
	this.p_HP = 0; this.p_MaxHP = 0;
	this.p_Str = 0; this.p_Dex = 0;
	this.p_Int = 0; this.p_Con = 0;
	this.p_EXP = 0; this.p_NextEXP = 0;
	this.p_SkillPoints = 0;
	this.p_Level = 0; this.p_PP = 0; // Power points.
	this.p_Powers = []; // Selected powers.
	this.p_Weapon = []; // Player weapon.
  this.p_Armour = []; // Player armour.
  this.p_Potion = []; // Equipped potion.
	this.p_State = Game.STATE_IDLE; // Player states
	this.p_specUsed = false;
	this.p_autoSaved = true;
	this.p_RepairInterval = null;
  this.p_Currency = 0;
  this.p_Scrap = 0;
	this.p_IdleInterval = null;
  this.p_Debuff = [];
  this.p_Adrenaline = 0;
  this.p_currentZone = 0;
  this.p_maxZone = 0;
  this.playerBadges = []; // Most important array ever.
  this.bossChance = 0;
  this.prestigeLevel = 0;
  this.activePanel = "";
  this.p_WeaponInventory = [];
  this.p_ArmourInventory = [];
  this.p_PotionInventory = [];
  this.p_ShopStockLimit = 5;
  this.p_WeaponShopStock = [];
  this.p_ArmourShopStock = [];
  this.p_PotionShopStock = [];
  this.updateInventory = true;
  this.updatePowers = true;
  this.updateForge = true;
  this.flurryActive = false;
  this.player_debuffInterval = null;
  this.player_debuffTimer = 0;
  this.enemy_debuffInterval = null;
  this.enemy_debuffTimer = 0;
	this.combat_enemyInterval = null;
  this.combat_playerInterval = null;
  this.toastQueue = [];
  this.toastTimer = null;
	// Enemy variables
	this.e_HP = 0; this.e_MaxHP = 0;
	this.e_MainStat = 0; this.e_Level = 0;
  this.e_Name = "";
	this.e_isBoss = false;
	this.e_Weapon = []; // Enemy weapon
  this.e_Armour = []; // Enemy armour
	this.e_DebuffStacks = 0;
  this.e_Debuff = [];
  this.e_ProperName = false; // Used for name output
  this.canLoot = true; // So we can take items from things...
	this.last_Weapon = []; // Weapon to take
  this.last_Armour = [];
  // Autobattle vars
  this.autoBattle = false;
  this.autoBattleTicker = null;
  this.autoBattle_flee = 5;
  this.autoBattle_repair = 5;
  this.autoSell_options = ["SELL","SCRAP","IGNORE","IGNORE","IGNORE"];
  if(!this.load()) {
 		this.initPlayer(1);
    this.showPanel("helpTable");
    this.repopulateShop();
 		this.save(true);
 	}
  else {
    this.showPanel(this.activePanel);
    this.toastNotification("Game loaded.");
  }
  // Set up the buttons here.
  var playerTabButton = document.getElementById("playerTab");
  var combatTabButton = document.getElementById("combatTab");
  var zoneTabButton = document.getElementById("zoneTab");
  var powersTabButton = document.getElementById("powersTab");
  var inventoryTabButton = document.getElementById("inventoryTab");
  var storeTabButton = document.getElementById("storeTab");
  var optionsTabButton = document.getElementById("optionsTab");
  var helpTabButton = document.getElementById("helpTab");
  var updateTabButton = document.getElementById("updateTab");
  var badgeTabButton = document.getElementById("badgeTab");
  playerTabButton.onclick = function(){ Game.showPanel('playerTable'); };
  combatTabButton.onclick = function(){ Game.showPanel('combatTable'); };
  zoneTabButton.onclick = function(){ Game.showPanel('zoneTable'); };
  powersTabButton.onclick = function(){ Game.showPanel('powersTable'); };
  inventoryTabButton.onclick = function(){ Game.showPanel('inventoryTable'); };
  storeTabButton.onclick = function(){ Game.showPanel('storeTable'); };
  optionsTabButton.onclick = function(){ Game.showPanel('optionsTable'); };
  helpTabButton.onclick = function(){ Game.showPanel('helpTable'); };
  updateTabButton.onclick = function(){ Game.showPanel('updateTable'); };
  badgeTabButton.onclick = function(){ Game.showPanel('badgeTable'); };
	if(Game.p_State != Game.STATE_COMBAT) { Game.idleHeal(); }
	this.drawActivePanel();
}
Game.reset = function() {
	if(confirm("Are you sure you wish to erase your save? It will be lost permanently...")) {
		window.localStorage.removeItem("gameSave");
		window.location.reload();
	}
}
Game.prestige = function() {
  var prestigeBonus = Game.p_Level;
  if(Game.p_State == Game.STATE_IDLE) {
    if(Game.p_maxZone > 0) {
      if(confirm("The following actions will take place: \n • You will lose all of your items and currency. \n • Your character will be returned to level 1. \n • You will gain " + prestigeBonus + " prestige levels. \n\n Are you sure you wish to prestige?")) {
        Game.POINTS_STR = 0;
        Game.POINTS_DEX = 0;
        Game.POINTS_INT = 0;
        Game.POINTS_CON = 0;
        Game.POINTS_STR_CURRENT = 0;
        Game.POINTS_DEX_CURRENT = 0;
        Game.POINTS_INT_CURRENT = 0;
        Game.POINTS_CON_CURRENT = 0;
        Game.p_Powers = [];
        Game.p_Currency = 0;
        Game.p_Scrap = 0;
        Game.p_WeaponInventory = [];
        Game.p_ArmourInventory = [];
        Game.p_PotionInventory = [];
        Game.p_Potion = [];
        Game.last_Weapon = [];
        Game.last_Armour = [];
        Game.bossChance = 0;
        Game.p_currentZone = 0;
        Game.p_maxZone = 0;
        Game.prestigeLevel += Game.p_Level;
        Game.initPlayer(1);
        Game.p_PP += Math.floor(Game.prestigeLevel/4);
        Game.p_SkillPoints += Math.floor(Game.prestigeLevel/2);
        Game.repopulateShop();
        Game.TRACK_RESETS++;
        Game.giveBadge(Game.BADGE_PRESTIGE);
        Game.toastNotification("Prestige reset activated.");
        Game.save(true);
        Game.drawActivePanel();
      }
    }
    else {
      Game.toastNotification("You cannot prestige until you have cleared the first zone.");
    }
  }
  else {
    Game.toastNotification("You cannot perform a prestige reset when in combat.");
  }
}
Game.save = function(auto) {
  var STS = {};
  STS.p_Name = Game.p_Name;
  STS.p_HP = Game.p_HP;
  STS.p_MaxHP = Game.p_MaxHP;
  STS.p_Str = Game.p_Str;
  STS.p_Dex = Game.p_Dex;
  STS.p_Int = Game.p_Int;
  STS.p_Con = Game.p_Con;
  STS.POINTS_STR = Game.POINTS_STR;
  STS.POINTS_DEX = Game.POINTS_DEX;
  STS.POINTS_INT  = Game.POINTS_INT;
  STS.POINTS_CON = Game.POINTS_CON;
  STS.POINTS_STR_CURRENT = Game.POINTS_STR_CURRENT;
  STS.POINTS_DEX_CURRENT = Game.POINTS_DEX_CURRENT;
  STS.POINTS_INT_CURRENT = Game.POINTS_INT_CURRENT;
  STS.POINTS_CON_CURRENT = Game.POINTS_CON_CURRENT;
  STS.p_EXP = Game.p_EXP;
  STS.p_NextEXP = Game.p_NextEXP;
  STS.p_Powers = Game.p_Powers;
  STS.p_Level = Game.p_Level;
  STS.p_PP = Game.p_PP;
  STS.p_Currency = Game.p_Currency;
  STS.p_Scrap = Game.p_Scrap;
  STS.p_SkillPoints = Game.p_SkillPoints;
  STS.p_WeaponInventory = Game.p_WeaponInventory
  STS.p_Weapon = Game.p_Weapon;
  STS.p_ArmourInventory = Game.p_ArmourInventory;
  STS.p_Armour = Game.p_Armour;
  STS.p_PotionInventory = Game.p_PotionInventory;
  STS.p_Potion = Game.p_Potion;
  STS.p_WeaponShopStock = Game.p_WeaponShopStock;
  STS.p_ArmourShopStock = Game.p_ArmourShopStock;
  STS.playerBadges = Game.playerBadges;
  STS.last_Weapon = Game.last_Weapon;
  STS.last_Armour = Game.last_Armour;
  STS.activePanel = Game.activePanel;
  STS.bossChance = Game.bossChance;
  STS.p_currentZone = Game.p_currentZone;
  STS.p_maxZone = Game.p_maxZone;
  STS.TRACK_TOTAL_DMG = Game.TRACK_TOTAL_DMG;
  STS.TRACK_MELEE_DMG = Game.TRACK_MELEE_DMG;
  STS.TRACK_RANGE_DMG = Game.TRACK_RANGE_DMG;
  STS.TRACK_MAGIC_DMG = Game.TRACK_MAGIC_DMG;
  STS.TRACK_TOTAL_TAKEN = Game.TRACK_TOTAL_TAKEN;
  STS.TRACK_MELEE_TAKEN = Game.TRACK_MELEE_TAKEN;
  STS.TRACK_MAGIC_TAKEN = Game.TRACK_MAGIC_TAKEN;
  STS.TRACK_RANGE_TAKEN = Game.TRACK_RANGE_TAKEN;
  STS.TRACK_ATTACKS_OUT = Game.TRACK_ATTACKS_OUT;
  STS.TRACK_ATTACKS_IN = Game.TRACK_ATTACKS_IN;
  STS.TRACK_WINS = Game.TRACK_WINS;
  STS.TRACK_LOSSES = Game.TRACK_LOSSES;
  STS.TRACK_ESCAPES = Game.TRACK_ESCAPES;
  STS.TRACK_WIN_STREAK = Game.TRACK_WIN_STREAK;
  STS.TRACK_BURSTS = Game.TRACK_BURSTS;
  STS.TRACK_BOSS_KILLS = Game.TRACK_BOSS_KILLS;
  STS.TRACK_BOSS_CHANCE = Game.TRACK_BOSS_CHANCE;
  STS.TRACK_MAXHIT_IN = Game.TRACK_MAXHIT_IN;
  STS.TRACK_MAXHIT_OUT = Game.TRACK_MAXHIT_OUT;
  STS.TRACK_XP_GAINED = Game.TRACK_XP_GAINED;
  STS.TRACK_XP_LOST = Game.TRACK_XP_LOST;
  STS.TRACK_XP_OVERFLOW = Game.TRACK_XP_OVERFLOW;
  STS.TRACK_UPGRADES = Game.TRACK_UPGRADES;
  STS.TRACK_REFORGES = Game.TRACK_REFORGES;
  STS.TRACK_RESETS = Game.TRACK_RESETS;
  STS.TRACK_ITEM_SALES = Game.TRACK_ITEM_SALES;
  STS.TRACK_ITEM_SCRAPS = Game.TRACK_ITEM_SCRAPS;
  STS.TRACK_ITEM_DISCARDS = Game.TRACK_ITEM_DISCARDS;
  STS.TRACK_BROKEN_ITEMS = Game.TRACK_BROKEN_ITEMS;
  STS.TRACK_COMBAT_SEEDS = Game.TRACK_COMBAT_SEEDS;
  STS.TRACK_SALE_SEEDS = Game.TRACK_SALE_SEEDS;
  STS.TRACK_COMBAT_SCRAP = Game.TRACK_COMBAT_SCRAP;
  STS.TRACK_CONVERT_SCRAP = Game.TRACK_CONVERT_SCRAP;
  STS.TRACK_DEBUFFS_OUT = Game.TRACK_DEBUFFS_OUT;
  STS.TRACK_DEBUFFS_IN = Game.TRACK_DEBUFFS_IN;
  STS.TRACK_DOOM_IN = Game.TRACK_DOOM_IN;
  STS.TRACK_DOOM_OUT = Game.TRACK_DOOM_OUT;
  STS.TRACK_SLEEPBREAK_IN = Game.TRACK_SLEEPBREAK_IN;
  STS.TRACK_SLEEPBREAK_OUT = Game.TRACK_SLEEPBREAK_OUT;
  STS.TRACK_DRAIN_IN = Game.TRACK_DRAIN_IN;
  STS.TRACK_DRAIN_OUT = Game.TRACK_DRAIN_OUT;
  STS.TRACK_DOTS_IN = Game.TRACK_DOTS_IN;
  STS.TRACK_DOTS_OUT = Game.TRACK_DOTS_OUT;
  STS.TRACK_CHARM_IN = Game.TRACK_CHARM_IN;
  STS.TRACK_CHARM_OUT = Game.TRACK_CHARM_OUT;
  STS.TRACK_PARAHAX_IN = Game.TRACK_PARAHAX_IN;
  STS.TRACK_PARAHAX_OUT = Game.TRACK_PARAHAX_OUT;
  STS.TRACK_POTIONS_USED = Game.TRACK_POTIONS_USED;
  STS.PROGRESS_AUTOSAVE = Game.PROGRESS_AUTOSAVE;
  STS.PROGRESS_KEYBINDING = Game.PROGRESS_KEYBINDING;
  STS.PROGRESS_MANUAL_BATTLE = Game.PROGRESS_MANUAL_BATTLE;
  STS.PROGRESS_RANDOM_DEBUFFS = Game.PROGRESS_RANDOM_DEBUFFS;
  STS.PROGRESS_DEBUFF_SPEND = Game.PROGRESS_DEBUFF_SPEND;
  STS.PROGRESS_SCRAPPING = Game.PROGRESS_SCRAPPING;
  STS.PROGRESS_SPEND = Game.PROGRESS_SPEND;
  STS.autoBattle_flee = Game.autoBattle_flee;
  STS.autoBattle_repair = Game.autoBattle_repair;
  STS.autoSell_options = Game.autoSell_options;
  STS.prestigeLevel = Game.prestigeLevel;
  STS.GAME_VERSION = Game.GAME_VERSION;
  window.localStorage.setItem("gameSave",JSON.stringify(STS));
  Game.toastNotification("Game saved.");
  if(!auto) {
    Game.giveBadge(Game.BADGE_MANUALSAVE); // Trust Issues
  }
  else {
    Game.PROGRESS_AUTOSAVE++;
    Game.badgeCheck(Game.BADGE_AUTOSAVE); // We've Got You Covered
  }
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
	if(g !== null && g.GAME_VERSION == Game.GAME_VERSION) {
    Game.p_Name = g.p_Name;
		Game.p_HP = g.p_HP;
		Game.p_MaxHP = g.p_MaxHP;
		Game.p_Str = g.p_Str;
		Game.p_Dex = g.p_Dex;
		Game.p_Int = g.p_Int;
		Game.p_Con = g.p_Con;
    Game.POINTS_STR = g.POINTS_STR;
    Game.POINTS_DEX = g.POINTS_DEX;
    Game.POINTS_INT = g.POINTS_INT;
    Game.POINTS_CON = g.POINTS_CON;
    Game.POINTS_STR_CURRENT = g.POINTS_STR_CURRENT;
    Game.POINTS_DEX_CURRENT = g.POINTS_DEX_CURRENT;
    Game.POINTS_INT_CURRENT = g.POINTS_INT_CURRENT;
    Game.POINTS_CON_CURRENT = g.POINTS_CON_CURRENT;
		Game.p_EXP = g.p_EXP;
		Game.p_NextEXP = g.p_NextEXP;
		Game.p_Powers = g.p_Powers;
		Game.p_Level = g.p_Level;
		Game.p_PP = g.p_PP;
    Game.p_Currency = g.p_Currency;
    Game.p_Scrap = g.p_Scrap;
		Game.p_SkillPoints = g.p_SkillPoints;
    Game.p_WeaponInventory = g.p_WeaponInventory
		Game.p_Weapon = g.p_Weapon;
    Game.p_ArmourInventory = g.p_ArmourInventory;
    Game.p_Armour = g.p_Armour;
    Game.p_PotionInventory = g.p_PotionInventory;
    Game.p_Potion = g.p_Potion;
    Game.p_WeaponShopStock = g.p_WeaponShopStock;
    Game.p_ArmourShopStock = g.p_ArmourShopStock;
		Game.last_Weapon = g.last_Weapon;
    Game.last_Armour = g.last_Armour;
    Game.activePanel = g.activePanel;
    Game.playerBadges = g.playerBadges;
    Game.p_currentZone = g.p_currentZone;
    Game.p_maxZone = g.p_maxZone;
    Game.TRACK_TOTAL_DMG = g.TRACK_TOTAL_DMG;
    Game.TRACK_MELEE_DMG = g.TRACK_MELEE_DMG;
    Game.TRACK_RANGE_DMG = g.TRACK_RANGE_DMG;
    Game.TRACK_MAGIC_DMG = g.TRACK_MAGIC_DMG;
    Game.TRACK_TOTAL_TAKEN = g.TRACK_TOTAL_TAKEN;
    Game.TRACK_MELEE_TAKEN = g.TRACK_MELEE_TAKEN;
    Game.TRACK_MAGIC_TAKEN = g.TRACK_MAGIC_TAKEN;
    Game.TRACK_RANGE_TAKEN = g.TRACK_RANGE_TAKEN;
    Game.TRACK_ATTACKS_OUT = g.TRACK_ATTACKS_OUT;
    Game.TRACK_ATTACKS_IN = g.TRACK_ATTACKS_IN;
    Game.TRACK_WINS = g.TRACK_WINS;
    Game.TRACK_LOSSES = g.TRACK_LOSSES;
    Game.TRACK_ESCAPES = g.TRACK_ESCAPES;
    Game.TRACK_WIN_STREAK = g.TRACK_WIN_STREAK;
    Game.TRACK_BURSTS = g.TRACK_BURSTS;
    Game.TRACK_BOSS_KILLS = g.TRACK_BOSS_KILLS;
    Game.TRACK_BOSS_CHANCE = g.TRACK_BOSS_CHANCE;
    Game.TRACK_MAXHIT_IN = g.TRACK_MAXHIT_IN;
    Game.TRACK_MAXHIT_OUT = g.TRACK_MAXHIT_OUT;
    Game.TRACK_XP_GAINED = g.TRACK_XP_GAINED;
    Game.TRACK_XP_LOST = g.TRACK_XP_LOST;
    Game.TRACK_XP_OVERFLOW = g.TRACK_XP_OVERFLOW;
    Game.TRACK_UPGRADES = g.TRACK_UPGRADES;
    Game.TRACK_REFORGES = g.TRACK_REFORGES;
    Game.TRACK_RESETS = g.TRACK_RESETS;
    Game.TRACK_ITEM_SALES = g.TRACK_ITEM_SALES;
    Game.TRACK_ITEM_SCRAPS = g.TRACK_ITEM_SCRAPS;
    Game.TRACK_ITEM_DISCARDS = g.TRACK_ITEM_DISCARDS;
    Game.TRACK_BROKEN_ITEMS = g.TRACK_BROKEN_ITEMS;
    Game.TRACK_COMBAT_SEEDS = g.TRACK_COMBAT_SEEDS;
    Game.TRACK_SALE_SEEDS = g.TRACK_SALE_SEEDS;
    Game.TRACK_COMBAT_SCRAP = g.TRACK_COMBAT_SCRAP;
    Game.TRACK_CONVERT_SCRAP = g.TRACK_CONVERT_SCRAP;
    Game.TRACK_DEBUFFS_OUT = g.TRACK_DEBUFFS_OUT;
    Game.TRACK_DEBUFFS_IN = g.TRACK_DEBUFFS_IN;
    Game.TRACK_DOOM_IN = g.TRACK_DOOM_IN;
    Game.TRACK_DOOM_OUT = g.TRACK_DOOM_OUT;
    Game.TRACK_SLEEPBREAK_IN = g.TRACK_SLEEPBREAK_IN;
    Game.TRACK_SLEEPBREAK_OUT = g.TRACK_SLEEPBREAK_OUT;
    Game.TRACK_DRAIN_IN = g.TRACK_DRAIN_IN;
    Game.TRACK_DRAIN_OUT = g.TRACK_DRAIN_OUT;
    Game.TRACK_DOTS_IN = g.TRACK_DOTS_IN;
    Game.TRACK_DOTS_OUT = g.TRACK_DOTS_OUT;
    Game.TRACK_CHARM_IN = g.TRACK_CHARM_IN;
    Game.TRACK_CHARM_OUT = g.TRACK_CHARM_OUT;
    Game.TRACK_PARAHAX_IN = g.TRACK_PARAHAX_IN;
    Game.TRACK_PARAHAX_OUT = g.TRACK_PARAHAX_OUT;
    Game.TRACK_POTIONS_USED = g.TRACK_POTIONS_USED;
    Game.PROGRESS_AUTOSAVE = g.PROGRESS_AUTOSAVE;
    Game.PROGRESS_KEYBINDING = g.PROGRESS_KEYBINDING;
    Game.PROGRESS_MANUAL_BATTLE = g.PROGRESS_MANUAL_BATTLE;
    Game.PROGRESS_RANDOM_DEBUFFS = g.PROGRESS_RANDOM_DEBUFFS;
    Game.PROGRESS_DEBUFF_SPEND = g.PROGRESS_DEBUFF_SPEND;
    Game.PROGRESS_SCRAPPING = g.PROGRESS_SCRAPPING;
    Game.PROGRESS_SPEND = g.PROGRESS_SPEND;
    Game.autoBattle_flee = g.autoBattle_flee;
    Game.autoBattle_repair = g.autoBattle_repair;
    Game.autoSell_options = g.autoSell_options;
    if(g.bossChance === undefined) { Game.bossChance = Game.p_Level >= 5 ? 1 : 0; }
    else { Game.bossChance = g.bossChance; }
    if(g.prestigeLevel === undefined) { Game.prestigeLevel = 0; }
    else { Game.prestigeLevel = g.prestigeLevel; }
    // Fix for weapons with the old weaker sleep debuff circa V1.0 RC2
    if(Game.p_Weapon[9][0] == 250 && Game.p_Weapon[9][3] == 20) {
      Game.p_Weapon[9][3] = 15;
    }
    for(var x = 0; x < Game.p_WeaponInventory.length; x++) {
      if(Game.p_WeaponInventory[x][9][0] == 250 && Game.p_WeaponInventory[x][9][3] == 20) {
        Game.p_WeaponInventory[x][9][3] = 15;
      }
    }
    return true;
	}
	else { return false; }
}
Game.RNG = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Game.padLeft = function(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}
function prettifyNumber(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t","qa","qi","sx","sp"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

document.getElementById("loadedInit").style.display = "";