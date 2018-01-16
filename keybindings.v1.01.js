function keyBindings(key) {
  var eventObj = window.event ? event : key;
  var pkCode = eventObj.charCode ? eventObj.charCode : eventObj.keyCode;
  var pressedKey = String.fromCharCode(pkCode);
  switch(pressedKey) {
    case "1":
      Game.showPanel('playerTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "2":
      Game.showPanel('combatTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "3":
      Game.showPanel('zoneTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "4":
      Game.showPanel('powersTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "5":
      Game.showPanel('inventoryTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "6":
      Game.showPanel('storeTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "7":
      Game.showPanel('optionsTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "8":
      Game.showPanel('helpTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "9":
      Game.showPanel('updateTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case "0":
      Game.showPanel('badgeTable'); Game.PROGRESS_KEYBINDING++;
      break;
    case " ":
      Game.startCombat();
      Game.showPanel('combatTable');
      Game.PROGRESS_KEYBINDING++;
      break;
    case "b":
      if(Game.p_State == Game.STATE_COMBAT && !Game.p_specUsed) {
        Game.burstAttack();
        Game.PROGRESS_KEYBINDING++;
      }
      break;
    case "f":
      if(Game.p_State == Game.STATE_COMBAT) {
        Game.fleeCombat();
        Game.PROGRESS_KEYBINDING++;
      }
      break;
    case "r":
      if(Game.p_State == Game.STATE_IDLE) {
        Game.startRepair();
        Game.PROGRESS_KEYBINDING++;
      }
      break;
  }
  Game.badgeCheck(Game.BADGE_KEYBINDING); // Keyboard Cat
}

document.getElementById("loadedKeybindings").style.display = "";