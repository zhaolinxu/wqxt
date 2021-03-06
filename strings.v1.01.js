/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";
/*---------------------------------
strings.js

Constant string values serving as
names and descriptions of various
game objects.
---------------------------------*/
// Weapon name arrays
Game.fast_melee_generic = ["短剑", "匕首", "迅捷之刃", "刀", "毒刃", "双刃剑"];
Game.mid_melee_generic = ["宝剑", "长剑", "手斧", "弯刀", "矛", "指节铜环"];
Game.slow_melee_generic = ["晨星", "利斧", "大刀", "战槌", "戟", "重刀"];
Game.fast_range_generic = ["飞镖", "投掷刀", "飞斧", "迷你弩", "飞镖"];
Game.mid_range_generic = ["中继器", "短弓", "标枪", "弹弓", "滑膛枪"];
Game.slow_range_generic = ["弩", "长弓", "复合弓", "枪带", "手炮"];
Game.fast_magic_generic = ["魔法之刃", "雷霆之书", "木棍", "权杖", "火花球"];
Game.mid_magic_generic = ["魔刃", "火焰之书", "法术专攻", "作战法杖", "火焰球"];
Game.slow_magic_generic = ["战斗法杖", "冰霜之书", "魔典", "牧杖", "冰霜之球"];
Game.debuffs_generic = [
  [241, "冷酷无情", 10, -1],
  [242, "狂暴", 10, 50],
  [243, "嗜血", 10, 20],
  [244, "削弱", 10, 15],
  [245, "精神控制", 5, -1],
  [246, "致伤毒药", 10, 20],
  [247, "神经打击", 10, 15],
  [248, "与日俱增的恐惧", 5, 5],
  [249, "解除武装", 10, -1],
  [250, "昏睡", 10, 15]
];
Game.debuffs_potion_normal = [
  [241, "Acidic Solution", 15, -1],
  [242, "Twinstrike Tonic", 10, 50],
  [243, "Vampiric Infusion", 10, 20],
  [244, "Frostblood Draught", 10, 15],
  [245, "Cupid's Charm Chalice", 5, -1],
  [246, "Nightshade Potion", 10, 20],
  [247, "Mind-Numbing Mix", 10, 15],
  [248, "Bottled Heart Attack", 5, 5],
  [249, "Butterfinger Brew", 10, -1],
  [250, "Chloroform Concoction", 10, 15]
];
Game.debuffs_potion_superior = [
  [241, "Enhanced Acidic Solution", 15, -1],
  [242, "Enhanced Twinstrike Tonic", 15, 70],
  [243, "Enhanced Vampiric Infusion", 15, 30],
  [244, "Enhanced Frostblood Draught", 15, 25],
  [245, "Cupid's Charm Chalice", 5, -1],
  [246, "Enhanced Nightshade Potion", 15, 30],
  [247, "Enhanced Mind-Numbing Mix", 15, 25],
  [248, "Bottled Double Heart Attack", 5, 7],
  [249, "Enhanced Butterfinger Brew", 15, -1],
  [250, "Enhanced Chloroform Concoction", 15, 10]
];
Game.debuff_names = [
  "盔甲碎片",
  "双重攻击",
  "生命吸取",
  "慢速攻击",
  "混乱",
  "持续伤害",
  "麻痹",
  "厄运",
  "解除武装",
  "昏睡"
];
Game.debuff_descriptions = [
  "使你的攻击忽略目标的装甲强度，持续10(15)秒。",
  "使你的攻击造成二次攻击，造成的伤害是第一次伤害的50%(70%)，持续时间10(15)秒。",
  "每秒恢复等于20%(30%)的武器秒伤害的血量，持续10(15)秒。",
  "减缓敌人攻击速度15%(25%)，持续10(15)秒。",
  "使目标的下一次攻击击中他们自己。",
  "每秒对目标造成20%(30%)的武器秒伤害，10(15)秒。",
  "增加目标攻击失败的几率15%(25%)，持续时间10(15)秒。",
  "给予5%(7%)的机会彻底消灭目标。如果不能杀死的话，可以给予250%(350%)的武器秒伤害。",
  "将目标造成的伤害降低50％，防止目标施放减益效果10（15）秒。",
  "防止目标攻击10(15)秒。有60%(40%)的几率被攻击打断。"
];
Game.potions = [
  [
    [0, "Lesser Healing Potion", 0.2],
    [1, "Healing Potion", 0.3],
    [2, "Greater Healing Potion", 0.4]
  ],
  [
    [0, "Acidic Solution", 0],
    [1, "Twinstrike Tonic", 1],
    [2, "Vampiric Infusion", 2],
    [3, "Frostblood Draught", 3],
    [4, "Cupid's Charm Chalice", 4],
    [5, "Nightshade Potion", 5],
    [6, "Mind-Numbing Mix", 6],
    [7, "Bottled Heart Attack", 7],
    [8, "Butterfinger Brew", 8],
    [9, "Chloroform Concoction", 9]
  ]
];
Game.potions_superior = [
  [
    [0, "Lesser Healing Potion", 0.3],
    [1, "Healing Potion", 0.4],
    [2, "Greater Healing Potion", 0.5]
  ],
  [
    [0, "Enhanced Acidic Solution", 0],
    [1, "Enhanced Twinstrike Tonic", 1],
    [2, "Enhanced Vampiric Infusion", 2],
    [3, "Enhanced Frostblood Draught", 3],
    [4, "Cupid's Charm Chalice", 4],
    [5, "Enhanced Nightshade Potion", 5],
    [6, "Enhanced Mind-Numbing Mix", 6],
    [7, "Enhanced Bottled Heart Attack", 7],
    [8, "Enhanced Butterfinger Brew", 8],
    [9, "Enhanced Chloroform Concoction", 9]
  ]
];
// Always need more names!
Game.fast_melee_special = [
  "Blinkstrike|They'll never know what hit 'em...",
  "Adder's Fang|Not to scale.",
  "Torturer's Poker|Tell me, tell me everything...",
  "Excalibur|Straight outta the lake.",
  "Sword Breaker|Serrated for your pleasure.",
  "Ether-Soaked Rag|\"Hey, does this cloth smell like chloroform to you?\""
];
Game.fast_melee_debuffs = [
  [242, "狂暴", 15, 70],
  [246, "致伤毒药", 15, 30],
  [245, "支配", 5, -1],
  [243, "圣光", 15, 30],
  [249, "解除武装", 15, -1],
  [250, "麻痹", 15, 10]
];
Game.mid_melee_special = [
  "Edge of Depravity|I think it's just misunderstood...",
  "Storm's Herald|Whatever you do, don't hold it above your head.",
  "Flametongue|Good for those long cold nights in camp.",
  "Zenith Blade|Glows brighter than the sun.",
  "Gunblade|Bringing a sword to a gunfight.",
  "Concrete Pillowcase|GO TO SLEEP DAMN YOU!"
];
Game.mid_melee_debuffs = [
  [241, "冷酷无情", 15, -1],
  [247, "静电冲击", 15, 25],
  [243, "腐蚀", 15, 30],
  [249, "眩光", 15, -1],
  [247, "蹒跚", 15, 25],
  [250, "震荡", 15, 10]
];
Game.slow_melee_special = [
  "Planetary Edge|Rare, because planets aren't edgy.",
  "Death Sentence|The Grim Reaper has arrived.",
  "The Ambassador|Diplomatic immunity!",
  "Excalibur II|Do it the same, but better!",
  "Mjolnir|They're not worthy!",
  "Generic Melee Weapon|Relic of a bygone era."
];
Game.slow_melee_debuffs = [
  [244, "断筋", 15, 25],
  [248, "黑暗预兆", 5, 7],
  [241, "外交", 15, -1],
  [243, "神圣光辉", 15, 30],
  [244, "震荡", 15, 25],
  [244, "一般慢速", 15, 25]
];
Game.fast_range_special = [
  "黑桃王牌|谁抛出一个卡吗？ 我的意思是，来吧，真的吗？",
  "战斧|为土著部落提供几个世纪的服务。",
  "Throat Piercers|Also perfect for piercing other parts.",
  "Miniature Shurikens|Why throw one when you can throw ten?",
  "Tranquilizer Blowpipe|Be very very quiet...",
  "M60 Light Machine Gun|Modern warfare at its finest."
];
Game.fast_range_debuffs = [
  [246, "剪纸", 15, 30],
  [244, "削弱", 15, 25],
  [241, "穿刺", 15, -1],
  [242, "炮火", 15, 70],
  [250, "镇静剂", 15, 10],
  [247, "火力压制", 15, 25]
];
Game.mid_range_special = [
  "死神天降|或低于或远离，取决于您所在的位置。",
  "破浪者的鱼叉|他们可能会想要在某个时候回来。",
  "梦想家|发射彩虹和阳光。",
  "人马座|让星星为你对齐。",
  "普通远程武器|旧时代的遗迹",
  "瓦斯弹|屏住呼吸。"
];
Game.mid_range_debuffs = [
  [248, "濒死", 5, 7],
  [243, "嗜血", 15, 30],
  [250, "数羊", 15, 10],
  [242, "星落", 15, 70],
  [246, "普通出血", 15, 30],
  [250, "睡眠气体", 15, 10]
];
Game.slow_range_special = [
  "利益相关者|提高赌注，一次一个尸体。",
  "阿蒂米斯弓|它有一个免费的竖琴，没有任何附加条件。",
  "分开射击|要记住它们。",
  "星形搜索器|我想知道今天我们会发现什么?",
  "C4飞行回旋镖|最好不要回来……",
  "矮人手炮|显然，矮人们的手很大。",
  "催泪瓦斯发射器|在加拿大是违法的。小心谨慎。"
];
Game.slow_range_debuffs = [
  [247, "不平衡的", 15, 20],
  [245, "符咒", 5, -1],
  [241, "冷酷无情", 15, -1],
  [249, "手臂射击", 15, -1],
  [246, "弹片", 15, 30],
  [248, "爆炸弹", 5, 7],
  [249, "丧失能力", 15, -1]
];
Game.fast_magic_special = [
  "Thundercaller|A lightning rod, for all intents and purposes.",
  "Cosmic Fury|Dr. Tyson would like a word with you...",
  "Spark-Touched Fetish|Rubber gloves are strongly recommended.",
  "\"The Theory of Everything\"|It works! At least in theory...",
  "Generic Magic Weapon|Relic of a bygone era.",
  "Contagion|Spreading the love."
];
Game.fast_magic_debuffs = [
  [247, "Static Shock", 15, 20],
  [242, "Frenzy", 15, 65],
  [245, "Confuse", 5, -1],
  [243, "Expert Strategy", 15, 30],
  [243, "Generic Heal", 15, 30],
  [246, "Poison Cloud", 15, 30]
];
Game.mid_magic_special = [
  "Flamecore Battlestaff|Still warm to the touch.",
  "Gift of the Cosmos|Just keeps on giving.",
  "Emberleaf War Tome|Not actually made of embers, which are terrible for books.",
  "Encyclopedia of the Realm|Knowledge is power.",
  "\"How to Maim Your Dragon\"|Now featuring step by step guides!",
  "Hypnotist's Watch|Your eyelids are getting heavy..."
];
Game.mid_magic_debuffs = [
  [246, "缓慢燃烧", 15, 30],
  [244, "削弱", 15, 25],
  [243, "Drain Life", 15, 30],
  [241, "Find Weakness", 15, -1],
  [249, "Wing Clip", 15, -1],
  [250, "Hypnosis", 15, 10]
];
Game.slow_magic_special = [
  "The Tetranomicon|Written and bound by Tetradigm. Mostly incomprehensible.",
  "彗星追逐者|注意:彗星是危险的，不要在家里尝试。",
  "Absolute Zero|Not quite. But it's close!",
  "Judgement Staff|Bear the weight of your crimes!",
  "Cock of the Infinite|I put on my robe and wizard hat.",
  "\"A Brief History of Magic\"|1,600 pages of sheer drivel."
];
Game.slow_magic_debuffs = [
  [248, "Flames of Tetradigm", 5, 7],
  [246, "缓慢燃烧", 15, 30],
  [247, "Bitter Cold", 15, 25],
  [248, "Judgement Bolt", 5, 10],
  [241, "Penetration", 15, -1],
  [250, "Intense Boredom", 15, 10]
];
// Prefixes for non-great items
// Yes there's a blank one, it's so the item has no prefix :)
Game.weaponQualityDescriptors = [
  ["一文不值的", "损坏的", "笨拙的", "腐烂的", "有缺陷的", "破旧的", "一文不值的"],
  ["平均的", "平凡的", "", "过得去的", "基本的", "简单的", "可用的", "适当的"],
  ["原始的", "增强的", "强大的", "保养良好的", "强大的", "优越的", "杰出的"]
];
Game.armourQualityDescriptors = [
  ["破烂的", "磨损的", "破旧的", "破裂的", "战斗磨损的", "无用的", "一文不值的"],
  ["平均的", "平凡的", "", "过得去的", "基本的", "简单的", "可用的", "适当的"],
  ["擦亮的", "保存完好的", "加固的", "缓和的", "沉重的", "一尘不染的", "杰出的"]
];
Game.armour_generic = [
  "长袍",
  "短上衣",
  "雨披",
  "大衣",
  "外套",
  "胸甲",
  "锁子甲",
  "胸甲",
  "圆盾",
  "导流板",
  "长大衣",
  "包装",
  "塔盾",
  "风筝盾",
  "腿板",
  "短裤",
  "连裤袜",
  "帽子",
  "无檐小便帽",
  "苏格兰短裙",
  "风衣"
];
Game.armour_special = [
  "The Blue Collar|If this won't stop attackers, the one wearing it will.",
  "Xena's Breastplate|It was padded all along!",
  "Dual-Wielded Shields|But how am I meant to attack?",
  "Steel Cage|Especially effective against shark attacks.",
  "Golden Helmet|Unrealistically heavy.",
  "Iron Boots|Definitely not made for walking.",
  "The Emperor's Clothes|Trust me, they're magnificent.",
  "Ze Goggles|Zey do nothing!",
  "Zenith Shield|Glows brighter than the sun.",
  "Generic Armour Name|Relic of a bygone era.",
  "Aegis Shield|Don't stare directly at it.",
  "Planetary Bulwark|You will not go to space today.",
  "Chainmail Bikini|Covers all the important bits.",
  "Cardboard Box|Who in their right mind would attack a harmless box?",
  "Golden Breastplate|Only really good for dying in style.",
  "Turtle Shell|Nature's take on the humble shield.",
  "Dragon Chainbody|Yes, dragon is a metal. No, we don't know what it is.",
  "Giant Armour Plate|It's bigger than you, and we all know bigger is better.",
  "Top Hat and Monocle|Stop! Dapper time!",
  "Kevlar Vest|Stops just about anything that doesn't aim for the head.",
  "Mechanical Exoskeleton|Humans are so much more effective when encased in metal.",
  "Overly Elaborate Robe|Washing this thing will be your worst nightmare.",
  "Rune Platebody|At least one dragon died in the making of this armour."
];
Game.SKILL_LIST = [
  ["扒手", "从战斗中获得每等级5%的种子增益。", 101],
  ["空腔搜索", "每级增加2%的几率，从战斗中获得3倍的种子收益。", 1011],
  ["物物交换", "每级降低3%的种子价格。", 1012],
  ["彻底洗劫", "每级增加2%的机会来从被击败的敌人那里获得碎片。", 10111],
  ["讨价还价", "每级从销售商品中增加5%的种子。", 10121],
  ["五指折扣", "在攻击时，每个等级增加1%的几率窃取与你的角色等级相等数量的种子。", 101211],
  ["耐心和自律", "在升级的时候增加2%的几率增加一个随机属性。", 101212],
  ["拆卸", "保证从销毁物品中获得额外的一块碎片。", 101213],
  ["有弹性的袋子", "每级为你的库存上限增加3个插槽。", 1012111],
  ["抽签的运气", "每个等级有2%的几率在升级时获得额外的属性点。", 1012121],
  ["快速学习者", "每级增加5%战斗经验。", 1012122],
  ["适当的照顾", "每级增加3%的几率来抵消你装备耐久的磨损。", 1012123],
  ["大师工匠", "每等级增加20％修补的有效性。", 1012131],
  ["幸运星", "每等级增加1％的几率获得额外的技能点。", 10121211],
  ["高维护", "在击败敌人时，每等级增加2％的机会来完全修复装备。", 10121231],
  ["命悬一线", "每级增加10%损坏武器的输出。", 10121232],
  ["致命的力量", "所有武器造成的伤害增加3%。", 102],
  ["灵活的手指", "每级增加3%攻击速度。", 1021],
  ["敏锐的眼睛", "每级增加3%的暴击几率。", 1022],
  ["骚动", "每阶增加2%几率，在攻击达到50%的伤害后进行二次攻击。", 10211],
  ["基纳眼", "每等级增加10%额外伤害爆击。", 10221],
  ["暴露弱点", "每级增加2%释放负面状态几率", 10222],
  ["授权的热潮", "每一级增加5%的伤害，会降低骚动二次攻击的伤害。", 102111],
  ["偷袭", "在战斗中第一次攻击时增加10%的命中率。", 102211],
  ["嗜血", "出发突发攻击时，暴击立刻冷却完毕", 102212],
  ["媒体的优势", "使用突发攻击对一个被打击的敌人，每级减少它的冷却时间1秒。", 102221],
  ["绝症", "允许将减益魔法定时器刷新重新应用。", 102222],
  ["剧烈波动", "增强您的突发攻击，以获得每阶的额外打击，但减少50%的攻击力。", 1021111],
  ["冲动", "在一次暴击之后，你的下3次攻击会增加5%的额外伤害。", 1021112],
  ["电涌", "在战斗开始时使用肾上腺素的刺激效果，每等级一次。", 10211121],
  ["执行", "每级增加5%的几率，立即杀死一个生命低于25%的敌人。", 1022111],
  ["扭转局面", "在使用突发攻击时，增加了20%的等级。", 1022211],
  ["超载", "增加了35%的伤害以增加每一次袭击的额外耐久性。", 10211121],
  ["削弱", "当使用突发攻击时，敌人对你的攻击类型的抵抗被视为一个弱点。", 10222111],
  ["盔甲大师", "每级增加5%的护甲。", 103],
  ["先祖", "每级减少3%的武器伤害。", 1031],
  ["生存本能", "每级增加4%的生命恢复和装备耐久。", 1032],
  ["盾墙", "每等级增加1%的格挡机会。", 10311],
  ["盾粉碎", "每级增加2%的几率在攻击你的武器时无视敌人的盔甲。", 10312],
  ["胜利冲刺", "在击败敌人后，恢复5%的生命。", 10321],
  ["复仇", "每级增加2%的几率将50%的伤害返还给目标。", 103111],
  ["最后的堡垒", "当你的健康低于30％时，每等级降低10％受到的伤害。", 103112],
  ["刃状装甲", "每级反射2%的伤害给敌人", 103113],
  ["坚持下去", "保证一次格挡，在激活盾牌粉碎后。", 103121],
  ["坚守阵地", "当盾牌粉碎激活时，清除你当前的减益效果。", 103122],
  ["狡猾的躲避者", "当你躲避攻击时，你的爆炸攻击就会冷却下来。", 103211],
  ["以眼还眼", "在一个成功的格挡后，100%的对攻击者造成格挡掉的伤害。", 103212],
  ["圣盾术", "每级增加2%的几率来完全抵消敌人的攻击。", 1031121],
  ["二次风", "遭受致命打击时，每级使你在战斗中恢复6%的健康。", 1031122],
  ["反击", "每一个等级的几率增加5%，一个成功的格挡会使攻击者解除武装。", 1031211],
  ["吸收盾", "你的神圣之盾现在可以治疗你所遭受的伤害。", 10311211],
  ["反光罩", "你的神圣之盾现在处理你对敌人造成的伤害。", 10311212],
  ["再生知识", "通过吸取经验溢出池来增加战斗经验，增加50%的战斗经验。", 104]
 // ["Brewmaster", "Grants a 1% chance per rank to ignore the single-use limitation on a potion when using it in combat.",115],
 // ["Medic's Intuition", "Causes healing potions to restore an additional 10% of your health.", 1151],
 // ["Saboteur's Intuition", "Causes your debuffing potions to apply the superior versions of their respective debuffs.", 1152]
];
Game.BADGE_LIST = [
  ["The Personal Touch", "Give your character a name.", "See that? That's you, right there.", 2001],
  ["God Complex", "Name your character after Psychemaster, the game's developer.", "Shhh... this one's a nod to Orteil.", 2002],
  ["We've Got You Covered", "Have the game autosave 100 times.", "Your data is safe in our hands.", 2003],
  ["Trust Issues", "Use the manual save feature.", "Do you think I can't write a working autosave feature? DO YOU?", 2004],
  ["Aversion To Clicking", "Activate the autobattle system.", "Do it for me, I'm too... tired. Yeah. Tired.", 2005],
  ["Keyboard Cat", "Use keybindings to perform game actions 1,000 times.", "Play it again, Sam!", 2006],
  ["Broken Mouse Convention", "Enter 1,000 battles without enabling the autobattle feature.", "It's OK, your keyboard still works. Mousekeys to the rescue!", 2007],
  ["What Does This Button Do?", "Reset the game to gain prestige.", "Oh, that was underwhelming.", 2008],
  ["Baby Steps", "Enter combat for the first time.", "There's a first time for everything.", 2009],
  ["Skullcrusher Mountain", "Defeat 1,000 enemies.", "You know what this world could use? A skull fortress!", 2010],
  ["Like a Boss", "Equip both a weapon and a piece of armour of Great or higher quality.", "PROMOTE SYNERGY!", 2011],
  ["Jack of All Trades", "Deal 1,000,000 damage with all three weapon types.", "Master of none.", 2012],
  ["Coup de Grace", "Deliver the finishing blow to a foe with a Burst Attack.", "Sometimes you just need a personal touch.", 2013],
  ["Manual Labour", "Deliver 1,000 Burst Attacks.", "Taking a more direct approach to mindless violence.", 2014],
  ["Living on a Prayer", "Win a fight with less than 5% of your total health remaining.", "Take my hand and we'll make it, I swear!", 2015],
  ["生存主义者", "以低于25%的生命水平赢得了一场战斗。", "只是不要开始喝你自己的尿液。", 2016],
  ["Flawless Victory", "Defeat an enemy without taking any damage.", "I am invincible!", 2017],
  ["MC Hammer Special", "Defeat a boss without taking any damage.", "Can't touch this, na na na na, na na, na na.", 2018],
  ["War of Attrition", "Take at least 25 attacks in one battle.", "I could do this ALL DAY!.", 2019],
  ["The Unstoppable Force", "Defeat 1,000 consecutive enemies without dying or fleeing.", "Glad there's no immovable objects here.", 2020],
  ["Alchemical Bombardment", "Use potions to inflict debuffs on enemies 100 times.", "Death from above!", 2021],
  ["Hoisted By My Own Petard", "Inflict your own weapon's debuff on yourself.", "So this is how it feels...", 2022],
  ["Punching Mirrors", "Die from an attack delivered to yourself.", "Stop hitting yourself!", 2023],
  ["Tarred With Their Own Brush", "Cause an enemy to apply their own weapon's debuff to themselves.", "Now you know how it feels!", 2024],
  ["Assisted Suicide", "Cause an enemy to deal the killing blow to itself.", "I promise this won't hurt. Much.", 2025],
  ["Vampirism", "End a fight with more health than you started it with.", "Tonight I'm going to suck... your blood!", 2026],
  ["Wherefore Art Thou, Romeo?", "Die from a Damage over Time effect while your enemy is suffering from Sleep.", "This, do I drink to thee...", 2027],
  ["Divine Intervention", "Use Divine Shield to survive a blow that would otherwise have killed you.", "Praise be to RNGesus!", 2028],
  ["Where We're Going, We Don't Need Weapons", "Deal the killing blow to an enemy while your weapon is broken.", "You know there were guys who used to fight EXCLUSIVELY with their fists?", 2029],
  ["Where We're Going, We Don't Need Armour", "Deal the killing blow to an enemy while your armour is broken.", "Ever heard of 'distraction value'?", 2030],
  ["Where We're Going, We Don't Need Gear", "Deal the killing blow to an enemy while your weapon and armour are broken.", "Any Scotsman will tell you nakedness is an incredible deterrent.", 2031],
  ["A Good Offense", "Spend 100 stat points in Strength.", "That's the best defence, you know!", 2032],
  ["Pinpoint Accuracy", "Spend 100 stat points in Dexterity.", "He shoots... and hits the barn door this time!", 2033],
  ["Bookish Type", "Spend 100 stat points in Intelligence.", "Curl up in an armchair with your favourite read - you deserve it.", 2034],
  ["Defence of the Ancients", "Spend 100 stat points in Constitution.", "Definitely not getting carried.", 2035],
  ["The Only Way is Up", "Spend 200 stat points across all stats.", "Gravity can go ahead and bite me.", 2036],
  ["Unlimited Power!", "Spend 100 skill points.", "OK, so 100 isn't unlimited, so what! It sounded cool, okay?", 2037],
  ["Indecisive", "Reset your stats or skills a total of 100 times.", "I used to be indecisive, but now I'm not so sure.", 2038],
  ["Rolling the Bones", "Apply random debuffs to your weapons 100 times.", "Maybe this one will be worth it?", 2039],
  ["Happy Customer", "Spend 500 scrap applying debuffs to weapons", "ALL HAIL THE ALMIGHTY STORE GOD!", 2040],
  ["Unimaginative", "Promote an item to Great quality without providing a name.", "Original badge, do not steal.", 2041],
  ["Lacking in Flavour", "Promote an item to Great quality without providing flavour text.", "Mmm... bland...", 2042],
  ["Broken In", "Make your first purchase from the store.", "Now you'll never leave. Muahahahahahahahaha!!!", 2043],
  ["The Trade Parade", "Spend at least 10,000 seeds on items in the store.", "Here's to the next 10k!", 2044],
  ["Sucker", "Spend at least 100,000 seeds on items in the store.", "If you're interested, I also have this rock that wards off tigers.", 2045],
  ["CAPITALISM!", "Spend at least 1,000,000 seeds on items in the store.", "With all the seeds you've provided, we hired some dancers to work out front. You're welcome.", 2046],
  ["The Trade Blockade", "Reach level 50 without spending any seeds in the store.", "You'll come crawling back soon enough!", 2047],
  ["Rags to Riches", "Gain 1,000,000 seeds from selling items.", "What use is being a millionaire when society as we know it has collapsed?", 2048],
  ["Heavy Metal", "Gain 1,000 scrap from converting items.", "Violent headbanging not required.", 2049],
  ["Disposable Income", "Throw away 1,000 items.", "I have no use for these pathetic toys!", 2050],
  ["A Habit is Born", "Initiate a repair of your equipment", "Once you start, you just can't stop! Until it's fixed.", 2051],
  ["Blue in the Face", "Have at least three Great quality items in your inventory.", "That's from talking about it, by the way.", 2052],
  ["Tastes like Purple", "Have at least three Amazing quality items in your inventory", "I don't recommend trying to verify the taste of purple.", 2053],
  ["Full House", "Have all of your inventory sections filled to maximum capacity.", "This bag is really, REALLY heavy.", 2054],
  ["Weapon Hoarder", "Have a full inventory of Great or better quality weapons.", "You never run out of ways to murder things, do you?", 2055],
  ["Armour Hoarder", "Have a full inventory of Great or better quality armours.", "Now if only you could wear them all at once...", 2056],
  ["Potion Hoarder", "Own one of every type of potion.", "Concoctions for all occasions!", 2057],
  ["Expensive Tastes", "Fill your weapon and armour inventories with only Amazing quality items.", "Your collection is worth HOW MUCH?!?!?", 2058],
  ["Chasing Shadows", "Reach an elite appearance chance of 20% or more.", "I'm not afraid of the dark, I'm afraid of what it hides...", 2059],
  ["Terminally Unimaginative", "Reach level 50 without providing custom names or descriptions for anything.", "Maybe it's best you leave everything at defaults after all...", 2060],
  ["Trolling the Troll", "Defeat Massive Cave Troll Tetradigm in the Whispering Cave.", "Maybe if he'd read that book, he would have learned how to not die.", 2061],
  ["Calm Down Dear", "Defeat Ashen Berserker Ragekai in the Ash Cultist Outpost.", "It's just a stab in the face, that's all. You won't feel a thing.", 2062],
  ["Time For A Shower", "Defeat Swamp Behemoth Sythek in the Dawn's Light Swamp.", "With this level of filth, you'll see me again in about a week.", 2063],
  ["All Change, Please", "Defeat the Ethereal Train Driver at The Final Stop.", "This service will terminate here. Please check all personal belongings when leaving the train.", 2064],
  ["Outgrown", "Defeat the Lumbering Spore Giant within the Echoing Passage.", "I'm bigger than you and I'm higher in the food chain!", 2065],
  ["Problem Solved", "Defeat Chief Engineer DeSolver in The Swiftsteel Workshop.", "May we all be blessed with everlasting prosperity.", 2066],
  ["Beyond Divinity", "Defeat Archbishop Raferty in the Weary Hollow Chapel.", "Where is your god now, eh?", 2067],
  ["Surpassing The Master", "Defeat Bandit Mastermind Seiyria at The Fallen Pillar.", "Banditry isn't a good career path, 0/10, would not recommend.", 2068],
  ["Feeling Broody", "Defeat Chromega, The Broodmother, atop the Dragons' Crown.", "If you had several thousand kids, you would too.", 2069],
  ["Coming To A Point", "Defeat Grand Archsage Reelix in the Ley Line Research Facility.", "All the magical power in the world still couldn't stop you from killing him.", 2070],
  ["Too Hot To Handle", "Defeat Magma Wyrm Mordoth deep within The Smouldering Heart.", "Burning things are notoriously hard to loot.", 2071],
  ["High and Mighty", "Defeat High Ashlord Kryzodoze atop the Pillar of Ash.", "Knocking him off his several hundred foot high horse.", 2072]
];

document.getElementById("loadedStrings").style.display = "";
