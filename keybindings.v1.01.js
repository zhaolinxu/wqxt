/*jslint node: true */
/*jslint devel: true */
/*global Game, prettifyNumber, abbreviateNumber, arraysEqual, statValue, clearElementContent, updateElementIDContent, toggleHelpVis, keyBindings*/
"use strict";

function keyBindings(key) {
  var eventObj = {}, pkCode = '', pressedKey = '';
  eventObj = window.event ? event : key;
  pkCode = eventObj.charCode || eventObj.keyCode;
  pressedKey = String.fromCharCode(pkCode);
  switch (pressedKey) {
  case "1":
    Game.showPanel('playerTable');
    Game.PROGRESS_KEYBINDING += 1;
    break;
  case "2":
    Game.showPanel('combatTable');
    Game.PROGRESS_KEYBINDING += 1;
    break;
  case "3":
    if (!document.getElementById("zoneTab").classList.contains("hiddenElement")) {
      Game.showPanel('zoneTable');
      Game.PROGRESS_KEYBINDING += 1;
    }
    break;
  case "4":
    if (!document.getElementById("powersTab").classList.contains("hiddenElement")) {
      Game.showPanel('powersTable');
      Game.PROGRESS_KEYBINDING += 1;
    }
    break;
  case "5":
    if (!document.getElementById("inventoryTab").classList.contains("hiddenElement")) {
      Game.showPanel('inventoryTable');
      Game.PROGRESS_KEYBINDING += 1;
    }
    break;
  case "6":
    if (!document.getElementById("storeTab").classList.contains("hiddenElement")) {
      Game.showPanel('storeTable');
      Game.PROGRESS_KEYBINDING += 1;
    }
    break;
  case "7":
    Game.showPanel('optionsTable');
    Game.PROGRESS_KEYBINDING += 1;
    break;
  case "8":
    Game.showPanel('helpTable');
    Game.PROGRESS_KEYBINDING += 1;
    break;
  case "9":
    Game.showPanel('updateTable');
    Game.PROGRESS_KEYBINDING += 1;
    break;
  case "0":
    if (!document.getElementById("badgeTab").classList.contains("hiddenElement")) {
      Game.showPanel('badgeTable');
      Game.PROGRESS_KEYBINDING += 1;
    }
    break;
  case " ":
    Game.startCombat();
    Game.showPanel('combatTable');
    Game.PROGRESS_KEYBINDING += 1;
    break;
  case "b":
    if (Game.p_State === Game.STATE_COMBAT && !Game.p_specUsed) {
      Game.burstAttack();
      Game.PROGRESS_KEYBINDING += 1;
    }
    break;
  case "f":
    if (Game.p_State === Game.STATE_COMBAT) {
      Game.fleeCombat();
      Game.PROGRESS_KEYBINDING += 1;
    }
    break;
  case "r":
    if (Game.p_State === Game.STATE_IDLE) {
      Game.startRepair();
      Game.PROGRESS_KEYBINDING += 1;
    }
    break;
  }
  Game.badgeCheck(Game.BADGE_KEYBINDING); // Keyboard Cat
}

document.getElementById("loadedKeybindings").style.display = "";
