var raidMemberList = {
	members : [],
	roles : {
		'Tank' : 0,
		'Melee DPS' : 0,
		'Ranged DPS' : 0,
		'Healer' : 0
	},
	adjustRoles : function(role, n) {
		this.roles[role] += n;
		if (this.roles[role] < 0) this.roles[role] = 0;
		switch (role) {
			case 'Tank':
				$('#tanks').html('Tanks: ' + this.roles['Tank']);
				break;
			case 'Melee DPS':
				$('#melee-dps').html('Melee DPS: ' + this.roles['Melee DPS']);
				break;
			case 'Ranged DPS':
				$('#ranged-dps').html('Ranged DPS: ' + this.roles['Ranged DPS']);
				break;
			case 'Healer':
				$('#healers').html('Healers: ' + this.roles['Healer']);
				break;
		}
	},
	add : function(name, spec, role, buffs, debuffs, colorCode) {
		var id = Date.now();
		$('#raid-team').append('<li><button class="raid-button" onClick="raidMemberList.remove(this,\'' + id + '\')">Remove</button>' + spec + ' ' + name + '</li>');
		var playerSpecificBuffs = raidBuffList.add(buffs);
		var data = {
			id : id,
			role : role,
			availableBuffs : buffs,
			buffsBrought : playerSpecificBuffs
		};
		this.adjustRoles(role, 1);
		this.members.push(data);
	},
	remove : function(e, id) {
		removeElement(e);
		var membersCopy = this.members;
		for (n = 0; n < membersCopy.length; n++) {
			member = membersCopy[n];
			if (member.id == id) {
				var memberBuffs = member.buffsBrought;
				this.adjustRoles(member.role, -1);
				this.members.splice(n, 1);
				raidBuffList.remove(memberBuffs);
			}
		}
	}
};

var raidBuffList = {
	buffList : [],
	add : function(b) {
		var uniqueBuffs = [];
		for (n = 0; n < b.length; n++) {
			var c = b[n];
			if (this.buffList.indexOf(c) == -1) {
				this.buffList.push(b[n]);
				uniqueBuffs.push(b[n]);
			}
		}
		this.populate();
		return uniqueBuffs;
	},
	remove : function(playerBuffs) {
		for (l = 0; l < playerBuffs.length; l++) {
			var buff = playerBuffs[l];
			if (!this.findReplacement(buff)) {
				this.buffList.splice(this.buffList.indexOf(buff), 1);
			} 
		}
		this.populate();
	},
	findReplacement : function(buff) {
		for (n = 0; n < raidMemberList.members.length; n++) {
			for (m = 0; m < raidMemberList.members[n].availableBuffs.length; m++) {
				if (raidMemberList.members[n].availableBuffs.indexOf(buff) != -1 && raidMemberList.members[n].buffsBrought.indexOf(buff) == -1) {
					raidMemberList.members[n].buffsBrought.push(buff);
					return true;
				}
			}
		}
		return false;
	},
	populate : function() {
		var e = $('#buff-list');
		e.html('');
		for (n = 0; n < this.buffList.length; n++) {
			e.append('<li>' + this.buffList[n] + '</li>');
		}
	}
};

var populateClassList = function() {
	var classList = [];
	classList.push(druid, hunter, mage, paladin, priest, rogue, warlock, warrior);
	for (n = 0; n < classList.length; n++) {
		var member = classList[n];
		var e = $('#raid-select');
		e.append('<li>' + member.name);
		member.specs.forEach(function(spec) {
			e.append('<button id="' + member.name.toLowerCase() + '" class="class-button" onClick="' + member.name.toLowerCase() + '.addToRaid(\'' + spec + '\')">' + spec + '</button>');
		});
		e.append('</li>');
	}
}

var removeElement = function(e){
	$(e).parent().remove();
}

function player() {
	this.name = null;
	this.colorCode = null;
	this.specs = [];
	this.buffs = {
		classBuffs : []
	};
	this.debuffs = {
		classDebuffs : []
	};
	this.roles = {};
	this.getBuffs = function(spec) {
		return this.buffs.classBuffs.concat(this.buffs[spec]);
	};
	this.getDebuffs = function(spec) {
		return this.debuffs.classDebuffs.concat(this.debuffs[spec]);
	};
	this.addToRaid = function(spec) {
		var buffs = this.getBuffs(spec);
		var debuffs = this.getDebuffs(spec);
		var role = this.roles[spec];
		var colorCode = this.colorCode;
		raidMemberList.add(this.name, spec, role, buffs, debuffs, colorCode);
	};
};

var druid = new player();
druid.name = 'Druid';
druid.colorCode = '#FF7D0A';
druid.specs = ['Feral', 'Restoration', 'Balance'];
druid.buffs.classBuffs = ['Mark of the Wild', 'Thorns'];
druid.buffs['Feral'] = ['Leader of the Pack'];
druid.buffs['Restoration'] = [];
druid.buffs['Balance'] = ['Moonkin Aura'];
druid.roles = {
	'Feral' : 'Tank',
	'Restoration' : 'Healer',
	'Balance' : 'Ranged DPS'
};

var hunter = new player();
hunter.name = 'Hunter';
hunter.colorCode = '#ABD473';
hunter.specs = ['Beast', 'Marksman', 'Survival'];
hunter.buffs.classBuffs = ['Aspect of the Hawk'];
hunter.buffs['Beast'] = [];
hunter.buffs['Marksman'] = ['Trueshot Aura'];
hunter.buffs['Survival'] = [];
hunter.roles = {
	'Beast' : 'Ranged DPS',
	'Marksman' : 'Ranged DPS',
	'Survival' : 'Ranged DPS'
};

var mage = new player();
mage.name = 'Mage';
mage.colorCode = '#69CCF0';
mage.specs = ['Arcane', 'Fire', 'Frost'];
mage.buffs.classBuffs = ['Arcane Brilliance'];
mage.buffs['Arcane'] = ['Magic Attunement'];
mage.buffs['Fire'] = [];
mage.buffs['Frost'] = [];
mage.roles = {
	'Arcane' : 'Ranged DPS',
	'Fire' : 'Ranged DPS',
	'Frost' : 'Ranged DPS'
};

var paladin = new player();
paladin.name = 'Paladin';
paladin.colorCode = '#F58CBA';
paladin.specs = ['Holy', 'Protection', 'Retribution'];
paladin.buffs.classBuffs = ['Blessing of Wisdom', 'Blessing of Might', 'Blessing of Salvation', 'Blessing of Light'];
paladin.buffs['Holy'] = ['Improved Blessing of Wisdom'];
paladin.buffs['Protection'] = ['Blessing of Kings', 'Blessing of Sanctuary', 'Improved Concentration Aura'];
paladin.buffs['Retribution'] = ['Improved Blessing of Might'];
paladin.roles = {
	'Holy' : 'Healer',
	'Protection' : 'Tank',
	'Retribution' : 'Melee DPS'
};

var priest = new player();
priest.name = 'Priest';
priest.specs = ['Discipline', 'Holy', 'Shadow'];
priest.colorCode = '#FFFFFF';
priest.buffs.classBuffs = ['Power Word: Fortitude', 'Shadow Protection'];
priest.buffs['Discipline'] = ['Divine Spirit', 'Improved Power Word: Fortitude'];
priest.buffs['Holy'] = ['Inspiration', 'Lightwell'];
priest.buffs['Shadow'] = ['Vampiric Embrace'];
priest.roles = {
	'Discipline' : 'Healer',
	'Holy' : 'Healer',
	'Shadow' : 'Ranged DPS'
};

var rogue = new player();
rogue.name = 'Rogue';
rogue.specs = ['Assassination', 'Combat', 'Subtlety'];
rogue.colorCode = '#FFF569';
rogue.buffs.classBuffs = [];
rogue.buffs['Assassination'] = [];
rogue.buffs['Combat'] = [];
rogue.buffs['Subtlety'] = [];
rogue.roles = {
	'Assassination' : 'Melee DPS',
	'Combat' : 'Melee DPS',
	'Subtlety' : 'Melee DPS'
};

var warlock = new player();
warlock.name = 'Warlock';
warlock.colorCode = '#9482C9';
warlock.specs = ['Affliction', 'Demonology', 'Destruction'];
warlock.buffs.classBuffs = ['Blood Pact'];
warlock.buffs['Affliction'] = [];
warlock.buffs['Demonology'] = ['Improved Blood Pact'];
warlock.buffs['Destruction'] = [];
warlock.roles = {
	'Affliction' : 'Ranged DPS',
	'Demonology' : 'Ranged DPS',
	'Destruction' : 'Ranged DPS'
};

var warrior = new player();
warrior.name = 'Warrior';
warrior.colorCode = '#C79C6E';
warrior.specs = ['Arms', 'Fury', 'Protection'];
warrior.buffs.classBuffs = ['Battle Shout'];
warrior.buffs['Arms'] = [];
warrior.buffs['Fury'] = ['Improved Battle Shout'];
warrior.buffs['Protection'] = [];
warrior.roles = {
	'Arms' : 'Melee DPS',
	'Fury' : 'Melee DPS',
	'Protection' : 'Tank'
};

$(document).ready(function() {
		populateClassList();
	}
);