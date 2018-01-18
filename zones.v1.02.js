/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";
Game.ZONE_NAMES = [
  "Whispering Cave",
  "Ash Cultist Outpost",
  "Dawn's Light Swamp",
  "The Final Stop",
  "Echoing Passage",
  "The Swiftsteel Workshop",
  "Weary Hollow Chapel",
  "The Fallen Pillar",
  "Dragons' Crown",
  "Ley Line Research Facility",
  "The Smouldering Heart",
  "The Pillar of Ash"];
Game.ZONE_DESCRIPTIONS = [
  "What might appear to be a calm refuge in the wastes, the Whispering Cave soon revealed itself to be anything but that once explorers started to plumb its' depths. The cave plays home to a host of otherwise rare animals that sought sanctuary from the ravaging wars above ground, and the creatures do not take kindly to humans trespassing on one of the few places left for them to call home.",
  "The Ash Cult has long believed the world is overdue to be reborn in flames, and as such has been working around the clock to gather supplies and capture unwitting survivors in the hope of gathering a large enough offering to finally bring the wrath of the heavens down on the world. Small outposts like this one generally don't hold onto their captures for very long, yet if you're lucky there may be some pickings to be had before they're all transported away to their main fortress.",
  "Once the site of a mighty battle between warring clans, the area became known as the Dawn's Light Swamp when one side's archmages conjured a massive water wave to overwhelm their foes' defences. While successful, the remaining water seeped into the ground and turned the one lush field into treacherous swampland, which was then promptly taken over by the local wildlife and declared a no-man's land for the remainder of the conflict.",
  "For many years, the TPX-4450 maglev train ferried thousands of passengers a day across the wastes to go about their daily business. Shortly after the onset of war, a stray blast of arcane magic knocked one of these trains flying off its rail, and the fall of over 100 feet and resulting impact instantly killed everyone on board. With nowhere else to go, the spirits of those slain saw fit to linger in the remains of the train as a warning to any who would approach: only death would find them here.",
  "Strategically cutting through the heart of a vast mountain, the Echoing Passage once served as a significant trade route, attracting thousands of daily commuters and visitors who would shop at the market stalls set up along the edges of the tunnel. However, a botched mining operation beneath the area resulted in a catastrophic release of highly virulent and toxic spores, killing everyone who passed through the area and infesting their rotting remains, rendering them akin to zombies.",
  "Before the discovery and widespread usage of magic for military engagements, armies around the world used mechanical constructs to fight their battles in their stead. The Swiftsteel Workshop was once a shining example of an efficient manufactory for war machines, pumping out hundreds a day to aid the effort. Now magic is commonplace, however, the workshop has fallen into ill repair, and the constructs remain wandering the halls, along with the lucky few who can still command them.",
  "The final resting place of countless casualties of war, the Weary Hollow stands as a stark reminder of the harsh reality that awaits those brave souls who gave their lives for others. An assortment of grievers, grave tenders and clergy wander the paths - many of which were hastily laid as the bodies came flooding in too fast for the chapel staff to handle. The chapel itself is no less bleak: with the staff so busy tending to existing graves and still creating new ones, the building itself has fallen into disrepair.",
  "Once a prospective site for the crowning glory of the Ash Cult, the Fallen Pillar came to acquire its' name as a result of the cult leader's foolish idea of building their base of operations atop an active volcano, which erupted violently a year after construction began. Now abandoned by its former masters, the ruins play host to a number of diverse scavengers, each hoping to find something tasty and/or valuable amongst the mess that the Ash Cult left behind.",
  "Prior to the wars that ravaged the realm, dragons preferred to steer well clear of the affairs of the other races, instead inhabiting strategic positions among mountain peaks to watch over the land. Princpal among these positions is the Dragons' Crown, a massive citadel that plays host to thousands of dragons from around the world. With the relentless abuse of magic across the planet placing their lofty strongholds in danger, the denizens of the Dragons' Crown finally rouse from their self-imposed exile and take the fight directly to those who seek to do them harm.",
  "With the relentless advancement of the magical arts, centres like the Ley Line Research Facility have risen across the globe over the years, where magi work around the clock to push the boundaries of magic for military purposes. This facility, as a direct result of your unwitting destruction of their most prized artifact and research material, has had to work twice as hard to make new discoveries, some of which now patrol the halls, neglected but no less functional from their abandonment.",
  "Set deep beneath the Pillar of Ash, the intense magma currents and searing atmosphere of this subterranean complex serve as a power source for the tower above. In true Ashen style, most of the elementals and hardy creatures of the caverns have been bound to the will of the Ash, and their unbridled power and otherworldly appearance has proven to be a most effective deterrent against those who would attempt to undermine the Ashen's ultimate quest for destruction.",
  "Having learned their lesson the first time around, the Ash Cult decided to build their colossal tower and base of operations on less volatile ground. The tower itself is constantly being built ever skyward, in the hopes that a significant sacrifice at its very peak will be enough to pierce the heavens, finally awakening their lord from his slumber and bolstering their efforts to cleanse the land of all those who have corrupted it."];
Game.ZONE_MIN_LEVEL = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111];
Game.ZONE_MAX_LEVEL = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
Game.ZONE_ENEMY_NAMES = [
  ["Oversized Rat", "Giant Spider", "Brown Bear", "Weakened Half-Giant", "Hibernating Boar", "Lurking Lion", "Stealthy Tiger"],
  ["Ashen Recruit", "Ashen Summoner", "Ashen Imp", "Ashen Warrior", "Ashen Ranger", "Ashen Spellweaver", "Ashen Engineer"],
  ["Hungry Crocodile", "Swamp Piranha", "Foul Elemental", "Tar Globule", "Corrupted Treant", "Putrid Slime", "Mud Golem"],
  ["Spectral Businessman", "Spectral Attendant", "Spectral Passenger", "Spectral Tourist", "Spectral Manager", "Spectral Child", "Spectral Lady"],
  ["Decaying Commuter", "Mindless Zombie", "Wandering Skeleton", "Gelatinous Cube", "Spore Creature", "Rotting Merchant", "Reanimated Thief"],
  ["Mechanical Walker", "Mad Scientist", "Augmented Worker", "Alarm-O-Bot", "Irradiated Inventor", "Self-Piloting Drone", "Uncharged Golem"],
  ["Grieving Widow", "Undertaker", "Worn-Out Priestess", "Wandering Orphan", "Flower Girl", "Wailing Attendant", "Coffin Looter"],
  ["Ravenous Hyena", "Desperate Brigand", "Starving Wolf", "Smoldering Imp", "Bandit Scavenger", "Damaged Construct", "Pack of Hungry Rats"],
  ["Baby Dragon", "Green Dragon", "Black Dragon", "Red Dragon", "Fire Dragon", "Frost Dragon", "Thunder Dragon"],
  ["Arcane Serpent", "Ley Line Tapper", "Mana-Bound Golem", "Imbued Construct", "Corrupted Researcher", "Void Terror", "Mana Eel"],
  ["Fire Elemental", "Bubbling Magma Globule", "Lava Serpent", "Earthen Crusher", "Ashen Fireweaver", "Unbound Firestorm", "Molten Giant"],
  ["Ashen Slave", "Ashen Runeweaver", "Ashen Hoplite", "Ashen Archer", "Ashen Warhound", "Ashen Cleric", "Ashen Guard", "Ashen Scryer"]
];
Game.ZONE_ELITE_NAMES = [
  ["Mountain Troll", "Hulking Ogre"],
  ["Ashen Archmage", "Ashen Rune Golem"],
  ["Lingering Archmage", "Flock of Vultures"],
  ["Spectral Guard", "Spectral Conductor"],
  ["Bursting Abomination", "Spore Spreader"],
  ["Arcane Nullifier", "Remote Controlled Tank"],
  ["Ancient Lich", "High Priest"],
  ["Bandit Warmonger", "Volcanic Giant"],
  ["Celestial Dragon", "Rune-Bound Dragon"],
  ["Runic Giant", "Senior Researcher"],
  ["Ashen Subjugator", "Searing Leviathan"],
  ["Ashen Houndmaster", "Ashen Slavedriver", "Ashen High Priest"]
];
// Bosses are defined as follows:
// [Name, Level, Maximum HP, Main Stat, Weapon, Armour]
Game.ZONE_BOSSES = [
  ["Massive Cave Troll Tetradigm", 10, 650, 40,
    ["Tetranomicon, 2nd Edition|Less words. More pages. Better for bash faces.", 10, 201, 2.1, 42, 53, 22.62, 226, 95, [245, "Skull Crack", 5, -1]],
    ["Grubby Loincloth|Hasn't been washed, ever.", 10, 226, 95, [[233, 15], [231, 8]], [[235, 20]]]],
  ["Ashen Berserker Ragekai", 20, 1300, 85,
    ["Dervish, Hand of Rage|If it had a mouth, it'd be screaming with anger.", 20, 201, 1.6, 59, 72, 40.94, 226, 145, [242, "Bloodrage", 20, 75]],
    ["Spiked Berserker's Mail|Spikes are normally impractical - these are no exception.", 20, 226, 145, [[231, 30], [232, 10]], [[236, 40]]]],
  ["Swamp Behemoth Sythek", 30, 2250, 150,
    ["Fermeus, Warmaul of the Wastes|The slime covering this maul comes from deep within.", 30, 201, 2.6, 129, 155, 54.62, 226, 195, [241, "Crushing Blow", 20, -1]],
    ["Sludge-Coated Cloak|Things I don't want to wear today include this.", 30, 226, 195, [[231, 45]], [[235, 25], [236, 10]]]],
  ["Ethereal Train Driver", 40, 3300, 225,
    ["Reliqus, The Echo of Eternity|It just goes on and on and on...", 40, 203, 1.6, 110, 132, 75.63, 226, 245, [250, "Eternal Sleep", 20, 5]],
    ["Invisibility Cloak|Also known as The Emperor's New Cloak.", 40, 226, 245, [[233, 60], [232, 15]], [[234, 50]]]],
  ["Lumbering Spore Giant", 50, 4700, 315,
    ["Earthword, Nature's Bounty|Natural gifts are the best kind!", 50, 201, 2.6, 206, 246, 86.92, 226, 295, [246, "Infest", 20, 40]],
    ["Broken Spore Carapace|How a mining pick got through this is a mystery.", 50, 226, 295, [[232, 60], [231, 20]], [[236, 70]]]],
  ["Chief Engineer DeSolver", 60, 6300, 425,
    ["Torrentus, The Storm of Steel|Not even Neo could stop all these bullets.", 60, 202, 1.6, 162, 192, 110.63, 226, 345, [244, "Suppressive Fire", 20, 40]],
    ["XT-250 Augmentation Platform|Built to last, unlike the contents.", 60, 226, 345, [[232, 80]], [[236, 70], [234, 20]]]],
  ["Archbishop Raferty", 70, 8200, 550,
    ["Exalt, Wrath of Heaven|Freshly delivered from on high.", 70, 202, 2.1, 236, 280, 122.86, 226, 395, [247, "Dazzle", 20, 40]],
    ["Archbishop's Shawl|You must be at least this holy to wear.", 70, 226, 395, [[233, 90]], [[234, 80], [235, 30]]]],
  ["Bandit Mastermind Seiyria", 80, 10250, 690,
    ["Ferrinoth, The Hunter's Mark|You'd swear those arrows have homing beacons on them.", 80, 202, 2.6, 322, 383, 135.58, 226, 445, [248, "Marked for Death", 5, 10]],
    ["Flame-Cured Dragon Leathers|Guaranteed to be fireproof, or your money back!", 80, 226, 445, [[233, 100], [232, 50]], [[234, 90]]]],
  ["Chromega, The Broodmother", 90, 12600, 840,
    ["Breath of the Broodmother|Dragons don't need no stinking weapons!", 90, 203, 2.6, 360, 428, 151.54, 226, 495, [243, "Cauterize", 20, 40]],
    ["Armour-Plated Scales|Tailored to fit a dragon, of course.", 90, 226, 495, [[231, 90], [232, 90], [233, 90]], []]],
  ["Grand Archsage Reelix", 100, 15200, 1024,
    ["Zenith, The Ley Convergence|Let's all come together and join hands!", 100, 203, 2.1, 332, 393, 172.62, 226, 495, [247, "Power Surge", 20, 40]],
    ["Crackling Robes|Making static electricity a permanent problem.", 100, 226, 495, [[233, 125], [231, 25]], [[235, 100]]]],
  ["Magma Wyrm Mordoth", 110, 18000, 1200,
    ["Endless Fireball Stream|It has to end eventually, right?", 110, 203, 1.6, 292, 343, 198.44, 226, 545, [243, "Cauterize", 20, 40]],
    ["Flamebearing Scales|Melting the enemy's offense is the best defence.", 110, 226, 545, [[231, 110], [232, 110], [233, 110]], []]],
  ["High Ashlord Kryzodoze", 120, 21100, 1410,
    ["Velorus, The Ashen Firestorm|With this, every arrow leaves a pretty fiery trail.", 120, 202, 2.1, 397, 469, 206.19, 226, 595, [246, "Ignited", 20, 40]],
    ["Earth-Infused Plate|It's just ordinary plate with rocks attached.", 120, 226, 595, [[231, 150], [232, 70]], [[236, 135]]]]
];
Game.changeZone = function (zoneID) {
  if (zoneID <= Game.p_maxZone && zoneID !== Game.p_currentZone) {
    if (Game.p_State === Game.STATE_IDLE) {
      Game.p_currentZone = zoneID;
      Game.toastNotification("Moved to " + Game.ZONE_NAMES[zoneID] + ".");
      Game.repopulateShop();
    } else {
      Game.toastNotification("Cannot change zones during combat.");
    }
  }
};

document.getElementById("loadedZones").style.display = "";
